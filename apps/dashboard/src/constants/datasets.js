/**
 * @fileoverview Dataset type definitions and constants
 * Defines the available dataset types and their display labels for the application
 */

/**
 * Available dataset types with their display labels
 * @type {Array<{value: string, label: string}>}
 * @constant
 * 
 * @property {string} value - Unique identifier for the dataset type
 * @property {string} label - Human-readable label for the dataset type
 * 
 * @description
 * This constant defines all supported dataset types:
 * - Image datasets for visual data
 * - Text datasets for natural language
 * - Audio datasets for sound data
 * - Video datasets for moving images
 * - Tabular datasets for structured data
 * - Time series datasets for temporal data
 * - Geospatial datasets for location data
 * - 3D model datasets for spatial objects
 * - Sensor datasets for IoT data
 * - Binary datasets for raw data files
 */
export const datasetTypes = [
  { value: 'imageDataset', label: 'Image Dataset' },
  { value: 'textDataset', label: 'Text Dataset' },
  { value: 'audioDataset', label: 'Audio Dataset' },
  { value: 'videoDataset', label: 'Video Dataset' },
  { value: 'tabularDataset', label: 'Tabular Dataset (CSV or Excel)' },
  {
    value: 'timeSeriesDataset',
    label: 'Time Series Dataset (Data indexed by time)',
  },
  {
    value: 'geospatialDataset',
    label: 'Geospatial Dataset (coordinates, or spatial measurements)',
  },
  {
    value: 'threeDDataset',
    label: '3D Model Dataset (Data for three-dimensional objects)',
  },
  {
    value: 'sensorDataset',
    label: 'Sensor Dataset (Data from IoT or other sensors)',
  },
  { value: 'binaryDataset', label: 'Binary Dataset (Raw data files)' },
];
