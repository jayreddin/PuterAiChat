import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modelGroups } from "@/lib/models";
import { ChevronDown } from "lucide-react";

interface ModelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  const currentModel = modelGroups
    .flatMap(group => group.models)
    .find(model => model.id === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[200px] border-none focus:ring-0 focus:ring-offset-0 p-0 [&>svg]:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">
            {currentModel?.name || "Select a model"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {modelGroups.map((group) => (
          <SelectGroup key={group.name}>
            <SelectLabel className="flex items-center gap-2 text-sm">
              <group.icon className={`h-3 w-3 ${group.color}`} />
              {group.name}
            </SelectLabel>
            {group.models.map((model) => (
              <SelectItem
                key={model.id}
                value={model.id}
                className="pl-6 text-sm"
              >
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}