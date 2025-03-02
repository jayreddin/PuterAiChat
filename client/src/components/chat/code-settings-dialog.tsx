import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface CodeSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CodeSettingsDialog = memo(({ 
  open, 
  onOpenChange 
}: CodeSettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Code Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-format Code</Label>
              <div className="text-sm text-muted-foreground">
                Automatically format code when pasting or inserting
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Syntax Highlighting</Label>
              <div className="text-sm text-muted-foreground">
                Enable syntax highlighting in code blocks
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Line Numbers</Label>
              <div className="text-sm text-muted-foreground">
                Show line numbers in code blocks
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Word Wrap</Label>
              <div className="text-sm text-muted-foreground">
                Wrap long lines of code
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

CodeSettingsDialog.displayName = "CodeSettingsDialog";