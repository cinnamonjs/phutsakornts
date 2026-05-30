import type React from "react";
import type { ReactNode } from "react";
import type { ComponentAdapter } from "@/components/module/form-builder/component-adapter";

export type FormId = string & { readonly __brand: unique symbol };
export type SectionId = string & { readonly __brand: unique symbol };
export type FieldId = string;

export const FIELD_TYPES = [
  "text",
  "email",
  "rating",
  "password",
  "number",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "switch",
  "date",
  "file",
  "image",
  "multiselect",
  "custom",
  "date-range",
  "slider",
  "choice",
  "group",
  "hidden",
  "quote",
] as const;

type StylingProps = {
  [K: `${string}ClassName`]: string;
  [K: `${string}Style`]: React.CSSProperties;
  [K: string]: unknown;
};

type CustomProps = {
  styling?: StylingProps;
  theme?: ThemeConfig;
  [key: string]: unknown;
};

export type FieldType = (typeof FIELD_TYPES)[number];

export type SpacingSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LayoutVariant = "default" | "card" | "steps" | "wizard";
export type ValidationTiming = "onSubmit" | "onChange" | "onBlur";

export type ValidationRule<T = unknown> =
  | { type: "required"; message?: string }
  | { type: "min"; value: number; message?: string }
  | { type: "max"; value: number; message?: string }
  | { type: "email"; message?: string }
  | { type: "url"; message?: string }
  | { type: "pattern"; value: string; message?: string; compiledRegex?: RegExp }
  | {
      type: "custom";
      message?: string;
      customValidator: (value: T, allValues: FormData) => boolean | string;
    };

export type ConditionalOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "isEmpty"
  | "isNotEmpty"
  | "startsWith"
  | "endsWith";

export type ConditionalAction =
  | "show"
  | "hide"
  | "require"
  | "disable"
  | "enable";

export type ConditionalLogic<T = unknown> = {
  field: string;
  operator: ConditionalOperator;
  value?: T;
  action: ConditionalAction;
};

export type SelectOption<T = string | number> = {
  label: string;
  value: T;
  disabled?: boolean;
  group?: string;
  description?: string;
  icon?: string;
};

export type GridConfig = {
  col?: number;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  row?: number;
  rowSpan?: number;
  order?: number;
};

export type BaseFieldConfig<T = unknown> = {
  id: string;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: T;
  value?: T;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: ValidationRule<T>[];
  conditional?: ConditionalLogic[];
  dependsOn?: DependencyConfig[];
  variant?: string;
  className?: string;
  style?: React.CSSProperties;
  customProps?: CustomProps;
  grid?: GridConfig;
};

export type TextFieldConfig = BaseFieldConfig<string> & {
  type: "text" | "email" | "password";
  minLength?: number;
  maxLength?: number;
  prefix?: ReactNode;
  subfix?: ReactNode;
  pattern?: string;
};

export type NumberFieldConfig = BaseFieldConfig<number> & {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
};

export type SliderFieldConfig = BaseFieldConfig<number> & {
  type: "slider";
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
};

export type TextareaFieldConfig = BaseFieldConfig<string> & {
  type: "textarea";
  rows?: number;
  cols?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  minLength?: number;
  maxLength?: number;
};

export type RatingFieldConfig = BaseFieldConfig<number> & {
  type: "rating";
  min?: number;
  max?: number;
};

