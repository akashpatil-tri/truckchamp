import React, { forwardRef } from "react";

import clsx from "clsx";

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  togglePosition?: "left" | "right";
}

/**
 * Reusable Toggle (Switch) component styled like iOS toggle
 *
 * @example
 * <Toggle
 *   id="recurring"
 *   checked={isEnabled}
 *   onChange={handleToggle}
 *   label="Your Recurring Days"
 *   description="Add the weekdays and time slots for your recurring job."
 * />
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      error,
      className = "",
      wrapperClassName = "",
      labelClassName = "",
      descriptionClassName = "",
      togglePosition = "right",
      // children,
      id,
      ...props
    },
    ref
  ) => {
    const content = (
      <div className={clsx("apple-toggle-wrap", wrapperClassName)}>
        <div
          className={clsx(
            "d-flex align-items-start",
            togglePosition === "right" ? "justify-content-between" : ""
          )}
        >
          {(label || description) && (
            <div className={togglePosition === "right" ? "me-3" : "ms-3"}>
              {label && (
                <div
                  className={clsx("offcanvas-body-title mb-1", labelClassName)}
                >
                  {label}
                </div>
              )}
              {description && (
                <p
                  className={clsx(
                    "text-muted small mb-0",
                    descriptionClassName
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
          <div className={togglePosition === "left" ? "me-auto" : ""}>
            <input
              ref={ref}
              type="checkbox"
              className={clsx("checkbox", className)}
              id={id}
              {...props}
            />
            <label htmlFor={id}></label>
          </div>
        </div>
        {error && <span className="text-danger text-sm mt-1">{error}</span>}
      </div>
    );

    return content;
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
