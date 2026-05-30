import { UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { DatePickerWithPresets } from "@/components/date/presetpicker";
import type {
  ChoiceConfig,
  FieldConfig,
  FieldType,
  RadioFieldConfig,
  RatingFieldConfig,
  SelectFieldConfig,
  SliderFieldConfig,
} from "@/components/module/form-builder/types";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star } from "@/components/ui/star";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/service/file.service";

export type FieldInputProps = {
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  field: FieldConfig;
  invalid?: boolean;
};

export type FormItemWrapperProps = {
  children: ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  isInline?: boolean;
};

export type SectionWrapperProps = {
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  children: ReactNode;
};

export type ButtonAdapterProps = {
  type?: "submit" | "button" | "reset";
  variant?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
};

export type FieldWrapperProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  error?: boolean;
  disabled?: boolean;
};

export type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

export type FieldDescriptionProps = {
  children: ReactNode;
  className?: string;
};

export type FieldErrorProps = {
  children: ReactNode;
  className?: string;
};

export type IconName = "calendar" | "chevronDown" | "chevronRight";

export type ComponentAdapter = {
  fields: Partial<Record<FieldType, React.ComponentType<FieldInputProps>>>;
  icons: Partial<Record<IconName, React.ComponentType<{ className?: string }>>>;
  Field: React.ComponentType<FieldWrapperProps>;
  Label: React.ComponentType<LabelProps>;
  FieldDescription: React.ComponentType<FieldDescriptionProps>;
  FieldError: React.ComponentType<FieldErrorProps>;
  FormItemWrapper: React.ComponentType<FormItemWrapperProps>;
  SectionWrapper: React.ComponentType<SectionWrapperProps>;
  Button: React.ComponentType<ButtonAdapterProps>;
  cn: (...args: Array<string | undefined | false | null>) => string;
  formatDate: (date: Date, formatStr: string) => string;
};

const DefaultTextInput = ({
  value,
  onChange,
  disabled,
  placeholder,
  className,
  field,
  invalid,
}: FieldInputProps) => (
  <Input
    type={
      field.type === "email"
        ? "email"
        : field.type === "password"
          ? "password"
          : "text"
    }
    value={(value as string) || ""}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    placeholder={placeholder}
    className={className}
    aria-invalid={invalid || undefined}
  />
);

const DefaultNumberInput = ({
  value,
  onChange,
  disabled,
  placeholder,
  className,
  field,
  invalid,
}: FieldInputProps) => {
  const suffix = (field as { customProps?: Record<string, unknown> })
    .customProps?.suffix as string | undefined;
  const [localValue, setLocalValue] = useState(
    value === null || value === undefined ? "" : String(value),
  );
  const isComposing = useRef(false);

  useEffect(() => {
    if (isComposing.current) return;
    const parsed = localValue === "" ? undefined : Number(localValue);
    if (parsed !== value) {
      setLocalValue(value === null || value === undefined ? "" : String(value));
    }
  }, [value]);

  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={(e) => {
          const raw = e.target.value;
          if (!/^-?\d*\.?\d*$/.test(raw) && raw !== "") return;
          setLocalValue(raw);
          if (raw === "" || raw === "-") {
            onChange(undefined);
          } else {
            const num = Number(raw);
            if (!Number.isNaN(num)) onChange(num);
          }
        }}
        onCompositionStart={() => {
          isComposing.current = true;
        }}
        onCompositionEnd={() => {
          isComposing.current = false;
        }}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(suffix && "pr-8", className)}
        aria-invalid={invalid || undefined}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-2 select-none text-xs text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  );
};

const DefaultSliderInput = ({
  value,
  onChange,
  disabled,
  className,
  field,
}: FieldInputProps) => {
  const f = field as SliderFieldConfig;
  const min = f.min ?? 0;
  const max = f.max ?? 100;
  const step = f.step ?? 1;
  const showValue = f.showValue ?? true;
  const numericValue =
    typeof value === "number"
      ? value
      : ((f.defaultValue as number | undefined) ?? min);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[numericValue]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        disabled={disabled}
        className="flex-1"
      />
      {showValue && (
        <Input
          type="number"
          value={numericValue}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-16 text-center"
        />
      )}
    </div>
  );
};

const DefaultTextareaInput = ({
  value,
  onChange,
  disabled,
  placeholder,
  className,
  invalid,
}: FieldInputProps) => (
  <Textarea
    value={(value as string) || ""}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    placeholder={placeholder}
    className={className}
    aria-invalid={invalid || undefined}
  />
);

