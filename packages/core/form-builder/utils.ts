import { z } from "zod";

import type {
  ConditionalLogic,
  DependencyConfig,
  FieldConfig,
  GroupFieldConfig,
} from "@/components/module/form-builder/types";

const regexCache = new Map<string, RegExp>();
const LOCALIZE_KEY = {
  validation: {
    required: "common.validation.required",
    min: "common.validation.min",
    max: "common.validation.max",
    pattern: "common.validation.pattern",
    invalid: "common.validation.invalid",
    url: "common.validation.url",
  },
  regex: {
    failed: "common.regex.failed",
  },
  field: {
    email: "common.field.email",
    number: "common.field.number",
    date: "common.field.date",
  },
} as const;

export type LocalizeKey = (typeof LOCALIZE_KEY)[keyof typeof LOCALIZE_KEY];

const getCompiledRegex = (pattern: string): RegExp => {
  if (!regexCache.has(pattern)) {
    regexCache.set(pattern, new RegExp(pattern));
  }
  const regex = regexCache.get(pattern);
  if (!regex) {
    throw new Error(`Failed to compile regex pattern: ${pattern}`);
  }
  return regex;
};

const isEmpty = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const getAtPath = (obj: unknown, path: string): unknown => {
  if (obj === undefined || obj === null) return undefined;
  const direct = (obj as Record<string, unknown>)[path];
  if (direct !== undefined) return direct;
  if (!path.includes(".")) return undefined;
  let cur: unknown = obj;
  for (const part of path.split(".")) {
    if (cur === undefined || cur === null || typeof cur !== "object") {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
};

export const createZodSchema = (
  fields: FieldConfig[],
  t: (key: string, params?: Record<string, unknown>) => string,
) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  const processField = (field: FieldConfig) => {
    if (field.type === "quote") return;

    const schemaMap: Record<string, z.ZodType> = {
      text: z.string(),
      "text-area": z.string(),
      password: z.string(),
      email: z.email(),
      number: z.number(),
      slider: z.number(),
      date: z.coerce.date(),
      checkbox: z.boolean(),
      switch: z.boolean(),
      custom: z.any(),
      hidden: z.any(),
      "date-range": z.union([
        z.object({
          start: z.coerce.date(),
          end: z.coerce.date(),
        }),
        z.string(),
      ]),
      multiselect: z.array(z.union([z.string(), z.number()])),
      choice: z.union([z.array(z.string()), z.string()]),
      rating: z.number(),
      file: z.instanceof(File),
    };
    const base = schemaMap[field.type] ?? z.string();
    schemaObject[field.id] = z.preprocess(
      (v) => (isEmpty(v) ? undefined : v),
      base.optional(),
    );
  };

  for (const field of fields) {
    if (field.type === "group") {
      const group = field as GroupFieldConfig;
      if (group.children) {
        for (const child of group.children) {
          processField(child);
        }
      }
    } else {
      processField(field);
    }
  }

  const finalSchema = z.looseObject(schemaObject).superRefine((allValues, ctx) => {
    const visit = (field: FieldConfig) => {
      if (field.type === "quote") return;
      const visible =
        shouldShowField(field, allValues) &&
        (field.dependsOn
          ? evaluateDependencies(field.dependsOn, allValues)
          : true);
      if (!visible) return;

      const value = getAtPath(allValues, field.id);
      const empty = isEmpty(value);

      if (shouldRequireField(field, allValues) && empty) {
        const requiredRule = field.validation?.find(
          (rule) => rule.type === "required",
        );
        ctx.addIssue({
          path: [field.id],
          message:
            requiredRule?.message ||
            t(LOCALIZE_KEY.validation.required, {
              label: (field as { label?: string }).label ?? field.id,
            }),
          code: "custom",
        });
      }

      if (empty) return;

      if (field.type === "email" && typeof value === "string") {
        if (!z.email().safeParse(value).success) {
          ctx.addIssue({
            path: [field.id],
            message: t(LOCALIZE_KEY.field.email),
            code: "custom",
          });
        }
      }

      const range = field as { min?: number; max?: number };
      if (
        (field.type === "number" ||
          field.type === "slider" ||
          field.type === "rating") &&
        typeof value === "number"
      ) {
        if (range.min !== undefined && value < range.min) {
          ctx.addIssue({
            path: [field.id],
            message: t(LOCALIZE_KEY.validation.min, { min: range.min }),
            code: "custom",
          });
        }
        if (range.max !== undefined && value > range.max) {
          ctx.addIssue({
            path: [field.id],
            message: t(LOCALIZE_KEY.validation.max, { max: range.max }),
            code: "custom",
          });
        }
      }

      if (field.validation) {
        const measure = (): number | null =>
          typeof value === "string" || Array.isArray(value)
            ? value.length
            : typeof value === "number"
              ? value
              : null;

        field.validation.forEach((rule) => {
          switch (rule.type) {
            case "min": {
              const size = measure();
              if (size !== null && size < Number(rule.value)) {
                ctx.addIssue({
                  path: [field.id],
                  message:
                    rule.message ||
                    t(LOCALIZE_KEY.validation.min, { min: rule.value }),
                  code: "custom",
                });
              }
              break;
            }
            case "max": {
              const size = measure();
              if (size !== null && size > Number(rule.value)) {
                ctx.addIssue({
                  path: [field.id],
                  message:
                    rule.message ||
                    t(LOCALIZE_KEY.validation.max, { max: rule.value }),
                  code: "custom",
                });
              }
              break;
            }
            case "pattern": {
              if (typeof value === "string") {
                const regex = getCompiledRegex(rule.value);
                if (!regex.test(value)) {
                  ctx.addIssue({
                    path: [field.id],
                    message: rule.message || t(LOCALIZE_KEY.validation.invalid),
                    code: "custom",
                  });
                }
              }
              break;
            }
            case "email": {
              if (
                typeof value === "string" &&
                !z.email().safeParse(value).success
              ) {
                ctx.addIssue({
                  path: [field.id],
                  message: rule.message || t(LOCALIZE_KEY.field.email),
                  code: "custom",
                });
              }
              break;
            }
            case "url": {
              if (
                typeof value === "string" &&
                !z.url().safeParse(value).success
              ) {
                ctx.addIssue({
                  path: [field.id],
                  message: rule.message || t(LOCALIZE_KEY.validation.url),
                  code: "custom",
                });
              }
              break;
            }
            case "custom": {
              const validate = rule.customValidator as (
                v: unknown,
                all: Record<string, unknown>,
              ) => boolean | string;
              const result = validate(value, allValues);
              if (result !== true) {
                ctx.addIssue({
                  path: [field.id],
                  message:
                    typeof result === "string"
                      ? result
                      : rule.message || t(LOCALIZE_KEY.validation.invalid),
                  code: "custom",
                });
              }
              break;
            }
          }
        });
      }
    };

    fields.forEach((field) => {
      if (field.type === "group") {
        const group = field as GroupFieldConfig;
        group.children?.forEach((child) => {
          visit(child);
        });
      } else {
        visit(field);
      }
    });
  });

  return finalSchema;
};

export const evaluateConditionalLogic = (
  logic: ConditionalLogic,
  formValues: Record<string, unknown> | undefined,
): boolean => {
  const fieldValue = getAtPath(formValues, logic.field) ?? "";
  switch (logic.operator) {
    case "equals":
      return fieldValue === logic.value;
    case "notEquals":
      return fieldValue !== logic.value;
    case "contains":
      return (
        typeof fieldValue === "string" &&
        fieldValue.includes(logic.value as string)
      );
    case "notContains":
      return (
        typeof fieldValue === "string" &&
        !fieldValue.includes(logic.value as string)
      );
    case "greaterThan":
      return Number(fieldValue) > Number(logic.value);
    case "lessThan":
      return Number(fieldValue) < Number(logic.value);
    case "greaterThanOrEqual":
      return Number(fieldValue) >= Number(logic.value);
    case "lessThanOrEqual":
      return Number(fieldValue) <= Number(logic.value);
    case "isEmpty":
      return (
        fieldValue === undefined || fieldValue === null || fieldValue === ""
      );
    case "isNotEmpty":
      return (
        fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
      );
    case "startsWith":
      return (
        typeof fieldValue === "string" &&
        fieldValue.startsWith(logic.value as string)
      );
    case "endsWith":
      return (
        typeof fieldValue === "string" &&
        fieldValue.endsWith(logic.value as string)
      );
    default:
      return false;
  }
};

export const shouldShowField = (
  field: FieldConfig,
  formValues: Record<string, unknown> | undefined,
): boolean => {
  if (!field.conditional || field.conditional.length === 0) {
    return true;
  }

  const visibilityRules = field.conditional.filter(
    (logic) => logic.action === "show" || logic.action === "hide",
  );

  if (visibilityRules.length === 0) return true;

  return visibilityRules.every((logic) => {
    const result = evaluateConditionalLogic(logic, formValues);
    return logic.action === "show" ? result : !result;
  });
};

export const shouldDisableField = (
  field: FieldConfig,
  formValues: Record<string, unknown>,
): boolean => {
  if ((field as { disabled?: boolean }).disabled) return true;

  if (!field.conditional) return false;

  return field.conditional.some((logic) => {
    const result = evaluateConditionalLogic(logic, formValues);
    return logic.action === "disable" && result;
  });
};

export const shouldRequireField = (
  field: FieldConfig,
  formValues: Record<string, unknown>,
): boolean => {
  if ((field as { required?: boolean }).required) return true;

  const rules = (field as { validation?: Array<{ type: string }> }).validation;
  if (rules?.some((rule) => rule.type === "required")) return true;

  if (!field.conditional) return false;

  return field.conditional.some((logic) => {
    const result = evaluateConditionalLogic(logic, formValues);
    return logic.action === "require" && result;
  });
};

const setAtPath = (
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
) => {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (
      cur[parts[i]] === undefined ||
      cur[parts[i]] === null ||
      typeof cur[parts[i]] !== "object"
    ) {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
};

export const getDefaultValues = (
  fields: FieldConfig[],
): Record<string, unknown> => {
  const defaultValues: Record<string, unknown> = {};

  const addDefault = (field: FieldConfig) => {
    if (field.type === "quote") return;

    if (field.defaultValue !== undefined) {
      setAtPath(defaultValues, field.id, field.defaultValue);
    } else {
      switch (field.type) {
        case "checkbox":
        case "switch":
          setAtPath(defaultValues, field.id, false);
          break;
        case "number":
          setAtPath(defaultValues, field.id, 0);
          break;
        case "slider":
          setAtPath(defaultValues, field.id, 0);
          break;
        case "date-range":
          setAtPath(defaultValues, field.id, undefined);
          break;
        case "choice":
          setAtPath(defaultValues, field.id, []);
          break;
        case "rating":
          setAtPath(defaultValues, field.id, 0);
          break;
        case "multiselect":
          setAtPath(defaultValues, field.id, []);
          break;
        default:
          setAtPath(defaultValues, field.id, "");
      }
    }
  };

  fields.forEach((field) => {
    if (field.type === "group") {
      (field as GroupFieldConfig).children?.forEach(addDefault);
    } else {
      addDefault(field);
    }
  });

  return defaultValues;
};

export const flattenFields = (
  sections: Array<{ fields: FieldConfig[] }>,
): FieldConfig[] => {
  const out: FieldConfig[] = [];
  const pushField = (field: FieldConfig) => {
    if (field.type === "group") {
      (field as GroupFieldConfig).children?.forEach(pushField);
    } else {
      out.push(field);
    }
  };

  sections.forEach((section) => {
    section.fields.forEach(pushField);
  });
  return out;
};

export const evaluateDependencies = (
  dependencies: DependencyConfig[],
  formValues: Record<string, unknown>,
): boolean => {
  if (!dependencies || dependencies.length === 0) return true;

  let result = true;
  let currentCondition: "and" | "or" = "and";

  for (const dep of dependencies) {
    const fieldValue = getAtPath(formValues, dep.field);
    let depResult = false;

    switch (dep.operator) {
      case "equals":
        depResult = fieldValue === dep.value;
        break;
      case "notEquals":
        depResult = fieldValue !== dep.value;
        break;
      case "contains":
        depResult =
          typeof fieldValue === "string" &&
          typeof dep.value === "string" &&
          fieldValue.includes(dep.value);
        break;
      case "notContains":
        depResult =
          typeof fieldValue === "string" &&
          typeof dep.value === "string" &&
          !fieldValue.includes(dep.value);
        break;
      case "greaterThan":
        depResult = Number(fieldValue) > Number(dep.value);
        break;
      case "lessThan":
        depResult = Number(fieldValue) < Number(dep.value);
        break;
      case "greaterThanOrEqual":
        depResult = Number(fieldValue) >= Number(dep.value);
        break;
      case "lessThanOrEqual":
        depResult = Number(fieldValue) <= Number(dep.value);
        break;
      case "isEmpty":
        depResult =
          !fieldValue ||
          (typeof fieldValue === "string" && fieldValue.trim() === "") ||
          (Array.isArray(fieldValue) && fieldValue.length === 0);
        break;
      case "isNotEmpty":
        depResult =
          !!fieldValue &&
          (typeof fieldValue !== "string" || fieldValue.trim() !== "") &&
          (!Array.isArray(fieldValue) || fieldValue.length > 0);
        break;
      case "startsWith":
        depResult =
          typeof fieldValue === "string" &&
          typeof dep.value === "string" &&
          fieldValue.startsWith(dep.value);
        break;
      case "endsWith":
        depResult =
          typeof fieldValue === "string" &&
          typeof dep.value === "string" &&
          fieldValue.endsWith(dep.value);
        break;
      default:
        depResult = false;
    }

    if (currentCondition === "and") {
      result = result && depResult;
    } else {
      result = result || depResult;
    }

    currentCondition = dep.condition || "and";
  }

  return result;
};
