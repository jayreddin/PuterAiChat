import { useState, useCallback, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  name: string;
}

const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

export function ColorPicker({ value, onChange, name }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (isValidHex(newValue)) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleBlur = useCallback(() => {
    if (!isValidHex(inputValue)) {
      setInputValue(value);
    }
  }, [inputValue, value]);

  const handlePickerChange = useCallback((color: string) => {
    setInputValue(color);
    onChange(color);
  }, [onChange]);

  return (
    <div className="flex items-center gap-2">
      <div 
        className="flex-1 grid gap-2"
        style={{
          gridTemplateColumns: "auto 1fr"
        }}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[60px] p-0 aspect-square"
              aria-label={`Pick ${name} color`}
            >
              <div
                className="w-full h-full rounded-sm"
                style={{ 
                  background: isValidHex(inputValue) ? inputValue : value,
                  borderRadius: "var(--radius)" 
                }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            side="right" 
            className="w-auto p-3"
          >
            <HexColorPicker color={value} onChange={handlePickerChange} />
          </PopoverContent>
        </Popover>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium capitalize">
            {name.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="#000000"
            className="h-8 font-mono"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}