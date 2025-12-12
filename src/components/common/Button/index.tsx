// components/common/Button.tsx
import React, { type ReactNode } from "react";

import clsx from "clsx";

export interface ButtonProps {
  isLink?: boolean;
  href?:
    | string
    | {
        pathname: string;
        query: object;
      };
  className?: string;
  title?: string;
  icon?: ReactNode;
  isIconFirst?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  titleClassName?: string;
  type?: "submit" | "reset" | "button";
  variant?: "filled" | "outline" | "none";
  isDisabled?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  buttonRef?: React.LegacyRef<HTMLButtonElement>;
  id?: string;
  parentClassName?: string;
  style?: React.CSSProperties;
}

/**
 * Plain, tailwind-free Button component.
 * - 'variant' controls visual style.
 * - 'className' allows custom CSS to override the default look.
 */
export const Button = ({
  isLink = false,
  href,
  className = "",
  title,
  icon = false,
  isIconFirst = false,
  variant = "filled",
  onClick,
  isActive = false,
  titleClassName,
  type = "button",
  isDisabled,
  isLoading = false,
  children,
  buttonRef,
  id,
  parentClassName,
  style,
}: ButtonProps) => {
  // if you want to render a link, handle it here (we keep it simple)
  if (isLink && href) {
    // Returning null to avoid changing behaviour — replace with <Link> if needed.
    return null;
  }

  const classes = clsx(
    "btn",
    {
      "btn--filled": variant === "filled",
      "btn--outline": variant === "outline",
      "btn--none": variant === "none",
      "is-loading": isLoading,
      "is-disabled": isDisabled || isLoading,
    },
    className
  );

  return (
    <div
      className={clsx("btn-wrapper", parentClassName)}
      style={{ position: "relative" }}
    >
      <button
        id={id}
        ref={buttonRef}
        type={type}
        onClick={onClick}
        className={classes}
        style={style}
        disabled={isDisabled || isLoading}
        aria-disabled={isDisabled || isLoading}
      >
        {/* icon first */}
        {isIconFirst && icon && (
          <span className="btn__icon btn__icon--first">{icon}</span>
        )}

        {/* title if provided */}
        {title ? (
          <span className={clsx("btn__title", titleClassName)}>{title}</span>
        ) : null}

        {/* children fallback */}
        {!title && children}

        {/* icon last */}
        {!isIconFirst && icon && <span className="btn__icon">{icon}</span>}
      </button>

      {/* loading spinner / overlay */}
      {(isDisabled || isLoading) && (
        <div
          className="btn-overlay"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 8,
            pointerEvents: "none",
          }}
        />
      )}

      {isLoading && (
        <div
          className="btn-spinner"
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <span className="btn-spinner-dot" />
        </div>
      )}
    </div>
  );
};

export default Button;
