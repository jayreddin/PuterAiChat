import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { defaultThemes, Theme, applyTheme, loadSavedTheme, ThemeColors } from "@/lib/themes";
import { ColorPicker } from "./color-picker";
import { reasoningModels } from "@/lib/models";

interface ModelDetails {
  name: string;
  provider_release_date: string;
  parameter_count_context_window: string;
  key_capabilities: string[];
  speed_rating: string;
  cons: string[];
  tips_tricks: string[];
}

const modelDetails: ModelDetails[] = [
  {
    name: "GPT‑4o‑mini",
    provider_release_date: "OpenAI; Released July 18, 2024",
    parameter_count_context_window: "Estimated ~8B parameters; 128K tokens",
    key_capabilities: ["Chat", "Streaming", "Vision Input", "Code Generation", "Reasoning/Deep Think", "Audio"],
    speed_rating: "8/10",
    cons: [
      "Lower maximum output (≈16.4K tokens per request)",
      "Fewer “deep thinking” steps than larger variants",
      "Requires careful prompt engineering to fully leverage multimodality"
    ],
    tips_tricks: [
      "Use for high-volume applications where cost–efficiency is key.",
      "Combine streaming mode with prompt tuning to speed up responses.",
      "Optimize prompt length to control costs given the lower output cap."
    ]
  },
  {
    name: "GPT‑4o",
    provider_release_date: "OpenAI; Released May 13, 2024",
    parameter_count_context_window: "Exact parameter count undisclosed (flagship multimodal model); 128K tokens",
    key_capabilities: ["Chat", "Streaming", "Vision Input", "Code Generation", "Reasoning/Deep Think", "Audio"],
    speed_rating: "7/10",
    cons: [
      "Higher resource usage compared to mini variants",
      "May be overkill for simple interactions",
      "Longer processing times for “deep think” tasks due to complexity"
    ],
    tips_tricks: [
      "Ideal for multimodal tasks that require integrated text, image, and audio analysis.",
      "Leverage advanced voice mode for conversational applications.",
      "Integrate via API for tasks demanding top-tier reasoning."
    ]
  },
  {
    name: "o3‑mini",
    provider_release_date: "OpenAI; Released January 31, 2025",
    parameter_count_context_window: "Estimated similar to GPT‑4o‑mini (~8B parameters); ~128K tokens",
    key_capabilities: ["Chat", "Streaming", "Reasoning/Deep Think", "Code Generation"],
    speed_rating: "9/10",
    cons: [
      "Sacrifices some breadth of reasoning compared to the full‑o3 model",
      "May be less robust on non-technical creative tasks",
      "Documentation can be sparse due to its recent release"
    ],
    tips_tricks: [
      "Experiment with the reasoning effort setting to balance speed and accuracy.",
      "Use for technical, math, and coding tasks requiring quick turnaround.",
      "Monitor API rate limits if using the high‑compute variant (o3‑mini‑high)."
    ]
  },
  {
    name: "o1‑mini",
    provider_release_date: "OpenAI; Initially released in September 2024 (now largely superseded by o3‑mini)",
    parameter_count_context_window: "Likely similar to early mini models (~8B parameters); extended context comparable to o3‑mini",
    key_capabilities: ["Chat", "Streaming", "Reasoning", "Code Generation"],
    speed_rating: "6/10",
    cons: [
      "Outperformed by o3‑mini in technical benchmarks",
      "Limited reasoning steps may yield less accurate responses",
      "Legacy model with reduced support compared to newer versions"
    ],
    tips_tricks: [
      "Use in legacy integrations where o1‑mini is already deployed.",
      "Optimize prompts to maximize its limited reasoning capacity.",
      "Consider upgrading to o3‑mini for more demanding tasks."
    ]
  },
  {
    name: "claude‑3‑7‑sonnet",
    provider_release_date: "Anthropic; Released February 24, 2025",
    parameter_count_context_window: "Exact count undisclosed; 200K tokens",
    key_capabilities: ["Chat", "Streaming", "Code Generation", "Reasoning/Deep Think"],
    speed_rating: "5/10",
    cons: [
      "High cost per token ($3 input, $15 output)",
      "Slower throughput due to extended reasoning features",
      "Increased latency may affect real-time applications"
    ],
    tips_tricks: [
      "Use extended thinking mode only when deep reasoning is required.",
      "Leverage the scratchpad to inspect and refine its reasoning process.",
      "Adjust the “thinking budget” to balance cost and response time."
    ]
  },
  {
    name: "claude‑3‑5‑sonnet",
    provider_release_date: "Anthropic; Released around June 2024",
    parameter_count_context_window: "Proprietary; 200K tokens",
    key_capabilities: ["Chat", "Streaming", "Code Generation", "Reasoning"],
    speed_rating: "6/10",
    cons: [
      "Slightly less advanced in deep reasoning than claude‑3‑7",
      "High cost remains compared to OpenAI models",
      "May need careful prompt design to avoid over‑thinking"
    ],
    tips_tricks: [
      "Use for balanced applications needing both speed and reasoning quality.",
      "Test both 3.5 and 3.7 versions to find the optimal fit.",
      "Monitor token usage to control operational costs."
    ]
  },
  {
    name: "deepseek‑chat",
    provider_release_date: "DeepSeek (High‑Flyer); Released circa 2024",
    parameter_count_context_window: "Not publicly disclosed; competitive with mid‑tier models",
    key_capabilities: ["Chat", "Streaming", "Code Generation", "Reasoning"],
    speed_rating: "6/10",
    cons: [
      "May lack robustness on complex or technical queries",
      "Lower overall language understanding compared to leading models",
      "Limited documentation for fine‑tuning"
    ],
    tips_tricks: [
      "Use for cost‑effective chat applications where extreme accuracy isn’t critical.",
      "Experiment with prompt re‑phrasing to improve clarity.",
      "Combine with external verification if used for sensitive tasks."
    ]
  },
  {
    name: "deepseek‑reasoner",
    provider_release_date: "DeepSeek; Released circa 2024",
    parameter_count_context_window: "Not publicly disclosed",
    key_capabilities: ["Chat", "Streaming", "Reasoning/Deep Think", "Code Generation"],
    speed_rating: "6/10",
    cons: [
      "May be less versatile than deepseek‑chat",
      "Lacks extensive coding benchmarks",
      "Overall robustness is lower than top‑tier models"
    ],
    tips_tricks: [
      "Use for dedicated reasoning tasks where cost is critical.",
      "Pair with manual oversight for coding tasks.",
      "Test varied prompts to determine optimal reasoning depth."
    ]
  },
  {
    name: "gemini‑2.0‑flash",
    provider_release_date: "Google (DeepMind/Google); Released December 2024 (experimental, then default in early 2025)",
    parameter_count_context_window: "Not fully disclosed; advanced configurations may support very high context (up to hundreds of thousands tokens)",
    key_capabilities: ["Chat", "Streaming", "Vision Input", "Code Generation", "Reasoning/Deep Think", "Audio"],
    speed_rating: "8/10",
    cons: [
      "Experimental status may lead to occasional instability",
      "Integration can be complex in Google Cloud environments",
      "Extended context features may need tuning"
    ],
    tips_tricks: [
      "Use via Vertex AI for seamless integration.",
      "Test extensively with multimodal prompts to fine-tune performance.",
      "Leverage “flash” mode for rapid iterative tasks."
    ]
  },
  {
    name: "gemini‑1.5‑flash",
    provider_release_date: "Google; Released around May 2024",
    parameter_count_context_window: "Estimated mid‑tier (possibly 50–70B parameters); context window very large (potentially up to 1M tokens)",
    key_capabilities: ["Chat", "Streaming", "Vision Input", "Code Generation", "Reasoning/Deep Think", "Audio"],
    speed_rating: "7/10",
    cons: [
      "Slightly lower performance on deep reasoning compared to Gemini 2.0",
      "May experience variable latency due to extremely large context windows",
      "Experimental integration may require additional configuration"
    ],
    tips_tricks: [
      "Use for tasks requiring very long context (e.g., document summarization).",
      "Optimize prompts to avoid overwhelming the context limits.",
      "Monitor performance via cloud dashboards to optimize throughput."
    ]
  },
  {
    name: "meta‑llama/Meta‑Llama‑3.1‑8B‑Instruct‑Turbo",
    provider_release_date: "Meta AI (via Together AI); Released July 23, 2024",
    parameter_count_context_window: "8B parameters; 128K tokens",
    key_capabilities: ["Chat", "Streaming", "Code Generation", "Reasoning"],
    speed_rating: "8/10",
    cons: [
      "Limited deep reasoning due to smaller parameter count",
      "Not ideal for complex coding or analytical challenges",
      "Text‑only modality limits multimodal use cases"
    ],
    tips_tricks: [
      "Use for lightweight, cost-efficient applications.",
      "Fine-tune on domain-specific data for improved performance.",
      "Ideal for rapid prototyping and testing."
    ]
  },
  {
    name: "meta‑llama/Meta‑Llama‑3.1‑70B‑Instruct‑Turbo",
    provider_release_date: "Meta AI (via Together AI); Released July 23, 2024",
    parameter_count_context_window: "70B parameters; 128K tokens",
    key_capabilities: ["Chat", "Streaming", "Code Generation", "Reasoning"],
    speed_rating: "6/10",
    cons: [
      "Higher computational load leads to slower responses",
      "Requires significant hardware resources",
      "Increased cost per token compared to smaller models"
    ],
    tips_tricks: [
      "Use when deep reasoning and accuracy are critical.",
      "Batch requests to optimize throughput.",
      "Monitor resource usage to balance performance and cost."
    ]
  },
  {
    name: "meta‑llama/Meta‑Llama‑3.1‑405B‑Instruct‑Turbo",
    provider_release_date: "Meta AI (via Together AI); Released July 23, 2024",
    parameter_count_context_window: "405B parameters; 128K tokens",
    key_capabilities: ["Chat", "Streaming", "Code Generation", "Reasoning/Deep Think"],
    speed_rating: "4/10",
    cons: [
      "Very heavy computational requirements lead to slower response times",
      "Expensive to run in real-time environments",
      "Overkill for many everyday applications"
    ],
    tips_tricks: [
      "Use for high-complexity tasks in batch or offline processing.",
      "Optimize prompt length to control costs and latency.",
      "Deploy on specialized hardware or high-compute cloud environments."
    ]
  },
  {
    name: "mistral‑large‑latest",
    provider_release_date: "Mistral AI; Latest version released circa early 2025",
    parameter_count_context_window: "Likely around 7B parameters; standard context window (~4K tokens)",
    key_capabilities: ["Chat", "Streaming", "Reasoning", "Code Generation"],
    speed_rating: "9/10",
    cons: [
      "Limited performance on complex reasoning or coding tasks",
      "Smaller size may reduce nuance in creative outputs",
      "Less suited for heavy-duty enterprise applications"
    ],
    tips_tricks: [
      "Ideal for real-time applications where speed is critical.",
      "Use for interactive chatbots and low-latency tasks.",
      "Fine-tune on domain-specific data to improve accuracy."
    ]
  },
  {
    name: "pixtral‑large‑latest",
    provider_release_date: "Likely from a team in the Mistral ecosystem; released circa 2025",
    parameter_count_context_window: "Exact figures not public; may be similar to mistral‑large",
    key_capabilities: ["Chat", "Streaming", "Vision Input", "Code/Reasoning"],
    speed_rating: "8/10",
    cons: [
      "Experimental; detailed benchmarks are limited",
      "May lack robustness for heavy reasoning tasks",
      "Integration may require extra configuration for multimodal inputs"
    ],
    tips_tricks: [
      "Test thoroughly for creative and multimodal workflows.",
      "Use in environments where image input adds value.",
      "Keep an eye on emerging benchmarks for performance tuning."
    ]
  },
  {
    name: "codestral‑latest",
    provider_release_date: "Likely from the same family as pixtral, specialized for coding; circa 2025",
    parameter_count_context_window: "Not explicitly disclosed; tuned for code tasks",
    key_capabilities: ["Chat", "Streaming", "Code Generation", "Reasoning"],
    speed_rating: "7/10",
    cons: [
      "Too specialized; less versatile for general language tasks",
      "Lacks multimodal input support",
      "Documentation and community support might be limited"
    ],
    tips_tricks: [
      "Integrate directly with IDEs for real-time code assistance.",
      "Use for automated code refactoring and debugging.",
      "Fine-tune on your own codebase to enhance specificity."
    ]
  },
  {
    name: "google/gemma‑2‑27b‑it",
    provider_release_date: "Google; Released circa 2024",
    parameter_count_context_window: "27B parameters; context window likely around 16K tokens (varies)",
    key_capabilities: ["Chat", "Streaming", "Code Generation", "Reasoning/Deep Think"],
    speed_rating: "7/10",
    cons: [
      "Context window may be lower than top competitors",
      "Limited multimodal support versus newer Gemini models",
      "May not excel in highly technical or creative tasks"
    ],
    tips_tricks: [
      "Use for balanced tasks where cost and performance are weighted equally.",
      "Integrate via Google Cloud for optimized performance.",
      "Experiment with prompt tuning to maximize reasoning efficiency."
    ]
  },
  {
    name: "grok‑beta",
    provider_release_date: "xAI; Released in early 2025 (beta)",
    parameter_count_context_window: "Exact figures not public; rumored to be mid- to large-scale",
    key_capabilities: ["Chat", "Streaming", "Reasoning", "Code Generation"],
    speed_rating: "7/10",
    cons: [
      "Beta status implies potential instability and evolving performance",
      "Documentation may be less mature",
      "Fine-tuning options may be limited initially"
    ],
    tips_tricks: [
      "Use for exploratory applications to gauge evolving capabilities.",
      "Provide clear, concise prompts to help guide reasoning.",
      "Stay updated on new releases as the beta matures for improved stability."
    ]
  }
];

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CustomTheme extends Theme {
  isCustom?: boolean;
}

