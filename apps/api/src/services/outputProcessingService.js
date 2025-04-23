export const outputContainsError = (output) => {
  if (typeof output !== 'object' || output === null) return false;

  for (const key in output) {
    const value = output[key];

    if (key.toLowerCase() === 'status') {
      if (
        (typeof value === 'number' && value >= 300) ||
        (typeof value === 'string' && value.toLowerCase() === 'error')
      ) {
        return true;
      }
    } else if (key.toLowerCase() === 'error' || key.toLowerCase() === 'errors') {
      return true;
    }

    if (typeof value === 'object') {
      if (outputContainsError(value)) {
        return true;
      }
    }
  }

  return false;
};

export const detectErrorMessage = (output) => {
  if (typeof output !== 'object' || output === null) return '';

  for (const key in output) {
    const value = output[key];

    if (key.toLowerCase() === 'error' || key.toLowerCase() === 'errors') {
      return value;
    }

    if (typeof value === 'object') {
      const errorMessage = detectErrorMessage(value);
      if (errorMessage) {
        return errorMessage;
      }
    }
  }

  return '';
}
