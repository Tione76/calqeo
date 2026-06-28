"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  clampNumber,
  formatNumericInputValue,
  isPartialNumericInput,
  parseNumber,
  sanitizeNumericInput,
} from "@/lib/utils/format";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  suffix?: string;
  error?: string;
}

interface FieldShellProps {
  inputId: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function FieldShell({
  inputId,
  label,
  hint,
  error,
  children,
}: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="relative">{children}</div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function inputClassName(
  suffix?: string,
  error?: string,
  className = ""
): string {
  return `w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
    suffix ? "pr-12" : ""
  } ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""} ${className}`;
}

function toNumericValue(
  value: InputHTMLAttributes<HTMLInputElement>["value"]
): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function createChangeEvent(value: string): ChangeEvent<HTMLInputElement> {
  return {
    target: { value },
    currentTarget: { value },
  } as ChangeEvent<HTMLInputElement>;
}

interface NumberInputControlProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  inputId: string;
  suffix?: string;
  error?: string;
  value: InputHTMLAttributes<HTMLInputElement>["value"];
}

function NumberInputControl({
  inputId,
  suffix,
  error,
  value,
  onChange,
  onFocus,
  onBlur,
  min,
  max,
  className = "",
  ...props
}: NumberInputControlProps) {
  const numericValue = toNumericValue(value);
  const [displayValue, setDisplayValue] = useState(() =>
    formatNumericInputValue(numericValue)
  );
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDisplayValue(formatNumericInputValue(numericValue));
    }
  }, [numericValue, focused]);

  const emitChange = (raw: string) => {
    onChange?.(createChangeEvent(raw));
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (numericValue === 0) {
      setDisplayValue("");
    }
    onFocus?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!isPartialNumericInput(raw)) return;

    const sanitized = sanitizeNumericInput(raw);
    setDisplayValue(sanitized);
    emitChange(sanitized);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);

    const parsed = clampNumber(
      displayValue === "" || displayValue === "-"
        ? 0
        : parseNumber(displayValue),
      min !== undefined ? Number(min) : undefined,
      max !== undefined ? Number(max) : undefined
    );

    const normalized = formatNumericInputValue(parsed);
    setDisplayValue(normalized);

    if (parsed !== numericValue) {
      emitChange(normalized);
    }

    onBlur?.(event);
  };

  return (
    <>
      <input
        {...props}
        id={inputId}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className={inputClassName(suffix, error, className)}
        value={displayValue}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          {suffix}
        </span>
      )}
    </>
  );
}

export function Input({
  label,
  hint,
  suffix,
  error,
  id,
  className = "",
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  min,
  max,
  ...props
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  if (type === "number") {
    return (
      <FieldShell
        inputId={inputId}
        label={label}
        hint={hint}
        error={error}
      >
        <NumberInputControl
          {...props}
          inputId={inputId}
          suffix={suffix}
          error={error}
          className={className}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          min={min}
          max={max}
        />
      </FieldShell>
    );
  }

  return (
    <FieldShell
      inputId={inputId}
      label={label}
      hint={hint}
      error={error}
    >
      <>
        <input
          id={inputId}
          type={type}
          className={inputClassName(suffix, error, className)}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          min={min}
          max={max}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </>
    </FieldShell>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  options: { value: string | number; label: string }[];
}

export function Select({
  label,
  hint,
  options,
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
