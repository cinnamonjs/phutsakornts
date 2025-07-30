import type { FieldConfig } from "../types/fieldsConfig";

export function shouldShowField(field: FieldConfig, values: Record<string, string>) {
  if (!field.showWhen) return true;
  const { field: depField, equals } = field.showWhen;
  if (equals) {
    return values[depField] === equals;
  }
  return !!values[depField]
}