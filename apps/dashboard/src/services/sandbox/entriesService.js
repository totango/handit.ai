/**
 * @fileoverview Entries Service for Sandbox Environment
 * Provides mock data generation and management for monitoring entries in sandbox mode
 */

/**
 * Process entries sandbox request and return appropriate mock data
 * @param {Object} args - Request arguments
 * @param {string} args.url - Request URL
 * @param {string} args.method - HTTP method
 * @param {Object} [args.body] - Request body for PUT requests
 * @returns {Promise<Object>} Mock entries data
 * 
 * @description
 * Handles entries-related requests in sandbox mode:
 * - PUT /entries/{id}: Verifies an entry
 * - GET /monitoring/list/me/{modelId}: Fetches monitoring entries for a model
 * - GET /monitoring/entry/{entryId}: Fetches a specific entry
 */
export const processEntriesSandboxRequest = async (args) => {
  const { url, method, body } = args;
  if (method === 'PUT') {
    const entryId = parseInt(url.split('/').pop());
    const modelId = Math.floor(entryId / 1000);
    return { data: verifyEntry(modelId, entryId, body) };
  }
  if (url.includes('monitoring/list/me/')) {
    const modelId = url.split('/').pop();
    return { data: fetchMonitoringEntries(modelId) };
  } else if (url.includes('monitoring/entry/')) {
    const entryId = url.split('/').pop();
    return { data: getEntryById(parseInt(entryId)) };
  }
}

/**
 * Get a specific entry by ID
 * @param {number} entryId - ID of the entry to retrieve
 * @returns {Object} The requested entry
 * 
 * @description
 * Retrieves a specific entry from the session storage based on its ID.
 * Calculates the model ID from the entry ID.
 */
function getEntryById(entryId) {
  const modelId = Math.floor(entryId / 1000);
  const entries = getSessionEntriesWithUnverified(modelId);
  return entries.find(entry => entry.id === entryId);
}

/**
 * Initialize session entries for a model
 * @param {number} modelId - ID of the model
 * @param {number} [initialCount=5] - Number of initial entries to generate
 * @returns {Array<Object>} Array of initialized entries
 * 
 * @description
 * Initializes or retrieves entries from session storage for a specific model.
 * Generates new entries if none exist.
 */
function initializeSessionEntries(modelId, initialCount = 5) {
  let entries = JSON.parse(sessionStorage.getItem(`monitoringEntries-${modelId}`));

  if (!entries || entries.length === 0) {
    entries = generateEmailEntries(modelId, initialCount);
    sessionStorage.setItem(`monitoringEntries-${modelId}`, JSON.stringify(entries));
  }

  return entries;
}

/**
 * Get entries from session storage with unverified entries
 * @param {number} modelId - ID of the model
 * @returns {Array<Object>} Array of entries including unverified ones
 * 
 * @description
 * Retrieves entries from session storage and ensures there are unverified entries.
 * Initializes entries if they don't exist.
 */
function getSessionEntriesWithUnverified(modelId) {
  let entries = initializeSessionEntries(modelId);

  // Ensure there are unverified entries, add more if needed
  const unverifiedEntries = entries.filter(entry => !entry.processed);


  return entries;
}

/**
 * Verify an entry
 * @param {number} modelId - ID of the model
 * @param {number} entryId - ID of the entry to verify
 * @param {Object} verificationData - Verification data
 * @returns {Object} The verified entry
 * 
 * @description
 * Updates an entry with verification data and marks it as processed.
 * Saves the updated entries back to session storage.
 */
function verifyEntry(modelId, entryId, verificationData) {
  let entries = getSessionEntriesWithUnverified(modelId);
  // Find and update the specific entry
  const entryIndex = entries.findIndex(entry => entry.id == entryId);
  if (entryIndex !== -1) {
    const entry = entries[entryIndex];

    entry.isCorrect = verificationData.actual.correct
    entry.processed = true;
    entry.actual = {
      relevance: verificationData.actual.relevance,
      coherence: verificationData.actual.coherence,
      correct: verificationData.actual.correct
    };
    entry.updatedAt = new Date().toISOString();
    // Save back to session storage
    sessionStorage.setItem(`monitoringEntries-${modelId}`, JSON.stringify(entries));
  }

  return entries[entryIndex];
}

/**
 * Fetch monitoring entries for a model
 * @param {number} modelId - ID of the model
 * @returns {Object} Monitoring entries with statistics
 * 
 * @description
 * Retrieves all entries for a model and calculates verification statistics:
 * - Number of verified/unverified entries
 * - Number of correct/incorrect entries
 */
function fetchMonitoringEntries(modelId) {
  const entries = getSessionEntriesWithUnverified(modelId);

  const amountVerified = entries.filter(entry => entry.processed).length;
  const amountUnverified = entries.length - amountVerified;
  const correct = entries.filter(entry => entry.processed && entry.isCorrect).length;
  const incorrect = amountVerified - correct;

  return {
    amountVerified,
    amountUnverified,
    correct,
    incorrect,
    entries
  };
}

