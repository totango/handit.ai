import { llmModelNamesAndDescriptions, providers } from "@/constants/models";

// Function to generate a detailed alert for a single alert view
export const processModelsSandboxRequest = (args) => {
  const { url, method } = args;

  if (method === 'POST' && url === 'models') {
    return { data: addModelToSession(args.body) };
  }
  if (url === ('models/me')) {
    return {
      data: [
        ...getSessionModels(),
        ...fetchMockModels(),
      ]
    }
  }
};
function generateMockModelData(modelId) {
  const modelInfo = getRandomModelInfo();
  
  return {
    id: modelId,
    name: modelInfo.name,
    url: `https://example.com/${modelInfo.name.toLowerCase().replace(/\s+/g, '-')}`,
    provider: providers[Math.floor(Math.random() * providers.length)].label,
    description: modelInfo.description,
    problemType: "binary_class",  // Or customize as needed
    modelCreationDate: new Date(new Date().setDate(new Date().getDate() - modelId * 10)).toISOString(),
    slug: modelInfo.name.toLowerCase().replace(/\s+/g, '-'),
    parameters: null,
    modelGroupId: modelId,
    type: "largeLanguageModel",
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model_group_id: modelId,
    datasets: [],
  };
}

// Function to generate a list of mock models
function fetchMockModels() {
  const models = [];
  for (let i = 1; i <= 5; i++) {
    models.push(generateMockModelData(i));
  }
  return models;
}

// Function to retrieve models from session or generate if none exist
function getSessionModels() {
  const sessionModels = JSON.parse(sessionStorage.getItem("mockSessionModels")) || [];
  return sessionModels;
}

function getRandomModelInfo() {
  return llmModelNamesAndDescriptions[Math.floor(Math.random() * llmModelNamesAndDescriptions.length)];
}

// Function to add a new model to the session storage (simulating model creation)
function addModelToSession(newModelData) {
  const sessionModels = getSessionModels();
  newModelData.id = sessionModels.length + 6; // Ensure unique IDs starting after mock fetch models
  sessionModels.push(newModelData);
  sessionStorage.setItem("mockSessionModels", JSON.stringify(sessionModels));
  return newModelData;
}

// Main function to simulate /models/me endpoint
function fetchModelsMe() {
  // Fetch automatic mock models
  const autoModels = fetchMockModels();
  
  // Fetch session-stored models
  const sessionModels = getSessionModels();

  // Combine both sets of models
  return [...autoModels, ...sessionModels];
}