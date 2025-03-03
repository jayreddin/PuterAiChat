export interface ReasoningModel {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  provider: string;
  logo?: string;
}

export const reasoningModels: ReasoningModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT 4o Mini",
    description: "OpenAI",
    isAvailable: true,
    provider: "OpenAI",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg"
  },
  {
    id: "gpt-4o",
    name: "GPT 4o",
    description: "OpenAI",
    isAvailable: true,
    provider: "OpenAI",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg"
  },
  {
    id: "o3-mini",
    name: "o3 Mini",
    description: "OpenAI",
    isAvailable: true,
    provider: "OpenAI",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg"
  },
  {
    id: "o1-mini",
    name: "o1 Mini",
    description: "OpenAI",
    isAvailable: true,
    provider: "OpenAI",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg"
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic",
    isAvailable: true,
    provider: "Anthropic",
    logo: "https://api.iconify.design/simple-icons:anthropic.svg"
  },
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    description: "Anthropic",
    isAvailable: true,
    provider: "Anthropic",
    logo: "https://api.iconify.design/simple-icons:anthropic.svg"
  },
  {
    id: "deepseek-chat",
    name: "Deepseek Chat",
    description: "High-Flyer (DeepSeek)",
    isAvailable: true,
    provider: "High-Flyer (DeepSeek)",
    logo: "https://www.deepseek.com/favicon.ico"
  },
  {
    id: "deepseek-reasoner",
    name: "Deepseek Reasoner",
    description: "High-Flyer (DeepSeek)",
    isAvailable: true,
    provider: "High-Flyer (DeepSeek)",
    logo: "https://www.deepseek.com/favicon.ico"
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Google",
    isAvailable: true,
    provider: "Google",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg"
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Google",
    isAvailable: true,
    provider: "Google",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg"
  },
  {
    id: "google/gemma-2-27b-it",
    name: "Gemma 2 it",
    description: "Google",
    isAvailable: true,
    provider: "Google",
    logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg"
  },
  {
    id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    name: "Meta Llama 3.1 8B Turbo",
    description: "Together.ai",
    isAvailable: true,
    provider: "Together.ai",
    logo: "https://assets-global.website-files.com/64f6f2c0e3f4c5a91c1e823a/64f6f2c0e3f4c5a91c1e8531_togetherai-logo.svg"
  },
  {
    id: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    name: "Meta Llama 3.1 70B Turbo",
    description: "Together.ai",
    isAvailable: true,
    provider: "Together.ai",
    logo: "https://assets-global.website-files.com/64f6f2c0e3f4c5a91c1e823a/64f6f2c0e3f4c5a91c1e8531_togetherai-logo.svg"
  },
  {
    id: "meta-llama/Meta-Llama-3.1-405B-Instruct Turbo",
    name: "Meta Llama 3.1 405B Turbo",
    description: "Together.ai",
    isAvailable: true,
    provider: "Together.ai",
    logo: "https://assets-global.website-files.com/64f6f2c0e3f4c5a91c1e823a/64f6f2c0e3f4c5a91c1e8531_togetherai-logo.svg"
  },
  {
    id: "mistral-large-latest",
    name: "Mistral Large",
    description: "Mistral AI",
    isAvailable: true,
    provider: "Mistral AI",
    logo: "https://mistral.ai/favicon.ico"
  },
  {
    id: "pixtral-large-latest",
    name: "Pixtral Large",
    description: "Mistral AI",
    isAvailable: true,
    provider: "Mistral AI",
    logo: "https://mistral.ai/favicon.ico"
  },
  {
    id: "codestral-latest",
    name: "Codestral",
    description: "Mistral AI",
    isAvailable: true,
    provider: "Mistral AI",
    logo: "https://mistral.ai/favicon.ico"
  },
  {
    id: "grok-beta",
    name: "Grok Beta",
    description: "xAI",
    isAvailable: true,
    provider: "xAI",
    logo: "https://x.ai/favicon.ico"
  }
];

export const getModelById = (id: string): ReasoningModel | undefined => {
  return reasoningModels.find(model => model.id === id);
};

export const getDefaultModel = (): ReasoningModel => {
  return reasoningModels[0];
};

export const saveSelectedModel = (modelId: string): void => {
  localStorage.setItem('selectedReasoningModel', modelId);
};

export const loadSavedModel = (): ReasoningModel => {
  const savedModelId = localStorage.getItem('selectedReasoningModel');
  return getModelById(savedModelId || 'gpt-4o-mini') || getDefaultModel();
};

export interface ReasoningExample {
  title: string;
  content: string;
}

export const reasoningExamples: ReasoningExample[] = [
  {
    title: "Basic Problem Solving",
    content: `Let me think about this step by step:
1. First, I'll clearly identify the key components of the problem
2. Then, I'll list any important constraints or requirements
3. Next, I'll break down the problem into smaller, manageable parts
4. For each part, I'll develop a potential solution
5. Finally, I'll combine these solutions into a cohesive approach
Let's begin...`
  },
  {
    title: "Complex Analysis",
    content: `Let me analyze this systematically:
1. I'll start by gathering all relevant information
2. Next, I'll identify any patterns or relationships
3. Then, I'll examine potential causes and effects
4. I'll consider multiple perspectives and interpretations
5. After that, I'll evaluate the implications
6. Finally, I'll form a comprehensive conclusion
Now, let's examine each aspect...`
  },
  {
    title: "Decision Making Framework",
    content: `Let me approach this decision methodically:
1. First, I'll list all available options
2. Then, I'll define the key criteria for evaluation
3. Next, I'll assess each option against these criteria
4. I'll identify potential risks and benefits
5. After that, I'll weigh the trade-offs
6. Finally, I'll recommend the best course of action
Let's evaluate each option...`
  },
  {
    title: "Strategy Development",
    content: `Let me develop a strategic approach:
1. First, I'll analyze the current situation
2. Then, I'll identify the desired outcome
3. Next, I'll brainstorm potential strategies
4. I'll evaluate the feasibility of each strategy
5. Following that, I'll outline required resources
6. Finally, I'll create an implementation plan
Let's begin the analysis...`
  }
];

// Simple examples array for backward compatibility
const examples = [
  "What are the steps to bake a cake?",
  "Explain the theory of relativity.",
  "Write a short story about a cat.",
  "Translate 'hello world' to Spanish.",
  "What is the capital of France?"
];

export { examples };