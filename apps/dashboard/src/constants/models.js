/**
 * @fileoverview Model-related constants and definitions
 * Defines providers, model types, AI problem types, and model categories for the application
 */

/**
 * Available AI model providers with their display labels
 * @type {Array<{value: string, label: string}>}
 * @constant
 * 
 * @property {string} value - Unique identifier for the provider
 * @property {string} label - Human-readable label for the provider
 * 
 * @description
 * This constant defines all supported AI model providers:
 * - OpenAI for GPT models
 * - Hugging Face for open-source models
 * - Google AI / Vertex AI
 * - Amazon SageMaker
 * - Microsoft Azure AI
 * - IBM Watson
 * - Anthropic for Claude AI
 * - Cohere
 * - DeepMind
 * - Oracle Cloud
 */
export const providers = [
  { value: 'openAi', label: 'OpenAI (GPT models)' },
  { value: 'huggingFace', label: 'Hugging Face' },
  { value: 'googleAi', label: 'Google AI / Vertex AI' },
  { value: 'amazon', label: 'Amazon SageMaker' },
  { value: 'microsoft', label: 'Microsoft Azure AI' },
  { value: 'ibm', label: 'IBM Watson' },
  { value: 'anthropic', label: 'Anthropic (Claude AI)' },
  { value: 'cohere', label: 'Cohere' },
  { value: 'deepMind', label: 'DeepMind' },
  { value: 'oracle', label: 'Oracle Cloud' },
];

/**
 * Predefined LLM model names and their descriptions
 * @type {Array<{name: string, description: string}>}
 * @constant
 * 
 * @property {string} name - Name of the LLM model
 * @property {string} description - Detailed description of the model's purpose
 * 
 * @description
 * This constant defines common LLM models and their use cases:
 * - Sentiment analysis
 * - Topic detection
 * - Text summarization
 * - Question answering
 * - Spam detection
 * - Entity recognition
 * - Text generation
 * - Review classification
 * - Intent detection
 * - Language translation
 * - Document embedding
 * - Toxicity detection
 * - Keyword extraction
 * - Paraphrasing
 * - Fake news detection
 */
export const llmModelNamesAndDescriptions = [
  {
    name: "Sentiment Classifier",
    description: "Classifies text as positive, negative, or neutral sentiment for social media comments."
  },
  {
    name: "Topic Detection Model",
    description: "Identifies the main topic of a text, useful for news categorization and article tagging."
  },
  {
    name: "Text Summarization Engine",
    description: "Generates concise summaries for long documents, making information easily digestible."
  },
  {
    name: "Question Answering Model",
    description: "Provides accurate answers to questions based on context from large text documents."
  },
  {
    name: "Spam Detection System",
    description: "Classifies emails or messages as spam or not spam based on content analysis."
  },
  {
    name: "Entity Recognition Model",
    description: "Identifies entities like names, dates, and locations within text for NLP tasks."
  },
  {
    name: "Text Generation Model",
    description: "Generates creative and coherent text based on given prompts, suitable for content creation."
  },
  {
    name: "Customer Review Classifier",
    description: "Analyzes product reviews and classifies them as positive or negative feedback."
  },
  {
    name: "Intent Detection Model",
    description: "Determines the intent behind user queries, aiding in customer support automation."
  },
  {
    name: "Language Translation Model",
    description: "Translates text between multiple languages, supporting global communication needs."
  },
  {
    name: "Document Embedding Model",
    description: "Generates embeddings for text documents to allow similarity searches and clustering."
  },
  {
    name: "Toxicity Detection Model",
    description: "Detects toxic or abusive language to moderate online content effectively."
  },
  {
    name: "Keyword Extraction Model",
    description: "Extracts relevant keywords from text, useful for SEO and content categorization."
  },
  {
    name: "Paraphrasing Model",
    description: "Rephrases sentences to generate alternative wording while preserving original meaning."
  },
  {
    name: "Fake News Detector",
    description: "Classifies news articles as likely genuine or fake based on text analysis."
  },
];

/**
 * Available model types with their descriptions
 * @type {Array<{value: string, label: string, description: string}>}
 * @constant
 * 
 * @property {string} value - Unique identifier for the model type
 * @property {string} label - Human-readable label for the model type
 * @property {string} description - Detailed description of the model type
 * 
 * @description
 * This constant defines all supported model types:
 * - Large Language Models (LLMs)
 * - Transformer-based models
 * - Convolutional Neural Networks (CNNs)
 * - Recurrent Neural Networks (RNNs)
 * - Reinforcement Learning
 * - Generative Adversarial Networks (GANs)
 * - Decision Trees
 * - Support Vector Machines (SVMs)
 */
