// GoogleTranslateWrapper.tsx
import type { ReactNode } from 'react';
import {  useEffect, useState } from 'react';
import { loadGoogleTranslateScript } from './useGoogleTranslate';

interface GoogleTranslateWrapperProps {
    children: ReactNode;
}

export const GoogleTranslateWrapper = ({ children }: GoogleTranslateWrapperProps) => {
    const [contentReady, setContentReady] = useState(false);

    useEffect(() => {
        // Wait for content to fully render first
        const renderTimer = setTimeout(() => {
            setContentReady(true);
            console.log('[GoogleTranslateWrapper] Content rendered, now loading translation...');

            // NOW load Google Translate after content is stable
            loadGoogleTranslateScript()
                .then(() => {
                    console.log('[GoogleTranslateWrapper] ✅ Script loaded');
                })
                .catch((error) => {
                    console.error('[GoogleTranslateWrapper] ❌ Error loading:', error);
                });
        }, 2000); // Content stable হতে দাও

        return () => clearTimeout(renderTimer);
    }, []);

    return (
        <>
            <div
                id="google_translate_element"
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    left: '10px',
                    background: 'yellow',
                    border: '2px solid red',
                    padding: '10px',
                    zIndex: 99999,
                    fontSize: '12px',
                    display: contentReady ? 'block' : 'none' // Hide until content ready
                }}
            >
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                    Google Translate Container
                </div>
            </div>
            {children}
        </>
    );
};