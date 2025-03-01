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

interface ModelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] h-8 text-sm">
        <SelectValue placeholder="Select a model" />
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