"use client";

import React, { useEffect, type ReactNode } from "react";

import clsx from "clsx";

import { useOffcanvasStore } from "@store/useOffcanvasStore";

export interface OffcanvasProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Offcanvas/Drawer component
 *
 * @example
 * <Offcanvas
 *   id="jobForm"
 *   title="Create New Job"
 *   description="Fill in the details to create a job"
 * >
 *   <JobForm />
 * </Offcanvas>
 */
export default function Offcanvas({
  id,
  title,
  description,
  children,
  className = "",
}: OffcanvasProps) {
  const { openOffcanvasId } = useOffcanvasStore();
  const isOpen = openOffcanvasId === id;

  const { closeOffcanvas } = useOffcanvasStore();

  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;

    if (isOpen) {
      element.classList.add("show");
      document.body.classList.add("offcanvas-backdrop");
      document.body.style.overflow = "hidden";
    } else {
      element.classList.remove("show");
      document.body.classList.remove("offcanvas-backdrop");
      document.body.style.overflow = "";
    }
  }, [isOpen, id]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeOffcanvas();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleBackdropClick}
        />
      )}
      <div
        className={clsx("offcanvas offcanvas-end offcanvas-cm", className)}
        tabIndex={-1}
        id={id}
        aria-labelledby={`${id}Label`}
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id={`${id}Label`}>
              {title}
            </div>
            {description && <p className="offcanvas-tl-p">{description}</p>}
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
