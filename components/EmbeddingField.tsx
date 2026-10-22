"use client";

import { useEffect, useRef } from "react";
import { startEmbeddingField, type FieldOptions } from "@/lib/embedding-field";

// Drop this as the first child of an element with class "has-field".
// It draws behind the content and reacts to the pointer over its parent.
export default function EmbeddingField(props: FieldOptions) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { density, k, seed, label } = props;

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    return startEmbeddingField(canvas, host, { density, k, seed, label });
  }, [density, k, seed, label]);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
