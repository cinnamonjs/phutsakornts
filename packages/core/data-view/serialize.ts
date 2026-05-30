import type { FilterState, ParamValue } from "@/components/module/data-view/types";

export type Params = Record<string, ParamValue | undefined | null>;

export function defaultSerializeParams(state: FilterState): Params {
  const out: Params = {};

  if (state.search) out["q"] = state.search;

  for (const [key, active] of Object.entries(state.filters)) {
    if (active.value === undefined || active.value === "") continue;
    const value = Array.isArray(active.value) ? active.value.join(",") : active.value;
    if (value === "") continue;
    out[`filter[${key}][${active.op}]`] = value;
  }

  if (state.sort) {
    out.sort = `${state.sort.key}:${state.sort.direction}`;
  }

  return out;
}
