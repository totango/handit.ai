/**
 * @fileoverview Evaluation Hub View Model
 * 
 * This view model implements the MVVM pattern for the Evaluation Hub feature.
 * It manages all business logic, data operations, and state management.
 * 
 * Responsibilities:
 * - Manage evaluator data and operations
 * - Handle state management
 * - Implement observer pattern for view updates
 * - Provide data validation and business rules
 * - Calculate statistics and metrics
 */

/**
 * @typedef {Object} Evaluator
 * @property {number} id - Unique identifier for the evaluator
 * @property {string} name - Name of the evaluator
 * @property {string} type - Type of evaluation (Classification, Content, etc.)
 * @property {string} status - Current status (Active/Inactive)
 * @property {string} lastEvaluation - Date of last evaluation
 * @property {number} successRate - Success rate percentage
 * @property {number} totalEvaluations - Total number of evaluations performed
 * @property {string} description - Description of the evaluator's purpose
 * @property {string} prompt - Evaluation prompt
 * @property {Array} relatedNodes - Array of related node IDs
 * @property {Object} llmConfig - LLM configuration
 */

/**
 * @typedef {Object} EvaluatorStats
 * @property {number} total - Total number of evaluators
 * @property {number} active - Number of active evaluators
 * @property {number} averageSuccessRate - Average success rate across all evaluators
 */

/**
 * @typedef {Object} Filters
 * @property {string} name - Name filter
 * @property {string} type - Type filter
 * @property {string} status - Status filter
 */

/**
 * @typedef {Object} Sorting
 * @property {string} field - Field to sort by
 * @property {string} direction - Sort direction ('asc' or 'desc')
 */

/**
 * @typedef {Object} State
 * @property {Evaluator[]} evaluators - Array of evaluators
 * @property {Filters} filters - Current filters
 * @property {Sorting} sorting - Current sorting
 * @property {Evaluator|null} selectedEvaluator - Currently selected evaluator
 * @property {boolean} isCreating - Whether in creation mode
 */

/**
 * Evaluation Hub View Model class
 * Manages evaluator data and provides methods for data manipulation and statistics
 */
export class EvaluationHubViewModel {
  /**
   * Creates a new instance of EvaluationHubViewModel
   * Initializes the state and observers
   */
  constructor() {
    /** @type {State} */
    this.state = {
      evaluators: this.initializeEvaluators(),
      filters: {
        name: '',
        type: '',
        status: ''
      },
      sorting: {
        field: 'name',
        direction: 'asc'
      },
      selectedEvaluator: null,
      isCreating: false
    };

    /** @type {Array<Function>} */
    this.observers = [];
  }

  /**
   * Initialize sample evaluators
   * @returns {Evaluator[]} Array of initial evaluators
   */
  initializeEvaluators() {
    return [
      {
        id: 1,
        name: 'Accuracy Evaluator',
        type: 'Classification',
        status: 'Active',
        lastEvaluation: '2024-03-20',
        successRate: 95.5,
        totalEvaluations: 1500,
        description: 'Evaluates model classification accuracy',
        prompt: 'Default evaluation prompt...',
        relatedNodes: [],
        llmConfig: {
          provider: 'OpenAI',
          model: 'GPT-4',
          temperature: 0.7,
          maxTokens: 2000
        }
      },
      {
        id: 2,
        name: 'Relevance Checker',
        type: 'Content',
        status: 'Active',
        lastEvaluation: '2024-03-19',
        successRate: 92.3,
        totalEvaluations: 1200,
        description: 'Checks content relevance and coherence'
      },
      {
        id: 3,
        name: 'Factual Consistency',
        type: 'Verification',
        status: 'Inactive',
        lastEvaluation: '2024-03-18',
        successRate: 88.7,
        totalEvaluations: 800,
        description: 'Verifies factual consistency in responses'
      },
      {
        id: 4,
        name: 'Toxicity Filter',
        type: 'Safety',
        status: 'Active',
        lastEvaluation: '2024-03-20',
        successRate: 99.1,
        totalEvaluations: 2000,
        description: 'Filters out toxic or harmful content'
      }
    ];
  }

  /**
   * Subscribe to state changes
   * @param {Function} observer - Callback function to be called on state changes
   */
  subscribe(observer) {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  /**
   * Notify all observers of state changes
   */
  notifyObservers() {
    this.observers.forEach(observer => observer(this.state));
  }

  /**
   * Update the state and notify observers
   * @param {Partial<State>} newState - New state to merge with current state
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyObservers();
  }

  /**
   * Get current state
   * @returns {State} Current state
   */
  getState() {
    return this.state;
  }

  /**
   * Set filters and update state
   * @param {Filters} filters - New filters
   */
  setFilters(filters) {
    this.setState({ filters });
  }

  /**
   * Set sorting and update state
   * @param {Sorting} sorting - New sorting configuration
   */
  setSorting(sorting) {
    this.setState({ sorting });
  }

  /**
   * Set selected evaluator
   * @param {Evaluator|null} evaluator - Selected evaluator
   */
  setSelectedEvaluator(evaluator) {
    this.setState({ selectedEvaluator: evaluator });
  }

  /**
   * Set creation mode
   * @param {boolean} isCreating - Whether in creation mode
   */
  setIsCreating(isCreating) {
    this.setState({ isCreating });
  }

  /**
   * Get filtered and sorted evaluators
   * @returns {Evaluator[]} Filtered and sorted evaluators
   */
  getFilteredEvaluators() {
    let filtered = [...this.state.evaluators];

    // Apply filters
    if (this.state.filters.name) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(this.state.filters.name.toLowerCase())
      );
    }
    if (this.state.filters.type) {
      filtered = filtered.filter(e => e.type === this.state.filters.type);
    }
    if (this.state.filters.status) {
      filtered = filtered.filter(e => e.status === this.state.filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const direction = this.state.sorting.direction === 'asc' ? 1 : -1;
      return direction * (a[this.state.sorting.field] > b[this.state.sorting.field] ? 1 : -1);
    });

