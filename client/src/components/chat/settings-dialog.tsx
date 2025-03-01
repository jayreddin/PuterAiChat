import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsDialogProps {
  onSave: (settings: UserSettings) => void;
  settings: UserSettings;
}

export interface UserSettings {
  customPrompt: string;
  theme: "light" | "dark" | "system";
  textSize: "small" | "medium" | "large";
  userName: string;
}

export function SettingsDialog({ onSave, settings }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Settings className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your application preferences.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                value={localSettings.userName}
                onChange={(e) => setLocalSettings({...localSettings, userName: e.target.value})}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={localSettings.theme} 
                onValueChange={(value) => setLocalSettings({...localSettings, theme: value as "light" | "dark" | "system"})}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="textSize">Text Size</Label>
              <Select 
                value={localSettings.textSize} 
                onValueChange={(value: "small" | "medium" | "large") => setLocalSettings({...localSettings, textSize: value})}
              >
                <SelectTrigger id="textSize">
                  <SelectValue placeholder="Select text size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customPrompt">Custom AI Prompt</Label>
              <Textarea
                id="customPrompt"
                placeholder="Enter custom instructions for the AI model"
                value={localSettings.customPrompt}
                onChange={(e) => setLocalSettings({...localSettings, customPrompt: e.target.value})}
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                These instructions will be sent to the AI model with every message.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
