import type { ReactNode } from "react";
import type {
	ConditionalLogic,
	CustomFieldComponent,
	CustomFieldComponentProps,
	FieldComponentProps,
	FieldConfig,
	FieldConfigMap,
	FieldType,
	FieldValueMap,
	FormConfig,
	FormData as FormDataType,
	FormSchema,
	FormSection,
	FormSectionProps,
	GroupComponentProps,
	LayoutConfig,
	SelectOption,
	SubmissionButtonProps,
	SubmissionConfig,
	ThemeConfig,
	ValidationRule,
} from "@/components/module/form-builder/types";

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
	columns: 1,
	spacing: "md" as const,
	variant: "default" as const,
};

export const DEFAULT_SUBMISSION_CONFIG: SubmissionConfig = {
	enabled: true,
	submitText: "Submit",
	resetText: "",
	validation: "onSubmit" as const,
};

export const DEFAULT_I18N_CONFIG = {
	locale: "en",
	messages: {},
};

const REGEX_CACHE = new Map<string, RegExp>();

const getCompiledRegex = (pattern: string): RegExp => {
	let regex = REGEX_CACHE.get(pattern);
	if (!regex) {
		regex = new RegExp(pattern);
		REGEX_CACHE.set(pattern, regex);
	}
	return regex;
};

type BuilderFieldType = Exclude<FieldType, "quote">;

export class FieldConfigBuilder<TField extends BuilderFieldType = BuilderFieldType, TId extends string = string> {
	declare readonly _type: TField;
	declare readonly _id: TId;
	private field: Partial<Exclude<FieldConfig, { type: "quote" }>> = {};

	constructor(id: TId, type: TField, label: string) {
		this.field = {};
		this.field.id = id;
		this.field.type = type as Exclude<FieldType, "quote">;
		this.field.label = label;
	}

	withDescription(description: string) {
		this.field.description = description;
		return this;
	}

	withPlaceholder(placeholder: string) {
		this.field.placeholder = placeholder;
		return this;
	}

	withValue(value: TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown) {
		(this.field as Record<string, unknown>).value = value;
		return this;
	}

	withDefaultValue(defaultValue: TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown): this {
		(this.field as Record<string, unknown>).defaultValue = defaultValue;
		return this;
	}

	asRequired(required = true, message = "This field is required") {
		this.field.required = required;
		if (required) {
			if (!this.field.validation) {
				this.field.validation = [];
			}
			if (!this.field.validation.some((v) => v.type === "required")) {
				this.field.validation.push({ type: "required", message });
			}
		}
		return this;
	}

	asDisabled(disabled = true) {
		this.field.disabled = disabled;
		return this;
	}

	asReadonly(readonly = true) {
		this.field.readonly = readonly;
		return this;
	}

	withValidation(validation: ValidationRule<TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown>[]) {
		(this.field as Record<string, unknown>).validation = validation;
		return this;
	}

	addValidation(rule: ValidationRule<TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown>) {
		if (!this.field.validation) {
			this.field.validation = [];
		}
		(this.field.validation as ValidationRule<TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown>[]).push(rule);
		return this;
	}

	withOptions(
		this: FieldConfigBuilder<"select" | "multiselect" | "radio">,
		options: SelectOption[],
	): FieldConfigBuilder<"select" | "multiselect" | "radio"> {
		(this.field as Record<string, unknown>).options = options;
		return this;
	}

	withMinMax(
		this: FieldConfigBuilder<"number" | "slider">,
		{ min, max }: { min?: number; max?: number },
	): FieldConfigBuilder<"number" | "slider"> {
		(this.field as Record<string, unknown>).min = min;
		(this.field as Record<string, unknown>).max = max;
		return this;
	}

	withClassName(className: string) {
		this.field.className = className;
		return this;
	}

	withStyle(style: React.CSSProperties) {
		this.field.style = style;
		return this;
	}

