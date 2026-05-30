import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ComponentAdapterProvider, useComponentAdapter } from "@/components/module/form-builder/component-adapter";
import { FormSection } from "@/components/module/form-builder/form-section";
import { usePlugins } from "@/components/module/form-builder/plugin-manager";
import type { FormBuilderProps } from "@/components/module/form-builder/types";
import {
  createZodSchema,
  evaluateDependencies,
  flattenFields,
  getDefaultValues,
  shouldShowField,
} from "@/components/module/form-builder/utils";
import { cn } from "@/lib/utils";

export const SPACING_CLASSES = {
  xs: "space-y-3",
  sm: "space-y-5",
  md: "space-y-7",
  lg: "space-y-9",
  xl: "space-y-11",
};

export function cleanEmpty(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(cleanEmpty);
  }
  if (value !== null && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return value;
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== "" && v !== undefined && !(Array.isArray(v) && v.length === 0))
        .map(([k, v]) => [k, cleanEmpty(v)]),
    );
  }
  return value;
}

const FormBuilderInner = ({
  config,
  initialValues,
  onSubmit,
  onError,
  onFieldChange,
  onFormReady,
  loading = false,
  disabled = false,
  className,
}: Omit<FormBuilderProps, "adapter">) => {
  const t = useTranslations();
  const pluginsHook = usePlugins();
  const adapter = useComponentAdapter();
  const allFields = useMemo(
    () => flattenFields(config.sections),
    [config.sections],
  );
  const schema = useMemo(
    () =>
      createZodSchema(allFields, (key: string, params?: Record<string, unknown>) =>
        t(key, params as Record<string, string | number | Date> | undefined),
      ),
    [allFields, t],
  );
  const defaultValues = useMemo(
    () => ({ ...getDefaultValues(allFields), ...initialValues }),
    [allFields, initialValues],
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: config.submission?.validation || "onSubmit",
  });

  const fieldsWithConditionals = useMemo(() => {
    const conditionalFields = new Set<string>();
    allFields.forEach((field) => {
      if (field.conditional) {
        field.conditional.forEach((logic) => {
          conditionalFields.add(logic.field);
        });
      }
      if (field.dependsOn) {
        field.dependsOn.forEach((dep) => {
          conditionalFields.add(dep.field);
        });
      }
      if (field.type === "quote" && field.watchFields) {
        field.watchFields.forEach((f) => { conditionalFields.add(f) });
      }
    });
    config.sections.forEach((section) => {
      if (section.conditional) {
        section.conditional.forEach((logic) => {
          conditionalFields.add(logic.field);
        });
      }
    });
    return Array.from(conditionalFields);
  }, [allFields, config.sections]);

  const dependentMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const add = (trigger: string, dependent: string) => {
      const set = map.get(trigger) ?? new Set<string>();
      set.add(dependent);
      map.set(trigger, set);
    };
    allFields.forEach((field) => {
      field.conditional?.forEach((logic) => add(logic.field, field.id));
      field.dependsOn?.forEach((dep) => add(dep.field, field.id));
    });
    return map;
  }, [allFields]);

  const formValues =
    fieldsWithConditionals.length > 0
      ? (form.watch(fieldsWithConditionals) as unknown[]).reduce(
        (acc: Record<string, unknown>, value, index) => {
          acc[fieldsWithConditionals[index]] = value;
          return acc;
        },
        {} as Record<string, unknown>,
      )
      : (form.watch() as Record<string, unknown>);

  const handleFieldChange = useCallback(
    (name: string, fieldValue: unknown, allValues: Record<string, unknown>) => {
      if (onFieldChange) {
        onFieldChange(name, fieldValue, allValues);
      }
    },
    [onFieldChange],
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;
      const values = value as Record<string, unknown>;
      if (onFieldChange) {
        handleFieldChange(name, values[name], values);
      }
      const dependents = dependentMap.get(name);
      if (dependents && dependents.size > 0 && form.formState.isSubmitted) {
        form.trigger(Array.from(dependents));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, handleFieldChange, onFieldChange, dependentMap]);

  useEffect(() => {
    if (onFormReady) {
      const formMethods = {
        setValue: (name: string, value: unknown) => form.setValue(name, value),
        setValues: (values: Record<string, unknown>) => {
          Object.entries(values).forEach(([key, value]) => {
            form.setValue(key, value);
          });
        },
        getValues: () => form.getValues(),
        reset: (values?: Record<string, unknown>) => form.reset(values),
        watch: (name?: string) => (name ? form.watch(name) : form.watch()),
        trigger: (name?: string | string[]) => form.trigger(name),
      };
      onFormReady(formMethods);
    }
  }, [form, onFormReady]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    const hiddenIds = new Set<string>();
    for (const f of allFields) {
      const visible =
        shouldShowField(f, data) &&
        (f.dependsOn ? evaluateDependencies(f.dependsOn, data) : true);
      if (!visible) hiddenIds.add(f.id);
    }
    const filtered = cleanEmpty(
      Object.fromEntries(
        Object.entries(data).filter(([k]) => !hiddenIds.has(k)),
      ),
    ) as Record<string, unknown>;
    try {
      if (config.submission?.onSubmit) {
        await config.submission.onSubmit(filtered);
      }
      if (onSubmit) {
        await onSubmit(filtered);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
    if (config.submission?.onReset) {
      config.submission.onReset();
    }
  };

  const themeStyles = useMemo(() => {
    if (!config.theme) return {};

    const cssVars: Record<string, string> = {};

    if (config.theme.colors) {
      Object.entries(config.theme.colors).forEach(([key, value]) => {
        cssVars[`--form-${key}`] = value;
      });
    }

    if (config.theme.spacing) {
      Object.entries(config.theme.spacing).forEach(([key, value]) => {
        cssVars[`--form-spacing-${key}`] = value;
      });
    }

    if (config.theme.borderRadius) {
      cssVars["--form-border-radius"] = config.theme.borderRadius;
    }

    return cssVars;
  }, [config.theme]);

  const plugins = useMemo(() => {
    if (!pluginsHook) return {};
    const pluginComponents = Object.fromEntries(
      allFields
        .filter((field) => field.type === "custom")
        .map((field) => [field.id, pluginsHook.getFieldComponent(field.id)])
        .filter(([, component]) => component !== undefined),
    );

    if (config.customComponents) {
      Object.entries(config.customComponents).forEach(([key, component]) => {
        pluginComponents[key] = component;
      });
    }

    return pluginComponents;
  }, [allFields, pluginsHook, config.customComponents]);

  const AdapterButton = adapter.Button;
  const { SectionWrapper } = adapter;

  const renderForm = () => (
    <div
      className={adapter.cn(
        SPACING_CLASSES[config.layout?.spacing || "md"],
        config.theme?.className,
        config.customProps?.styling?.formClassName,
        className,
      )}
      style={{
        ...themeStyles,
        ...config.theme?.style,
        ...config.customProps?.styling?.formStyle,
      }}
    >
      {config.sections.map((section) => (
        <FormSection
          key={section.id}
          section={section}
          control={form.control}
          formValues={formValues}
          plugins={plugins}
          layout={config.layout}
          theme={config.theme}
        />
      ))}

      {config.submission?.enabled !== false && (
        <div
          className={adapter.cn(
            "flex gap-3 w-full",
            config.theme?.submissionLayout === "vertical"
              ? "flex-col"
              : "flex-row",
          )}
        >
          {config.submission?.customSubmitButton ? (
            <config.submission.customSubmitButton
              type="submit"
              loading={loading}
              disabled={loading || disabled}
              className={adapter.cn(
                "min-w-24",
                config.submission?.expand ? "w-full" : "",
              )}
              text={config.submission?.submitText || "Submit"}
            />
          ) : (
            <AdapterButton
              type="submit"
              disabled={loading || disabled}
              className={adapter.cn(
                "min-w-24",
                config.submission?.expand ? "w-full" : "",
              )}
            >
              {loading
                ? "Submitting..."
                : config.submission?.submitText || "Submit"}
            </AdapterButton>
          )}

          {config.submission?.resetText &&
            (config.submission?.customResetButton ? (
              <config.submission.customResetButton
                type="button"
                loading={loading}
                disabled={loading || disabled}
                onClick={handleReset}
                text={config.submission.resetText}
              />
            ) : (
              <AdapterButton
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading || disabled}
              >
                {config.submission.resetText}
              </AdapterButton>
            ))}
        </div>
      )}
    </div>
  );

  const formContent = (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, onError)}
        className="w-full"
      >
        {renderForm()}
      </form>
    </FormProvider>
  );

  if (config.layout?.variant === "card") {
    return (
      <SectionWrapper className={className}>
        {(config.title || config.description) && (
          <div style={{ padding: "1.5rem 1.5rem 0" }}>
            {config.title && <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>{config.title}</h2>}
            {config.description && <p style={{ color: "#666" }}>{config.description}</p>}
          </div>
        )}
        <div style={{ padding: "1.5rem" }}>{formContent}</div>
      </SectionWrapper>
    );
  }

  if (config.title || config.description) {
    return (
      <div className={className}>
        <div className="mb-6">
          {config.title && (
            <h2 className={cn("text-2xl font-bold tracking-tight", !config.description && "mb-2")}>
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="text-muted-foreground">{config.description}</p>
          )}
        </div>
        {formContent}
      </div>
    );
  }

  return formContent;
};

export const FormBuilder = (props: FormBuilderProps) => {
  if (props.adapter) {
    return (
      <ComponentAdapterProvider adapter={props.adapter}>
        <FormBuilderInner {...props} />
      </ComponentAdapterProvider>
    );
  }
  return <FormBuilderInner {...props} />;
};
