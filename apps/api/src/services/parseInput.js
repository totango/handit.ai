export const parseInput = (input, index = -1, startIndex = -1, model = null) => {
  let processed_arr = [];

  if (Array.isArray(input)) {
    if (index >= 0) {
      processed_arr = [input[index]];
    } else if (startIndex >= 0) {
      processed_arr = input.slice(startIndex);
    } else {
      processed_arr = input;
    }
  } else {
    processed_arr = [input];
  }

  let full_output = processed_arr.map((processed) => {
    if (typeof processed === 'object') {
      if ('content' in processed) {
        processed = processed.content;
      } else if ('choices' in processed) {
        processed = processed.choices;
        if (Array.isArray(processed)) {
          processed = processed.map((choice) => {
            if (typeof choice === 'object' && 'message' in choice) {
              if (typeof choice.message === 'object' && 'content' in choice.message) {
                return choice.message.content;
              } else {
                return choice.message;
              }
            }
            return choice;
          });
        }
      }
    }

    if (Array.isArray(processed) && processed.length === 1) {
      processed = processed[0];
    }
    if (processed != null && typeof processed === 'object') {
      if ('image' in processed) {
        processed = processed.image;
      }
    }

    // If not Base64, return as a processed string
    return (JSON.stringify(processed) || '')?.replace(/\\n/g, '\n')
  });

  return full_output.join('\n');
};