/**
 * Generate a single email entry
 * @param {number} entryId - ID for the new entry
 * @param {number} modelId - ID of the model
 * @returns {Object} Generated email entry
 * 
 * @description
 * Creates a mock email generation entry with:
 * - Dynamic input prompt based on topic, tone, and audience
 * - Generated email content
 * - Verification status and metrics
 */
function generateEmailEntry(entryId, modelId) {
  const isCorrect = Math.random() > 0.5;

  // Define random parameters for email generation
  const topics = [
    "Invoice Reminder", "Meeting Schedule", "Promotional Offer",
    "Password Reset", "Project Update", "Urgent Account Verification",
    "Vacation Approval", "Newsletter", "Purchase Confirmation",
    "Technical Support", "Job Application", "Subscription Renewal",
    "Event Invitation", "Service Downtime", "Follow-up"
  ];

  const tones = [
    "formal", "casual", "enthusiastic", "polite", "urgent", "professional", "friendly"
  ];

  const audiences = [
    "customer", "team member", "manager", "job applicant",
    "event attendee", "newsletter subscriber", "technical support agent"
  ];

  // Randomly select parameters for this email generation entry
  const selectedTopic = topics[entryId % topics.length];
  const selectedTone = tones[Math.floor(Math.random() * tones.length)];
  const selectedAudience = audiences[Math.floor(Math.random() * audiences.length)];

  // Construct a dynamic input prompt based on the parameters
  const inputPrompt = `
  Create an email with the following parameters:
  - Topic: ${selectedTopic}
  - Tone: ${selectedTone}
  - Target Audience: ${selectedAudience}
  
  The email should clearly convey the intended message and be engaging for the recipient.`;

  // Simulate the email content based on the parameters
  const generatedEmail = `
  Subject: ${selectedTopic}
  
  Dear ${selectedAudience.charAt(0).toUpperCase() + selectedAudience.slice(1)},
  
  ${selectedTone === "urgent" ? "Please note, this is an urgent matter." : ""}
  ${selectedTone === "enthusiastic" ? "We're thrilled to reach out to you!" : ""}
  
  ${selectedTone === "formal" ? "I am writing to inform you" : "Just a quick note to let you know"} that ${selectedTopic === "Invoice Reminder" ? "your recent invoice is due for payment."
      : selectedTopic === "Meeting Schedule" ? "our upcoming meeting is scheduled for tomorrow at 10 AM."
        : selectedTopic === "Promotional Offer" ? "we're offering an exclusive discount on our products this weekend!"
          : selectedTopic === "Password Reset" ? "we've received a request to reset your account password."
            : selectedTopic === "Project Update" ? "we're making great progress on the project."
              : selectedTopic === "Urgent Account Verification" ? "your account requires immediate verification."
                : selectedTopic === "Vacation Approval" ? "your vacation request has been approved."
                  : selectedTopic === "Newsletter" ? "here’s the latest edition of our newsletter."
                    : selectedTopic === "Purchase Confirmation" ? "we've received your purchase and it's being processed."
                      : selectedTopic === "Technical Support" ? "we're here to help you with any issues."
                        : selectedTopic === "Job Application" ? "thank you for applying to our position."
                          : selectedTopic === "Subscription Renewal" ? "your subscription is due for renewal."
                            : selectedTopic === "Event Invitation" ? "you are invited to our exclusive event."
                              : selectedTopic === "Service Downtime" ? "our services will be undergoing maintenance."
                                : "we wanted to follow up on our last interaction."
    }
  
  ${selectedTone === "friendly" ? "Feel free to reach out with any questions!" : "If you have any concerns, please let us know."}
  
  Best regards,
  The Team`;

  return {
    id: modelId * 1000 + entryId,
    input: inputPrompt.trim(),
    output: generatedEmail.trim(),
    parameters: {
      topic: selectedTopic,
      tone: selectedTone,
      audience: selectedAudience
    },
    isCorrect,
    processed: Math.random() > 0.5,
    metricProcessed: Math.random() > 0.5,
    actual: {
      relevance: Math.floor(Math.random() * 10) + 1,
      coherence: Math.floor(Math.random() * 10) + 1,
      correct: isCorrect
    },
    predicted: [isCorrect ? "Correct" : "Needs Review"],
    deletedAt: null,
    modelId: modelId,
    createdAt: new Date(new Date().setDate(new Date().getDate() - entryId)).toISOString(),
    updatedAt: new Date().toISOString(),
    model_id: modelId
  };
}

