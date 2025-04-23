/**
 * PDF Viewer Component
 * 
 * A dynamically loaded PDF viewer component that integrates with @react-pdf/renderer.
 * This component is loaded only on the client side to avoid SSR-related issues
 * with PDF rendering. It provides a consistent interface for displaying PDF
 * documents within the application.
 */

'use client';

import dynamic from 'next/dynamic';

/**
 * PDFViewer Component
 * 
 * A dynamically imported PDF viewer that loads the @react-pdf/renderer's PDFViewer
 * component only on the client side. This approach prevents SSR-related issues
 * while maintaining the ability to render PDF documents in the browser.
 * 
 * @type {React.ComponentType}
 * @property {Object} props - All props are forwarded to the underlying PDFViewer component
 * @see https://react-pdf.org/components for available props and usage
 */
export const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((module) => module.PDFViewer), {
  ssr: false, // Disable server-side rendering for this component
});
