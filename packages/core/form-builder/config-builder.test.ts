import type { ComponentAdapter, FieldInputProps } from "@/components/module/form-builder/component-adapter";
import { defaultAdapter } from "@/components/module/form-builder/component-adapter";
import type { TypedFormSection } from "@/components/module/form-builder/config-builder";
import {
  ConditionalHelpers,
  createCustomSection,
  createField,
  createFieldGroup,
  createForm,
  createSection,
  DEFAULT_I18N_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  DEFAULT_SUBMISSION_CONFIG,
  defineCustomField,
  FieldConfigBuilder,
  FormConfigBuilder,
  FormSectionBuilder,
  loadFormConfigFromJSON,
  OptionHelpers,
  saveFormConfigToJSON,
  ValidationHelpers,
} from "@/components/module/form-builder/config-builder";
import { FormPresets } from "@/components/module/form-builder/presets";
import type {
  CheckboxFieldConfig,
  CustomFieldConfig,
  DateFieldConfig,
  DateRangeFieldConfig,
  FieldType,
  FileFieldConfig,
  FormBuilderProps,
  FormSection,
  NumberFieldConfig,
  RadioFieldConfig,
  SelectFieldConfig,
  SliderFieldConfig,
  SwitchFieldConfig,
  TextareaFieldConfig,
  TextFieldConfig,
} from "./types";

// ─── FieldConfigBuilder ─────────────────────────────────────────────────────

describe("FieldConfigBuilder", () => {
  it("sets id, type, label via constructor", () => {
    const field = new FieldConfigBuilder("name", "text", "Name").build();
    expect(field).toMatchObject({ id: "name", type: "text", label: "Name" });
  });

  it("uses plain object (not null-prototype)", () => {
    const field = new FieldConfigBuilder("x", "text", "X").build();
    expect(Object.getPrototypeOf(field)).toBe(Object.prototype);
  });

  it("withDescription", () => {
    const field = createField("x", "text", "X").withDescription("desc").build();
    expect(field.description).toBe("desc");
  });

  it("withPlaceholder", () => {
    const field = createField("x", "text", "X").withPlaceholder("ph").build();
    expect(field.placeholder).toBe("ph");
  });

  it("withValue", () => {
    const field = createField("x", "text", "X").withValue("hello").build();
    expect(field.value).toBe("hello");
  });

  it("withDefaultValue", () => {
    const field = createField("x", "text", "X").withDefaultValue("def").build();
    expect(field.defaultValue).toBe("def");
  });

  it("asRequired defaults to true and adds validation rule", () => {
    const field = createField("x", "text", "X").asRequired().build();
    expect(field.required).toBe(true);
    expect(field.validation).toEqual([
      { type: "required", message: "This field is required" },
    ]);
  });

  it("asRequired with custom message", () => {
    const field = createField("x", "text", "X").asRequired(true, "needed").build();
    expect(field.validation).toEqual([{ type: "required", message: "needed" }]);
  });

  it("asRequired(false) does not add validation", () => {
    const field = createField("x", "text", "X").asRequired(false).build();
    expect(field.required).toBe(false);
    expect(field.validation).toBeUndefined();
  });

  it("asRequired does not duplicate if required rule already exists", () => {
    const field = createField("x", "text", "X")
      .withValidation([ValidationHelpers.required("custom")])
      .asRequired()
      .build();
    const requiredRules = field.validation!.filter((v) => v.type === "required");
    expect(requiredRules).toHaveLength(1);
    expect(requiredRules[0].message).toBe("custom");
  });

  it("asDisabled defaults to true", () => {
    const field = createField("x", "text", "X").asDisabled().build();
    expect(field.disabled).toBe(true);
  });

  it("asDisabled(false)", () => {
    const field = createField("x", "text", "X").asDisabled(false).build();
    expect(field.disabled).toBe(false);
  });

  it("asReadonly defaults to true", () => {
    const field = createField("x", "text", "X").asReadonly().build();
    expect(field.readonly).toBe(true);
  });

  it("asReadonly(false)", () => {
    const field = createField("x", "text", "X").asReadonly(false).build();
    expect(field.readonly).toBe(false);
  });

  it("withValidation replaces", () => {
    const rules = [ValidationHelpers.required()];
    const field = createField("x", "text", "X").withValidation(rules).build();
    expect(field.validation).toBe(rules);
  });

  it("addValidation appends", () => {
    const field = createField("x", "text", "X")
      .addValidation(ValidationHelpers.required())
      .addValidation(ValidationHelpers.email())
      .build();
    expect(field.validation).toHaveLength(2);
    expect(field.validation![0].type).toBe("required");
    expect(field.validation![1].type).toBe("email");
  });

  it("addValidation initializes array if missing", () => {
    const field = createField("x", "text", "X")
      .addValidation(ValidationHelpers.email())
      .build();
    expect(field.validation).toHaveLength(1);
  });

  it("withClassName", () => {
    const field = createField("x", "text", "X").withClassName("cls").build();
    expect(field.className).toBe("cls");
  });

  it("withStyle", () => {
    const style = { color: "red" };
    const field = createField("x", "text", "X").withStyle(style).build();
    expect(field.style).toBe(style);
  });

  it("withCustomProps merges into existing", () => {
    const field = createField("x", "text", "X")
      .withCustomProps({ a: 1 })
      .withCustomProps({ b: 2 })
      .build();
    expect(field.customProps).toEqual({ a: 1, b: 2 });
  });

  it("withGrid", () => {
    const field = createField("x", "text", "X").withGrid({ colSpan: 6 }).build();
    expect(field.grid).toEqual({ colSpan: 6 });
  });

  it("dependsOn adds a conditional entry", () => {
    const field = createField("x", "text", "X")
      .dependsOn("other", "yes")
      .build();
    expect(field.conditional).toEqual([
      { field: "other", operator: "equals", value: "yes", action: "show" },
    ]);
  });

  it("dependsOn with custom operator and action", () => {
    const field = createField("x", "text", "X")
      .dependsOn("other", 5, "greaterThan", "hide")
      .build();
    expect(field.conditional).toEqual([
      { field: "other", operator: "greaterThan", value: 5, action: "hide" },
    ]);
  });

  it("dependsOn accumulates multiple conditionals", () => {
    const field = createField("x", "text", "X")
      .dependsOn("a", 1)
      .dependsOn("b", 2)
      .build();
    expect(field.conditional).toHaveLength(2);
  });

  it("dependsOnMultiple", () => {
    const field = createField("x", "text", "X")
      .dependsOnMultiple([
        { field: "a", value: 1 },
        { field: "b", value: 2, operator: "notEquals", action: "hide" },
      ])
      .build();
    expect(field.conditional).toHaveLength(2);
    expect(field.conditional![0]).toMatchObject({ field: "a", operator: "equals", action: "show" });
    expect(field.conditional![1]).toMatchObject({ field: "b", operator: "notEquals", action: "hide" });
  });

  it("withRegisteredComponent preserves existing customProps", () => {
    const field = createField("x", "custom", "X")
      .withCustomProps({ existing: true })
      .withRegisteredComponent("MyComp", { extra: true })
      .build();
    expect(field.customProps).toEqual({
      existing: true,
      extra: true,
      registeredComponent: "MyComp",
    });
  });

  it("withRegisteredComponent initializes customProps if missing", () => {
    const field = createField("x", "text", "X")
      .withRegisteredComponent("Comp")
      .build();
    expect(field.customProps?.registeredComponent).toBe("Comp");
  });

  it("clone produces independent copy", () => {
    const original = createField("x", "text", "X").withPlaceholder("ph");
    const cloned = original.clone("y");
    const clonedField = cloned.build();
    const originalField = original.build();
    expect(clonedField.id).toBe("y");
    expect(clonedField.placeholder).toBe("ph");
    expect(originalField.id).toBe("x");
  });

  it("clone without newId keeps original id", () => {
    const cloned = createField("x", "text", "X").clone().build();
    expect(cloned.id).toBe("x");
  });

  it("clone with overrides", () => {
    const original = createField("x", "text", "X").withPlaceholder("ph");
    const cloned = original.clone("y", { description: "override" });
    const clonedField = cloned.build();
    expect(clonedField.id).toBe("y");
    expect(clonedField.description).toBe("override");
    expect(clonedField.placeholder).toBe("ph");
  });

  it("build returns the field config", () => {
    const field = createField("x", "text", "X").build();
    expect(field.id).toBe("x");
    expect(field.type).toBe("text");
    expect(field.label).toBe("X");
  });

  it("chaining returns same builder instance for generic methods", () => {
    const builder = createField("x", "text", "X");
    const returned = builder.withDescription("d").withPlaceholder("p").asRequired();
    expect(returned).toBe(builder);
  });
});

