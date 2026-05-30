"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { z } from "zod";

export function useModalParams<S extends z.ZodTypeAny>(
  schema: S,
): z.infer<S> | null {
  const search = useSearchParams();
  return useMemo(() => {
    const obj: Record<string, string> = {};
    for (const [k, v] of search.entries()) obj[k] = v;
    const parsed = schema.safeParse(obj);
    return parsed.success ? parsed.data : null;
  }, [search, schema]);
}