const DefaultSelectInput = ({
  value,
  onChange,
  disabled,
  placeholder,
  className,
  field,
  invalid,
}: FieldInputProps) => {
  const f = field as SelectFieldConfig;
  return (
    <Select
      items={f.options?.map((opt) => ({
        label: opt.label,
        value: String(opt.value),
      }))}
      value={value != null && value !== "" ? String(value) : ""}
      onValueChange={(v) => onChange(v)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn("w-full rounded-lg", className)}
        aria-invalid={invalid || undefined}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {f.options?.map((opt) => (
          <SelectItem
            key={String(opt.value)}
            value={String(opt.value)}
            disabled={opt.disabled}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const DefaultRatingInput = ({
  value,
  onChange,
  disabled,
  className,
  field,
}: FieldInputProps) => {
  const f = field as RatingFieldConfig;
  const max = f.max ?? 5;
  const current = typeof value === "number" ? value : 0;

  return (
    <div
      role="radiogroup"
      aria-label={f.label}
      className={cn("flex items-center gap-0.5", className)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={current === starValue}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            disabled={disabled}
            onClick={() => onChange(current === starValue ? 0 : starValue)}
            className={cn(
              "rounded-sm p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
              starValue <= current
                ? "text-amber-400"
                : "text-muted-foreground/30 hover:text-amber-300",
            )}
          >
            <Star filled={starValue <= current} half={false} />
          </button>
        );
      })}
    </div>
  );
};

const DefaultMultiselectInput = ({
  value,
  onChange,
  disabled,
  className,
  field,
}: FieldInputProps) => {
  const f = field as SelectFieldConfig;
  const selected: string[] = Array.isArray(value)
    ? (value as string[])
    : value
      ? [String(value)]
      : [];
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {f.options?.map((opt) => {
        const checked = selected.includes(String(opt.value));
        return (
          <label
            key={String(opt.value)}
            className="flex items-center gap-2 text-sm"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(c) => {
                const next = new Set(selected);
                if (c) next.add(String(opt.value));
                else next.delete(String(opt.value));
                onChange(Array.from(next));
              }}
              disabled={opt.disabled || disabled}
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
};

const DefaultChoiceInput = ({
  value,
  onChange,
  disabled,
  className,
  field,
}: FieldInputProps) => {
  const f = field as ChoiceConfig;
  const multiple = f.multiple ?? false;
  const columns = f.columns ?? 2;
  const variant = f.variant ?? "block";

  const selected: Set<string> = new Set(
    Array.isArray(value)
      ? (value as (string | number)[]).map(String)
      : value != null
        ? [String(value)]
        : [],
  );

  const toggle = (optValue: string) => {
    if (!multiple) {
      onChange(selected.has(optValue) ? undefined : optValue);
      return;
    }
    const next = new Set(selected);
    if (next.has(optValue)) next.delete(optValue);
    else next.add(optValue);
    onChange(Array.from(next));
  };

  const colsClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-3"
        : columns === 4
          ? "grid-cols-4"
          : "grid-cols-2";

  return (
    <div className={cn("grid gap-2.5", colsClass, className)}>
      {f.options?.map((opt) => {
        const isSelected = selected.has(String(opt.value));
        return (
          <button
            type="button"
            key={String(opt.value)}
            onClick={() => toggle(String(opt.value))}
            disabled={disabled || opt.disabled}
            className={cn(
              "px-4 py-3.5 rounded-xl border transition-all duration-200 text-left",
              variant === "inline"
                ? "flex flex-row items-center gap-3"
                : "flex flex-col gap-1",
              isSelected
                ? "border-primary/60 bg-primary text-background"
                : "border-border bg-background text-foreground hover:border-primary/30 hover:bg-muted",
              (disabled || opt.disabled) && "pointer-events-none opacity-50",
            )}
          >
            <span className="font-medium text-sm">{opt.label}</span>
            {opt.description && (
              <span
                className={cn(
                  "text-xs",
                  isSelected ? "text-background/70" : "text-muted-foreground",
                )}
              >
                {opt.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const DefaultCheckboxInput = ({
  value,
  onChange,
  disabled,
  className,
}: FieldInputProps) => (
  <Checkbox
    checked={Boolean(value)}
    onCheckedChange={(c) => onChange(c)}
    disabled={disabled}
    className={className}
  />
);

const DefaultSwitchInput = ({
  value,
  onChange,
  disabled,
  className,
}: FieldInputProps) => (
  <Switch
    checked={Boolean(value)}
    onCheckedChange={(c) => onChange(c)}
    disabled={disabled}
    className={cn("data-unchecked:bg-border mt-2", className)}
  />
);

const DefaultRadioInput = ({
  value,
  onChange,
  disabled,
  className,
  field,
}: FieldInputProps) => {
  const f = field as RadioFieldConfig;
  return (
    <RadioGroup
      value={value ? String(value) : undefined}
      onValueChange={(v) => onChange(v)}
      disabled={disabled}
      className={className}
    >
      {f.options?.map((opt) => (
        <label
          key={String(opt.value)}
          className="flex items-center gap-2 text-sm"
        >
          <RadioGroupItem value={String(opt.value)} disabled={opt.disabled} />
          {opt.label}
        </label>
      ))}
    </RadioGroup>
  );
};

const DefaultDateInput = ({
  value,
  onChange,
  disabled,
  className,
  field,
}: FieldInputProps) => {
  const customProps =
    (field as { customProps?: Record<string, unknown> }).customProps ?? {};
  const showEndDateProps = Boolean(customProps.showEndDateProps);
  const showStartDateProps = Boolean(customProps.showStartDateProps);
  const disableFuture = Boolean(customProps.disableFuture);
  const isEndDate = Boolean(customProps.isEndDate);
  const startDate =
    customProps.startDate instanceof Date ? customProps.startDate : undefined;
  const intervalCount =
    typeof customProps.intervalCount === "number"
      ? customProps.intervalCount
      : 1;

  const date =
    value instanceof Date
      ? value
      : value
        ? new Date(value as string)
        : undefined;

  return (
    <div className={cn("w-full", className)} aria-disabled={disabled}>
      <DatePickerWithPresets
        value={date}
        onDateChange={(d) => onChange(d ?? undefined)}
        isEndDate={isEndDate}
        showEndDateProps={showEndDateProps}
        showStartDateProps={showStartDateProps}
        disableFuture={disableFuture}
        startDate={startDate}
        interval_count={intervalCount}
      />
    </div>
  );
};

const DefaultImageInput = ({
  value,
  onChange,
  disabled,
  className,
  invalid,
}: FieldInputProps) => {
  const t = useTranslations();
  const [uploading, setUploading] = useState(false);
  const inputId = useRef(`img-upload-${Math.random().toString(36).slice(2)}`);
  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <Input
        type="text"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="https://example.com/image.png"
        className="flex-1"
        aria-invalid={invalid || undefined}
      />
      <span className="shrink-0 text-xs text-muted-foreground">or</span>
      <label
        htmlFor={inputId.current}
        aria-disabled={disabled || uploading}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium",
          "hover:bg-accent hover:text-accent-foreground",
          (disabled || uploading) && "pointer-events-none opacity-50",
        )}
      >
        <UploadIcon className="size-3.5" />
        {uploading ? "Uploading…" : "Upload"}
      </label>
      <input
        id={inputId.current}
        type="file"
        style={{ display: "none" }}
        disabled={disabled || uploading}
        accept="image/png,image/jpeg,image/webp"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          try {
            const url = await uploadFile(file, "product");
            if (!url) {
              toast.error(t("admin.formBuilder.uploadFailed"));
              return;
            }
            onChange(url?.file_id);
            toast.success(t("admin.formBuilder.imageUploaded"));
          } catch {
            toast.error(t("admin.formBuilder.uploadFailed"));
          } finally {
            setUploading(false);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
};

const DefaultDateRangeInput = ({
  value,
  onChange,
  className,
  field,
}: FieldInputProps) => {
  const range =
    value && typeof value === "object"
      ? (value as { start?: Date; end?: Date })
      : { start: undefined, end: undefined };
  const customProps =
    (field as { customProps?: Record<string, unknown> }).customProps ?? {};
  const showStartDateProps = Boolean(customProps.showStartDateProps);
  const showEndDateProps = Boolean(customProps.showEndDateProps);
  const disableFuture = Boolean(customProps.disableFuture);
  const intervalCount =
    typeof customProps.intervalCount === "number"
      ? customProps.intervalCount
      : 1;
  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      <DatePickerWithPresets
        value={range.start}
        onDateChange={(d) => onChange({ ...range, start: d })}
        showStartDateProps={showStartDateProps}
        disableFuture={disableFuture}
        interval_count={intervalCount}
        startDate={range.start}
        className="w-1/3"
      />
      <span className="text-muted-foreground">–</span>
      <DatePickerWithPresets
        value={range.end}
        onDateChange={(d) => onChange({ ...range, end: d })}
        showEndDateProps={showEndDateProps}
        isEndDate
        startDate={range.start}
        disableFuture={disableFuture}
        className="w-1/3"
      />
    </div>
  );
};

const DefaultField = ({
  children,
  className,
  style,
  error,
  disabled,
}: FieldWrapperProps) => (
  <div
    data-slot="field"
    data-error={error || undefined}
    data-disabled={disabled || undefined}
    className={cn("group/field grid gap-1.5", className)}
    style={style}
  >
    {children}
  </div>
);

const DefaultLabel = ({
  children,
  htmlFor,
  required,
  className,
  disabled,
}: LabelProps) => (
  <Label
    htmlFor={htmlFor}
    data-disabled={disabled || undefined}
    className={cn(
      "text-sm font-medium leading-none opacity-70 select-none group-has-disabled/field:pointer-events-none group-has-disabled/field:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
  >
    {children}
    {required && (
      <span className="ml-0.5 text-destructive" aria-hidden>
        *
      </span>
    )}
  </Label>
);

const DefaultFieldDescription = ({
  children,
  className,
}: FieldDescriptionProps) => (
  <p
    data-slot="field-description"
    className={cn("text-sm text-muted-foreground", className)}
  >
    {children}
  </p>
);

const DefaultFieldError = ({ children, className }: FieldErrorProps) => (
  <p
    data-slot="field-error"
    role="alert"
    className={cn("text-sm text-destructive", className)}
  >
    {children}
  </p>
);

const DefaultFormItemWrapper = ({
  children,
  label,
  description,
  error,
  required,
  className,
  style,
  isInline,
}: FormItemWrapperProps) => (
  <DefaultField
    className={cn(isInline && "flex flex-row items-start gap-3", className)}
    style={style}
    error={!!error}
  >
    {!isInline && label && (
      <DefaultLabel required={required}>{label}</DefaultLabel>
    )}
    {children}
    {isInline && label && (
      <div className="grid gap-1">
        <DefaultLabel required={required}>{label}</DefaultLabel>
        {description && (
          <DefaultFieldDescription>{description}</DefaultFieldDescription>
        )}
      </div>
    )}
    {!isInline && description && (
      <DefaultFieldDescription>{description}</DefaultFieldDescription>
    )}
    {error && <DefaultFieldError>{error}</DefaultFieldError>}
  </DefaultField>
);

const DefaultSectionWrapper = ({
  title,
  description,
  collapsible,
  defaultCollapsed,
  className,
  children,
}: SectionWrapperProps) => {
  if (collapsible) {
    return (
      <details
        open={!defaultCollapsed}
        className={cn("group rounded-2xl ring-1 ring-foreground/10", className)}
      >
        <summary className="cursor-pointer select-none px-6 py-4 font-heading text-base font-medium">
          {title}
          {description && (
            <p className="mt-1 text-sm font-normal text-muted-foreground">
              {description}
            </p>
          )}
        </summary>
        <div className="px-6 pb-6">{children}</div>
      </details>
    );
  }
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="font-heading text-base font-medium">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

const DefaultButton = ({
  type = "button",
  variant,
  onClick,
  disabled,
  className,
  children,
}: ButtonAdapterProps) => (
  <ShadcnButton
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={className}
    variant={
      variant === "outline"
        ? "outline"
        : variant === "ghost"
          ? "ghost"
          : variant === "destructive"
            ? "destructive"
            : "default"
    }
  >
    {children}
  </ShadcnButton>
);

const defaultFormatDate = (date: Date): string => date.toLocaleDateString();

export const defaultAdapter: ComponentAdapter = {
  fields: {
    text: DefaultTextInput,
    email: DefaultTextInput,
    password: DefaultTextInput,
    number: DefaultNumberInput,
    slider: DefaultSliderInput,
    rating: DefaultRatingInput,
    textarea: DefaultTextareaInput,
    select: DefaultSelectInput,
    multiselect: DefaultMultiselectInput,
    choice: DefaultChoiceInput,
    checkbox: DefaultCheckboxInput,
    switch: DefaultSwitchInput,
    radio: DefaultRadioInput,
    date: DefaultDateInput,
    "date-range": DefaultDateRangeInput,
    image: DefaultImageInput,
  },
  icons: {},
  Field: DefaultField,
  Label: DefaultLabel,
  FieldDescription: DefaultFieldDescription,
  FieldError: DefaultFieldError,
  FormItemWrapper: DefaultFormItemWrapper,
  SectionWrapper: DefaultSectionWrapper,
  Button: DefaultButton,
  cn: cn as ComponentAdapter["cn"],
  formatDate: defaultFormatDate,
};

const ComponentAdapterContext = createContext<ComponentAdapter>(defaultAdapter);

export type ComponentAdapterProviderProps = {
  adapter?: Partial<ComponentAdapter>;
  children: ReactNode;
};

export const ComponentAdapterProvider = ({
  adapter,
  children,
}: ComponentAdapterProviderProps) => {
  const merged = useMemo<ComponentAdapter>(() => {
    if (!adapter) return defaultAdapter;
    return {
      ...defaultAdapter,
      ...adapter,
      fields: { ...defaultAdapter.fields, ...adapter.fields },
      icons: { ...defaultAdapter.icons, ...adapter.icons },
    };
  }, [adapter]);
  return (
    <ComponentAdapterContext.Provider value={merged}>
      {children}
    </ComponentAdapterContext.Provider>
  );
};

export const useComponentAdapter = (): ComponentAdapter =>
  useContext(ComponentAdapterContext);
