import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { reasoningModels, ReasoningModel } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  isDeepThinkActive?: boolean;
}

export function ModelSelect({ value, onValueChange, className, isDeepThinkActive = false }: ModelSelectProps) {
  const selectedModel = reasoningModels.find(model => model.id === value);

  // Group models by provider
  const groupedModels = reasoningModels.reduce((groups, model) => {
    const provider = model.provider;
    if (!groups[provider]) {
      groups[provider] = [];
    }
    groups[provider].push(model);
    return groups;
  }, {} as { [provider: string]: ReasoningModel[] });

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          className={`w-[220px] ${
            isDeepThinkActive 
              ? 'bg-yellow-200 dark:bg-yellow-700' 
              : ''
          }`}
        >
          <SelectValue>
            <div className="flex items-center gap-2">
              {selectedModel?.logo && (
                <div className="w-5 h-5 flex-shrink-0">
                  <img
                    src={selectedModel.logo}
                    alt={`${selectedModel.provider} Logo`}
                    className="w-full h-full object-contain dark:invert"
                  />
                </div>
              )}
              <span className="truncate">{selectedModel?.name || "Select a model"}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedModels).map(([provider, models]) => (
            <SelectGroup key={provider}>
              <SelectLabel className="font-semibold px-2 py-1.5 flex items-center gap-2">
                {models[0]?.logo && (
                  <div className="w-4 h-4 flex-shrink-0">
                    <img
                      src={models[0].logo}
                      alt={`${provider} Logo`}
                      className="w-full h-full object-contain dark:invert"
                    />
                  </div>
                )}
                {provider}
              </SelectLabel>
              <SelectSeparator className="my-1" />
              {models.map((model) => (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  disabled={!model.isAvailable}
                  className="py-2"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center flex-1 min-w-0 gap-2">
                      <span className="truncate flex-1">{model.name}</span>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 flex-shrink-0 hover:bg-accent rounded-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="right" 
                            className="max-w-[250px] text-sm"
                            align="start"
                          >
                            <p>{model.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}