	withCustomProps(customProps: Record<string, unknown>) {
		this.field.customProps = { ...this.field.customProps, ...customProps };
		return this;
	}

	withGrid(grid: FieldConfig["grid"]) {
		this.field.grid = grid;
		return this;
	}

	withPrefix(
		this: FieldConfigBuilder<"text" | "email" | "password">,
		prefix: ReactNode,
	): FieldConfigBuilder<"text" | "email" | "password"> {
		(this.field as Record<string, unknown>).prefix = prefix;
		return this;
	}

	withSubfix(
		this: FieldConfigBuilder<"text" | "email" | "password">,
		subfix: ReactNode,
	): FieldConfigBuilder<"text" | "email" | "password"> {
		(this.field as Record<string, unknown>).subfix = subfix;
		return this;
	}

	clone(
		newId?: string,
		overrides?: Partial<FieldConfig>,
	): FieldConfigBuilder<TField> {
		const cloned = new FieldConfigBuilder(
			this.field.id || "",
			this.field.type as TField,
			this.field.label || "",
		);
		cloned.field = { ...this.field, ...overrides } as typeof cloned.field;
		if (newId) cloned.field.id = newId;
		return cloned;
	}

	dependsOn(
		fieldId: string,
		value: unknown,
		operator: ConditionalLogic["operator"] = "equals",
		action: ConditionalLogic["action"] = "show",
	): this {
		const conditional: ConditionalLogic = {
			field: fieldId,
			operator,
			value,
			action,
		};

		if (!this.field.conditional) {
			this.field.conditional = [];
		}
		this.field.conditional.push(conditional);
		return this;
	}

	dependsOnMultiple(
		conditions: Array<{
			field: string;
			value: unknown;
			operator?: ConditionalLogic["operator"];
			action?: ConditionalLogic["action"];
		}>,
	): this {
		conditions.forEach(
			({ field, value, operator = "equals", action = "show" }) => {
				this.dependsOn(field, value, operator, action);
			},
		);
		return this;
	}

	withCustomComponent<
		TValue = unknown,
		TCustomProps extends Record<string, unknown> = Record<string, never>,
	>(
		this: FieldConfigBuilder<"custom">,
		component: CustomFieldComponent<TValue, TCustomProps>,
		...args: keyof TCustomProps extends never
			? [props?: Record<string, unknown>]
			: [props: TCustomProps]
	): FieldConfigBuilder<"custom"> {
		(this.field as Record<string, unknown>).customComponent =
			component as React.ComponentType<FieldComponentProps<unknown>>;
		const props = args[0];
		if (props) {
			this.field.customProps = { ...this.field.customProps, ...props };
		}
		return this;
	}

	withRegisteredComponent(
		componentName: string,
		componentProps?: Record<string, unknown>,
	): this {
		this.field.customProps = {
			...this.field.customProps,
			...componentProps,
			registeredComponent: componentName,
		};
		return this;
	}

	withDateRangeDefaults(
		this: FieldConfigBuilder<"date-range">,
		options?: {
			separatorLabel?: string;
			allowSameDay?: boolean;
			enforceOrder?: boolean;
			minDate?: Date | string;
			maxDate?: Date | string;
		},
	): FieldConfigBuilder<"date-range"> {
		this.field = {
			...this.field,
			customProps: {
				...this.field.customProps,
				separatorLabel: options?.separatorLabel ?? "to",
			},
			...(options?.minDate ? { minDate: options.minDate } : {}),
			...(options?.maxDate ? { maxDate: options.maxDate } : {}),
			...(options?.allowSameDay !== undefined
				? { allowSameDay: options.allowSameDay }
				: {}),
			...(options?.enforceOrder !== undefined
				? { enforceOrder: options.enforceOrder }
				: {}),
		} as typeof this.field;
		return this;
	}

	build(): FieldConfigMap[TField] & { readonly id: TId } {
		return this.field as FieldConfigMap[TField] & { readonly id: TId };
	}

