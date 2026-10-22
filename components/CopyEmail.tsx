"use client";

import { useState } from "react";
import { btn } from "@/components/ui";

type Labels = { copy: string; copied: string; selected: string };

export default function CopyEmail({ email, labels }: { email: string; labels: Labels }) {
  const [label, setLabel] = useState(labels.copy);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setLabel(labels.copied);
    } catch {
      const el = document.getElementById("email");
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setLabel(labels.selected);
    }
    setTimeout(() => setLabel(labels.copy), 1800);
  }

  return (
    <button className={`${btn} cursor-pointer`} type="button" onClick={copy}>
      {label}
    </button>
  );
}
