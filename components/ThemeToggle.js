// components/ThemeToggle.js
'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({
    className = "p-2 rounded-lg bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#222222] transition-colors",
    duration = 400,
    ...props
}){
    const [isDark, setIsDark] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const buttonRef = useRef(null);

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

        if (shouldBeDark) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
        }

        setIsDark(shouldBeDark);
        setIsMounted(true);
    }, []);

    // Watch for theme changes from other sources
    useEffect(() => {
        if (!isMounted) return;

        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, [isMounted]);

    const toggleTheme = useCallback(() => {
        const button = buttonRef.current;
        if (!button) return;

        // Remove stable class to disable transitions during animation
        document.documentElement.classList.remove("theme-stable");

        const { top, left, width, height } = button.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const maxRadius = Math.hypot(
            Math.max(x, viewportWidth - x),
            Math.max(y, viewportHeight - y)
        );

        const applyTheme = () => {
            const newTheme = !isDark;
            setIsDark(newTheme);

            if (newTheme) {
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.add("light");
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        };

        if (typeof document.startViewTransition !== "function") {
            applyTheme();
            // Re-enable transitions
            setTimeout(() => {
                document.documentElement.classList.add("theme-stable");
            }, 100);
            return;
        }

        const transition = document.startViewTransition(() => {
            flushSync(applyTheme);
        });

        const ready = transition?.ready;
        if (ready && typeof ready.then === "function") {
            ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`,
                        ],
                    },
                    {
                        duration,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );

                // Re-enable transitions after animation completes
                setTimeout(() => {
                    document.documentElement.classList.add("theme-stable");
                }, duration + 100);
            });
        }
    }, [isDark, duration]);

    // Prevent hydration mismatch
    if (!isMounted) {
        return (
            <button type="button" className={className} {...props}>
                <div className="w-5 h-5" />
                <span className="sr-only">Toggle theme</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            ref={buttonRef}
            onClick={toggleTheme}
            className={className}
            {...props}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};