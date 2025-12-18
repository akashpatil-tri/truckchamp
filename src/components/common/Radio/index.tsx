import React, { forwardRef } from "react";

import clsx from "clsx";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  variant?: "rounded" | "square";
  error?: string;
  wrapperClassName?: string;
}

/**
 * Reusable Radio component
 *
 * @example
 * // Rounded variant
 * <Radio
 *   id="option1"
 *   name="option"
 *   value="1"
 *   label="Option 1"
 *   variant="rounded"
 * />
 *
 * @example
 * // Square variant with image
 * <Radio
 *   id="truck1"
 *   name="truck"
 *   value="tipper"
 *   variant="square"
 * >
 *   <img src="/truck.png" alt="Tipper Truck" />
 *   <p>Tipper Truck</p>
 * </Radio>
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      variant = "rounded",
      error,
      className = "",
      wrapperClassName = "",
      children,
      id,
      ...props
    },
    ref
  ) => {
    if (variant === "square") {
      return (
        <div className={clsx("radio-square-main", wrapperClassName)}>
          <div className="radio-square-wrap">
            <div className="form-group mb-0">
              <input
                ref={ref}
                type="radio"
                className={clsx("radio-st-sq", className)}
                id={id}
                {...props}
              />
              <label htmlFor={id} className="radio-square-label">
                {children}
              </label>
            </div>
          </div>
        </div>
      );
    }

    // Rounded variant
    return (
      <div className={clsx("radio-rounded-wrap", wrapperClassName)}>
        <div className="form-group mb-0">
          <input
            ref={ref}
            type="radio"
            className={clsx("radio", className)}
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

Radio.displayName = "Radio";

export default Radio;
