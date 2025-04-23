/**
 * @fileoverview Time zone and date formatting utilities
 * Provides helper functions for handling time zone conversions and date formatting
 */

import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

/**
 * Formats a date string in a specific time zone
 * @function
 * @param {string|Date} dateString - The date to format (UTC)
 * @param {string} timeZone - The target time zone (e.g., 'America/New_York')
 * @returns {string} Formatted date string in the specified time zone
 * 
 * @description
 * This function:
 * - Converts a UTC date to the specified time zone
 * - Formats the date with month, day, year, time, and time zone
 * - Uses date-fns and date-fns-tz for reliable time zone handling
 * 
 * @example
 * // Format a date in New York time zone
 * formatInTimeZone('2024-03-20T15:30:00Z', 'America/New_York')
 * // Returns: "Mar 20, 2024 11:30 AM EDT"
 */
export const formatInTimeZone = (dateString, timeZone) => {
  const zonedDate = utcToZonedTime(dateString, timeZone); // Convert the date to the target timezone
  return format(zonedDate, 'MMM d, yyyy h:mm a zzz', { timeZone }); // Format the date string
};


