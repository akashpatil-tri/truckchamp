"use client";

import { useEffect, type ReactNode } from "react";

import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { useOffcanvasStore } from "@store/useOffcanvasStore";

import "./Offcanvas.css";

interface OffcanvasProps {
    id: string;
    title: string;
    description?: string;
    children: ReactNode;
    size?: "default" | "medium" | "large";
}

export default function Offcanvas({
    id,
    title,
    description,
    children,
    size = "default",
}: OffcanvasProps) {
    const { openOffcanvasId, closeOffcanvas } = useOffcanvasStore();
    const isOpen = openOffcanvasId === id;

    // Handle ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                closeOffcanvas();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, closeOffcanvas]);

    if (!isOpen) return null;

    const sizeClass = {
        default: "offcanvas-cm",
        medium: "offcanvas-cm offcanvas-med",
        large: "offcanvas-cm offcanvas-large",
    }[size];

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="offcanvas-backdrop fade show offcanvas-backdrop-custom"
                onClick={closeOffcanvas}
            />

            {/* Offcanvas */}
            <div
                className={`offcanvas offcanvas-end show ${sizeClass} offcanvas-panel-custom`}
                tabIndex={-1}
                id={id}
                aria-labelledby={`${id}Label`}
            >
                <div className="offcanvas-header-cm">
                    <div className="offcanvas-header">
                        <div>
                            <h5 className="offcanvas-title" id={`${id}Label`}>
                                {title}
                            </h5>
                            {description && <p className="offcanvas-tl-p">{description}</p>}
                        </div>
                        <button
                            type="button"
                            className="btn-close offcanvas-close-btn"
                            onClick={closeOffcanvas}
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
                {children}
            </div>
        </>,
        document.body
    );
}
