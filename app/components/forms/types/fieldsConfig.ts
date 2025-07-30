type BaseField = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  showWhen?: {
    field: string;
    equals: string;
  };
};

type TextField = BaseField & {
  type: "text" | "email" | "password" | "number";
  min?: number;
  max?: number;
  step?: number;
};

type FloatField = BaseField & {
  type: "float";
};

type TextAreaField = BaseField & {
  type: "textarea";
  rows?: number;
  maxLength?: number;
};

type SelectField = BaseField & {
  type: "select";
  options: string[] | { label: string; value: string }[];
};

type CheckboxField = BaseField & {
  type: "checkbox";
};

export type FieldConfig =
  | TextField
  | FloatField
  | TextAreaField
  | SelectField
  | CheckboxField;

export type FormConfig = FieldConfig[];