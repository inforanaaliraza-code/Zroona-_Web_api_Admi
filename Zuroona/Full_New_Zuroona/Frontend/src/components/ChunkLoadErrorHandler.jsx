"use client";

import { useEffect } from "react";

const CHUNK_RELOAD_KEY = "chunkErrorReloadAttempt";

/**
 * Handles ChunkLoadError - common when cached chunks are stale after rebuild/deploy.
 * Does a single hard refresh to fetch fresh chunks. Prevents infinite reload loop.
 */
export default function ChunkLoadErrorHandler() {
    useEffect(() => {
        const isChunkError = (msg, reason) => {
            const text = [msg, reason?.message].filter(Boolean).join(" ");
            return (
                text.includes("ChunkLoadError") ||
                text.includes("Loading chunk") ||
                text.includes("Failed to fetch dynamically imported module") ||
                reason?.name === "ChunkLoadError"
            );
        };

        const handleError = (event) => {
            const msg = event?.message || "";
            const reason = event?.reason;
            if (!isChunkError(msg, reason) || typeof window === "undefined") return;

            const alreadyReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY);
            if (alreadyReloaded === "1") {
                sessionStorage.removeItem(CHUNK_RELOAD_KEY);
                return;
            }

            sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
            window.location.reload();
        };

        const handleRejection = (event) => {
            if (!isChunkError("", event?.reason) || typeof window === "undefined") return;

            const alreadyReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY);
            if (alreadyReloaded === "1") {
                sessionStorage.removeItem(CHUNK_RELOAD_KEY);
                return;
            }

            sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
            window.location.reload();
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);

        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, []);

    return null;
}
