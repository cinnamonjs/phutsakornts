import { describe, expect, it } from "vitest";
import type { FieldConfig } from "@/components/module/form-builder/types";
import {
  createZodSchema,
  shouldShowField,
} from "@/components/module/form-builder/utils";

const t = (key: string, params?: Record<string, unknown>) => {
  if (params?.label) return `${params.label} is required`;
  return key;
};

const makeTextField = (overrides: Partial<FieldConfig> = {}): FieldConfig => ({
  id: "name",
  type: "text",
  label: "Name",
  ...overrides,
} as FieldConfig);

const parse = (fields: FieldConfig[], data: Record<string, unknown>) => {
  const schema = createZodSchema(fields, t);
  return schema.safeParse(data);
};

describe("createZodSchema — conditional visibility", () => {
  const toggleField = makeTextField({ id: "toggle", type: "select", label: "Toggle" });

  const conditionalRequired: FieldConfig = {
    id: "details",
    type: "text",
    label: "Details",
    required: true,
    conditional: [{ field: "toggle", operator: "equals", value: "yes", action: "show" }],
  } as FieldConfig;

  it("passes when conditional required field is hidden and value is empty", () => {
    const result = parse(
      [toggleField, conditionalRequired],
      { toggle: "no", details: "" },
    );
    expect(result.success).toBe(true);
  });

  it("passes when conditional required field is hidden and value is undefined", () => {
    const result = parse(
      [toggleField, conditionalRequired],
      { toggle: "no", details: undefined },
    );
    expect(result.success).toBe(true);
  });

  it("fails when conditional required field is visible and value is empty", () => {
    const result = parse(
      [toggleField, conditionalRequired],
      { toggle: "yes", details: "" },
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      const detailsError = result.error.issues.find((i) => i.path.includes("details"));
      expect(detailsError).toBeDefined();
    }
  });

  it("passes when conditional required field is visible and value is provided", () => {
    const result = parse(
      [toggleField, conditionalRequired],
      { toggle: "yes", details: "some text" },
    );
    expect(result.success).toBe(true);
  });

  it("passes when conditional optional field is hidden and value is empty", () => {
    const optionalConditional: FieldConfig = {
      id: "notes",
      type: "text",
      label: "Notes",
      required: false,
      conditional: [{ field: "toggle", operator: "equals", value: "yes", action: "show" }],
    } as FieldConfig;

    const result = parse(
      [toggleField, optionalConditional],
      { toggle: "no", notes: "" },
    );
    expect(result.success).toBe(true);
  });
});

describe("createZodSchema — conditional hide action", () => {
  const toggleField = makeTextField({ id: "mode", type: "select", label: "Mode" });

  const hiddenWhenAdvanced: FieldConfig = {
    id: "simple_field",
    type: "text",
    label: "Simple Field",
    required: true,
    conditional: [{ field: "mode", operator: "equals", value: "advanced", action: "hide" }],
  } as FieldConfig;

  it("passes when field is hidden via hide action and value is empty", () => {
    const result = parse(
      [toggleField, hiddenWhenAdvanced],
      { mode: "advanced", simple_field: "" },
    );
    expect(result.success).toBe(true);
  });

  it("fails when field is visible (hide condition not met) and value is empty", () => {
    const result = parse(
      [toggleField, hiddenWhenAdvanced],
      { mode: "basic", simple_field: "" },
    );
    expect(result.success).toBe(false);
  });
});

describe("createZodSchema — conditional require action", () => {
  const toggleField = makeTextField({ id: "needs_detail", type: "checkbox", label: "Needs Detail" });

  const conditionallyRequired: FieldConfig = {
    id: "detail",
    type: "text",
    label: "Detail",
    required: false,
    conditional: [{ field: "needs_detail", operator: "equals", value: true, action: "require" }],
  } as FieldConfig;

  it("passes when conditional require is not triggered and value is empty", () => {
    const result = parse(
      [toggleField, conditionallyRequired],
      { needs_detail: false, detail: "" },
    );
    expect(result.success).toBe(true);
  });

  it("fails when conditional require is triggered and value is empty", () => {
    const result = parse(
      [toggleField, conditionallyRequired],
      { needs_detail: true, detail: "" },
    );
    expect(result.success).toBe(false);
  });

  it("passes when conditional require is triggered and value is provided", () => {
    const result = parse(
      [toggleField, conditionallyRequired],
      { needs_detail: true, detail: "done" },
    );
    expect(result.success).toBe(true);
  });
});

