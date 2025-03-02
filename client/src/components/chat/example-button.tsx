import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExampleCategory {
  name: string;
  examples: string[];
}

const exampleCategories: ExampleCategory[] = [
  {
    name: "Problem Solving",
    examples: [
      "Let me break down this problem step by step:\n1. First, I'll identify the key components\n2. Then analyze their relationships\n3. Finally, propose a solution based on the analysis",
      "To solve this problem, I'll use the following approach:\n1. Define the goal state\n2. Assess current constraints\n3. Map potential solutions\n4. Evaluate trade-offs"
    ]
  },
  {
    name: "Code Analysis",
    examples: [
      "Let's analyze this code:\n1. Review the architecture\n2. Identify potential bottlenecks\n3. Suggest optimizations\n4. Consider edge cases",
      "Code review process:\n1. Check for design patterns\n2. Evaluate performance implications\n3. Look for security concerns\n4. Assess maintainability"
    ]
  },
  {
    name: "Decision Making",
    examples: [
      "Decision framework:\n1. List all options\n2. Define evaluation criteria\n3. Compare pros and cons\n4. Make a recommendation",
      "Let's evaluate this decision:\n1. Current situation\n2. Desired outcome\n3. Available options\n4. Risk assessment\n5. Final recommendation"
    ]
  }
];

interface ExampleButtonProps {
  onSelect: (example: string) => void;
}

export const ExampleButton = memo(({ onSelect }: ExampleButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          Examples
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="grid gap-2 p-4">
          {exampleCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <h4 className="font-medium text-sm">{category.name}</h4>
              <div className="grid gap-1">
                {category.examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => {
                      onSelect(example);
                      setOpen(false);
                    }}
                  >
                    Example {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
});

ExampleButton.displayName = "ExampleButton";