/**
 * Generate multiple email entries
 * @param {number} modelId - ID of the model
 * @param {number} [numberOfEntries=5] - Number of entries to generate
 * @returns {Array<Object>} Array of generated email entries
 * 
 * @description
 * Creates a specified number of email entries for a model.
 * Each entry has unique content and parameters.
 */
function generateEmailEntries(modelId, numberOfEntries = 5) {
  const entries = [];
  for (let i = 1; i <= numberOfEntries; i++) {
    const entry = generateEmailEntry(i, modelId);
    entries.push(entry);
  }
  return entries;
}

/**
 * Generate a single monitoring entry
 * @param {number} entryId - ID for the new entry
 * @param {number} modelId - ID of the model
 * @returns {Object} Generated monitoring entry
 * 
 * @description
 * Creates a mock monitoring entry for email classification with:
 * - Sample email content
 * - Classification result
 * - Verification status and metrics
 */
function generateMonitoringEntry(entryId, modelId) {
  const isCorrect = Math.random() > 0.5;

  // Expanded content examples for an email classification application
  const contentExamples = [
    "Subject: Invoice Overdue\nBody: Dear Customer, your payment for invoice #12345 is overdue. Please settle it by the end of the month.",
    "Subject: Meeting Reminder\nBody: Just a reminder that we have a meeting scheduled for tomorrow at 10 AM in the main conference room.",
    "Subject: Promotional Offer\nBody: Get 50% off on all our products this weekend only! Don’t miss out on these amazing deals.",
    "Subject: Password Reset\nBody: Click the link below to reset your password. This link will expire in 24 hours.",
    "Subject: Project Update\nBody: Here’s the latest update on the project status. We’re on track to meet the next deadline.",
    "Subject: Urgent: Account Verification Needed\nBody: Please verify your account to continue using our services. Failure to do so will result in account suspension.",
    "Subject: Vacation Request\nBody: I would like to request time off from June 10th to June 15th. Let me know if there are any issues.",
    "Subject: Newsletter - April Edition\nBody: Welcome to the April edition of our newsletter! This month, we’re focusing on…",
    "Subject: Thank You for Your Purchase\nBody: We appreciate your recent purchase with us. Your order #78901 will be shipped soon.",
    "Subject: Technical Support Request\nBody: I’m experiencing issues with logging into my account. Can you assist?",
    "Subject: Job Application\nBody: I am submitting my application for the Software Engineer role. Attached is my resume and cover letter.",
    "Subject: Subscription Renewal Notice\nBody: Your subscription is due for renewal on May 1st. Please update your payment details to avoid interruption.",
    "Subject: Team Outing Details\nBody: The team outing is scheduled for next Friday. Please confirm your attendance.",
    "Subject: Service Downtime Notification\nBody: Our services will be down for maintenance on Saturday from 1 AM to 5 AM.",
    "Subject: Follow-up on Previous Inquiry\nBody: I’m following up on the support request I made last week. Could you provide an update?"
  ];

  // Select a random content example for each entry
  const selectedContent = contentExamples[entryId % contentExamples.length];

  // Return a simplified entry structure with plain text input/output
  return {
    id: modelId * 1000 + entryId,
    input: 'Check if the following email is spam: ' + `\n\n${selectedContent}`,
    output: isCorrect ? "Classified as Spam" : "Classified as Not Spam",
    parameters: {},
    isCorrect,
    processed: Math.random() > 0.5,
    metricProcessed: Math.random() > 0.5,
    actual: {
      relevance: Math.floor(Math.random() * 10) + 1,
      coherence: Math.floor(Math.random() * 10) + 1,
      correct: isCorrect
    },
    predicted: [isCorrect ? "Classified as Spam" : "Classified as Not Spam"],
    deletedAt: null,
    modelId: modelId,
    createdAt: new Date(new Date().setDate(new Date().getDate() - entryId)).toISOString(),
    updatedAt: new Date().toISOString(),
    model_id: modelId
  };
}

/**
 * Generate multiple monitoring entries
 * @param {number} modelId - ID of the model
 * @param {number} [numberOfEntries=5] - Number of entries to generate
 * @returns {Object} Monitoring entries with statistics
 * 
 * @description
 * Creates a specified number of monitoring entries and calculates:
 * - Number of verified/unverified entries
 * - Number of correct/incorrect entries
 * - Complete list of generated entries
 */
function generateMonitoringEntries(modelId, numberOfEntries = 5) {
  const entries = [];
  let amountVerified = 0;
  let amountUnverified = 0;
  let correct = 0;
  let incorrect = 0;

  for (let i = 1; i <= numberOfEntries; i++) {
    const entry = generateMonitoringEntry(i, modelId);
    entries.push(entry);

    if (entry.processed) {
      amountVerified++;
      entry.isCorrect ? correct++ : incorrect++;
    } else {
      amountUnverified++;
    }
  }

  return {
    amountVerified,
    amountUnverified,
    correct,
    incorrect,
    entries
  };
}