// ─── withOptions (select | multiselect | radio) ─────────────────────────────

describe("FieldConfigBuilder.withOptions", () => {
  const opts = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
  ];

  it("sets options on select field", () => {
    const field = createField("x", "select", "X").withOptions(opts).build();
    expect((field as Record<string, unknown>).options).toEqual(opts);
  });

  it("sets options on multiselect field", () => {
    const field = createField("x", "multiselect", "X").withOptions(opts).build();
    expect((field as Record<string, unknown>).options).toEqual(opts);
  });

  it("sets options on radio field", () => {
    const field = createField("x", "radio", "X").withOptions(opts).build();
    expect((field as Record<string, unknown>).options).toEqual(opts);
  });
});

// ─── withMinMax (number | slider) ───────────────────────────────────────────

describe("FieldConfigBuilder.withMinMax", () => {
  it("sets min and max on number field", () => {
    const field = createField("x", "number", "X")
      .withMinMax({ min: 0, max: 100 })
      .build();
    expect((field as Record<string, unknown>).min).toBe(0);
    expect((field as Record<string, unknown>).max).toBe(100);
  });

  it("sets min and max on slider field", () => {
    const field = createField("x", "slider", "X")
      .withMinMax({ min: 1, max: 10 })
      .build();
    expect((field as Record<string, unknown>).min).toBe(1);
    expect((field as Record<string, unknown>).max).toBe(10);
  });

  it("handles partial min/max", () => {
    const field = createField("x", "number", "X")
      .withMinMax({ min: 5 })
      .build();
    expect((field as Record<string, unknown>).min).toBe(5);
    expect((field as Record<string, unknown>).max).toBeUndefined();
  });
});

// ─── withPrefix / withSubfix (text | email | password) ──────────────────────

describe("FieldConfigBuilder.withPrefix / withSubfix", () => {
  it("sets prefix on text field", () => {
    const field = createField("x", "text", "X").withPrefix("$").build();
    expect((field as Record<string, unknown>).prefix).toBe("$");
  });

  it("sets prefix on email field", () => {
    const field = createField("x", "email", "X").withPrefix("@").build();
    expect((field as Record<string, unknown>).prefix).toBe("@");
  });

  it("sets prefix on password field", () => {
    const field = createField("x", "password", "X").withPrefix("lock").build();
    expect((field as Record<string, unknown>).prefix).toBe("lock");
  });

  it("sets subfix on text field", () => {
    const field = createField("x", "text", "X").withSubfix("kg").build();
    expect((field as Record<string, unknown>).subfix).toBe("kg");
  });
});

// ─── withCustomComponent (custom) ───────────────────────────────────────────

describe("FieldConfigBuilder.withCustomComponent", () => {
  const MockComponent = () => null;

  it("sets custom component on custom field", () => {
    const field = createField("x", "custom", "X")
      .withCustomComponent(MockComponent)
      .build();
    expect((field as Record<string, unknown>).customComponent).toBe(MockComponent);
  });

  it("sets custom component with props", () => {
    const field = createField("x", "custom", "X")
      .withCustomComponent(MockComponent, { extra: true })
      .build();
    expect((field as Record<string, unknown>).customComponent).toBe(MockComponent);
    expect(field.customProps?.extra).toBe(true);
  });
});

// ─── withDateRangeDefaults (date-range) ─────────────────────────────────────

describe("FieldConfigBuilder.withDateRangeDefaults", () => {
  it("sets default separatorLabel to 'to'", () => {
    const field = createField("x", "date-range", "X")
      .withDateRangeDefaults()
      .build();
    expect(field.customProps?.separatorLabel).toBe("to");
  });

  it("accepts custom options", () => {
    const field = createField("x", "date-range", "X")
      .withDateRangeDefaults({
        separatorLabel: "-",
        allowSameDay: true,
        enforceOrder: false,
        minDate: "2024-01-01",
        maxDate: "2025-12-31",
      })
      .build();
    expect(field.customProps?.separatorLabel).toBe("-");
    expect((field as Record<string, unknown>).allowSameDay).toBe(true);
    expect((field as Record<string, unknown>).enforceOrder).toBe(false);
    expect((field as Record<string, unknown>).minDate).toBe("2024-01-01");
    expect((field as Record<string, unknown>).maxDate).toBe("2025-12-31");
  });
});

// ─── Group helpers ──────────────────────────────────────────────────────────

describe("FieldConfigBuilder group methods", () => {
  const child1 = createField("c1", "text", "C1").build();
  const child2 = createField("c2", "text", "C2").build();

  it("withChildren sets children array", () => {
    const field = createFieldGroup("g", "Group")
      .withChildren([child1, child2])
      .build();
    expect((field as Record<string, unknown>).children).toEqual([child1, child2]);
  });

  it("addChild appends a single child", () => {
    const field = createFieldGroup("g", "Group")
      .addChild(child1)
      .addChild(child2)
      .build();
    expect((field as Record<string, unknown>).children).toEqual([child1, child2]);
  });

  it("withGroupLayout sets layout", () => {
    const field = createFieldGroup("g", "Group")
      .withGroupLayout({ columns: 2, spacing: "lg" })
      .build();
    expect((field as Record<string, unknown>).layout).toEqual({ columns: 2, spacing: "lg" });
  });

  it("withGroupComponent sets component", () => {
    const Comp = () => null;
    const field = createFieldGroup("g", "Group")
      .withGroupComponent(Comp as any)
      .build();
    expect((field as Record<string, unknown>).customComponent).toBe(Comp);
  });

  it("withRegisterFields sets field ids", () => {
    const field = createFieldGroup("g", "Group")
      .withRegisterFields(["f1", "f2"])
      .build();
    expect((field as Record<string, unknown>).registerFields).toEqual(["f1", "f2"]);
  });
});

