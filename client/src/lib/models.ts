import { SiOpenai, SiGooglecloud, SiMeta } from "react-icons/si";
import { IconType } from "react-icons";

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
}

export interface ProviderGroup {
  name: string;
  icon: IconType;
  models: AIModel[];
  color: string;
}

export const modelGroups: ProviderGroup[] = [
  {
    name: "OpenAI",
    icon: SiOpenai,
    color: "text-green-500",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4 Mini", provider: "OpenAI" },
      { id: "gpt-4o", name: "GPT-4", provider: "OpenAI" },
      { id: "o3-mini", name: "O3 Mini", provider: "OpenAI" }
    ]
  },
  {
    name: "Anthropic",
    icon: SiOpenai, // Using OpenAI icon as placeholder
    color: "text-blue-500",
    models: [
      { id: "claude-3-7-sonnet", name: "Claude 3.7 Sonnet", provider: "Anthropic" },
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" }
    ]
  },
  {
    name: "Google",
    icon: SiGooglecloud,
    color: "text-yellow-500",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google" }
    ]
  },
  {
    name: "Mistral AI",
    icon: SiOpenai, // Using OpenAI icon as placeholder
    color: "text-purple-500",
    models: [
      { id: "mistral-large-latest", name: "Mistral Large", provider: "Mistral AI" },
      { id: "codestral-latest", name: "Codestral", provider: "Mistral AI" }
    ]
  },
  {
    name: "Others",
    icon: SiOpenai, // Using OpenAI icon as placeholder
    color: "text-gray-500",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat", provider: "High-Flyer" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner", provider: "High-Flyer" },
      { id: "google/gemma-2-27b-it", name: "Gemma 2 27B", provider: "Groq" },
      { id: "grok-beta", name: "Grok Beta", provider: "xAI" }
    ]
  }
];

export const DEFAULT_MODEL = "claude-3-7-sonnet";

export function getModelById(id: string): AIModel | undefined {
  for (const group of modelGroups) {
    const model = group.models.find(m => m.id === id);
    if (model) return model;
  }
  return undefined;
}

export function getProviderGroupForModel(id: string): ProviderGroup | undefined {
  return modelGroups.find(group =>
    group.models.some(model => model.id === id)
  );
}