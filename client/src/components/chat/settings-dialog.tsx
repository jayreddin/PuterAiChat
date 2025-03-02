import { memo } from "react";
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
import { useDarkMode } from "@/hooks/use-dark-mode";

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = memo(({
  open,
  onOpenChange
}: SettingsDialogProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your chat experience and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Appearance</h4>
            <Separator />
            <div className="flex items-center justify-between">
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

          {/* Chat Preferences */}
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

          {/* System Settings */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
});

SettingsDialog.displayName = "SettingsDialog";