describe("createZodSchema — non-conditional fields unchanged", () => {
  it("enforces required on always-visible field", () => {
    const field = makeTextField({ required: true });
    const result = parse([field], { name: "" });
    expect(result.success).toBe(false);
  });

  it("passes optional on always-visible field", () => {
    const field = makeTextField({ required: false });
    const result = parse([field], { name: undefined });
    expect(result.success).toBe(true);
  });

  it("rejects wrong type on always-visible field", () => {
    const field: FieldConfig = { id: "count", type: "number", label: "Count", required: true } as FieldConfig;
    const result = parse([field], { count: "not a number" });
    expect(result.success).toBe(false);
  });
});

describe("createZodSchema — typed fields with conditional visibility", () => {
  const toggleField = makeTextField({ id: "show_date", type: "checkbox", label: "Show Date" });

  it("passes when conditional date field is hidden with invalid value", () => {
    const dateField: FieldConfig = {
      id: "event_date",
      type: "date",
      label: "Event Date",
      required: true,
      conditional: [{ field: "show_date", operator: "equals", value: true, action: "show" }],
    } as FieldConfig;

    const result = parse(
      [toggleField, dateField],
      { show_date: false, event_date: "not-a-date" },
    );
    expect(result.success).toBe(true);
  });

  it("passes when conditional number field is hidden with string value", () => {
    const numField: FieldConfig = {
      id: "amount",
      type: "number",
      label: "Amount",
      required: true,
      conditional: [{ field: "show_date", operator: "equals", value: true, action: "show" }],
    } as FieldConfig;

    const result = parse(
      [toggleField, numField],
      { show_date: false, amount: "invalid" },
    );
    expect(result.success).toBe(true);
  });
});

describe("createZodSchema — validation rules skipped when hidden", () => {
  const toggleField = makeTextField({ id: "toggle", type: "select", label: "Toggle" });

  it("skips min validation when field is hidden", () => {
    const field: FieldConfig = {
      id: "code",
      type: "text",
      label: "Code",
      required: false,
      validation: [{ type: "min", value: 5, message: "Too short" }],
      conditional: [{ field: "toggle", operator: "equals", value: "yes", action: "show" }],
    } as FieldConfig;

    const result = parse(
      [toggleField, field],
      { toggle: "no", code: "ab" },
    );
    expect(result.success).toBe(true);
  });

  it("enforces min validation when field is visible", () => {
    const field: FieldConfig = {
      id: "code",
      type: "text",
      label: "Code",
      required: false,
      validation: [{ type: "min", value: 5, message: "Too short" }],
      conditional: [{ field: "toggle", operator: "equals", value: "yes", action: "show" }],
    } as FieldConfig;

    const result = parse(
      [toggleField, field],
      { toggle: "yes", code: "ab" },
    );
    expect(result.success).toBe(false);
  });
});