	/**
	 * Group helpers (effective only when type === "group")
	 */
	withChildren(
		this: FieldConfigBuilder<"group">,
		children: FieldConfig[],
	): FieldConfigBuilder<"group"> {
		(
			this.field as unknown as Partial<{
				children?: FieldConfig[];
			}>
		).children = children;
		return this;
	}

	addChild(
		this: FieldConfigBuilder<"group">,
		child: FieldConfig,
	): FieldConfigBuilder<"group"> {
		const holder = this.field as unknown as Partial<{
			children?: FieldConfig[];
		}>;
		holder.children = holder.children ? [...holder.children, child] : [child];
		return this;
	}

	withGroupLayout(
		this: FieldConfigBuilder<"group">,
		layout: {
			columns?: 1 | 2 | 3 | 4 | 6 | 12;
			spacing?: "xs" | "sm" | "md" | "lg" | "xl";
			className?: string;
		},
	): FieldConfigBuilder<"group"> {
		(
			this.field as unknown as Partial<{
				layout: {
					columns?: 1 | 2 | 3 | 4 | 6 | 12;
					spacing?: "xs" | "sm" | "md" | "lg" | "xl";
					className?: string;
				};
			}>
		).layout = layout;
		return this;
	}

	withGroupComponent(
		this: FieldConfigBuilder<"group">,
		component: React.ComponentType<GroupComponentProps>,
	): FieldConfigBuilder<"group"> {
		(
			this.field as unknown as Partial<{
				customComponent: React.ComponentType<GroupComponentProps>;
			}>
		).customComponent = component;
		return this;
	}

	withRegisterFields(
		this: FieldConfigBuilder<"group">,
		fieldIds: string[],
	): FieldConfigBuilder<"group"> {
		(
			this.field as unknown as Partial<{ registerFields: string[] }>
		).registerFields = fieldIds;
		return this;
	}
}

/**
 * Form section builder
 */
export type TypedFormSection<TFields extends readonly FieldConfig[] = readonly FieldConfig[]> =
	FormSection & { readonly values: FormSchema<TFields> };

export class FormSectionBuilder<TFields extends readonly FieldConfig[] = readonly FieldConfig[]> {
	private section: Partial<FormSection> = {};

	constructor(id: string) {
		this.section = {};
		this.section.id = id;
		this.section.fields = [];
	}

	withTitle(title: string): FormSectionBuilder<TFields> {
		this.section.title = title;
		return this;
	}

	withDescription(description: string): FormSectionBuilder<TFields> {
		this.section.description = description;
		return this;
	}

	asCollapsible(collapsible = true, defaultCollapsed = false): FormSectionBuilder<TFields> {
		this.section.collapsible = collapsible;
		this.section.defaultCollapsed = defaultCollapsed;
		return this;
	}

	withFields<F extends readonly FieldConfig[]>(fields: F): FormSectionBuilder<F> {
		this.section.fields = fields as unknown as FieldConfig[];
		return this as unknown as FormSectionBuilder<F>;
	}

	addField<F extends FieldConfig>(field: F): FormSectionBuilder<readonly [...TFields, F]> {
		if (!this.section.fields) {
			this.section.fields = [];
		}
		this.section.fields.push(field);
		return this as unknown as FormSectionBuilder<readonly [...TFields, F]>;
	}

	addFields<F extends readonly FieldConfig[]>(fields: F): FormSectionBuilder<readonly [...TFields, ...F]> {
		if (!this.section.fields) {
			this.section.fields = [];
		}
		this.section.fields.push(...fields);
		return this as unknown as FormSectionBuilder<readonly [...TFields, ...F]>;
	}

	withClassName(className: string): FormSectionBuilder<TFields> {
		this.section.className = className;
		return this;
	}

	withConditional(conditional: ConditionalLogic[]): FormSectionBuilder<TFields> {
		this.section.conditional = conditional;
		return this;
	}

