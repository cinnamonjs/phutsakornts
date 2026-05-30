"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getManifestSchemaKeys, MODAL_MANIFEST } from "./modal-manifest";

type Extras = Record<string, string | number | boolean | null | undefined>;

function buildParams(current: URLSearchParams, patch: Record<string, string | null>): URLSearchParams {
  const next = new URLSearchParams(current);
  for (const [k, v] of Object.entries(patch)) {
    if (v == null) next.delete(k);
    else next.set(k, v);
  }
  return next;
}

function useStableSearch() {
  const search = useSearchParams();
  const ref = useRef(search);
  useEffect(() => {
    ref.current = search;
  }, [search]);
  return ref;
}

export function useModalOpen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useStableSearch();

  return useCallback(
    (name: string, extras?: Extras) => {
      const entry = MODAL_MANIFEST[name];
      if (!entry) return;
      const patch: Record<string, string | null> = { m: String(name) };
      const candidate: Record<string, string> = { m: String(name) };
      if (extras) {
        for (const [k, v] of Object.entries(extras)) {
          if (v == null) {
            patch[k] = null;
          } else {
            const s = String(v);
            patch[k] = s;
            candidate[k] = s;
          }
        }
      }
      if (!entry.schema.safeParse(candidate).success) return;
      const next = buildParams(searchRef.current, patch);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchRef],
  );
}

export function useModalClose() {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useStableSearch();

  return useCallback(() => {
    const search = searchRef.current;
    const current = search.get("m");
    if (!current) return;
    const keys = new Set(["m", ...getManifestSchemaKeys(current)]);
    const patch: Record<string, string | null> = {};
    for (const k of keys) patch[k] = null;
    const next = buildParams(search, patch);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchRef]);
}

export function useModal() {
  const search = useSearchParams();
  const open = useModalOpen();
  const close = useModalClose();
  return { name: search.get("m"), open, close };
}
