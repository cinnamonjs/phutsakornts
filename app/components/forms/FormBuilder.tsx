import { Form } from "react-router";
import type { FieldConfig, FormConfig } from "./types/fieldsConfig";
import { useState } from "react";
import { fieldComponents } from "./fields";

export function FormBuilder({
    config,
    errors = {},
}: {
    config: FormConfig;
    errors?: Record<string, string[]>;
}) {
    const [formValues, setFormValues] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? ((e.target as any).checked ? "on" : "") : value,
        }));
    };

    const shouldShow = (field: FieldConfig) => {
        if (!field.showWhen) return true;
        return formValues[field.showWhen.field] === field.showWhen.equals;
    };

    return (
        <Form method="post" className="space-y-4">
            {config.map((field) => {
                if (!shouldShow(field)) return null;
                const Component = fieldComponents[field.type];
                return (
                    <Component
                        key={field.name}
                        {...field}
                        value={formValues[field.name] ?? ""}
                        error={errors[field.name]?.[0]}
                        onChange={handleChange}
                    />
                );
            })}
            <button type="submit" className="btn btn-primary">
                Submit
            </button>
        </Form>
    );
}
