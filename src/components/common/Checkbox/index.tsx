import React, { forwardRef } from "react";

import clsx from "clsx";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

/**
 * Reusable Checkbox component
 *
 * @example
 * <Checkbox
 *   id="option1"
 *   name="option1"
 *   label="10 mm"
 *   value="10mm"
 * />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      className = "",
      wrapperClassName = "",
      children,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx("checkbox-square-wrap", wrapperClassName)}>
        <div className="form-group mb-0">
          <input
            ref={ref}
            type="checkbox"
            className={clsx("checkbox", className)}
            id={id}
            {...props}
          />
          <label htmlFor={id} className="mb-0">
            {label || children}
          </label>
          {error && <span className="text-danger text-sm mt-1">{error}</span>}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