	withCustomComponent(component: React.ComponentType<FormSectionProps>): FormSectionBuilder<TFields> {
		this.section.customComponent = component;
		return this;
	}

	withCustomProps(customProps: Record<string, unknown>): FormSectionBuilder<TFields> {
		this.section.customProps = customProps;
		return this;
	}

	withStyle(style: React.CSSProperties): FormSectionBuilder<TFields> {
		this.section.style = style;
		return this;
	}

	clone(newId?: string): FormSectionBuilder<TFields> {
		const cloned = new FormSectionBuilder(this.section.id || "");
		cloned.section = {
			...this.section,
			fields: [...(this.section.fields || [])],
		};
		if (newId) cloned.section.id = newId;
		return cloned as unknown as FormSectionBuilder<TFields>;
	}

	build(): TypedFormSection<TFields> {
		return this.section as TypedFormSection<TFields>;
	}
}

/**
 * Main form configuration builder
 */
export class FormConfigBuilder {
	private config: Partial<FormConfig> = {};

	constructor(id: string) {
		this.config = {};
		this.config.id = id;
		this.config.sections = [];
	}

	withTitle(title: string) {
		this.config.title = title;
		return this;
	}

	withDescription(description: string) {
		this.config.description = description;
		return this;
	}

	withSections(sections: FormSection[]) {
		this.config.sections = sections;
		return this;
	}

	addSection(section: FormSection) {
		if (!this.config.sections) {
			this.config.sections = [];
		}
		this.config.sections.push(section);
		return this;
	}

	withLayout(layout: FormConfig["layout"]) {
		this.config.layout = { ...DEFAULT_LAYOUT_CONFIG, ...layout };
		return this;
	}

	withSubmission(submission: FormConfig["submission"]) {
		this.config.submission = { ...DEFAULT_SUBMISSION_CONFIG, ...submission };
		return this;
	}

	withoutSubmission() {
		this.config.submission = { ...DEFAULT_SUBMISSION_CONFIG, enabled: false };
		return this;
	}

	withCustomSubmitButton(
		submitButton: React.ComponentType<SubmissionButtonProps>,
		resetButton?: React.ComponentType<SubmissionButtonProps>,
	) {
		this.config.submission = {
			...DEFAULT_SUBMISSION_CONFIG,
			...this.config.submission,
			customSubmitButton: submitButton,
			customResetButton: resetButton,
		};
		return this;
	}

	withPlugins(plugins: string[]) {
		this.config.plugins = plugins;
		return this;
	}

	withCustomValidators(
		validators: Record<string, (value: unknown) => boolean | string>,
	) {
		this.config.customValidators = validators;
		return this;
	}

	withI18n(i18n: FormConfig["i18n"]) {
		this.config.i18n = { ...DEFAULT_I18N_CONFIG, ...i18n };
		return this;
	}

	build(): FormConfig {
		return this.config as FormConfig;
	}

	buildSerializable(): Omit<FormConfig, "submission"> & {
		submission?: Omit<FormConfig["submission"], "onSubmit" | "onReset">;
	} {
		const { submission, ...serializable } = this.config;
		return {
			...serializable,
			submission: submission
				? {
						submitText: submission.submitText,
						resetText: submission.resetText,
						validation: submission.validation,
					}
				: undefined,
		} as Omit<FormConfig, "submission"> & {
			submission?: Omit<FormConfig["submission"], "onSubmit" | "onReset">;
		};
	}

	clone(newId?: string, overrides?: Partial<FormConfig>): FormConfigBuilder {
		const cloned = new FormConfigBuilder(this.config.id || "");
		cloned.config = {
			...this.config,
			...overrides,
			sections: this.config.sections?.map((section) => ({
				...section,
				fields: section.fields.map((field) => ({ ...field })),
			})),
		};
		if (newId) cloned.config.id = newId;
		return cloned;
	}