// ─── FormSectionBuilder ─────────────────────────────────────────────────────

describe("FormSectionBuilder", () => {
  it("sets id and empty fields via constructor", () => {
    const section = new FormSectionBuilder("s1").build();
    expect(section.id).toBe("s1");
    expect(section.fields).toEqual([]);
  });

  it("uses plain object (not null-prototype)", () => {
    const section = new FormSectionBuilder("s1").build();
    expect(Object.getPrototypeOf(section)).toBe(Object.prototype);
  });

  it("withTitle", () => {
    const section = createSection("s").withTitle("Title").build();
    expect(section.title).toBe("Title");
  });

  it("withDescription", () => {
    const section = createSection("s").withDescription("Desc").build();
    expect(section.description).toBe("Desc");
  });

  it("asCollapsible defaults", () => {
    const section = createSection("s").asCollapsible().build();
    expect(section.collapsible).toBe(true);
    expect(section.defaultCollapsed).toBe(false);
  });

  it("asCollapsible with args", () => {
    const section = createSection("s").asCollapsible(true, true).build();
    expect(section.collapsible).toBe(true);
    expect(section.defaultCollapsed).toBe(true);
  });

  it("withFields replaces fields", () => {
    const f = createField("x", "text", "X").build();
    const section = createSection("s").withFields([f]).build();
    expect(section.fields).toEqual([f]);
  });

  it("addField appends a field", () => {
    const f1 = createField("x", "text", "X").build();
    const f2 = createField("y", "text", "Y").build();
    const section = createSection("s").addField(f1).addField(f2).build();
    expect(section.fields).toEqual([f1, f2]);
  });

  it("addFields appends multiple fields", () => {
    const f1 = createField("x", "text", "X").build();
    const f2 = createField("y", "text", "Y").build();
    const section = createSection("s").addFields([f1, f2]).build();
    expect(section.fields).toEqual([f1, f2]);
  });

  it("withClassName", () => {
    const section = createSection("s").withClassName("cls").build();
    expect(section.className).toBe("cls");
  });

  it("withConditional", () => {
    const cond = [ConditionalHelpers.when("x", "equals", "y")];
    const section = createSection("s").withConditional(cond).build();
    expect(section.conditional).toBe(cond);
  });

  it("withCustomComponent", () => {
    const Comp = (() => null) as any;
    const section = createSection("s").withCustomComponent(Comp).build();
    expect(section.customComponent).toBe(Comp);
  });

  it("withCustomProps", () => {
    const section = createSection("s").withCustomProps({ a: 1 }).build();
    expect(section.customProps).toEqual({ a: 1 });
  });

  it("withStyle", () => {
    const style = { padding: "10px" };
    const section = createSection("s").withStyle(style).build();
    expect(section.style).toBe(style);
  });

  it("clone produces independent copy", () => {
    const original = createSection("s").withTitle("T");
    const cloned = original.clone("s2");
    expect(cloned.build().id).toBe("s2");
    expect(cloned.build().title).toBe("T");
    expect(original.build().id).toBe("s");
  });

  it("clone without newId keeps original id", () => {
    expect(createSection("s").clone().build().id).toBe("s");
  });
});

// ─── FormConfigBuilder ──────────────────────────────────────────────────────

describe("FormConfigBuilder", () => {
  it("sets id and empty sections via constructor", () => {
    const config = new FormConfigBuilder("f1").build();
    expect(config.id).toBe("f1");
    expect(config.sections).toEqual([]);
  });

  it("uses plain object (not null-prototype)", () => {
    const config = new FormConfigBuilder("f1").build();
    expect(Object.getPrototypeOf(config)).toBe(Object.prototype);
  });

  it("withTitle", () => {
    const config = createForm("f").withTitle("Title").build();
    expect(config.title).toBe("Title");
  });

  it("withDescription", () => {
    const config = createForm("f").withDescription("Desc").build();
    expect(config.description).toBe("Desc");
  });

  it("withSections replaces sections", () => {
    const s = createSection("s").build();
    const config = createForm("f").withSections([s]).build();
    expect(config.sections).toEqual([s]);
  });

  it("addSection appends a section", () => {
    const s1 = createSection("s1").build();
    const s2 = createSection("s2").build();
    const config = createForm("f").addSection(s1).addSection(s2).build();
    expect(config.sections).toEqual([s1, s2]);
  });

  it("withLayout merges with defaults", () => {
    const config = createForm("f").withLayout({ columns: 3 }).build();
    expect(config.layout).toEqual({ ...DEFAULT_LAYOUT_CONFIG, columns: 3 });
  });

  it("withSubmission merges with defaults", () => {
    const config = createForm("f").withSubmission({ submitText: "Go" }).build();
    expect(config.submission).toEqual({ ...DEFAULT_SUBMISSION_CONFIG, submitText: "Go" });
  });

  it("withoutSubmission sets enabled false", () => {
    const config = createForm("f").withoutSubmission().build();
    expect(config.submission?.enabled).toBe(false);
  });

  it("withCustomSubmitButton", () => {
    const Btn = (() => null) as any;
    const Reset = (() => null) as any;
    const config = createForm("f").withCustomSubmitButton(Btn, Reset).build();
    expect(config.submission?.customSubmitButton).toBe(Btn);
    expect(config.submission?.customResetButton).toBe(Reset);
  });

  it("withPlugins", () => {
    const config = createForm("f").withPlugins(["a", "b"]).build();
    expect(config.plugins).toEqual(["a", "b"]);
  });

  it("withCustomValidators", () => {
    const v = { isEven: (val: unknown) => (val as number) % 2 === 0 };
    const config = createForm("f").withCustomValidators(v).build();
    expect(config.customValidators).toBe(v);
  });

  it("withI18n merges with defaults", () => {
    const config = createForm("f").withI18n({ locale: "fr" }).build();
    expect(config.i18n).toEqual({ ...DEFAULT_I18N_CONFIG, locale: "fr" });
  });

  it("buildSerializable strips submission callbacks", () => {
    const config = createForm("f")
      .withSubmission({ submitText: "Go", validation: "onBlur" })
      .buildSerializable();
    expect(config.submission).toEqual({
      submitText: "Go",
      resetText: "",
      validation: "onBlur",
    });
    expect((config.submission as any)?.onSubmit).toBeUndefined();
  });

  it("buildSerializable with no submission", () => {
    const config = createForm("f").buildSerializable();
    expect(config.submission).toBeUndefined();
  });

  it("clone produces independent copy", () => {
    const s = createSection("s").build();
    const original = createForm("f").withTitle("T").addSection(s);
    const cloned = original.clone("f2");
    expect(cloned.build().id).toBe("f2");
    expect(cloned.build().title).toBe("T");
    expect(cloned.build().sections).toHaveLength(1);
    expect(original.build().id).toBe("f");
  });

  it("clone without newId keeps original id", () => {
    expect(createForm("f").clone().build().id).toBe("f");
  });

  it("clone with overrides", () => {
    const s = createSection("s").withFields([createField("x", "text", "X").build()]).build();
    const original = createForm("f").withTitle("T").addSection(s);
    const cloned = original.clone("f2", { title: "New" });
    expect(cloned.build().id).toBe("f2");
    expect(cloned.build().title).toBe("New");
  });

  it("withTheme", () => {
    const theme = { primaryColor: "#000" } as any;
    const config = createForm("f").withTheme(theme).build();
    expect(config.customProps?.theme).toBe(theme);
  });

  it("withTheme initializes customProps", () => {
    const config = createForm("f").withTheme({} as any).build();
    expect(config.customProps).toBeDefined();
  });

  it("withStyling", () => {
    const styling = { formClassName: "my-form" };
    const config = createForm("f").withStyling(styling).build();
    expect(config.customProps?.styling).toBe(styling);
  });

  it("withStyling initializes customProps", () => {
    const config = createForm("f").withStyling({}).build();
    expect(config.customProps).toBeDefined();
  });
});

