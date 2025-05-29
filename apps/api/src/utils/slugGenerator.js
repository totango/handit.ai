/**
 * Generates a URL-friendly slug from a given name
 * @param {string} name - The name to convert to a slug
 * @returns {string} The generated slug
 */
export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('') + Math.random().toString(36).substring(2, 4);
}; 