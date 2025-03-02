import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CodeSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CodeSettingsDialog({ open, onOpenChange }: CodeSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Code Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-detect">Auto Language Detect</Label>
            <Switch id="auto-detect" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="code-format">Code Format</Label>
            <Switch id="code-format" />
          </div>
          <Button variant="outline">View All Previous Code</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}