// ─── Factory functions ──────────────────────────────────────────────────────

describe("createField", () => {
  it("returns FieldConfigBuilder", () => {
    expect(createField("x", "text", "X")).toBeInstanceOf(FieldConfigBuilder);
  });
});

describe("createFieldGroup", () => {
  it("returns FieldConfigBuilder with type group", () => {
    const field = createFieldGroup("g", "Group").build();
    expect(field.type).toBe("group");
  });
});

describe("createSection", () => {
  it("returns FormSectionBuilder", () => {
    expect(createSection("s")).toBeInstanceOf(FormSectionBuilder);
  });
});

describe("createCustomSection", () => {
  it("returns FormSectionBuilder with no config", () => {
    const section = createCustomSection("s").build();
    expect(section.id).toBe("s");
  });

  it("applies all custom config options", () => {
    const Comp = (() => null) as any;
    const section = createCustomSection("s", {
      className: "cls",
      customComponent: Comp,
      customProps: { x: 1 },
      style: { margin: "0" },
    }).build();
    expect(section.className).toBe("cls");
    expect(section.customComponent).toBe(Comp);
    expect(section.customProps).toEqual({ x: 1 });
    expect(section.style).toEqual({ margin: "0" });
  });
});

describe("createForm", () => {
  it("returns FormConfigBuilder", () => {
    expect(createForm("f")).toBeInstanceOf(FormConfigBuilder);
  });
});

// ─── ValidationHelpers ──────────────────────────────────────────────────────

describe("ValidationHelpers", () => {
  it("required with default message", () => {
    expect(ValidationHelpers.required()).toEqual({
      type: "required",
      message: "This field is required",
    });
  });

  it("required with custom message", () => {
    expect(ValidationHelpers.required("needed").message).toBe("needed");
  });

  it("email with default message", () => {
    expect(ValidationHelpers.email().type).toBe("email");
  });

  it("email with custom message", () => {
    expect(ValidationHelpers.email("bad email").message).toBe("bad email");
  });

  it("minLength", () => {
    const rule = ValidationHelpers.minLength(3) as Record<string, unknown>;
    expect(rule).toEqual({ type: "min", value: 3, message: "Must be at least 3 characters" });
  });

  it("minLength with custom message", () => {
    expect(ValidationHelpers.minLength(3, "too short").message).toBe("too short");
  });

  it("maxLength", () => {
    const rule = ValidationHelpers.maxLength(10) as Record<string, unknown>;
    expect(rule).toEqual({ type: "max", value: 10, message: "Must be no more than 10 characters" });
  });

  it("maxLength with custom message", () => {
    expect(ValidationHelpers.maxLength(10, "too long").message).toBe("too long");
  });

  it("pattern returns compiled regex", () => {
    const rule = ValidationHelpers.pattern("^[a-z]+$", "lowercase only") as Record<string, unknown>;
    expect(rule.type).toBe("pattern");
    expect(rule.value).toBe("^[a-z]+$");
    expect(rule.compiledRegex).toBeInstanceOf(RegExp);
    expect((rule.compiledRegex as RegExp).test("abc")).toBe(true);
  });

  it("pattern caches regex", () => {
    const r1 = ValidationHelpers.pattern("^x$") as Record<string, unknown>;
    const r2 = ValidationHelpers.pattern("^x$") as Record<string, unknown>;
    expect(r1.compiledRegex).toBe(r2.compiledRegex);
  });

  it("url", () => {
    expect(ValidationHelpers.url().type).toBe("url");
  });

  it("custom", () => {
    const validator = (v: number) => v > 0 || "must be positive";
    const rule = ValidationHelpers.custom(validator, "invalid") as Record<string, unknown>;
    expect(rule.type).toBe("custom");
    expect(rule.customValidator).toBe(validator);
  });

  it("phone", () => {
    const rule = ValidationHelpers.phone() as Record<string, unknown>;
    expect(rule.type).toBe("pattern");
    expect(rule.value).toContain("[1-9]");
  });

  it("password", () => {
    expect(ValidationHelpers.password().type).toBe("pattern");
  });

  it("zipCode returns compiled regex", () => {
    const rule = ValidationHelpers.zipCode() as Record<string, unknown>;
    expect(rule.compiledRegex).toBeInstanceOf(RegExp);
    expect((rule.compiledRegex as RegExp).test("12345")).toBe(true);
    expect((rule.compiledRegex as RegExp).test("12345-6789")).toBe(true);
  });

  it("creditCard returns compiled regex", () => {
    const rule = ValidationHelpers.creditCard() as Record<string, unknown>;
    expect(rule.compiledRegex).toBeInstanceOf(RegExp);
    expect((rule.compiledRegex as RegExp).test("1234 5678 9012 3456")).toBe(true);
  });
});

// ─── ConditionalHelpers ─────────────────────────────────────────────────────

describe("ConditionalHelpers", () => {
  it("when with default action", () => {
    expect(ConditionalHelpers.when("f", "contains", "x")).toEqual({
      field: "f", operator: "contains", value: "x", action: "show",
    });
  });

  it("when with explicit action", () => {
    expect(ConditionalHelpers.when("f", "notEquals", "v", "hide")).toEqual({
      field: "f", operator: "notEquals", value: "v", action: "hide",
    });
  });

  it("equals with default action", () => {
    const c = ConditionalHelpers.equals("f", "v");
    expect(c.operator).toBe("equals");
    expect(c.action).toBe("show");
  });

  it("equals with custom action", () => {
    expect(ConditionalHelpers.equals("f", "v", "hide").action).toBe("hide");
  });
});

// ─── OptionHelpers ──────────────────────────────────────────────────────────

