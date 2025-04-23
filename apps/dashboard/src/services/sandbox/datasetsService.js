/**
 * @fileoverview Datasets Service for Sandbox Environment
 * Provides mock data generation and management for dataset-related functionality in sandbox mode
 */

import { llmModelNamesAndDescriptions, providers } from "@/constants/models";

/**
 * Process datasets sandbox request and return appropriate mock data
 * @param {Object} args - Request arguments
 * @param {string} args.url - Request URL
 * @param {string} args.method - HTTP method
 * @param {Object} [args.body] - Request body for POST requests
 * @returns {Object} Mock dataset data
 * 
 * @description
 * Handles dataset-related requests in sandbox mode:
 * - POST /datasets: Creates a new dataset
 * - GET /datasets/me: Retrieves all datasets
 */
export const processDatasetsSandboxRequest = (args) => {
  const { url, method } = args;

  if (method === 'POST' && url === 'datasets') {
    return { data: addDatasetToSession(args.body) };
  }
  if (url === ('datasets/me')) {
    return {
      data: fetchDatasetsMe()
    }
  }
};

/**
 * Generate mock dataset data for a specific dataset ID
 * @param {number} datasetId - ID of the dataset
 * @returns {Object} Mock dataset data
 * 
 * @description
 * Creates a mock dataset with predefined names and descriptions.
 * Includes metadata such as creation date, type, and version.
 */
function generateMockDatasetData(datasetId) {
  const datasetNamesAndDescriptions = [
    {
      name: "IMDB Dataset",
      description: "Dataset with more than 5000 comments on movies.",
      url: "https://kaggle.com/imdb-dataset"
    },
    {
      name: "Amazon Product Reviews",
      description: "Dataset containing reviews of various Amazon products.",
      url: "https://kaggle.com/amazon-product-reviews"
    },
    {
      name: "Twitter Sentiment Analysis",
      description: "Dataset with tweets labeled by sentiment.",
      url: "https://kaggle.com/twitter-sentiment"
    },
    {
      name: "Yelp Business Reviews",
      description: "Dataset containing reviews of businesses on Yelp.",
      url: "https://kaggle.com/yelp-business-reviews"
    },
    {
      name: "Reddit Comment Corpus",
      description: "Corpus of comments from various subreddits.",
      url: "https://kaggle.com/reddit-comment-corpus"
    }
  ];

  const datasetInfo = datasetNamesAndDescriptions[datasetId % datasetNamesAndDescriptions.length];

  return {
    id: datasetId,
    name: datasetInfo.name,
    description: datasetInfo.description,
    url: datasetInfo.url,
    datasetCreationDate: new Date(new Date().setDate(new Date().getDate() - datasetId * 10)).toISOString(),
    type: "textDataset",
    version: "1",
    datasetGroupId: datasetId,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dataset_group_id: datasetId
  };
}

/**
 * Generate a list of mock datasets
 * @returns {Array<Object>} Array of mock datasets
 * 
 * @description
 * Creates a fixed set of 5 mock datasets with unique IDs.
 * Each dataset has predefined metadata and content.
 */
function fetchMockDatasets() {
  const datasets = [];
  for (let i = 1; i <= 5; i++) {
    datasets.push(generateMockDatasetData(i));
  }
  return datasets;
}

/**
 * Retrieve datasets from session storage
 * @returns {Array<Object>} Array of datasets stored in session
 * 
 * @description
 * Retrieves datasets from sessionStorage or returns an empty array if none exist.
 * Used to persist user-created datasets across sessions.
 */
function getSessionDatasets() {
  const sessionDatasets = JSON.parse(sessionStorage.getItem("mockSessionDatasets")) || [];
  return sessionDatasets;
}

/**
 * Add a new dataset to session storage
 * @param {Object} newDatasetData - Data for the new dataset
 * @returns {Object} The newly created dataset with assigned ID
 * 
 * @description
 * Adds a new dataset to sessionStorage with a unique ID.
 * Simulates dataset creation in the sandbox environment.
 */
function addDatasetToSession(newDatasetData) {
  const sessionDatasets = getSessionDatasets();
  newDatasetData.id = sessionDatasets.length + 6; // Unique ID, starting after mock datasets
  sessionDatasets.push(newDatasetData);
  sessionStorage.setItem("mockSessionDatasets", JSON.stringify(sessionDatasets));
  return newDatasetData;
}

/**
 * Fetch all datasets (mock and session-stored)
 * @returns {Array<Object>} Combined array of all datasets
 * 
 * @description
 * Combines automatically generated mock datasets with user-created datasets
 * stored in sessionStorage. Simulates the /datasets/me endpoint.
 */
function fetchDatasetsMe() {
  // Fetch automatic mock datasets
  const autoDatasets = fetchMockDatasets();

  // Fetch session-stored datasets
  const sessionDatasets = getSessionDatasets();

  // Combine both sets of datasets
  return [...autoDatasets, ...sessionDatasets];
}