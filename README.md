<p align="center">
  <img width="903" alt="Screenshot 2025-05-21 at 11 09 55 AM" src="https://github.com/user-attachments/assets/e40d816e-3b2f-4abc-9bfb-400528db2b0d" />
</p>

>The Open Source Engine that Auto-Improves Your AI <br>
>Handit evaluates every agent decision, auto-generates better prompts and datasets, A/B-tests the fix, and lets you control what goes live.

---

## 🌟 What Handit Delivers

Handit gives you the tools to observe, evaluate, and improve every part of your LLM agents—node by node.

- 🔍 **Track Everything**  
  Capture all agent activity—inputs, outputs, tool calls, intermediate reasoning—across every node. Gain full visibility into how your agent actually behaves in production.

- 🧠 **Evaluate Automatically**  
  Use LLM-based evaluators to score each output. Assess quality, correctness, hallucination risk, and more at every step in your agent's execution graph.

- 💡 **Generate Insights**  
  Automatically detect failure patterns, drift, or low-performing prompts. Get actionable suggestions tied to specific parts of your agent.

- ✍️ **Version Prompts**  
  Track, compare, and roll back prompt changes. Version control is built into the system—by node, model, or project.

- 🔁 **Route Intelligently**  
  Serve the best prompt version dynamically via A2A-style routing. Optimize execution paths before they even run.

> If your agent is in production, Handit helps make sure it's actually working—and keeps getting better.

# ✨ Core Features

## Real-Time Monitoring

Continuously ingest logs from every model, prompt, and agent in your stack. Instantly visualize performance trends, detect anomalies, and set custom alerts for drift or failures—live.