describe("OptionHelpers", () => {
  it("create", () => {
    expect(OptionHelpers.create("A", "a")).toEqual({ label: "A", value: "a", disabled: false });
  });

  it("create disabled", () => {
    expect(OptionHelpers.create("A", "a", true).disabled).toBe(true);
  });

  it("createGroup", () => {
    const result = OptionHelpers.createGroup(
      [{ label: "A", value: "a" }, { label: "B", value: "b" }],
      "grp",
    );
    expect(result).toEqual([
      { label: "A", value: "a", group: "grp" },
      { label: "B", value: "b", group: "grp" },
    ]);
  });

  it("fromArray", () => {
    expect(OptionHelpers.fromArray(["x", "y"])).toEqual([
      { label: "x", value: "x" },
      { label: "y", value: "y" },
    ]);
  });

  it("fromObject", () => {
    expect(OptionHelpers.fromObject({ us: "United States", ca: "Canada" })).toEqual([
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
    ]);
  });

  it("countries returns non-empty array", () => {
    const c = OptionHelpers.countries();
    expect(c.length).toBeGreaterThan(0);
    expect(c[0]).toHaveProperty("label");
    expect(c[0]).toHaveProperty("value");
  });

  it("states returns non-empty array", () => {
    expect(OptionHelpers.states().length).toBeGreaterThan(0);
  });

  it("yesNo", () => {
    expect(OptionHelpers.yesNo()).toEqual([
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ]);
  });

  it("priority returns 4 options", () => {
    expect(OptionHelpers.priority()).toHaveLength(4);
  });
});

// ─── FormPresets ────────────────────────────────────────────────────────────

describe("FormPresets", () => {
  it("contactForm builds valid config", () => {
    const form = FormPresets.contactForm();
    expect(form.id).toBe("contact-form");
    expect(form.sections.length).toBeGreaterThan(0);
    expect(form.submission?.submitText).toBe("Send Message");
  });

  it("contactForm with custom id", () => {
    expect(FormPresets.contactForm("custom").id).toBe("custom");
  });

  it("registrationForm builds valid config", () => {
    const form = FormPresets.registrationForm();
    expect(form.id).toBe("registration-form");
    expect(form.sections.length).toBe(2);
  });

  it("surveyForm builds valid config with radio options", () => {
    const form = FormPresets.surveyForm();
    expect(form.id).toBe("survey-form");
    const basicInfo = form.sections[0];
    const radioField = basicInfo.fields.find((f) => f.type === "radio");
    expect(radioField).toBeDefined();
    expect(radioField!.options).toBeDefined();
    expect(radioField!.options!.length).toBeGreaterThan(0);
  });

  it("surveyForm uses dependsOn instead of withConditional", () => {
    const form = FormPresets.surveyForm();
    const industry = form.sections[0].fields.find((f) => f.id === "industry");
    expect(industry?.conditional).toEqual([
      { field: "customerType", operator: "notEquals", value: "individual", action: "show" },
    ]);
  });

  it("jobApplicationForm builds valid config", () => {
    const form = FormPresets.jobApplicationForm();
    expect(form.id).toBe("job-application");
    expect(form.sections).toHaveLength(2);
  });

  it("jobApplicationForm radio fields have options set", () => {
    const form = FormPresets.jobApplicationForm();
    const experienceSection = form.sections[1];
    const radioField = experienceSection.fields.find((f) => f.type === "radio");
    expect(radioField).toBeDefined();
    expect(radioField!.options!.length).toBe(4);
  });

  it("asRequired auto-adds required validation in presets", () => {
    const form = FormPresets.contactForm();
    const nameField = form.sections[0].fields.find((f) => f.id === "name");
    expect(nameField?.required).toBe(true);
    expect(nameField?.validation?.some((v) => v.type === "required")).toBe(true);
  });
});

// ─── saveFormConfigToJSON / loadFormConfigFromJSON ───────────────────────────