    return filtered;
  }

  /**
   * Get evaluator statistics
   * @returns {EvaluatorStats} Evaluator statistics
   */
  getEvaluatorStats() {
    const activeEvaluators = this.state.evaluators.filter(e => e.status === 'Active');
    const totalSuccessRate = this.state.evaluators.reduce((acc, curr) => acc + curr.successRate, 0);

    return {
      total: this.state.evaluators.length,
      active: activeEvaluators.length,
      averageSuccessRate: totalSuccessRate / this.state.evaluators.length
    };
  }

  /**
   * Create a new evaluator
   * @param {Partial<Evaluator>} evaluatorData - New evaluator data
   * @returns {Evaluator} Created evaluator
   */
  createEvaluator(evaluatorData) {
    const newEvaluator = {
      id: Date.now(),
      name: evaluatorData.name,
      type: evaluatorData.type || 'Classification',
      status: evaluatorData.status || 'Active',
      lastEvaluation: new Date().toISOString(),
      successRate: 0,
      totalEvaluations: 0,
      description: evaluatorData.description || '',
      prompt: evaluatorData.prompt || '',
      relatedNodes: evaluatorData.relatedNodes || [],
      llmConfig: evaluatorData.llmConfig || {
        provider: 'OpenAI',
        model: 'GPT-4',
        temperature: 0.7,
        maxTokens: 2000
      }
    };

    this.setState({
      evaluators: [...this.state.evaluators, newEvaluator],
      selectedEvaluator: newEvaluator,
      isCreating: false
    });

    return newEvaluator;
  }

  /**
   * Update an existing evaluator
   * @param {number} id - Evaluator ID
   * @param {Partial<Evaluator>} updates - Updates to apply
   * @returns {Evaluator} Updated evaluator
   */
  updateEvaluator(id, updates) {
    const updatedEvaluators = this.state.evaluators.map(evaluator => 
      evaluator.id === id ? { ...evaluator, ...updates } : evaluator
    );

    this.setState({
      evaluators: updatedEvaluators,
      selectedEvaluator: this.state.selectedEvaluator?.id === id 
        ? { ...this.state.selectedEvaluator, ...updates }
        : this.state.selectedEvaluator
    });

    return this.state.evaluators.find(e => e.id === id);
  }

  /**
   * Remove an evaluator
   * @param {number} id - Evaluator ID to remove
   */
  removeEvaluator(id) {
    this.setState({
      evaluators: this.state.evaluators.filter(e => e.id !== id),
      selectedEvaluator: this.state.selectedEvaluator?.id === id ? null : this.state.selectedEvaluator
    });
  }

  /**
   * Get available evaluator types
   * @returns {string[]} Array of unique evaluator types
   */
  getEvaluatorTypes() {
    return [...new Set(this.state.evaluators.map(e => e.type))];
  }

  /**
   * Get available evaluator statuses
   * @returns {string[]} Array of unique evaluator statuses
   */
  getEvaluatorStatuses() {
    return [...new Set(this.state.evaluators.map(e => e.status))];
  }

  /**
   * Validate evaluator data
   * @param {Partial<Evaluator>} data - Evaluator data to validate
   * @returns {boolean} Whether the data is valid
   */
  validateEvaluatorData(data) {
    if (!data.name?.trim()) return false;
    if (data.successRate < 0 || data.successRate > 100) return false;
    if (data.totalEvaluations < 0) return false;
    return true;
  }

  /**
   * Get available LLM providers and their configurations
   * @returns {Array<{name: string, models: string[], icon: string}>} Array of provider configurations
   */
  getAvailableProviders() {
    return [
      {
        name: 'OpenAI',
        models: ['GPT-4', 'GPT-3.5-Turbo', 'GPT-3.5'],
        icon: '🤖'
      },
      {
        name: 'Anthropic',
        models: ['Claude-3-Opus', 'Claude-3-Sonnet', 'Claude-2'],
        icon: '🧠'
      },
      {
        name: 'Google',
        models: ['Gemini-Pro', 'Gemini-Ultra', 'PaLM-2'],
        icon: '🔍'
      }
    ];
  }

  /**
   * Get available nodes for linking
   * @returns {Array<{id: number, name: string, type: string}>} Array of available nodes
   */
  getAvailableNodes() {
    return [
      { id: 1, name: 'Input Validator', type: 'Validation' },
      { id: 2, name: 'Response Formatter', type: 'Processing' },
      { id: 3, name: 'Quality Checker', type: 'Evaluation' },
      { id: 4, name: 'Data Validator', type: 'Validation' },
      { id: 5, name: 'Output Formatter', type: 'Processing' },
      { id: 6, name: 'Content Analyzer', type: 'Analysis' },
      { id: 7, name: 'Response Generator', type: 'Generation' },
      { id: 8, name: 'Quality Metrics', type: 'Metrics' },
      { id: 9, name: 'Error Handler', type: 'Error' },
      { id: 10, name: 'Context Manager', type: 'Management' }
    ];
  }
} 