	withTheme(theme: ThemeConfig): this {
		if (!this.config.customProps) {
			this.config.customProps = {};
		}
		this.config.customProps.theme = theme;
		return this;
	}

	withStyling(styling: {
		formClassName?: string;
		formStyle?: React.CSSProperties;
		sectionClassName?: string;
		sectionStyle?: React.CSSProperties;
		fieldClassName?: string;
		fieldStyle?: React.CSSProperties;
		labelClassName?: string;
		inputClassName?: string;
		errorClassName?: string;
		descriptionClassName?: string;
	}): this {
		if (!this.config.customProps) {
			this.config.customProps = {};
		}
		this.config.customProps.styling = styling;
		return this;
	}
}

interface FieldBuilderBase<TField extends FieldType, TId extends string = string> {
	withDescription(description: string): FieldBuilderOf<TField, TId>;
	withPlaceholder(placeholder: string): FieldBuilderOf<TField, TId>;
	withValue(value: TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown): FieldBuilderOf<TField, TId>;
	withDefaultValue(defaultValue: TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown): FieldBuilderOf<TField, TId>;
	asRequired(required?: boolean, message?: string): FieldBuilderOf<TField, TId>;
	asDisabled(disabled?: boolean): FieldBuilderOf<TField, TId>;
	asReadonly(readonly?: boolean): FieldBuilderOf<TField, TId>;
	withValidation(validation: ValidationRule<TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown>[]): FieldBuilderOf<TField, TId>;
	addValidation(rule: ValidationRule<TField extends keyof FieldValueMap ? FieldValueMap[TField] : unknown>): FieldBuilderOf<TField, TId>;
	withClassName(className: string): FieldBuilderOf<TField, TId>;
	withStyle(style: React.CSSProperties): FieldBuilderOf<TField, TId>;
	withCustomProps(customProps: Record<string, unknown>): FieldBuilderOf<TField, TId>;
	withGrid(grid: FieldConfig["grid"]): FieldBuilderOf<TField, TId>;
	dependsOn(
		fieldId: string,
		value: unknown,
		operator?: ConditionalLogic["operator"],
		action?: ConditionalLogic["action"],
	): FieldBuilderOf<TField, TId>;
	dependsOnMultiple(
		conditions: Array<{
			field: string;
			value: unknown;
			operator?: ConditionalLogic["operator"];
			action?: ConditionalLogic["action"];
		}>,
	): FieldBuilderOf<TField, TId>;
	withRegisteredComponent(
		componentName: string,
		componentProps?: Record<string, unknown>,
	): FieldBuilderOf<TField, TId>;
	clone(newId?: string, overrides?: Partial<FieldConfig>): FieldBuilderOf<TField, TId>;
	build(): (TField extends keyof FieldConfigMap ? FieldConfigMap[TField] : FieldConfig) & { readonly id: TId };
}