describe("saveFormConfigToJSON", () => {
  it("returns valid JSON string", () => {
    const config = createForm("f").withTitle("T").build();
    const json = saveFormConfigToJSON(config);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("actually serializes the passed config", () => {
    const config = createForm("f")
      .withTitle("My Form")
      .addSection(createSection("s").withTitle("S").build())
      .withSubmission({ submitText: "Go", validation: "onBlur" })
      .build();
    const parsed = JSON.parse(saveFormConfigToJSON(config));
    expect(parsed.id).toBe("f");
    expect(parsed.title).toBe("My Form");
    expect(parsed.sections).toHaveLength(1);
    expect(parsed.submission.submitText).toBe("Go");
    expect(parsed.submission.validation).toBe("onBlur");
  });

  it("strips submission callbacks", () => {
    const config = createForm("f")
      .withSubmission({ submitText: "Go" })
      .build();
    const parsed = JSON.parse(saveFormConfigToJSON(config));
    expect(parsed.submission.onSubmit).toBeUndefined();
    expect(parsed.submission.onReset).toBeUndefined();
  });
});

describe("loadFormConfigFromJSON", () => {
  it("parses JSON string", () => {
    const json = '{"id":"f","title":"T"}';
    const config = loadFormConfigFromJSON(json);
    expect(config.id).toBe("f");
    expect(config.title).toBe("T");
  });

  it("passes through object", () => {
    const obj = { id: "f", title: "T" };
    const config = loadFormConfigFromJSON(obj);
    expect(config).toBe(obj);
  });
});

// ─── Default configs ────────────────────────────────────────────────────────

describe("default configs", () => {
  it("DEFAULT_LAYOUT_CONFIG", () => {
    expect(DEFAULT_LAYOUT_CONFIG).toEqual({
      columns: 1,
      spacing: "md",
      variant: "default",
    });
  });

  it("DEFAULT_SUBMISSION_CONFIG", () => {
    expect(DEFAULT_SUBMISSION_CONFIG).toEqual({
      enabled: true,
      submitText: "Submit",
      resetText: "",
      validation: "onSubmit",
    });
  });

  it("DEFAULT_I18N_CONFIG", () => {
    expect(DEFAULT_I18N_CONFIG).toEqual({ locale: "en", messages: {} });
  });
});

// ─── Type-safe values ────────────────────────────────────────────────────────

describe("FieldBuilderOf type-safe values", () => {
  it("number field: withValue accepts number, build returns NumberFieldConfig", () => {
    const field = createField("age", "number", "Age").withValue(25).build();
    expect(field.value).toBe(25);
    expect(field.type).toBe("number");
    const _typecheck: NumberFieldConfig = field;
    const _min: number | undefined = field.min;
  });

  it("text field: withValue accepts string, build returns TextFieldConfig", () => {
    const field = createField("name", "text", "Name").withValue("hello").build();
    expect(field.value).toBe("hello");
    expect(field.type).toBe("text");
    const _typecheck: TextFieldConfig = field;
    const _minLen: number | undefined = field.minLength;
  });

  it("email field: withValue accepts string, build returns TextFieldConfig", () => {
    const field = createField("email", "email", "Email").withValue("a@b.com").build();
    expect(field.value).toBe("a@b.com");
    const _typecheck: TextFieldConfig = field;
  });

  it("password field: withValue accepts string, build returns TextFieldConfig", () => {
    const field = createField("pw", "password", "PW").withValue("secret").build();
    expect(field.value).toBe("secret");
    const _typecheck: TextFieldConfig = field;
  });

  it("textarea field: withValue accepts string, build returns TextareaFieldConfig", () => {
    const field = createField("bio", "textarea", "Bio").withValue("text").build();
    expect(field.value).toBe("text");
    const _typecheck: TextareaFieldConfig = field;
    const _rows: number | undefined = field.rows;
  });

  it("checkbox field: withValue accepts boolean, build returns CheckboxFieldConfig", () => {
    const field = createField("agree", "checkbox", "Agree").withValue(true).build();
    expect(field.value).toBe(true);
    const _typecheck: CheckboxFieldConfig = field;
  });

  it("switch field: withValue accepts boolean, build returns SwitchFieldConfig", () => {
    const field = createField("toggle", "switch", "Toggle").withValue(false).build();
    expect(field.value).toBe(false);
    const _typecheck: SwitchFieldConfig = field;
  });

  it("slider field: withValue accepts number, build returns SliderFieldConfig", () => {
    const field = createField("vol", "slider", "Volume").withValue(50).build();
    expect(field.value).toBe(50);
    const _typecheck: SliderFieldConfig = field;
    const _step: number | undefined = field.step;
  });

  it("select field: build returns SelectFieldConfig", () => {
    const field = createField("color", "select", "Color")
      .withOptions([{ label: "Red", value: "red" }])
      .build();
    const _typecheck: SelectFieldConfig = field;
    const _searchable: boolean | undefined = field.searchable;
  });

  it("radio field: build returns RadioFieldConfig", () => {
    const field = createField("size", "radio", "Size")
      .withOptions([{ label: "S", value: "s" }])
      .build();
    const _typecheck: RadioFieldConfig = field;
    const _inline: boolean | undefined = field.inline;
  });

  it("date field: build returns DateFieldConfig", () => {
    const field = createField("dob", "date", "DOB").build();
    const _typecheck: DateFieldConfig = field;
    const _format: string | undefined = field.format;
  });

  it("date-range field: build returns DateRangeFieldConfig", () => {
    const field = createField("range", "date-range", "Range").build();
    const _typecheck: DateRangeFieldConfig = field;
    const _allowSameDay: boolean | undefined = field.allowSameDay;
  });

  it("file field: build returns FileFieldConfig", () => {
    const field = createField("doc", "file", "Doc").build();
    const _typecheck: FileFieldConfig = field;
    const _accept: string | undefined = field.accept;
  });

  it("custom field: build returns CustomFieldConfig", () => {
    const field = createField("x", "custom", "X").build();
    const _typecheck: CustomFieldConfig = field;
  });

  it("withDefaultValue is typed per field", () => {
    const num = createField("x", "number", "X").withDefaultValue(0).build();
    expect(num.defaultValue).toBe(0);
    const text = createField("x", "text", "X").withDefaultValue("").build();
    expect(text.defaultValue).toBe("");
    const bool = createField("x", "checkbox", "X").withDefaultValue(false).build();
    expect(bool.defaultValue).toBe(false);
  });

  it("chain preserves type safety through multiple calls", () => {
    const field = createField("age", "number", "Age")
      .withValue(18)
      .withDefaultValue(0)
      .withDescription("Your age")
      .asRequired()
      .withMinMax({ min: 0, max: 150 })
      .build();
    expect(field.value).toBe(18);
    expect(field.defaultValue).toBe(0);
    expect(field.description).toBe("Your age");
    const _typecheck: NumberFieldConfig = field;
  });
});

// ─── Method constraint tests ────────────────────────────────────────────────

describe("FieldBuilderOf method constraints", () => {
  it("select/multiselect/radio have withOptions", () => {
    const opts = [{ label: "A", value: "a" }];
    expect(createField("x", "select", "X").withOptions(opts).build().type).toBe("select");
    expect(createField("x", "multiselect", "X").withOptions(opts).build().type).toBe("multiselect");
    expect(createField("x", "radio", "X").withOptions(opts).build().type).toBe("radio");
  });

  it("number/slider have withMinMax", () => {
    expect(createField("x", "number", "X").withMinMax({ min: 0 }).build().type).toBe("number");
    expect(createField("x", "slider", "X").withMinMax({ max: 100 }).build().type).toBe("slider");
  });

  it("text/email/password have withPrefix and withSubfix", () => {
    expect(createField("x", "text", "X").withPrefix("$").build().type).toBe("text");
    expect(createField("x", "email", "X").withPrefix("@").build().type).toBe("email");
    expect(createField("x", "password", "X").withSubfix("!").build().type).toBe("password");
  });

  it("custom has withCustomComponent", () => {
    const Comp = () => null;
    const field = createField("x", "custom", "X").withCustomComponent(Comp).build();
    expect(field.type).toBe("custom");
  });

  it("group has withChildren, addChild, withGroupLayout", () => {
    const child = createField("c", "text", "C").build();
    const field = createFieldGroup("g", "Group")
      .withChildren([child])
      .withGroupLayout({ columns: 2 })
      .build();
    expect(field.type).toBe("group");
  });

  it("date-range has withDateRangeDefaults", () => {
    const field = createField("x", "date-range", "X").withDateRangeDefaults().build();
    expect(field.type).toBe("date-range");
  });
});

// ─── defineCustomField ──────────────────────────────────────────────────────

describe("defineCustomField", () => {
  it("returns component that works with withCustomComponent", () => {
    const Rating = defineCustomField<number>(({ value: _value, onChange: _onChange }) => null);
    const field = createField("r", "custom", "R").withCustomComponent(Rating).build();
    expect((field as Record<string, unknown>).customComponent).toBe(Rating);
  });

  it("typed custom props are required in withCustomComponent", () => {
    const Stars = defineCustomField<number, { maxStars: number }>(
      ({ value: _value, onChange: _onChange, maxStars: _maxStars }) => null,
    );
    const field = createField("s", "custom", "S")
      .withCustomComponent(Stars, { maxStars: 5 })
      .build();
    expect(field.customProps?.maxStars).toBe(5);
  });
});

// ─── TypedFormSection values inference ──────────────────────────────────────

describe("TypedFormSection values inference", () => {
  it("section.values type infers field names and types from addFields with as const", () => {
    const f1 = createField("username", "text", "Username").build();
    const f2 = createField("age", "number", "Age").build();
    const f3 = createField("agree", "checkbox", "Agree").build();

    const section = createSection("profile")
      .addFields([f1, f2, f3] as const)
      .build();

    type Values = typeof section.values;
    const _check: Values = {} as {
      username: string;
      age: number;
      agree: boolean;
    };
    const _reverse: { username: string; age: number; agree: boolean } = {} as Values;

    expect(section.fields).toEqual([f1, f2, f3]);
    expect(section.id).toBe("profile");
  });

  it("section.values type infers from withFields with as const", () => {
    const f1 = createField("email", "email", "Email").build();
    const f2 = createField("bio", "textarea", "Bio").build();

    const section = createSection("contact")
      .withFields([f1, f2] as const)
      .build();

    type Values = typeof section.values;
    const _check: Values = {} as { email: string; bio: string };
    const _reverse: { email: string; bio: string } = {} as Values;

    expect(section.fields).toEqual([f1, f2]);
  });

  it("addField chains preserve tuple inference", () => {
    const f1 = createField("name", "text", "Name").build();
    const f2 = createField("score", "number", "Score").build();

    const section = createSection("s")
      .addField(f1)
      .addField(f2)
      .build();

    type Values = typeof section.values;
    const _check: Values = {} as { name: string; score: number };
    const _reverse: { name: string; score: number } = {} as Values;

    expect(section.fields).toHaveLength(2);
  });

  it("mixed addField and addFields preserve full tuple", () => {
    const f1 = createField("a", "text", "A").build();
    const f2 = createField("b", "number", "B").build();
    const f3 = createField("c", "checkbox", "C").build();

    const section = createSection("s")
      .addField(f1)
      .addFields([f2, f3] as const)
      .build();

    type Values = typeof section.values;
    const _check: Values = {} as { a: string; b: number; c: boolean };
    const _reverse: { a: string; b: number; c: boolean } = {} as Values;

    expect(section.fields).toHaveLength(3);
  });

  it("chaining builder methods preserves field types", () => {
    const f1 = createField("x", "text", "X").build();

    const section = createSection("s")
      .withTitle("Title")
      .withDescription("Desc")
      .addFields([f1] as const)
      .withClassName("cls")
      .build();

    type Values = typeof section.values;
    const _check: Values = {} as { x: string };

    expect(section.title).toBe("Title");
    expect(section.className).toBe("cls");
  });

  it("clone preserves field types", () => {
    const f1 = createField("x", "number", "X").build();

    const original = createSection("s").addFields([f1] as const);
    const cloned = original.clone("s2").build();

    type Values = typeof cloned.values;
    const _check: Values = {} as { x: number };

    expect(cloned.id).toBe("s2");
  });

  it("TypedFormSection type alias works standalone", () => {
    const f1 = createField("name", "text", "Name").build();
    const f2 = createField("active", "switch", "Active").build();

    const section = createSection("s")
      .addFields([f1, f2] as const)
      .build();

    type S = typeof section;
    type _AssertExtends = S extends TypedFormSection ? true : never;
    const _t: _AssertExtends = true;

    expect(section.fields).toHaveLength(2);
  });

  it("empty section has empty values type", () => {
    const section = createSection("empty").build();

    type Values = typeof section.values;
    const _check: Values = {} as Record<string, never>;

    expect(section.fields).toEqual([]);
  });

  it("built section is assignable to FormSection", () => {
    const f1 = createField("x", "text", "X").build();
    const section = createSection("s").addFields([f1] as const).build();

    const _asFormSection: FormSection = section;

    expect(_asFormSection.id).toBe("s");
  });
});

// ─── Component Adapter ──────────────────────────────────────────────────────

describe("defaultAdapter", () => {
  it("satisfies ComponentAdapter type", () => {
    const adapter: ComponentAdapter = defaultAdapter;
    expect(adapter).toBeDefined();
  });

  it("has field renderers for all standard field types", () => {
    const expectedTypes: FieldType[] = [
      "text", "email", "password", "number", "slider",
      "textarea", "select", "multiselect", "checkbox",
      "switch", "radio", "date", "date-range",
    ];
    for (const type of expectedTypes) {
      expect(defaultAdapter.fields[type]).toBeDefined();
      expect(typeof defaultAdapter.fields[type]).toBe("function");
    }
  });

  it("does not include renderers for structural field types", () => {
    expect(defaultAdapter.fields.hidden).toBeUndefined();
    expect(defaultAdapter.fields.custom).toBeUndefined();
    expect(defaultAdapter.fields.group).toBeUndefined();
  });

  it("has empty icons by default", () => {
    expect(defaultAdapter.icons).toEqual({});
  });

  it("has layout components", () => {
    expect(typeof defaultAdapter.FormItemWrapper).toBe("function");
    expect(typeof defaultAdapter.SectionWrapper).toBe("function");
    expect(typeof defaultAdapter.Button).toBe("function");
  });

  it("has utility functions", () => {
    expect(typeof defaultAdapter.cn).toBe("function");
    expect(typeof defaultAdapter.formatDate).toBe("function");
  });
});

describe("defaultAdapter.cn", () => {
  it("joins truthy class names with space", () => {
    expect(defaultAdapter.cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(defaultAdapter.cn("a", undefined, false, null, "b")).toBe("a b");
  });

  it("returns empty string for all falsy", () => {
    expect(defaultAdapter.cn(undefined, false, null)).toBe("");
  });

  it("handles single class", () => {
    expect(defaultAdapter.cn("only")).toBe("only");
  });

  it("handles empty args", () => {
    expect(defaultAdapter.cn()).toBe("");
  });
});

describe("defaultAdapter.formatDate", () => {
  it("returns a string", () => {
    const result = defaultAdapter.formatDate(new Date(2024, 0, 15), "PPP");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("uses toLocaleDateString", () => {
    const date = new Date(2024, 5, 15);
    expect(defaultAdapter.formatDate(date, "PPP")).toBe(date.toLocaleDateString());
  });
});

describe("ComponentAdapter type integration", () => {
  it("FormBuilderProps accepts partial adapter", () => {
    const partial: FormBuilderProps["adapter"] = {
      cn: (...args: Array<string | undefined | false | null>) => args.filter(Boolean).join("-"),
    };
    expect(partial.cn!("a", "b")).toBe("a-b");
  });

  it("FormBuilderProps accepts adapter with custom field renderer", () => {
    const CustomText = () => null;
    const partial: FormBuilderProps["adapter"] = {
      fields: { text: CustomText },
    };
    expect(partial.fields!.text).toBe(CustomText);
  });

  it("FormBuilderProps accepts empty adapter", () => {
    const partial: FormBuilderProps["adapter"] = {};
    expect(partial).toEqual({});
  });

  it("FormBuilderProps accepts full defaultAdapter", () => {
    const partial: FormBuilderProps["adapter"] = defaultAdapter;
    expect(partial).toBe(defaultAdapter);
  });

  it("adapter field renderer matches FieldInputProps signature", () => {
    const renderer = defaultAdapter.fields.text!;
    const props: FieldInputProps = {
      value: "test",
      onChange: jest.fn(),
      field: createField("x", "text", "X").build(),
    };
    expect(() => renderer(props)).not.toThrow();
  });

  it("text/email/password share same renderer", () => {
    expect(defaultAdapter.fields.text).toBe(defaultAdapter.fields.email);
    expect(defaultAdapter.fields.text).toBe(defaultAdapter.fields.password);
  });

  it("each non-shared field type has unique renderer", () => {
    const renderers = new Set([
      defaultAdapter.fields.text,
      defaultAdapter.fields.number,
      defaultAdapter.fields.slider,
      defaultAdapter.fields.textarea,
      defaultAdapter.fields.select,
      defaultAdapter.fields.multiselect,
      defaultAdapter.fields.checkbox,
      defaultAdapter.fields.switch,
      defaultAdapter.fields.radio,
      defaultAdapter.fields.date,
      defaultAdapter.fields["date-range"],
    ]);
    expect(renderers.size).toBe(11);
  });
});

// ─── FormBuilder with JSON config ───────────────────────────────────────────

describe("FormBuilder with JSON config", () => {
  it("loadFormConfigFromJSON accepts inline JSON object", () => {
    const config = loadFormConfigFromJSON({
      id: "json-form",
      title: "JSON Form",
      sections: [
        {
          id: "main",
          fields: [
            { id: "name", type: "text", label: "Name" },
            { id: "age", type: "number", label: "Age" },
          ],
        },
      ],
    });
    expect(config.id).toBe("json-form");
    expect(config.title).toBe("JSON Form");
  });

  it("loadFormConfigFromJSON parses stringified JSON with all field types", () => {
    const json = JSON.stringify({
      id: "full-form",
      sections: [
        {
          id: "s1",
          title: "Section 1",
          fields: [
            { id: "t", type: "text", label: "Text", placeholder: "Enter text" },
            { id: "e", type: "email", label: "Email", required: true },
            { id: "p", type: "password", label: "Password" },
            { id: "n", type: "number", label: "Number", min: 0, max: 100 },
            { id: "ta", type: "textarea", label: "Textarea", rows: 5 },
            { id: "cb", type: "checkbox", label: "Checkbox", defaultValue: false },
            { id: "sw", type: "switch", label: "Switch" },
            { id: "sl", type: "slider", label: "Slider", min: 0, max: 100, step: 5 },
            { id: "sel", type: "select", label: "Select", options: [{ label: "A", value: "a" }] },
            { id: "rad", type: "radio", label: "Radio", options: [{ label: "X", value: "x" }] },
            { id: "d", type: "date", label: "Date" },
            { id: "dr", type: "date-range", label: "Date Range" },
          ],
        },
      ],
    });
    const config = loadFormConfigFromJSON(json);
    expect(config.sections).toHaveLength(1);
    expect(config.sections![0].fields).toHaveLength(12);
  });

  it("loadFormConfigFromJSON preserves layout and submission from JSON", () => {
    const config = loadFormConfigFromJSON({
      id: "f",
      sections: [],
      layout: { columns: 2, spacing: "lg", variant: "card" },
      submission: { submitText: "Save", resetText: "Cancel", validation: "onBlur" },
    });
    expect(config.layout).toEqual({ columns: 2, spacing: "lg", variant: "card" });
    expect(config.submission?.submitText).toBe("Save");
    expect(config.submission?.resetText).toBe("Cancel");
    expect(config.submission?.validation).toBe("onBlur");
  });

  it("loadFormConfigFromJSON preserves conditionals from JSON", () => {
    const config = loadFormConfigFromJSON({
      id: "f",
      sections: [
        {
          id: "s",
          fields: [
            { id: "role", type: "select", label: "Role", options: [{ label: "Admin", value: "admin" }] },
            {
              id: "adminCode",
              type: "text",
              label: "Admin Code",
              conditional: [{ field: "role", operator: "equals", value: "admin", action: "show" }],
            },
          ],
        },
      ],
    });
    const adminField = config.sections![0].fields[1];
    expect(adminField.conditional).toEqual([
      { field: "role", operator: "equals", value: "admin", action: "show" },
    ]);
  });

  it("loadFormConfigFromJSON preserves validation rules from JSON", () => {
    const config = loadFormConfigFromJSON({
      id: "f",
      sections: [
        {
          id: "s",
          fields: [
            {
              id: "email",
              type: "email",
              label: "Email",
              required: true,
              validation: [
                { type: "required", message: "Email is required" },
                { type: "email", message: "Invalid email" },
              ],
            },
          ],
        },
      ],
    });
    const field = config.sections![0].fields[0];
    expect(field.validation).toHaveLength(2);
    expect(field.validation![0]).toEqual({ type: "required", message: "Email is required" });
    expect(field.validation![1]).toEqual({ type: "email", message: "Invalid email" });
  });

  it("loadFormConfigFromJSON preserves nested sections with collapsible", () => {
    const config = loadFormConfigFromJSON({
      id: "f",
      sections: [
        { id: "s1", title: "Open", fields: [] },
        { id: "s2", title: "Collapsed", collapsible: true, defaultCollapsed: true, fields: [] },
      ],
    });
    expect(config.sections).toHaveLength(2);
    expect(config.sections![1].collapsible).toBe(true);
    expect(config.sections![1].defaultCollapsed).toBe(true);
  });

  it("loadFormConfigFromJSON preserves theme config from JSON", () => {
    const config = loadFormConfigFromJSON({
      id: "f",
      sections: [],
      theme: {
        colors: { primary: "#ff0000", background: "#ffffff" },
        borderRadius: "8px",
        className: "themed-form",
      },
    });
    expect(config.theme?.colors?.primary).toBe("#ff0000");
    expect(config.theme?.borderRadius).toBe("8px");
    expect(config.theme?.className).toBe("themed-form");
  });

  it("loadFormConfigFromJSON preserves grid config on fields", () => {
    const config = loadFormConfigFromJSON({
      id: "f",
      sections: [
        {
          id: "s",
          fields: [
            { id: "a", type: "text", label: "A", grid: { colSpan: 6 } },
            { id: "b", type: "text", label: "B", grid: { colSpan: 6 } },
          ],
        },
      ],
    });
    expect(config.sections![0].fields[0].grid).toEqual({ colSpan: 6 });
    expect(config.sections![0].fields[1].grid).toEqual({ colSpan: 6 });
  });

  it("saveFormConfigToJSON roundtrips with loadFormConfigFromJSON", () => {
    const original = createForm("roundtrip")
      .withTitle("Roundtrip Form")
      .addSection(
        createSection("s")
          .withTitle("Section")
          .withFields([
            createField("name", "text", "Name").asRequired().build(),
            createField("count", "number", "Count").withMinMax({ min: 0, max: 10 }).build(),
          ])
          .build(),
      )
      .withLayout({ columns: 2 })
      .withSubmission({ submitText: "Go", validation: "onBlur" })
      .build();

    const json = saveFormConfigToJSON(original);
    const restored = loadFormConfigFromJSON(json);

    expect(restored.id).toBe("roundtrip");
    expect(restored.title).toBe("Roundtrip Form");
    expect(restored.sections).toHaveLength(1);
    expect(restored.sections![0].fields).toHaveLength(2);
    expect(restored.layout?.columns).toBe(2);
    expect(restored.submission?.submitText).toBe("Go");
  });

  it("JSON config with i18n settings", () => {
    const config = loadFormConfigFromJSON({
      id: "i18n-form",
      sections: [],
      i18n: { locale: "ja", rtl: false, messages: { submit: "送信" } },
    });
    expect(config.i18n?.locale).toBe("ja");
    expect(config.i18n?.messages?.submit).toBe("送信");
  });

  it("JSON config with group fields and children", () => {
    const config = loadFormConfigFromJSON({
      id: "f",
      sections: [
        {
          id: "s",
          fields: [
            {
              id: "address",
              type: "group",
              label: "Address",
              children: [
                { id: "street", type: "text", label: "Street" },
                { id: "city", type: "text", label: "City" },
              ],
              layout: { columns: 2 },
            },
          ],
        },
      ],
    });
    const group = config.sections![0].fields[0] as any;
    expect(group.type).toBe("group");
    expect(group.children).toHaveLength(2);
    expect(group.layout).toEqual({ columns: 2 });
  });

  it("JSON config with file field constraints", () => {
    const config = loadFormConfigFromJSON({
      id: "f",
      sections: [
        {
          id: "s",
          fields: [
            {
              id: "avatar",
              type: "file",
              label: "Avatar",
              accept: "image/*",
              multiple: false,
              maxSize: 5242880,
            },
          ],
        },
      ],
    });
    const field = config.sections![0].fields[0] as any;
    expect(field.accept).toBe("image/*");
    expect(field.maxSize).toBe(5242880);
  });
});
