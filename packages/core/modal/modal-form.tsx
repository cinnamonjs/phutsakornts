"use client";

import { useCallback, useMemo, useRef } from "react";
import { FormBuilder } from "@/components/module/form-builder";
import type { FormConfig } from "@/components/module/form-builder/types";
import { useDraftStore } from "@/components/module/modal/draft-store";
import { Button } from "@/components/ui/button";
type FormMethods = {
  trigger: (name?: string | string[]) => Promise<boolean>;
  getValues: () => Record<string, unknown>;
  reset: (values?: Record<string, unknown>) => void;
};

interface ModalFormProps {
  draftKey: string;
  config: FormConfig;
  initialValues?: Record<string, unknown>;
  lockedFields?: string[];
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  loading?: boolean;
}

export function ModalForm({
  draftKey,
  config,
  initialValues,
  lockedFields,
  onSubmit,
  loading,
}: ModalFormProps) {
  const setDraft = useDraftStore((s) => s.set);
  const clearDraft = useDraftStore((s) => s.clear);
  const saved = useDraftStore((s) => s.drafts[draftKey]);
  const formRef = useRef<FormMethods | null>(null);

  const lockedSet = useMemo(() => new Set(lockedFields ?? []), [lockedFields]);

  const seed = useMemo(
    () => ({ ...initialValues, ...saved }),
    [initialValues, saved],
  );

  const effectiveConfig = useMemo<FormConfig>(() => {
    const base = {
      ...config,
      submission: { ...config.submission, enabled: false },
    };
    if (!lockedSet.size) return base;
    return {
      ...base,
      sections: base.sections.map((sec) => ({
        ...sec,
        fields: sec.fields.map((f) =>
          lockedSet.has(f.id) ? { ...f, disabled: true, readonly: true } : f,
        ),
      })),
    };
  }, [config, lockedSet]);

  const handleChange = useCallback(
    (_fieldId: string, _value: unknown, all: Record<string, unknown>) => {
      if (lockedSet.size === 0) {
        setDraft(draftKey, all);
        return;
      }
      const filtered: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(all)) {
        if (!lockedSet.has(k)) filtered[k] = v;
      }
      setDraft(draftKey, filtered);
    },
    [draftKey, setDraft, lockedSet],
  );

  const handleFooterSubmit = useCallback(async () => {
    if (!formRef.current) return;
    const valid = await formRef.current.trigger();
    if (!valid) return;
    const data = formRef.current.getValues();
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== ""),
    );
    await onSubmit(filtered);
    clearDraft(draftKey);
  }, [draftKey, onSubmit, clearDraft]);

  const handleReset = useCallback(() => {
    clearDraft(draftKey);
    formRef.current?.reset(initialValues ?? {});
  }, [draftKey, clearDraft, initialValues]);

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-1 -m-1">
        <FormBuilder
          config={effectiveConfig}
          initialValues={seed}
          onFieldChange={handleChange}
          onFormReady={(methods) => {
            formRef.current = methods;
          }}
          loading={loading}
        />
      </div>
      <div className="flex-none pt-4 mt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </Button>
        <Button
          onClick={handleFooterSubmit}
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Saving..." : (config.submission?.submitText ?? "Save")}
        </Button>
      </div>
    </div>
  );
}