export type FieldBuilderOf<TField extends FieldType, TId extends string = string> =
	FieldBuilderBase<TField, TId> &
	(TField extends "select" | "multiselect" | "radio"
		? { withOptions(options: SelectOption[]): FieldBuilderOf<TField, TId> }
		: unknown) &
	(TField extends "number" | "slider"
		? { withMinMax(config: { min?: number; max?: number }): FieldBuilderOf<TField, TId> }
		: unknown) &
	(TField extends "text" | "email" | "password"
		? {
				withPrefix(prefix: ReactNode): FieldBuilderOf<TField, TId>;
				withSubfix(subfix: ReactNode): FieldBuilderOf<TField, TId>;
			}
		: unknown) &
	(TField extends "custom"
		? {
				withCustomComponent<
					TValue = unknown,
					TCustomProps extends Record<string, unknown> = Record<string, never>,
				>(
					component: CustomFieldComponent<TValue, TCustomProps>,
					...args: keyof TCustomProps extends never
						? [props?: Record<string, unknown>]
						: [props: TCustomProps]
				): FieldBuilderOf<TField, TId>;
			}
		: unknown) &
	(TField extends "group"
		? {
				withChildren(children: FieldConfig[]): FieldBuilderOf<TField, TId>;
				addChild(child: FieldConfig): FieldBuilderOf<TField, TId>;
				withGroupLayout(layout: {
					columns?: 1 | 2 | 3 | 4 | 6 | 12;
					spacing?: "xs" | "sm" | "md" | "lg" | "xl";
					className?: string;
				}): FieldBuilderOf<TField, TId>;
				withGroupComponent(
					component: React.ComponentType<GroupComponentProps>,
				): FieldBuilderOf<TField, TId>;
				withRegisterFields(fieldIds: string[]): FieldBuilderOf<TField, TId>;
			}
		: unknown) &
	(TField extends "date-range"
		? {
				withDateRangeDefaults(options?: {
					separatorLabel?: string;
					allowSameDay?: boolean;
					enforceOrder?: boolean;
					minDate?: Date | string;
					maxDate?: Date | string;
				}): FieldBuilderOf<TField, TId>;
			}
		: unknown);

/**
 * Convenience functions for creating configurations
 */
export function createField<TId extends string, TField extends FieldType>(
	id: TId,
	type: TField,
	label: string,
): FieldBuilderOf<TField, TId> {
	return new FieldConfigBuilder(id, type as Exclude<TField, "quote"> & BuilderFieldType, label) as unknown as FieldBuilderOf<TField, TId>;
}

export function createFieldGroup<TId extends string>(
	id: TId,
	label: string,
): FieldBuilderOf<"group", TId> {
	return new FieldConfigBuilder(id, "group", label) as unknown as FieldBuilderOf<"group", TId>;
}

export function createSection(id: string): FormSectionBuilder<readonly []> {
	return new FormSectionBuilder(id);
}

export function createCustomSection(
	id: string,
	customConfig?: {
		customComponent?: React.ComponentType<FormSectionProps>;
		customProps?: Record<string, unknown>;
		className?: string;
		style?: React.CSSProperties;
	},
): FormSectionBuilder {
	const builder = new FormSectionBuilder(id);
	if (customConfig?.className) builder.withClassName(customConfig.className);
	if (customConfig?.customComponent)
		builder.withCustomComponent(customConfig.customComponent);
	if (customConfig?.customProps)
		builder.withCustomProps(customConfig.customProps);
	if (customConfig?.style) builder.withStyle(customConfig.style);
	return builder;
}

export function createForm(id: string): FormConfigBuilder {
	return new FormConfigBuilder(id);
}

export const ValidationHelpers = {
	required: (message = "This field is required"): ValidationRule => ({
		type: "required",
		message,
	}),

	email: (message = "Please enter a valid email address"): ValidationRule => ({
		type: "email",
		message,
	}),

	minLength: (length: number, message?: string): ValidationRule => ({
		type: "min",
		value: length,
		message: message || `Must be at least ${length} characters`,
	}),

	maxLength: (length: number, message?: string): ValidationRule => ({
		type: "max",
		value: length,
		message: message || `Must be no more than ${length} characters`,
	}),

	pattern: (regex: string, message = "Invalid format"): ValidationRule => ({
		type: "pattern",
		value: regex,
		message,
		compiledRegex: getCompiledRegex(regex),
	}),

	url: (message = "Please enter a valid URL"): ValidationRule => ({
		type: "url",
		message,
	}),

	custom: <T>(
		validator: (value: T, allValues: FormDataType) => boolean | string,
		message = "Invalid value",
	): ValidationRule<T> => ({
		type: "custom",
		customValidator: validator,
		message,
	}),

	phone: (message = "Please enter a valid phone number"): ValidationRule => ({
		type: "pattern",
		value: "^[\\+]?[1-9][\\d]{0,15}$",
		message,
	}),

	password: (
		message = "Password must be at least 8 characters with uppercase, lowercase, and number",
	): ValidationRule => ({
		type: "pattern",
		value: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$",
		message,
	}),

	zipCode: (message = "Please enter a valid ZIP code"): ValidationRule => ({
		type: "pattern",
		value: "^\\d{5}(-\\d{4})?$",
		message,
		compiledRegex: getCompiledRegex("^\\d{5}(-\\d{4})?$"),
	}),

	creditCard: (
		message = "Please enter a valid credit card number",
	): ValidationRule => ({
		type: "pattern",
		value: "^\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}$",
		message,
		compiledRegex: getCompiledRegex(
			"^\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}$",
		),
	}),
};

