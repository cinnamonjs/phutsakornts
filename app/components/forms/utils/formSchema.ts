import { z } from "zod";
import type { FormConfig } from "../types/fieldsConfig";

export function getZodSchema(config: FormConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of config) {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case "float":
        schema = z
          .string()
          .refine(val => val === "" || /^[+-]?\d*\.?\d*$/.test(val), {
            message: "Invalid number format",
          })
          .transform(val => (val === "" ? undefined : parseFloat(val)));
        break;

      case "checkbox":
        schema = z.union([z.literal("on"), z.undefined()]);
        break;

      default:
        schema = z.string();
        break;
    }

    if (field.required && field.type !== "checkbox") {
      schema = (schema as any).min(1, `${field.label} is required`);
    }

    shape[field.name] = schema;
  }

  return z.object(shape);
}