export const SettingsDialog = memo(({
  open,
  onOpenChange
}: SettingsDialogProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [selectedTheme, setSelectedTheme] = useState<CustomTheme>(loadSavedTheme());
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customColors, setCustomColors] = useState<ThemeColors>(selectedTheme.colors);
  const [activeTab, setActiveTab] = useState("appearance");

  useEffect(() => {
    if (open) {
      const savedTheme = loadSavedTheme();
      setSelectedTheme(savedTheme);
      setCustomColors(savedTheme.colors);
      setIsCustomizing(savedTheme.id === 'custom');
    }
  }, [open]);

  const handleThemeChange = (themeId: string): void => {
    if (themeId === 'custom') {
      setIsCustomizing(true);
      const customTheme: CustomTheme = {
        id: 'custom',
        name: 'Custom Theme',
        colors: customColors,
        isCustom: true
      };
      setSelectedTheme(customTheme);
      applyTheme(customTheme);
    } else {
      setIsCustomizing(false);
      const theme = defaultThemes.find(t => t.id === themeId);
      if (theme) {
        setSelectedTheme(theme);
        applyTheme(theme);
      }
    }
  };

  const updateCustomColor = (key: keyof ThemeColors, value: string): void => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    const customTheme: CustomTheme = {
      ...selectedTheme,
      colors: newColors,
      isCustom: true
    };
    setSelectedTheme(customTheme);
    applyTheme(customTheme);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your chat experience and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 h-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="ai_models">AI Models</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="appearance" className="space-y-6 p-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <div className="text-sm text-muted-foreground">
                      Choose your preferred theme
                    </div>
                  </div>
                  <Select 
                    value={selectedTheme.id} 
                    onValueChange={handleThemeChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>{selectedTheme.name}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {defaultThemes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Theme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 300px" }}>
                  {isCustomizing && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h5 className="font-medium mb-4">Customize Colors</h5>
                      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        {(Object.entries(customColors) as [keyof ThemeColors, string][]).map(([key, value]) => (
                          <ColorPicker
                            key={key}
                            name={key}
                            value={value}
                            onChange={(color) => updateCustomColor(key, color)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </div>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                    aria-label="Toggle dark mode"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6 p-1">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Chat Preferences</h4>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Message Timestamps</Label>
                    <div className="text-sm text-muted-foreground">
                      Show timestamps on messages
                    </div>
                  </div>
                  <Switch
                    defaultChecked={true}
                    aria-label="Toggle message timestamps"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Scroll</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically scroll to new messages
                    </div>
                  </div>
                  <Switch
                    defaultChecked={true}
                    aria-label="Toggle auto scroll"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6 p-1">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">System</h4>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Reduce spacing and padding
                    </div>
                  </div>
                  <Switch
                    defaultChecked={false}
                    aria-label="Toggle compact mode"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hardware Acceleration</Label>
                    <div className="text-sm text-muted-foreground">
                      Use GPU for better performance
                    </div>
                  </div>
                  <Switch
                    defaultChecked={true}
                    aria-label="Toggle hardware acceleration"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai_models" className="space-y-6 p-1">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">AI Model Details</h4>
                <Separator />
                {modelDetails.map((model) => (
                  <div key={model.name} className="border rounded-lg p-4">
                    <h5 className="font-medium">{model.name}</h5>
                    <p className="text-sm text-muted-foreground">{model.provider_release_date}</p>
                    <p className="text-sm text-muted-foreground">{model.parameter_count_context_window}</p>
                    <h6 className="font-medium mt-2">Key Capabilities:</h6>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {model.key_capabilities.map((cap, index) => (
                        <li key={index}>{cap}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground">Speed Rating: {model.speed_rating}</p>
                    <h6 className="font-medium mt-2">Cons:</h6>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {model.cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                    <h6 className="font-medium mt-2">Tips & Tricks:</h6>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {model.tips_tricks.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});

SettingsDialog.displayName = "SettingsDialog";
export default SettingsDialog;
