import { LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { memo, useEffect, useMemo } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  useFormContext,
} from "react-hook-form";
import { useComponentAdapter } from "@/components/module/form-builder/component-adapter";
import type {
  FieldComponentProps,
  FieldConfig,
  GroupFieldConfig,
  QuoteFieldConfig,
  ThemeConfig,
} from "@/components/module/form-builder/types";
import {
  evaluateDependencies,
  shouldDisableField,
  shouldShowField,
} from "@/components/module/form-builder/utils";
type FieldRendererProps = {
  field: FieldConfig;
  control: Control<FieldValues>;
  formValues: Record<string, unknown>;
  plugins?: Record<string, React.ComponentType<FieldComponentProps>>;
  theme?: ThemeConfig;
};

const FieldRendererComponent = ({
  field,
  control,
  formValues,
  // oxlint-disable-next-line only-used-in-recursion
  plugins = {},
  theme,
}: FieldRendererProps) => {
  const formCtx = useFormContext();
  const unregister = formCtx?.unregister;
  const getValues = formCtx?.getValues;
  const adapter = useComponentAdapter();

  const isVisible = useMemo(() => {
    const conditionalVisible = shouldShowField(field, formValues);
    const dependencyVisible = field.dependsOn
      ? evaluateDependencies(field.dependsOn, formValues)
      : true;
    return conditionalVisible && dependencyVisible;
  }, [field, formValues]);

  const isDisabled = useMemo(
    () => shouldDisableField(field, formValues),
    [field, formValues],
  );
  const isLocked = !!(
    (field as { disabled?: boolean }).disabled &&
    (field as { readonly?: boolean }).readonly
  );

  useEffect(() => {
    if (isVisible) return;
    if (!unregister) return;
    const current = getValues?.(field.id);
    if (current === undefined) return;
    unregister(field.id, {
      keepDirty: false,
      keepError: false,
      keepTouched: false,
      keepIsValid: false,
      keepDefaultValue: false,
    });
  }, [isVisible, field.id, unregister, getValues]);

  if (!isVisible) return null;

  if (field.type === "quote") {
    const q = field as QuoteFieldConfig;
    const gridStyle: React.CSSProperties = {
      gridColumnStart: q.grid?.col,
      gridRowStart: q.grid?.row,
      gridColumn: q.grid?.colSpan ? `span ${q.grid.colSpan}` : undefined,
      gridRow: q.grid?.rowSpan ? `span ${q.grid.rowSpan}` : undefined,
      ...q.style,
    };
    const { Label } = adapter;
    return (
      <div style={gridStyle} className="grid gap-1.5">
        {q.label && (
          <Label htmlFor={q.id} className={theme?.labelClassName}>
            {q.label}
          </Label>
        )}
        <p
          className={adapter.cn(
            "rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground",
            q.className,
          )}
        >
          {typeof q.template === "function" ? q.template(formValues) : q.template}
        </p>
      </div>
    );
  }

  const renderFieldInput = (
    value: unknown,
    onChange: (value: unknown) => void,
    invalid: boolean,
  ) => {
    const isControlled = typeof field.value !== "undefined";
    const displayValue = isControlled ? field.value : value;
    const handleChange = (next: unknown) => {
      onChange(next);
    };
    const commonProps = {
      disabled: isDisabled || field.disabled,
      readOnly: field.readonly,
      placeholder: field.placeholder,
      className: adapter.cn(
        field.className,
        theme?.fieldClassName,
        field.variant && `variant-${field.variant}`,
      ),
      style: { ...theme?.fieldStyle, ...field.style },
      ...field.customProps,
    };

    if (field.type === "hidden") return null;

    if (field.type === "custom") {
      if (field.customComponent) {
        const CustomComponent = field.customComponent;
        return (
          <CustomComponent
            value={value}
            name={field.id}
            onChange={onChange}
            field={field}
            {...commonProps}
          />
        );
      }
      return (
        <div style={{ color: "red" }}>Unknown field type: {field.type}</div>
      );
    }

    if (field.type === "group") {
      const group = field as GroupFieldConfig;
      const renderChildrenGrid = () => (
        <div
          className={adapter.cn(
            "grid",
            (() => {
              const cols = group.layout?.columns ?? 1;
              if (cols === 12) return "grid-cols-12 gap-3";
              if (cols === 6) return "grid-cols-6 gap-3";
              if (cols === 4) return "grid-cols-4 gap-3";
              if (cols === 3) return "grid-cols-3 gap-3";
              if (cols === 2) return "grid-cols-2 gap-3";
              return "grid-cols-1 gap-3";
            })(),
          )}
        >
          {group.children?.map((child) => (
            <FieldRendererComponent
              key={child.id}
              field={child}
              control={control}
              formValues={formValues}
              plugins={plugins}
              theme={theme}
            />
          ))}
        </div>
      );

      if (group.customComponent) {
        const GroupComp = group.customComponent;
        return (
          <div className={adapter.cn(group.layout?.className)}>
            <GroupComp
              group={group}
              fields={group.children || []}
              formValues={formValues}
              theme={theme}
              renderChild={(child) => (
                <FieldRendererComponent
                  key={child.id}
                  field={child}
                  control={control}
                  formValues={formValues}
                  plugins={plugins}
                  theme={theme}
                />
              )}
              setValue={(fieldId, v) =>
                formCtx?.setValue?.(fieldId as string, v as unknown, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              getValues={() =>
                (formCtx?.getValues?.() as unknown as Record<
                  string,
                  unknown
                >) || (formValues as Record<string, unknown>)
              }
            />
          </div>
        );
      }

      return (
        <div className={adapter.cn("grid gap-3", group.layout?.className)}>
          {(group.label || field.label) && (
            <label className={adapter.cn(theme?.labelClassName)}>
              {group.label || field.label}
            </label>
          )}
          {(group.description || field.description) && (
            <p
              className={adapter.cn(
                "text-sm text-muted-foreground",
                theme?.descriptionClassName,
              )}
            >
              {group.description || field.description}
            </p>
          )}
          {renderChildrenGrid()}
        </div>
      );
    }

    const FieldComponent = adapter.fields[field.type];
    if (FieldComponent) {
      return (
        <FieldComponent
          value={displayValue}
          onChange={handleChange}
          field={field}
          invalid={invalid}
          {...commonProps}
        />
      );
    }

    return <div style={{ color: "red" }}>Unknown field type: {field.type}</div>;
  };

  const isCheckboxOrSwitch =
    field.type === "checkbox" || field.type === "switch";
  const isSwitch = field.type === "switch";
  const isSlider = field.type === "slider";

  const { Field, Label, FieldDescription, FieldError } = adapter;

  const gridStyle = {
    ...theme?.itemStyle,
    gridColumnStart: field.grid?.col,
    gridRowStart: field.grid?.row,
    gridColumn: field.grid?.colSpan ? `span ${field.grid.colSpan}` : undefined,
    gridRow: field.grid?.rowSpan ? `span ${field.grid.rowSpan}` : undefined,
  };

  return (
    <Controller
      name={field.id}
      control={control}
      render={({ field: formField, fieldState }) => (
        <Field
          className={adapter.cn(
            isCheckboxOrSwitch &&
            !isSwitch &&
            "flex flex-row items-start gap-3",
            isSwitch && "flex flex-row items-center gap-3",
            isSlider && "flex flex-row items-center gap-3",
            theme?.itemClassName,
          )}
          style={gridStyle}
          error={!!fieldState.error}
          disabled={isDisabled || field.disabled}
        >
          {!isCheckboxOrSwitch && !isSlider && field.label && (
            <Label
              htmlFor={field.id}
              required={field.required}
              disabled={isDisabled || field.disabled}
              className={theme?.labelClassName}
            >
              <span className="inline-flex items-center gap-1.5">
                {field.label}
                {isLocked && (
                  <HugeiconsIcon
                    icon={LockIcon}
                    strokeWidth={2}
                    className="size-3 text-muted-foreground"
                    aria-label = "Set from context"
                  />
                )}
              </span>
            </Label>
          )}
          {isSlider && field.label && (
            <Label
              htmlFor={field.id}
              required={field.required}
              disabled={isDisabled || field.disabled}
              className={theme?.labelClassName}
            >
              <span className="inline-flex items-center gap-1.5">
                {field.label}
                {isLocked && (
                  <HugeiconsIcon
                    icon={LockIcon}
                    strokeWidth={2}
                    className="size-3 text-muted-foreground"
                    aria-label = "Set from context"
                  />
                )}
              </span>
            </Label>
          )}
          {isSwitch && field.label && (
            <div className="grid gap-1">
              <Label
                htmlFor={field.id}
                required={field.required}
                disabled={isDisabled || field.disabled}
                className={theme?.labelClassName}
              >
                {field.label}
              </Label>
              {field.description && (
                <FieldDescription className={theme?.descriptionClassName}>
                  {field.description}
                </FieldDescription>
              )}
            </div>
          )}
          {isSlider || isSwitch ? (
            <div className="ml-auto">
              {renderFieldInput(
                formField.value,
                formField.onChange,
                !!fieldState.error,
              )}
            </div>
          ) : (
            renderFieldInput(
              formField.value,
              formField.onChange,
              !!fieldState.error,
            )
          )}
          {isCheckboxOrSwitch && !isSwitch && field.label && (
            <div className="grid gap-1">
              <Label
                htmlFor={field.id}
                required={field.required}
                disabled={isDisabled || field.disabled}
                className={theme?.labelClassName}
              >
                {field.label}
              </Label>
              {field.description && (
                <FieldDescription className={theme?.descriptionClassName}>
                  {field.description}
                </FieldDescription>
              )}
            </div>
          )}
          {!isCheckboxOrSwitch && !isSlider && field.description && (
            <FieldDescription className={theme?.descriptionClassName}>
              {field.description}
            </FieldDescription>
          )}
          {fieldState.error?.message && (
            <FieldError className={theme?.errorClassName}>
              {fieldState.error.message}
            </FieldError>
          )}
        </Field>
      )}
    />
  );
};

export const FieldRenderer = memo(FieldRendererComponent);
