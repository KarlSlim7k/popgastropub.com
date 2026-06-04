"use client";

import { useState, forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  errorClassName?: string;
  iconClassName?: string;
  wrapperClassName?: string;
  rightAdornment?: ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { errorClassName, iconClassName, wrapperClassName, rightAdornment, className = "", ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${wrapperClassName ?? ""}`}>
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={className}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
        className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:text-white ${iconClassName ?? ""}`}
        tabIndex={-1}
      >
        {visible ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
      {rightAdornment}
    </div>
  );
});

export default PasswordInput;