Ready to evaluate your AI performance? Visit [Evaluation Hub](https://beta.handit.ai/ag-tracing)

![AI Agent Tracing Dashboard](/assets/overview/tracing.png)

<details>
<summary>**Benefits**</summary>

- Ingest logs from models, prompts, and agents in seconds
- Visualize performance trends with interactive dashboards
- Detect anomalies and drift automatically
- Set custom real-time alerts for failures and threshold breaches

</details>



## Evaluation

Run evaluation pipelines on production traffic with custom LLM-as-Judge prompts, business KPI thresholds (accuracy, latency, etc.), and get automated quality scores in real time. Results feed directly into your optimization workflows—no manual grading required.

Run your evaluations here: [Evaluation Hub](https://beta.handit.ai/evaluation-hub)

![Evaluation Hub Dashboard](/assets/overview/evaluation-hub.png)

![Error Detection and Analysis](/assets/overview/evaluation-error-detection.png)

<details>
<summary>**Benefits**</summary>

- Execute LLM-as-Judge prompts on live traffic
- Enforce business KPI thresholds (accuracy, latency, etc.)
- Receive automated quality scores in real time
- Feed results directly into optimization workflows automatically

</details>

## Prompt Management, Self-Optimization, and AI CI/CD

- **Run experiments**  
  Test different model versions, prompts, or agent configurations with A/B traffic routing—no manual work required.

- **Automatically optimize**  
  Handit collects performance and ROI metrics in real time, then promotes the winning variant without human intervention.

- **Get the best prompt from Handit**  
  Compare prompt versions side-by-side, promote your favorite to production, and deploy it with a single click.

- **Collaborate and track**  
  Use built-in version control to manage templates, tag and categorize prompts, and view performance trends over time.


Run your prompt experiments and deployments here: [Prompt Versions](https://beta.handit.ai/prompt-versions)

![Prompt Performance Comparison](/assets/overview/prompt-comparison.png)

<details>
<summary>**Benefits**</summary>

- Launch experiments across model versions, prompts, or agent configs
- Automatically route traffic and gather performance data
- Compare ROI metrics to identify top performers
- Promote winning variants without manual effort
- Centralize prompt templates and version histories
- Tag, categorize, and collaborate on prompts
- Track prompt performance trends over time
- Roll back or fork proven prompts instantly for quick iteration

</details>


## 🔍 Core Tracing Methods

Both SDKs provide the same core tracing capabilities through different method signatures:

### Agent-Level Tracing

**Purpose:** Track complete AI agent workflows from start to finish

| **Method** | **Python** | **JavaScript** | **Use Case** |
|------------|------------|----------------|--------------|
| **Agent Wrapper** | `@start_agent_tracing()` | `startAgentTracing()` | Wrap entire agent functions for automatic tracing |
| **Manual Agent** | `_send_tracked_data()` | `captureAgentNode()` | Custom control over agent execution tracking |

### Function-Level Tracing

**Purpose:** Monitor individual components, tools, and LLM calls

| **Method** | **Python** | **JavaScript** | **Use Case** |
|------------|------------|----------------|--------------|
| **Node Decorator** | `@trace_agent_node()` | `traceAgentNode()` | Automatic tracing of specific functions |
| **Node Function** | `trace_agent_node_func()` | `captureAgentNode()` | Programmatic function tracing |
| **Model Tracking** | `track_model()` | `captureModel()` | LLM interaction monitoring |
| **Tool Tracking** | `track_tool()` | `trackTool()` | Custom tool and API call tracing |

### Configuration & Setup

**Purpose:** Initialize and configure SDK behavior

| **Method** | **Python** | **JavaScript** | **Use Case** |
|------------|------------|----------------|--------------|
| **Configuration** | `tracker.config()` | `config()` | Set API keys and SDK options |
| **Context Management** | `endAgentTracing()` | `endAgentTracing()` | Manual session management |

## What Gets Tracked

### Automatic Tracking
- **Agent Executions** - Complete workflow timing and status
- **Function Calls** - Input parameters and return values  
- **LLM Interactions** - Prompts, responses, token usage, and performance
- **Tool Usage** - Custom function executions and API calls
- **Error Handling** - Exception details and stack traces
- **Performance Metrics** - Execution time and resource usage

### Custom Tracking
- **Business Events** - Domain-specific metrics and KPIs
- **User Context** - User IDs, session data, and custom metadata
- **External Services** - Third-party API calls and database queries
- **Conditional Logic** - Environment-based and user-tier tracking

## Key Capabilities by Use Case

### 🔍 **Debugging & Troubleshooting**
- **Complete execution traces** - See exactly what your agent did
- **Error context capture** - Full stack traces with input data
- **Performance bottleneck identification** - Find slow operations
- **Data flow visualization** - Track data transformations

### 📊 **Performance Monitoring**
- **Response time tracking** - Monitor agent and LLM latency
- **Resource usage monitoring** - Track memory and CPU usage
- **Token usage analysis** - Monitor LLM costs and efficiency
- **Success rate monitoring** - Track completion and failure rates

### 🎯 **Optimization & Insights**
- **Prompt performance analysis** - Compare different prompts
- **Model comparison** - Evaluate different LLM models
- **Tool effectiveness tracking** - Monitor tool success rates
- **User experience metrics** - Track user satisfaction indicators

### 🏗️ **Development & Testing**
- **Gradual rollout support** - Test new features safely
- **A/B testing integration** - Compare different approaches
- **Environment-specific tracking** - Different behavior per environment
- **Custom event tracking** - Monitor business-specific metrics


## SDK-Specific Features

### Python SDK Advantages
- **Deep Framework Integration** - Native LangChain and OpenAI support
- **Async/Await Support** - Full asynchronous operation tracking
- **Scientific Computing** - Integration with NumPy, Pandas, and ML libraries
- **Decorator Patterns** - Pythonic function decoration for tracing

### JavaScript SDK Advantages  
- **Modern JavaScript Support** - ES6+, TypeScript, and module systems
- **HTTP Library Integration** - Automatic Axios and Fetch tracking
- **Event-Driven Architecture** - WebSocket and event-based tracing
- **Microservice Ready** - Built for distributed Node.js applications

</br>

# ⚡️ Quickstart

## Prerequisites

Before we start, make sure you have:

- A [Handit.ai Account](https://beta.handit.ai) (sign up if needed)
- 15-30 minutes to complete the setup

## Phase 1: AI Observability (5 minutes)

Let's add comprehensive tracing to see exactly what your AI is doing.

### Step 1: Install the SDK

```bash
pip install -U "handit-sdk>=1.9.0"
```

> **💡 Not using Python?**  
> Visit our [documentation](https://docs.handit.ai/) to learn how to trace other languages.

### Step 2: Get Your Integration Token

1. Log into your [Handit.ai Dashboard](https://beta.handit.ai)
2. Go to **Settings** → **Integrations**
3. Copy your integration token

<video 
  width="100%" 
  autoPlay 
  loop 
  muted 
  playsInline
  style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
>
  <source src="/assets/quickstart/integration_token.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

### Step 3: Add Basic Tracing

Now, let's set up your main agent function, LLM calls and tool usage with tracing. You'll need to set up four key components:

1. Initialize Handit.ai service
2. Set up main orchestration with `startAgentTracing()`
3. Track LLM calls with `captureModel()`
4. Track tool usage with `traceAgentNode()`

Create a `handit_service.py` file to initialize the Handit.ai tracker:

```python
"""
Handit.ai service initialization.
This file creates a singleton tracker instance that can be imported across your application.
"""
from handit import HanditTracker

# Create a singleton tracker instance
tracker = HanditTracker()
# Configure with your API key from environment variables
tracker.config(api_key=os.getenv("HANDIT_API_KEY"))
```

Functions used for this example: 

- `@tracker.start_agent_tracing()`
   - Type: Decorator
   - Usage: Applied to main orchestration function
   - Parameters: None
   - Purpose: Marks start of agent tracing for entire request flow

- `tracker._send_tracked_data()`
   - Type: Async function
   - Parameters:
     - `model_id`: str (required) - Unique identifier for the Tool or LLM you want to track
     - `request_body`: dict (required) - Input data for operation
     - `response_body`: dict (required) - Output data from operation
   - Purpose: Tracks individual component executions (LLMs/Tools)

Example implementation:

```python
"""
Customer Service Agent with comprehensive tracing.

This example demonstrates the correct pattern for implementing tracing in a customer service agent:
1. Use @tracker.start_agent_tracing() ONLY on the main orchestration function
2. Use tracker._send_tracked_data() for tracking individual component executions (LLMs/Tools)
3. Each component should track its own execution with a unique model_id
  (Create unique identifiers for each component. They must be unique across all nodes)

The main orchestration function (handle_customer_request) is the only entry point that should
use start_agent_tracing. All other components should use _send_tracked_data directly.

"""
from handit_service import tracker
import time
from typing import Dict, Any

async def search_knowledge_base(query: str) -> Dict[str, Any]:
    """
    Search the knowledge base for relevant information.
    
    This function demonstrates how to track a tool execution:
    1. Execute the tool logic
    2. Track the execution using _send_tracked_data
    3. Return the results
    
    Args:
        query (str): The search query
        
    Returns:
        Dict[str, Any]: Search results with confidence score
    """
    # Simulate knowledge base search
    await asyncio.sleep(0.5)  # Simulate API call
    results = {
        "results": [
            {"title": "Refund Policy", "content": "Customers can request refunds within 30 days..."},
            {"title": "Shipping Info", "content": "Standard shipping takes 3-5 business days..."}
        ],
        "confidence": 0.85
    }
    
    # Track the knowledge base search
    await tracker._send_tracked_data(
        model_id="knowledge-base-search",  # Create your own unique identifier for your component. Must be unique across all nodes
        request_body={"query": query},
        response_body=results
    )
    
    return results

async def generate_response(context: Dict[str, Any]) -> str:
    """
    Generate a response using LLM.
    
    This function demonstrates how to track an LLM call:
    1. Execute the LLM call
    2. Track the execution using _send_tracked_data
    3. Return the response
    
    Args:
        context (Dict[str, Any]): Context including user message and KB results
        
    Returns:
        str: Generated response
    """
    # Simulate LLM call
    await asyncio.sleep(1)  # Simulate API call
    response = "Based on our policies, you can request a refund within 30 days of purchase..."
    
    # Track the LLM response generation
    await tracker._send_tracked_data(
        model_id="response-generator",  # Unique identifier
        request_body=context,
        response_body={"response": response}
    )
    
    return response

# Main customer service agent - this is the only function that uses start_agent_tracing
@tracker.start_agent_tracing()
async def handle_customer_request(user_message: str, user_id: str) -> Dict[str, Any]:
    """
    Process a customer service request with comprehensive tracing.
    
    This is the main orchestration function that:
    1. Uses @tracker.start_agent_tracing() to track the entire request flow
    2. Coordinates between different components (KB search, LLM)
    3. Tracks the complete interaction
    
    The start_agent_tracing decorator should ONLY be used on this main function,
    as it's the entry point that orchestrates the entire flow.
    
    Args:
        user_message (str): The customer's message
        user_id (str): The customer's ID
        
    Returns:
        Dict[str, Any]: Response with answer and metadata
    """
    # Track the start of processing
    start_time = time.time()
    
    # Search knowledge base
    kb_results = await search_knowledge_base(user_message)
    
    # Generate response using LLM
    response = await generate_response({
        "user_message": user_message,
        "kb_results": kb_results
    })
    
    return {
        "response": response,
        "processing_time": time.time() - start_time,
        "confidence": kb_results["confidence"]
    }

# Usage example
async def main():
    """
    Example usage of the customer service agent.
    
    This demonstrates how to:
    1. Call the main orchestration function
    2. Handle the response
    3. Process any errors
    """
    try:
        result = await handle_customer_request(
            "I want to return my order, it's been 20 days",
            "user_123"
        )
        print(result)
    except Exception as e:
        print(f"Error processing request: {e}")
```

> **Phase 1 Complete!** 🎉 You now have full observability with every operation, timing, input, output, and error visible in your dashboard.

**➡️ Want to dive deeper?** Check out our [detailed Tracing Quickstart](https://docs.handit.ai/tracing/quickstart) for advanced features and best practices.

## Phase 2: Quality Evaluation (10 minutes)

Now let's add automated evaluation to continuously assess quality across multiple dimensions.

### Step 1: Connect Evaluation Models

1. Go to **Settings** → **Model Tokens**
2. Add your OpenAI or other model credentials
3. These models will act as "judges" to evaluate responses

<video 
  width="100%" 
  autoPlay 
  loop 
  muted 
  playsInline
  style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
>
  <source src="/assets/quickstart/model_token.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

### Step 2: Create Focused Evaluators

Create separate evaluators for each quality aspect. **Critical principle**: One evaluator = one quality dimension.

1. Go to **Evaluation** → **Evaluation Suite**
2. Click **Create New Evaluator**

**Example Evaluator 1: Response Completeness**
```
You are evaluating whether an AI response completely addresses the user's question.

Focus ONLY on completeness - ignore other quality aspects.

User Question: {input}
AI Response: {output}

Rate on a scale of 1-10:
1-2 = Missing major parts of the question
3-4 = Addresses some parts but incomplete
5-6 = Addresses most parts adequately  
7-8 = Addresses all parts well
9-10 = Thoroughly addresses every aspect

Output format:
Score: [1-10]
Reasoning: [Brief explanation]
```

**Example Evaluator 2: Accuracy Check**
```
You are checking if an AI response contains accurate information.

Focus ONLY on factual accuracy - ignore other aspects.

User Question: {input}
AI Response: {output}

Rate on a scale of 1-10:
1-2 = Contains obvious false information
3-4 = Contains questionable claims
5-6 = Mostly accurate with minor concerns
7-8 = Accurate information
9-10 = Completely accurate and verifiable

Output format:
Score: [1-10]
Reasoning: [Brief explanation]
```

<video 
  width="100%" 
  autoPlay 
  loop 
  muted 
  playsInline
  style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
>
  <source src="/assets/quickstart/evaluator_creation.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

### Step 3: Associate Evaluators to Your LLM Nodes

1. Go to **Agent Performance**
2. Select your LLM node (e.g., "response-generator")
3. Click on Manage Evaluators on the menu
4. Add your evaluators

<video 
  width="100%" 
  autoPlay 
  loop 
  muted 
  playsInline
  style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
>
  <source src="/assets/quickstart/associate_evaluator.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

### Step 4: Monitor Results

View real-time evaluation results in:
- **Tracing** tab: Individual evaluation scores
- **Agent Performance**: Quality trends over time

**Tracing Dashboard - Individual Evaluation Scores:**
![AI Agent Tracing Dashboard](/assets/overview/tracing.png)

**Agent Performance Dashboard - Quality Trends:**
![Agent Performance Dashboard](/assets/overview/general-handit.png)

> **Phase 2 Complete!** 🎉 Continuous evaluation is now running across multiple quality dimensions with real-time insights into performance trends.

**➡️ Want more sophisticated evaluators?** Check out our [detailed Evaluation Quickstart](https://docs.handit.ai/evaluation/quickstart) for advanced techniques.

## Phase 3: Self-Improving AI (15 minutes)

Finally, let's enable automatic optimization that generates better prompts and provides proven improvements.

### Step 1: Connect Optimization Models

1. Go to **Settings** → **Model Tokens**
2. Select optimization model tokens
3. Self-improving AI automatically activates once configured

<video 
  width="100%" 
  autoPlay 
  loop 
  muted 
  playsInline
  style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
>
  <source src="/assets/quickstart/model_token.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

> **Automatic Activation**: Once optimization tokens are configured, the system automatically begins analyzing evaluation data and generating optimizations. No additional setup required!

### Step 2: Monitor Optimization Results

The system is now automatically generating and testing improved prompts. Monitor results in two places:

**Agent Performance Dashboard:**
- View agent performance metrics
- Compare current vs optimized versions
- See improvement percentages

![Agent Performance Dashboard](/assets/overview/general-handit.png)

**Release Hub:**
- Go to **Optimization** → **Release Hub**
- View detailed prompt comparisons
- See statistical confidence and recommendations

![Release Hub - Prompt Performance Comparison](/assets/overview/prompt-comparison.png)

### Step 3: Deploy Optimizations

1. **Review Recommendations** in Release Hub
2. **Compare Performance** between current and optimized prompts
3. **Mark as Production** for prompts you want to deploy
4. **Fetch via SDK** in your application

<video 
  width="100%" 
  autoPlay 
  loop 
  muted 
  playsInline
  style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
>
  <source src="/assets/quickstart/ci:cd.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

**Fetch Optimized Prompts:**

```python
from handit import HanditTracker

# Initialize tracker
tracker = HanditTracker(api_key="your-api-key")

# Fetch current production prompt
optimized_prompt = tracker.fetch_optimized_prompt(
    model_id="response-generator"
)

# Use in your LLM calls
response = your_llm_client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": optimized_prompt},
        {"role": "user", "content": user_query}
    ]
)
```

> **Phase 3 Complete!** 🎉 You now have a self-improving AI that automatically detects quality issues, generates better prompts, tests them in the background, and provides proven improvements.

> **💡 Want advanced optimization features?**  
> Visit our [documentation](https://docs.handit.ai/)

---

## 📅 Roadmap

| Week | Focus                                               | Status         |
|------|------------------------------------------------------|----------------|
| 1    | Backend foundation + infrastructure                 | ✔️ Done |
| 2    | Prompt versioning + A2A routing logic               | ✔️ Done |
| 3    | Auto-evaluation + insight generation                | ✔️ Done |
| 4    | Deployment setup + UI + public release              | ✔️ Done |

---

## 🧪 Project Status

Handit is now open source and in active development!

This repo is live—but the full system is still under construction.  
Early adopters and contributors are welcome to **follow the build**, **open issues**, and **help shape what comes next**.

---

## 🚀 Getting Started

Handit is designed to be easy to run locally with Docker Compose. You can get both the backend (API) and frontend (dashboard) running with a single command.

### 1. Prerequisites
- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/)
- (Optional for advanced users) [Node.js](https://nodejs.org/) and [PostgreSQL](https://www.postgresql.org/)

### 2. Clone the Repository
```bash
git clone https://github.com/handit-ai/handit.ai.git
cd handit.ai
```

### 3. Environment Variables
Create a `.env` file in the root directory (or set the variables in your shell):
```
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```
You can also add any other environment variables required by the API or dashboard.

### 4. Run in Development Mode
This uses `docker-compose.dev.yml` for hot-reloading and local development:
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001/api](http://localhost:3001/api)
- Database: localhost:5432 (Postgres)
- Redis: localhost:6379

### 5. Run in Production Mode
This uses `docker-compose.yml` for a production-like environment:
```bash
docker compose -f docker-compose.yml up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001/api](http://localhost:3001/api)

### 6. Manual Local Setup (Advanced)
If you want to run the backend and frontend separately (without Docker):
- Install dependencies in each app:
  ```bash
  cd apps/api && npm install
  cd ../dashboard && npm install
  ```
- Start Postgres and Redis locally, and set up your `.env` files.
- Run the backend:
  ```bash
  cd apps/api
  npm run dev
  ```
- Run the frontend:
  ```bash
  cd apps/dashboard
  npm run dev
  ```

---

## 📚 Documentation

- Docs and hosted playground coming soon  
- For updates, follow the creators:
  - [Cristhian Neira](https://www.linkedin.com/in/cristhian-neira)
  - [Oliver Tex](https://www.linkedin.com/in/oliver-tex/)
    
---

## ✏️ Contributing

Want to help build the future of LLM agent optimization?  
We'll soon add:

- `CONTRIBUTING.md`
- Open issues
- Early test environments
- Handit SDKs

Join the Discord and say hi: <a href="https://discord.gg/fnWyEC4t" target="_blank">https://discord.gg/fnWyEC4t</a>

---

## 👥 Contributors

Thanks to everyone helping bring Handit to life:

<a href="https://github.com/handit-ai/handit.ai/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=handit-ai/handit.ai" />
</a>


> Want to appear here? Star the repo, follow along, and make your first PR 🙌

---

## 📄 License

MIT © 2025 – Built with 💡 by the Handit community


