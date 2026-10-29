"use client";
import React, { useState, useCallback } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const removeLetters = (value: string) => {
  return value.replace(/\D/g, "");
};

export const formatPhoneInput = (rawValue: string) => {
  let value = removeLetters(rawValue);
  let result = "";

  if (!value) {
    return "";
  }

  if (value[0] !== "8" && value[0] !== "7") {
    value = `7${value}`;
  }

  // Convert 8 to 7 for consistency
  if (value[0] === "8") {
    value = `7${value.substring(1)}`;
  }

  result = `+7`;

  if (value.length > 1) {
    result = `${result} (${value.substring(1, 4)}`;
  }

  if (value.length > 4) {
    result = `${result}) ${value.substring(4, 7)}`;
  }

  if (value.length > 7) {
    result = `${result}-${value.substring(7, 9)}`;
  }

  if (value.length > 9) {
    result = `${result}-${value.substring(9, 11)}`;
  }

  return result;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() =>
      value ? formatPhoneInput(String(value)) : "",
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formatted = formatPhoneInput(inputValue);

        setDisplayValue(formatted);

        if (onChange) {
          const cleanValue = removeLetters(formatted);
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: cleanValue,
              name: props.name || "",
            },
          };
          onChange(syntheticEvent);
        }
      },
      [onChange, props.name],
    );

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={props.placeholder || "+7 (___) ___-__-__"}
        className={cn(className)}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";
