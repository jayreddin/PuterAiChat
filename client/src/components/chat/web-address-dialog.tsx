import { memo, useState, forwardRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";

interface WebAddressDialogProps {
  onInsert: (text: string) => void;
}

interface FormFields {
  url: string;
  text: string;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const FormField = memo(({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="col-span-3"
      placeholder={placeholder}
    />
  </div>
));

FormField.displayName = "FormField";

const WebAddressDialogComponent = forwardRef<HTMLButtonElement, WebAddressDialogProps>(({ onInsert }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FormFields>({ url: "", text: "" });
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFields({ url: "", text: "" });
    setError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!fields.url.trim()) {
      setError("URL is required");
      return;
    }

    // Add http:// if no protocol specified
    const urlWithProtocol = /^https?:\/\//i.test(fields.url) 
      ? fields.url 
      : `http://${fields.url}`;

    if (!isValidUrl(urlWithProtocol)) {
      setError("Please enter a valid URL");
      return;
    }

    const markdownLink = fields.text.trim() 
      ? `[${fields.text}](${urlWithProtocol})` 
      : urlWithProtocol;
    
    onInsert(markdownLink);
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button ref={ref} variant="ghost" size="icon" className="hover:bg-muted">
          <Link className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <FormField
              id="url"
              label="URL"
              value={fields.url}
              onChange={(value) => {
                setFields(prev => ({ ...prev, url: value }));
                setError(null);
              }}
              placeholder="https://example.com"
            />
            <FormField
              id="text"
              label="Text"
              value={fields.text}
              onChange={(value) => setFields(prev => ({ ...prev, text: value }))}
              placeholder="(Optional) Display text"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 px-4">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button type="submit">
              Insert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

WebAddressDialogComponent.displayName = "WebAddressDialog";

export const WebAddressDialog = memo(WebAddressDialogComponent);
