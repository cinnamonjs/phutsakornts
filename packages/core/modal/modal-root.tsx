"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MODAL_MANIFEST } from "./modal-manifest";
import { useModalClose } from "./use-modal";

export function ModalRoot() {
  const search = useSearchParams();
  const close = useModalClose();
  const name = search.get("m");
  const entry = name ? MODAL_MANIFEST[name] : null;

  const parsed = useMemo(() => {
    if (!entry) return null;
    const raw: Record<string, string> = {};
    for (const [k, v] of search.entries()) raw[k] = v;
    return entry.schema.safeParse(raw);
  }, [entry, search]);

  useEffect(() => {
    if (name && (!entry || (parsed && !parsed.success))) {
      close();
    }
  }, [name, entry, parsed, close]);

  if (!entry || !parsed?.success) return null;

  const data = parsed.data as Record<string, unknown>;
  const locked = Object.keys(data).filter(
    (k) => k !== "m" && data[k] !== undefined && data[k] !== null,
  );

  const Component = entry.Component;
  return <Component params={data} locked={locked} onClose={close} />;
}
