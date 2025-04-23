export const parseTitle = (title) => {
  return (title || '')
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
const isBase64 = (str) => {
  try {
    const base64String = str.split(',')[1] || str;
    return btoa(atob(base64String)) === base64String;
  } catch (err) {
    return false;
  }
};

export const parseInput = (input, index = -1, startIndex = -1, onlyText = false, onlyAttachments = false) => {
  if (onlyAttachments) {
    return parseAttachments(input);
  }
  
  if (onlyText) {
    return parseContent(input);
  }

  // Handle string input directly
  if (typeof input === 'string') {
    return onlyText ? input : <p>{input}</p>;
  }

  // Handle null/undefined
  if (!input) {
    return onlyText ? '' : <p></p>;
  }

  // For tracing table simple text display
  if (onlyText) {
    // If it's a messages array
    if (Array.isArray(input) && input.some(item => item.role)) {
      return parseMessagesArray(input);
    }
    
    // If it's an object with known input fields
    if (typeof input === 'object' && !Array.isArray(input)) {
      return parseInputObject(input);
    }
  }



  const isJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };
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
    if (processed === null) {
      return null;
    }
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
    } else if (Array.isArray(processed) && processed.length > 1) {
      return processed.map((item) => {
        if ((typeof item === 'object' && ('image' in item || 'image_url' in item))) {
          if (isBase64(item.image || item.image_url?.url)) {
            if (onlyText) {
              return '';
            }
            if (onlyAttachments) {
              return item.image || item.image_url?.url;
            }
            return (
              <img
                src={item.image || item.image_url?.url}
                alt="Generated Content"
                style={{ maxWidth: '100%', maxHeight: '450px' }}
              />
            );
          }
        }
        if (onlyAttachments) {
          return null;
        }
        if (item.text) {
          return item.text;
        }
        if (isJSON(item)) {
          return (
            <pre
              style={{
                padding: '10px',
                borderRadius: '5px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(JSON.parse(item), null, 2)}
            </pre>
          );
        }

        return <p>{(JSON.stringify(item) || '')?.replace(/\\n/g, '\n')}</p>;
      });
    }
    if (processed && typeof processed === 'object') {
      if ('image' in processed || 'image_url' in processed) {
        processed = processed.image || processed.image_url;
      }
    }
    // Check if the processed input is Base64 and render an image
    if (isBase64(processed)) {
      return <img src={processed} alt="Generated Content" style={{ maxWidth: '100%', maxHeight: '450px' }} />;
    }

    // If JSON, render as formatted JSON
    if (isJSON(processed)) {
      return (
        <pre
          style={{
            padding: '10px',
            borderRadius: '5px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {JSON.stringify(JSON.parse(processed), null, 2)}
        </pre>
      );
    }

    // If not Base64, return as a processed string
    return <p>{(JSON.stringify(processed) || '')?.replace(/\\n/g, '\n')}</p>;
  });
  
  if (onlyAttachments) {
    const jointArray = [];
    full_output.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((item2) => {
          jointArray.push(item2);
        });
      } else {
        jointArray.push(item);
      }
    });
    return jointArray;
  }

  return full_output.map((output, index) => (
    <div key={index} style={{ marginBottom: '10px' }}>
      {output}
    </div>
  ));
};

// Add these new helper functions
const parseMessagesArray = (messages) => {
  // Filter out system messages and get user/human messages
  const userMessages = messages.filter(item => 
    item.role !== 'system' && 
    (item.role === 'user' || item.role === 'human')
  );

  // Return the content of the last user message
  if (userMessages.length > 0) {
    const lastMessage = userMessages[userMessages.length - 1];
    return lastMessage.content || '';
  }

  // If no user messages, return the last non-system message
  const nonSystemMessages = messages.filter(item => item.role !== 'system');
  if (nonSystemMessages.length > 0) {
    const lastMessage = nonSystemMessages[nonSystemMessages.length - 1];
    return lastMessage.content || '';
  }

  return '';
};

const parseInputObject = (input) => {
  // Check for common input field names
  const inputFields = ['input_docs', 'input', 'contents', 'query', 'prompt'];
  
  for (const field of inputFields) {
    if (input[field] !== undefined) {
      // If the field is an array, parse it recursively
      if (Array.isArray(input[field])) {
        return parseMessagesArray(input[field]);
      }
      // If it's a string, return it directly
      if (typeof input[field] === 'string') {
        return input[field];
      }
      // If it's an object, stringify it
      return JSON.stringify(input[field]);
    }
  }

  // If no known fields found, return a cleaned up JSON string
  return JSON.stringify(input, null, 2)
    .replace(/[{}\[\]"]/g, '')
    .replace(/,\n/g, ' ')
    .replace(/^\s+/gm, '')
    .substring(0, 100) + (JSON.stringify(input).length > 100 ? '...' : '');
};

// Recursively search for base64 strings in any data structure
const findBase64Strings = (data) => {
  const results = [];
  
  const search = (item) => {
    if (!item) return;
    
    if (typeof item === 'string' && isBase64(item)) {
      results.push(item);
    } else if (Array.isArray(item)) {
      item.forEach(search);
    } else if (typeof item === 'object') {
      Object.values(item).forEach(search);
    }
  };
  
  search(data);
  return results;
};

// Parse context from any data structure
export const parseContext = (data) => {
  const systemMessages = [];
  
  const extractSystemContent = (item) => {
    if (!item) return;
    
    if (Array.isArray(item)) {
      item.forEach(extractSystemContent);
    } else if (typeof item === 'object') {
      if (item.role === 'system' && item.content) {
        systemMessages.push(item.content);
      } else {
        Object.values(item).forEach(extractSystemContent);
      }
    }
  };
  
  extractSystemContent(data);
  return systemMessages.length > 0 ? systemMessages.join(', ') : null;
};

// Parse attachments from any data structure
export const parseAttachments = (data) => {
  return findBase64Strings(data);
};

// Parse content excluding context and attachments
export const parseContent = (data, isOutput = false) => {
  const contents = [];
  
  const extractContent = (item) => {
    if (!item) return;
    
    // Skip if it's a base64 string
    if (typeof item === 'string') {
      if (!isBase64(item)) {
        contents.push(item);
      }
      return;
    }
    
    if (Array.isArray(item)) {
      item.forEach(extractContent);
      return;
    }
    
    if (typeof item === 'object') {
      // Skip system messages for input
      if (!isOutput && item.role === 'system') {
        return;
      }
      
      // Prioritize 'content' field if it exists
      if (item.content) {
        if (typeof item.content === 'string' && !isBase64(item.content)) {
          contents.push(item.content);
        }
        return;
      }
      
      // Recursively process other object values
      Object.entries(item).forEach(([key, value]) => {
        // Skip known attachment fields
        if (!['image', 'image_url', 'base64'].includes(key)) {
          extractContent(value);
        }
      });
    }
  };
  
  extractContent(data);
  
  if (contents.length > 0) {
    return contents.join(', ');
  }
  
  // Fallback: return stringified version without base64 and system messages
  return typeof data === 'string' 
    ? data 
    : JSON.stringify(data, (key, value) => {
        if (typeof value === 'string' && isBase64(value)) return '[BASE64]';
        if (value?.role === 'system') return undefined;
        return value;
      }, 2);
};
