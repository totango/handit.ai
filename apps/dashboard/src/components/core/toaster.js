/**
 * Toaster
 * 
 * A client-side module that provides toast notification functionality using the sonner library.
 * Exports both the Toaster component for rendering toast notifications and the toast
 * function for triggering them. This module serves as a centralized interface for
 * displaying non-disruptive notifications to users.
 * 
 * @see https://sonner.emilkowal.ski/ for complete documentation of the sonner library
 */

'use client';

import { toast, Toaster } from 'sonner';

/**
 * Toast Function
 * 
 * A function for displaying toast notifications with various configurations.
 * Supports different types of toasts (success, error, loading, etc.) and
 * customizable options for duration, position, and styling.
 * 
 * @example
 * // Display a success toast
 * toast.success('Operation completed successfully');
 * 
 * // Display an error toast
 * toast.error('An error occurred');
 * 
 * // Display a custom toast
 * toast('Custom message', {
 *   duration: 5000,
 *   position: 'top-right'
 * });
 */
export { Toaster, toast };