describe("createZodSchema — optional typed fields tolerate empty", () => {
  it("passes optional email left blank", () => {
    const field: FieldConfig = { id: "mail", type: "email", label: "Email" } as FieldConfig;
    const result = parse([field], { mail: "" });
    expect(result.success).toBe(true);
  });

  it("passes optional date left blank", () => {
    const field: FieldConfig = { id: "due", type: "date", label: "Due" } as FieldConfig;
    const result = parse([field], { due: "" });
    expect(result.success).toBe(true);
  });

  it("rejects malformed email when provided", () => {
    const field: FieldConfig = { id: "mail", type: "email", label: "Email" } as FieldConfig;
    const result = parse([field], { mail: "nope" });
    expect(result.success).toBe(false);
  });

  it("reports required (not invalid-format) on empty required email", () => {
    const field: FieldConfig = { id: "mail", type: "email", label: "Email", required: true } as FieldConfig;
    const result = parse([field], { mail: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Email is required");
    }
  });
});

describe("createZodSchema — rule coverage", () => {
  it("runs custom validator returning false", () => {
    const field: FieldConfig = {
      id: "code",
      type: "text",
      label: "Code",
      validation: [{ type: "custom", message: "bad", customValidator: () => false }],
    } as FieldConfig;
    const result = parse([field], { code: "x" });
    expect(result.success).toBe(false);
  });

  it("uses string returned by custom validator as message", () => {
    const field: FieldConfig = {
      id: "code",
      type: "text",
      label: "Code",
      validation: [{ type: "custom", customValidator: () => "too weak" }],
    } as FieldConfig;
    const result = parse([field], { code: "x" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("too weak");
    }
  });

  it("passes when custom validator returns true", () => {
    const field: FieldConfig = {
      id: "code",
      type: "text",
      label: "Code",
      validation: [{ type: "custom", customValidator: () => true }],
    } as FieldConfig;
    const result = parse([field], { code: "x" });
    expect(result.success).toBe(true);
  });

  it("enforces url rule", () => {
    const field: FieldConfig = {
      id: "site",
      type: "text",
      label: "Site",
      validation: [{ type: "url" }],
    } as FieldConfig;
    expect(parse([field], { site: "not a url" }).success).toBe(false);
    expect(parse([field], { site: "https://x.com" }).success).toBe(true);
  });

  it("enforces field-level number min/max", () => {
    const field: FieldConfig = {
      id: "qty",
      type: "number",
      label: "Qty",
      min: 1,
      max: 10,
    } as FieldConfig;
    expect(parse([field], { qty: 0 }).success).toBe(false);
    expect(parse([field], { qty: 11 }).success).toBe(false);
    expect(parse([field], { qty: 5 }).success).toBe(true);
  });

  it("reads nested dotted-id value (filled passes, empty fails)", () => {
    const field: FieldConfig = {
      id: "address.line1",
      type: "text",
      label: "Line 1",
      validation: [{ type: "required" }],
    } as FieldConfig;
    expect(parse([field], { address: { line1: "123 St" } }).success).toBe(true);
    expect(parse([field], { address: { line1: "" } }).success).toBe(false);
    expect(parse([field], {}).success).toBe(false);
  });

  it("evaluates nested-id conditional in superRefine", () => {
    const toggle: FieldConfig = { id: "shipping.same_as_billing", type: "switch", label: "Same" } as FieldConfig;
    const shipLine: FieldConfig = {
      id: "shipping.address.line1",
      type: "text",
      label: "Ship Line 1",
      validation: [{ type: "required" }],
      conditional: [{ field: "shipping.same_as_billing", operator: "equals", value: true, action: "hide" }],
    } as FieldConfig;
    expect(
      parse([toggle, shipLine], { shipping: { same_as_billing: true, address: { line1: "" } } }).success,
    ).toBe(true);
    expect(
      parse([toggle, shipLine], { shipping: { same_as_billing: false, address: { line1: "" } } }).success,
    ).toBe(false);
  });

  it("shouldShowField handles flat-keyed render values for nested triggers", () => {
    const field: FieldConfig = {
      id: "shipping.address.line1",
      type: "text",
      label: "Ship Line 1",
      conditional: [{ field: "shipping.same_as_billing", operator: "equals", value: true, action: "hide" }],
    } as FieldConfig;
    expect(shouldShowField(field, { "shipping.same_as_billing": true })).toBe(false);
    expect(shouldShowField(field, { "shipping.same_as_billing": false })).toBe(true);
  });

  it("enforces required via validation rule (not just field.required)", () => {
    const field: FieldConfig = {
      id: "name",
      type: "text",
      label: "Name",
      validation: [{ type: "required" }],
    } as FieldConfig;
    expect(parse([field], { name: "" }).success).toBe(false);
    expect(parse([field], { name: "Bob" }).success).toBe(true);
  });

  it("honors custom message on required rule", () => {
    const field: FieldConfig = {
      id: "name",
      type: "text",
      label: "Name",
      validation: [{ type: "required", message: "need it" }],
    } as FieldConfig;
    const result = parse([field], { name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("need it");
    }
  });

  it("required rule + email rule reports required (not invalid) when empty", () => {
    const field: FieldConfig = {
      id: "email",
      type: "email",
      label: "Email",
      validation: [{ type: "required" }, { type: "email" }],
    } as FieldConfig;
    const result = parse([field], { email: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Email is required");
    }
  });

  it("enforces array length via min rule", () => {
    const field: FieldConfig = {
      id: "tags",
      type: "multiselect",
      label: "Tags",
      validation: [{ type: "min", value: 2, message: "pick 2" }],
    } as FieldConfig;
    expect(parse([field], { tags: ["a"] }).success).toBe(false);
    expect(parse([field], { tags: ["a", "b"] }).success).toBe(true);
  });
});