/**
 * Conditional logic helpers
 */
export const ConditionalHelpers = {
	when: (
		field: string,
		operator: ConditionalLogic["operator"],
		value: unknown,
		action: ConditionalLogic["action"] = "show",
	): ConditionalLogic => ({
		field,
		operator,
		value,
		action,
	}),

	equals: (
		field: string,
		value: unknown,
		action: ConditionalLogic["action"] = "show",
	): ConditionalLogic => ({
		field,
		operator: "equals",
		value,
		action,
	}),
};

/**
 * Option helpers for select/radio fields
 */
export const OptionHelpers = {
	create: (
		label: string,
		value: string | number,
		disabled = false,
	): SelectOption => ({
		label,
		value,
		disabled,
	}),

	createGroup: (
		options: Array<{
			label: string;
			value: string | number;
			disabled?: boolean;
		}>,
		group: string,
	): SelectOption[] => options.map((opt) => ({ ...opt, group })),

	fromArray: (items: string[]): SelectOption[] =>
		items.map((item) => ({ label: item, value: item })),

	fromObject: (obj: Record<string, string>): SelectOption[] =>
		Object.entries(obj).map(([value, label]) => ({ label, value })),

	countries: (): SelectOption[] => [
		{ label: "United States", value: "US" },
		{ label: "Canada", value: "CA" },
		{ label: "United Kingdom", value: "GB" },
		{ label: "Germany", value: "DE" },
		{ label: "France", value: "FR" },
		{ label: "Japan", value: "JP" },
		{ label: "Australia", value: "AU" },
	],

	states: (): SelectOption[] => [
		{ label: "California", value: "CA" },
		{ label: "New York", value: "NY" },
		{ label: "Texas", value: "TX" },
		{ label: "Florida", value: "FL" },
		{ label: "Illinois", value: "IL" },
	],

	yesNo: (): SelectOption[] => [
		{ label: "Yes", value: "yes" },
		{ label: "No", value: "no" },
	],

	priority: (): SelectOption[] => [
		{ label: "Low", value: "low" },
		{ label: "Medium", value: "medium" },
		{ label: "High", value: "high" },
		{ label: "Critical", value: "critical" },
	],
};

export function defineCustomField<
	TValue = unknown,
	TCustomProps extends Record<string, unknown> = Record<string, never>,
>(
	component: (
		props: CustomFieldComponentProps<TValue, TCustomProps>,
	) => React.ReactNode,
): CustomFieldComponent<TValue, TCustomProps> {
	return component as CustomFieldComponent<TValue, TCustomProps>;
}

export function saveFormConfigToJSON(config: FormConfig): string {
	const { submission, ...rest } = config;
	const serializable = {
		...rest,
		submission: submission
			? {
					submitText: submission.submitText,
					resetText: submission.resetText,
					validation: submission.validation,
					enabled: submission.enabled,
				}
			: undefined,
	};
	return JSON.stringify(serializable, null, 2);
}

export function loadFormConfigFromJSON(
	json: string | object,
): Partial<FormConfig> {
	if (typeof json === "string") {
		return JSON.parse(json);
	}
	return json as Partial<FormConfig>;
}
