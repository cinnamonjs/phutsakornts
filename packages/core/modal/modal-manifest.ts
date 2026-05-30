"use client";

import type { ComponentType } from "react";
import type { z } from "zod";
import type { ModalProps, ModalSize } from "@/components/module/modal/registry";

export interface ManifestEntry<S extends z.ZodTypeAny = z.ZodTypeAny> {
  schema: S;
  size?: ModalSize;
  Component: ComponentType<ModalProps<S>>;
}

export const MODAL_MANIFEST: Record<string, ManifestEntry> = {};

export function getManifestSchemaKeys(name: string): string[] {
  const entry = MODAL_MANIFEST[name];
  if (!entry) return [];
  const shape = (entry.schema as unknown as { shape?: Record<string, unknown> })
    .shape;
  return shape ? Object.keys(shape) : [];
}

export interface ManifestSchemaParam {
  key: string;
  type: string;
  optional: boolean;
}

function zodTypeLabel(schema: unknown): { type: string; optional: boolean } {
  let optional = false;
  let current = schema as { _def?: { typeName?: string; innerType?: unknown; value?: unknown; values?: unknown[]; type?: unknown } };
  while (current?._def?.typeName === "ZodOptional" || current?._def?.typeName === "ZodDefault" || current?._def?.typeName === "ZodNullable") {
    if (current._def.typeName === "ZodOptional" || current._def.typeName === "ZodNullable") optional = true;
    current = current._def.innerType as typeof current;
  }
  const def = current?._def;
  switch (def?.typeName) {
    case "ZodString":
      return { type: "string", optional };
    case "ZodNumber":
      return { type: "number", optional };
    case "ZodBoolean":
      return { type: "boolean", optional };
    case "ZodLiteral":
      return { type: JSON.stringify(def.value), optional };
    case "ZodEnum":
      return { type: (def.values as string[]).join("|"), optional };
    case "ZodArray":
      return { type: `${zodTypeLabel(def.type).type}[]`, optional };
    default:
      return { type: "string", optional };
  }
}

export function getManifestSchemaParams(name: string): ManifestSchemaParam[] {
  const entry = MODAL_MANIFEST[name];
  if (!entry) return [];
  const shape = (entry.schema as unknown as { shape?: Record<string, unknown> })
    .shape;
  if (!shape) return [];
  return Object.entries(shape)
    .filter(([k]) => k !== "m")
    .map(([k, v]) => {
      const { type, optional } = zodTypeLabel(v);
      return { key: k, type, optional };
    });
}
