// components/common/Button/index.tsx
import React, { type ReactNode } from "react";

import clsx from "clsx";
import Link from "next/link";

export type ButtonVariant = "filled" | "outline" | "none" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface BaseButtonProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDisabled?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  id?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export interface ButtonAsButton extends BaseButtonProps {
  as?: "button";
  type?: "submit" | "reset" | "button";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: never;
  target?: never;
  rel?: never;
  [key: string]: any;
}

export interface ButtonAsLink extends BaseButtonProps {
  as: "link";
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  type?: never;
  onClick?: never;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Reusable Button component that can render as a button or Next.js Link
 *
 * @example
 * // As a button
 * <Button variant="filled" onClick={handleClick}>Click me</Button>
 *
 * @example
 * // As a link
 * <Button as="link" href="/dashboard" variant="outline">Go to Dashboard</Button>
 *
 * @example
 * // With icon
 * <Button icon={<Icon name="plus" />} iconPosition="left">Add Item</Button>
 *
 * @example
 * // Loading state
 * <Button isLoading={isPending} type="submit">Submit</Button>
 */
export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      as = "button",
      className = "",
      title,
      icon,
      iconPosition = "right",
      variant = "filled",
      size = "md",
      isDisabled = false,
      isLoading = false,
      children,
      id,
      fullWidth = false,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const content = title || children;

    // Build CSS classes
    const buttonClasses = clsx(
      "btn",
      {
        // Variants
        "btn--filled": variant === "filled",
        "btn--outline": variant === "outline",
        "btn--ghost": variant === "ghost",
        "btn--link": variant === "link",
        "btn--none": variant === "none",

        // Sizes
        "btn--sm": size === "sm",
        "btn--md": size === "md",
        "btn--lg": size === "lg",

        // States
        "btn--loading": isLoading,
        "btn--disabled": isDisabled || isLoading,
        "btn--full-width": fullWidth,

        // Icon positioning
        "btn--icon-left": icon && iconPosition === "left",
        "btn--icon-right": icon && iconPosition === "right",
      },
      className
    );

    // Render button content
    const renderContent = () => (
      <>
        {icon && iconPosition === "left" && (
          <span className="btn__icon btn__icon--left">{icon}</span>
        )}

        {content && <span className="btn__content">{content}</span>}

        {icon && iconPosition === "right" && (
          <span className="btn__icon btn__icon--right">{icon}</span>
        )}

        {isLoading && (
          <span className="btn__spinner" aria-hidden="true">
            <span className="btn__spinner-dot" />
          </span>
        )}
      </>
    );

    // Render as Next.js Link
    if (as === "link") {
      const { href, target, rel } = props as ButtonAsLink;
      const linkRel = target === "_blank" ? "noopener noreferrer" : rel;

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          id={id}
          className={buttonClasses}
          target={target}
          rel={linkRel}
          aria-label={ariaLabel}
          aria-disabled={isDisabled || isLoading}
          onClick={(e) => {
            if (isDisabled || isLoading) {
              e.preventDefault();
            }
          }}
        >
          {renderContent()}
        </Link>
      );
    }

    // Render as button
    const { type = "button", onClick, ...restProps } = props as ButtonAsButton;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        id={id}
        type={type}
        onClick={onClick}
        className={buttonClasses}
        disabled={isDisabled || isLoading}
        aria-label={ariaLabel}
        aria-disabled={isDisabled || isLoading}
        aria-busy={isLoading}
        {...restProps}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
