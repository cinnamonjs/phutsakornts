import { useState, useCallback } from "react"

interface RangeSelection {
  start: string | null;
  end: string | null;
  startIdx: number | null;
  endIdx: number | null;
}

export function useRangeSelection(data: any[], xKey: string = "x") {
  const [range, setRange] = useState<RangeSelection>({ start: null, end: null, startIdx: null, endIdx: null });
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback((e: any) => {
    if (e?.activeLabel) {
      const idx = data.findIndex(d => d[xKey] === e.activeLabel);
      setRange({ start: e.activeLabel, end: null, startIdx: idx, endIdx: null });
      setIsDragging(true);
    }
  }, [data, xKey]);

  const onMouseMove = useCallback((e: any) => {
    if (isDragging && e?.activeLabel) {
      const idx = data.findIndex(d => d[xKey] === e.activeLabel);
      setRange(prev => ({ ...prev, end: e.activeLabel, endIdx: idx }));
    }
  }, [isDragging, data, xKey]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null, startIdx: null, endIdx: null });
  }, []);

  return { range, isDragging, onMouseDown, onMouseMove, onMouseUp, clearRange };
}