export type SelectFieldConfig<T = string | number> = BaseFieldConfig<T> & {
  type: "select" | "multiselect";
  options: SelectOption<T>[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
};

export type RadioFieldConfig<T = string | number> = BaseFieldConfig<T> & {
  type: "radio";
  options: SelectOption<T>[];
  inline?: boolean;
};

export type ChoiceConfig<T = string | number> = BaseFieldConfig<T | T[]> & {
  type: "choice";
  options: SelectOption<T>[];
  multiple?: boolean;
  columns?: 1 | 2 | 3 | 4;
  variant?: "inline" | "block";
};

export type CheckboxFieldConfig = BaseFieldConfig<boolean> & {
  type: "checkbox";
  indeterminate?: boolean;
};

export type SwitchFieldConfig = BaseFieldConfig<boolean> & {
  type: "switch";
  size?: "sm" | "md" | "lg";
};

export type DateFieldConfig = BaseFieldConfig<Date | string> & {
  type: "date";
  format?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  showTime?: boolean;
  timezone?: string;
};

export type DateRangeValue = {
  start?: Date | null;
  end?: Date | null;
};

export type DateRangeFieldConfig = BaseFieldConfig<DateRangeValue> & {
  type: "date-range";
  format?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  allowSameDay?: boolean;
  enforceOrder?: boolean;
  separatorLabel?: string;
};

export type ImageFieldConfig = BaseFieldConfig<string> & {
  type: "image";
  aspectRatio?: number;
  maxFileSize?: number;
  acceptedFormats?: string[];
};

export type FileFieldConfig = BaseFieldConfig<File | File[]> & {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
};

// `label` is optional only for custom fields: field-renderer.tsx returns the
// CustomComponent before reaching the <Label> branch, so the framework never
// renders the outer label here — custom components own their own UI (e.g.
// UseSameAddressSwitch renders an internal <span> + Switch). Other variants
// keep label required because the renderer emits <Label> for them.
export type CustomFieldConfig<T = unknown> = Omit<BaseFieldConfig<T>, "label"> & {
  type: "custom";
  label?: string;
  customComponent: React.ComponentType<FieldComponentProps<T>>;
};

export type HiddenFieldConfig = BaseFieldConfig & {
  type: "hidden";
};

export type QuoteFieldConfig = {
  id: string;
  type: "quote";
  label?: string;
  template: ((values: Record<string, unknown>) => string) | string;
  watchFields?: string[];
  grid?: GridConfig;
  conditional?: ConditionalLogic[];
  dependsOn?: DependencyConfig[];
  className?: string;
  style?: React.CSSProperties;
};

export type GroupComponentProps = {
  group: GroupFieldConfig;
  fields: FieldConfig[];
  renderChild: (field: FieldConfig) => React.ReactNode;
  formValues: Record<string, unknown>;
  theme?: ThemeConfig;
  setValue: (fieldId: string, value: unknown) => void;
  getValues: () => Record<string, unknown>;
};

export type GroupFieldConfig = BaseFieldConfig & {
  type: "group";
  children?: FieldConfig[];
  layout?: {
    columns?: 1 | 2 | 3 | 4 | 6 | 12;
    spacing?: SpacingSize;
    className?: string;
  };
  customComponent?: React.ComponentType<GroupComponentProps>;
};

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SliderFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | ChoiceConfig
  | RadioFieldConfig
  | RatingFieldConfig
  | CheckboxFieldConfig
  | SwitchFieldConfig
  | DateFieldConfig
  | DateRangeFieldConfig
  | FileFieldConfig
  | ImageFieldConfig
  | CustomFieldConfig
  | HiddenFieldConfig
  | GroupFieldConfig
  | QuoteFieldConfig;

export type FieldValueMap = {
  text: string;
  email: string;
  password: string;
  textarea: string;
  number: number;
  slider: number;
  checkbox: boolean;
  switch: boolean;
  date: Date | string;
  "date-range": DateRangeValue;
  file: File | File[];
  image: string;
  select: string | number;
  multiselect: (string | number)[];

  radio: string | number;
  choice: string | number | (string | number)[];
  custom: unknown;
  group: unknown;
  hidden: unknown;
};

export type FieldConfigMap = {
  text: TextFieldConfig;
  email: TextFieldConfig;
  rating: RatingFieldConfig;
  password: TextFieldConfig;
  textarea: TextareaFieldConfig;
  number: NumberFieldConfig;
  slider: SliderFieldConfig;
  checkbox: CheckboxFieldConfig;
  switch: SwitchFieldConfig;
  date: DateFieldConfig;
  "date-range": DateRangeFieldConfig;
  file: FileFieldConfig;
  select: SelectFieldConfig;
  multiselect: SelectFieldConfig;
  radio: RadioFieldConfig;
  choice: ChoiceConfig;
  custom: CustomFieldConfig;
  group: GroupFieldConfig;
  image: ImageFieldConfig;
  hidden: HiddenFieldConfig;
};

export type FormData = Record<string, unknown>;

export type FormSection<T extends FormData = FormData> = {
  id: string;
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: FieldConfig[];
  className?: string;
  conditional?: ConditionalLogic[];
  customComponent?: React.ComponentType<FormSectionProps<T>>;
  customProps?: CustomProps;
  style?: React.CSSProperties;
  validation?: {
    crossField?: (data: Partial<T>) => Record<string, string> | null;
  };
};

export type LayoutConfig = {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  spacing?: SpacingSize;
  variant?: LayoutVariant;
  responsive?: {
    sm?: Partial<LayoutConfig>;
    md?: Partial<LayoutConfig>;
    lg?: Partial<LayoutConfig>;
    xl?: Partial<LayoutConfig>;
  };
};

export type SubmissionConfig<T extends FormData = FormData> = {
  enabled?: boolean;
  expand?: boolean;
  submitText?: string;
  resetText?: string;
  customSubmitButton?: React.ComponentType<SubmissionButtonProps>;
  customResetButton?: React.ComponentType<SubmissionButtonProps>;
  onSubmit?: (data: T) => void | Promise<void>;
  onReset?: () => void;
  validation?: ValidationTiming;
  confirmBeforeSubmit?: boolean;
  confirmMessage?: string;
  loadingText?: string;
};

export type FormConfig<T extends FormData = FormData> = {
  id: string;
  title?: string;
  description?: string;
  sections: FormSection<T>[];
  layout?: LayoutConfig;
  submission?: SubmissionConfig<T>;
  theme?: ThemeConfig;
  customComponents?: Record<string, React.ComponentType<FieldComponentProps>>;
  plugins?: string[];
  customValidators?: Record<string, (value: unknown) => boolean | string>;
  i18n?: {
    locale?: string;
    messages?: Record<string, string>;
    rtl?: boolean;
  };
  customProps?: CustomProps;
  metadata?: {
    version?: string;
    createdAt?: Date;
    updatedAt?: Date;
    author?: string;
    tags?: string[];
  };
};

export type SubmissionButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  className?: string;
  children?: React.ReactNode;
  text?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export type FieldComponentProps<T = unknown> = {
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  field?: FieldConfig;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  error?: string;
  touched?: boolean;
  name?: string;
};

export type CustomFieldComponentProps<
  TValue = unknown,
  TCustomProps extends Record<string, unknown> = Record<string, never>,
> = FieldComponentProps<TValue> & TCustomProps;

export type CustomFieldComponent<
  TValue = unknown,
  TCustomProps extends Record<string, unknown> = Record<string, never>,
> = React.ComponentType<CustomFieldComponentProps<TValue, TCustomProps>> & {
  readonly __customFieldProps?: TCustomProps;
};

export type FormSectionProps<T extends FormData = FormData> = {
  section: FormSection<T>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export type FormBuilderProps<T extends FormData = FormData> = {
  config: FormConfig<T>;
  initialValues?: Partial<T>;
  onSubmit?: (data: T) => void | Promise<void>;
  onError?: (error: unknown) => void;
  onFieldChange?: (
    fieldId: string,
    value: unknown,
    allValues: Partial<T>,
  ) => void;
  onValidationChange?: (errors: Record<string, string>) => void;
  onFormReady?: (formMethods: {
    setValue: (name: string, value: unknown) => void;
    setValues: (values: Partial<T>) => void;
    getValues: () => Partial<T>;
    reset: (values?: Partial<T>) => void;
    watch: (name?: string) => unknown;
    trigger: (name?: string | string[]) => Promise<boolean>;
  }) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  mode?: "create" | "edit" | "view";
  theme?: ThemeConfig;
  adapter?: Partial<ComponentAdapter>;
};

export type PluginConfig<T extends FormData = FormData> = {
  name: string;
  version?: string;
  fieldTypes?: Record<string, React.ComponentType<FieldComponentProps>>;
  validators?: Record<string, (value: unknown) => boolean | string>;
  hooks?: {
    beforeSubmit?: (data: T) => T | Promise<T>;
    afterSubmit?: (data: T) => void | Promise<void>;
    onFieldChange?: (
      fieldId: FieldId,
      value: unknown,
      allValues: Partial<T>,
    ) => void;
    onValidationError?: (fieldId: FieldId, error: string) => void;
    onSectionToggle?: (sectionId: SectionId, collapsed: boolean) => void;
  };
  components?: {
    customFields?: Record<string, React.ComponentType<FieldComponentProps>>;
    customSections?: Record<string, React.ComponentType<FormSectionProps<T>>>;
    customLayouts?: Record<
      string,
      React.ComponentType<{ children: React.ReactNode }>
    >;
  };
};

export type FieldValue<F extends FieldConfig> = F extends TextFieldConfig
  ? string
  : F extends TextareaFieldConfig
    ? string
    : F extends NumberFieldConfig
      ? number
      : F extends SliderFieldConfig
        ? number
        : F extends RatingFieldConfig
          ? number
          : F extends CheckboxFieldConfig
            ? boolean
            : F extends SwitchFieldConfig
              ? boolean
              : F extends DateFieldConfig
                ? Date | string
                : F extends DateRangeFieldConfig
                  ? DateRangeValue
                  : F extends FileFieldConfig
                    ? File | File[]
                    : F extends ImageFieldConfig
                      ? string
                      : F extends SelectFieldConfig<infer T>
                        ? F["type"] extends "multiselect"
                          ? T[]
                          : T
                        : F extends RadioFieldConfig<infer T>
                          ? T
                          : F extends ChoiceConfig<infer T>
                            ? F["multiple"] extends true
                              ? T[]
                              : T
                            : unknown;

export type FormSchema<F extends readonly FieldConfig[]> = {
  [K in F[number] as K["id"]]: FieldValue<K>;
};

export const isTextFieldConfig = (
  field: FieldConfig,
): field is TextFieldConfig =>
  ["text", "email", "password"].includes(field.type);

export const isNumberFieldConfig = (
  field: FieldConfig,
): field is NumberFieldConfig => field.type === "number";

export const isSelectFieldConfig = (
  field: FieldConfig,
): field is SelectFieldConfig => ["select", "multiselect"].includes(field.type);

export const isFileFieldConfig = (
  field: FieldConfig,
): field is FileFieldConfig => field.type === "file";

export const createFormId = (id: string): FormId => id as FormId;
export const createSectionId = (id: string): SectionId => id as SectionId;
export const createFieldId = (id: string): FieldId => id as FieldId;

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  URL: "Please enter a valid URL",
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be no more than ${max}`,
  PATTERN: "Invalid format",
  PHONE: "Please enter a valid phone number",
  PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and number",
} as const;

export const SPACING_VALUES: Record<SpacingSize, string> = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
} as const;

export type ThemeConfig = {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    muted?: string;
    border?: string;
    input?: string;
    ring?: string;
    destructive?: string;
    warning?: string;
    success?: string;
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
  fieldClassName?: string;
  fieldStyle?: React.CSSProperties;
  labelClassName?: string;
  itemClassName?: string;
  itemStyle?: React.CSSProperties;
  descriptionClassName?: string;
  errorClassName?: string;
  submissionLayout?: "horizontal" | "vertical";
};

export type DependencyConfig = {
  field: FieldId;
  operator: ConditionalOperator;
  value?: unknown;
  condition?: "and" | "or";
};
