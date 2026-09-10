"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
};

export default function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Selecciona...",
  required = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, options.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      }

      if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault();
        onChange(options[focusedIndex].value);
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, focusedIndex, options, onChange]);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        id={id}
        value={value}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
      />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-12 w-full items-center justify-between rounded-xl border px-4 text-left text-[14px] transition-all"
        style={{
          borderColor: open ? "rgba(30,196,255,0.5)" : "rgba(255,255,255,0.1)",
          background: open ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
          color: selectedOption ? "#f2f3f5" : "rgba(242,243,245,0.35)",
          boxShadow: open ? "0 0 0 3px rgba(30,196,255,0.1)" : "none",
        }}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          style={{ color: "rgba(242,243,245,0.4)" }}
        />
      </button>

      <div
        className={`absolute left-0 right-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-xl border transition-all duration-200 ${
          open
            ? "scale-y-100 opacity-100"
            : "pointer-events-none scale-y-95 opacity-0"
        }`}
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          background: "#0d1017",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8)",
        }}
      >
        <ul role="listbox" className="max-h-[260px] overflow-y-auto py-1">
          {options.map((option, i) => {
            const selected = option.value === value;
            const focused = i === focusedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setFocusedIndex(i)}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-[14px] transition-colors"
                style={{
                  background: focused ? "rgba(255,255,255,0.06)" : "transparent",
                  color: focused ? "#1ec4ff" : "#f2f3f5",
                  fontWeight: selected ? 600 : 400,
                }}
              >
                <span>{option.label}</span>
                {selected && (
                  <Check
                    className="h-4 w-4"
                    style={{ color: "#1ec4ff" }}
                    strokeWidth={2.5}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