export const modelTypes = [
  {
    value: 'largeLanguageModel',
    label: 'Large Language Model (LLM)',
    description: 'Processes and generates human-like text (e.g., chatbots).',
  },
  {
    value: 'transformer',
    label: 'Transformer-based Model',
    description: 'Used for language tasks and large data processing (e.g., translations).',
  },
  {
    value: 'convolutionalNeuralNetwork',
    label: 'Convolutional Neural Network (CNN)',
    description: 'Recognizes patterns in images (e.g., used in photo recognition).',
  },
  {
    value: 'recurrentNeuralNetwork',
    label: 'Recurrent Neural Network (RNN)',
    description: 'Processes sequences (e.g., used for language models and time-series data).',
  },
  {
    value: 'reinforcementLearning',
    label: 'Reinforcement Learning',
    description: 'Learns from actions and feedback (e.g., teaching a computer to play a game).',
  },
  {
    value: 'generativeAdversarialNetwork',
    label: 'Generative Model (GAN)',
    description: 'Generates new data (e.g., creating new images or videos).',
  },
  {
    value: 'decisionTree',
    label: 'Decision Tree',
    description: 'Makes decisions based on rules (e.g., used for classifying things).',
  },
  {
    value: 'supportVectorMachine',
    label: 'Support Vector Machine (SVM)',
    description: 'Classifies data into different categories.',
  },
];

/**
 * Available AI problem types with their descriptions
 * @type {Array<{value: string, label: string, description: string}>}
 * @constant
 * 
 * @property {string} value - Unique identifier for the problem type
 * @property {string} label - Human-readable label for the problem type
 * @property {string} description - Detailed description of the problem type
 * 
 * @description
 * This constant defines all supported AI problem types:
 * - Text generation
 * - Binary classification
 * - Multiclass classification
 * - Multilabel classification
 * - Regression
 * - Clustering
 * - Anomaly detection
 * - Ranking
 * - Sequence prediction
 * - Time series forecasting
 */
export const aiProblemTypes = [
  {
    value: 'text_generation',
    label: 'Text Generation',
    description: 'Create new text based on existing data (e.g., write a story).',
  },
  {
    value: 'binary_class',
    label: 'Binary Classification',
    description: 'Decide between two choices (e.g., spam vs. not spam).',
  },
  {
    value: 'multi_class',
    label: 'Multiclass Classification',
    description: 'Pick one from many choices (e.g., identify the type of an object).',
  },
  {
    value: 'multi_label',
    label: 'Multilabel Classification',
    description: 'Choose multiple tags for a single item (e.g., detect objects in a photo).',
  },
  { value: 'regression', label: 'Predicting Numbers', description: 'Predict a number (e.g., forecast sales).' },
  {
    value: 'clustering',
    label: 'Grouping Things',
    description: 'Group items that are similar (e.g., segment customers).',
  },
  {
    value: 'anomaly_detection',
    label: 'Finding Unusual Patterns',
    description: 'Spot outliers or unusual behavior (e.g., detect fraud).',
  },
  { value: 'ranking', label: 'Ranking Items', description: 'Arrange things in order (e.g., rank search results).' },
  {
    value: 'sequence_prediction',
    label: 'Predicting Sequences',
    description: 'Predict the next item in a sequence (e.g., predict stock prices).',
  },
  {
    value: 'time_series_forecasting',
    label: 'Forecasting Over Time',
    description: 'Predict future trends based on past data (e.g., sales forecasting).',
  },
];

/**
 * Available model categories with their descriptions
 * @type {Array<{value: string, label: string, description: string}>}
 * @constant
 * 
 * @property {string} value - Unique identifier for the model category
 * @property {string} label - Human-readable label for the model category
 * @property {string} description - Detailed description of the model category
 * 
 * @description
 * This constant defines all supported model categories:
 * - Base LLMs
 * - Fine-tuned models
 * - RAG-enhanced models
 * - Specialized models
 * - Custom models
 */
export const modelCategories = [
  {
    value: 'base_llm',
    label: 'Base LLM',
    description: 'Original, unmodified language models (e.g., GPT-4, Claude)',
  },
  {
    value: 'fine_tuned',
    label: 'Fine-tuned Model',
    description: 'Models customized for specific tasks or domains',
  },
  {
    value: 'rag_enhanced',
    label: 'RAG-enhanced Model',
    description: 'Models augmented with retrieval-based systems',
  },
  {
    value: 'specialized',
    label: 'Specialized Model',
    description: 'Purpose-built models for specific tasks (e.g., code, image generation)',
  },
  {
    value: 'custom',
    label: 'Custom Model',
    description: 'In-house or custom-developed models',
  },
];
