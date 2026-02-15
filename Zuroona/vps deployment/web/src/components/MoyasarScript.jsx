"use client";

import Script from "next/script";

export default function MoyasarScript() {
    return (
        <Script
            src="httpss://cdn.moyasar.com/mpf/1.15.0/moyasar.js"
            strategy="lazyOnload"
            onLoad={() => {
                if (typeof window !== 'undefined') {
                    window.MoyasarReady = true;
                    console.log('[MOYASAR] Script loaded successfully');
                    if (window.Moyasar) {
                        console.log('[MOYASAR] Moyasar object available');
                    } else {
                        console.warn('[MOYASAR] Script loaded but Moyasar object not found');
                    }
                }
            }}
            onError={() => {
                console.error('[MOYASAR] Failed to load script');
                if (typeof window !== 'undefined') {
                    window.MoyasarLoadError = true;
                }
            }}
        />
    );
}
