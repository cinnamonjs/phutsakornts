import { memo, useMemo } from "react";
import type { Control, FieldValues } from "react-hook-form";
import { useComponentAdapter } from "@/components/module/form-builder/component-adapter";
import { FieldRenderer } from "@/components/module/form-builder/field-renderer";
import { SPACING_CLASSES } from "@/components/module/form-builder/form-builder";
import type {
	FieldComponentProps,
	FormSection as FormSectionType,
	ThemeConfig,
} from "@/components/module/form-builder/types";
import { shouldShowField } from "@/components/module/form-builder/utils";

type FormSectionProps = {
	section: FormSectionType;
	control: Control<FieldValues>;
	formValues: Record<string, unknown>;
	plugins?: Record<string, React.ComponentType<FieldComponentProps>>;
	layout?: {
		columns?: number;
		spacing?: "xs" | "sm" | "md" | "lg" | "xl";
	};
	theme?: ThemeConfig;
};

const FormSectionComponent = ({
	section,
	control,
	formValues,
	plugins,
	layout,
}: FormSectionProps) => {
	const adapter = useComponentAdapter();

	const isVisible = useMemo(() => {
		return (
			!section.conditional ||
			section.conditional.every((logic) => {
				const fieldValue = formValues[logic.field];
				const result = fieldValue === logic.value;
				return logic.action === "show" ? result : !result;
			})
		);
	}, [section.conditional, formValues]);

	const visibleFields = useMemo(
		() => section.fields.filter((field) => shouldShowField(field, formValues)),
		[section.fields, formValues],
	);

	if (!isVisible) return null;

	const gridCols = layout?.columns || 1;
	const gridClasses =
		gridCols > 1
			? `grid grid-cols-${gridCols} gap-4`
			: SPACING_CLASSES[layout?.spacing || "md"];

	const renderContent = () => (
		<div className={adapter.cn(gridClasses, section.className)}>
			{visibleFields.map((field) => (
				<FieldRenderer
					key={field.id}
					field={field}
					control={control}
					formValues={formValues}
					plugins={plugins}
				/>
			))}
		</div>
	);

	const { SectionWrapper } = adapter;

	if (section.customComponent) {
		const Custom = section.customComponent as React.ComponentType<{ children?: React.ReactNode }>
		return <Custom>{renderContent()}</Custom>
	}

	if (section.collapsible) {
		return (
			<SectionWrapper
				title={section.title}
				description={section.description}
				collapsible
				defaultCollapsed={section.defaultCollapsed}
				className={section.className}
			>
				{renderContent()}
			</SectionWrapper>
		);
	}

	if (section.title || section.description) {
		return (
			<SectionWrapper
				title={section.title}
				description={section.description}
				className={section.className}
			>
				{renderContent()}
			</SectionWrapper>
		);
	}

	return <div className={section.className}>{renderContent()}</div>;
};

export const FormSection = memo(FormSectionComponent);
