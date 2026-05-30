import type { FilterDataType, FilterOperator } from "@/components/module/data-view/types";

export const TEXT_OPERATORS: FilterOperator[] = [
  { id: "contains", label: "contains", inputKind: "text" },
  { id: "equals", label: "equals", inputKind: "text" },
  { id: "starts_with", label: "starts with", inputKind: "text" },
  { id: "ends_with", label: "ends with", inputKind: "text" },
  { id: "not_contains", label: "does not contain", inputKind: "text" },
  { id: "not_equals", label: "does not equal", inputKind: "text" },
];

export const NUMBER_OPERATORS: FilterOperator[] = [
  { id: "eq", label: "equals", inputKind: "number" },
  { id: "gt", label: "greater than", inputKind: "number" },
  { id: "gte", label: "greater than or equal", inputKind: "number" },
  { id: "lt", label: "less than", inputKind: "number" },
  { id: "lte", label: "less than or equal", inputKind: "number" },
  { id: "between", label: "between", inputKind: "numberrange" },
];

export const AMOUNT_OPERATORS: FilterOperator[] = NUMBER_OPERATORS;

export const DATE_OPERATORS: FilterOperator[] = [
  { id: "in_last", label: "is in the last", inputKind: "duration" },
  { id: "on", label: "is on", inputKind: "date" },
  { id: "before", label: "is before", inputKind: "date" },
  { id: "after", label: "is after", inputKind: "date" },
  { id: "between", label: "is between", inputKind: "daterange" },
];

export const SELECT_OPERATORS: FilterOperator[] = [
  { id: "is", label: "is", inputKind: "select" },
  { id: "is_not", label: "is not", inputKind: "select" },
];

export const MULTI_OPERATORS: FilterOperator[] = [
  { id: "has_any", label: "has any of", inputKind: "multiselect" },
  { id: "has_all", label: "has all of", inputKind: "multiselect" },
  { id: "has_none", label: "has none of", inputKind: "multiselect" },
];

export const BOOLEAN_OPERATORS: FilterOperator[] = [
  { id: "is_true", label: "is true", inputKind: "none" },
  { id: "is_false", label: "is false", inputKind: "none" },
];

export function defaultOperators(type: FilterDataType): FilterOperator[] {
  switch (type) {
    case "text": return TEXT_OPERATORS;
    case "number": return NUMBER_OPERATORS;
    case "amount": return AMOUNT_OPERATORS;
    case "date": return DATE_OPERATORS;
    case "daterange": return [];
    case "select": return SELECT_OPERATORS;
    case "multiselect": return MULTI_OPERATORS;
    case "boolean": return BOOLEAN_OPERATORS;
  }
}
