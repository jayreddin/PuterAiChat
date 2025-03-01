import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modelGroups, type AIModel } from "@/lib/models";

interface ModelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {modelGroups.map((group) => (
          <SelectGroup key={group.name}>
            <SelectLabel className="flex items-center gap-2">
              <group.icon className={`h-4 w-4 ${group.color}`} />
              {group.name}
            </SelectLabel>
            {group.models.map((model) => (
              <SelectItem
                key={model.id}
                value={model.id}
                className="pl-6"
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
