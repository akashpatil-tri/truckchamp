"use client";

import { type ReactNode } from "react";

import { useOffcanvasStore } from "@store/useOffcanvasStore";

interface OffcanvasTriggerProps {
  targetId: string;
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
}

export default function OffcanvasTrigger({
  targetId,
  children,
  className = "",
  as = "button",
}: OffcanvasTriggerProps) {
  const { openOffcanvas } = useOffcanvasStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openOffcanvas(targetId);
  };

  if (as === "a") {
    return (
      <a href="#" className={className} onClick={handleClick} role="button">
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
