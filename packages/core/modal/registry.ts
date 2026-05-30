import type { z } from "zod";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps<S extends z.ZodTypeAny = z.ZodTypeAny> {
  params: z.infer<S>;
  locked: string[];
  onClose: () => void;
}
