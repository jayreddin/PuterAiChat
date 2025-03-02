import { memo, useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { defaultThemes, Theme, applyTheme, loadSavedTheme, ThemeColors } from "@/lib/themes";
import { ColorPicker } from "./color-picker";

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CustomTheme extends Theme {
  isCustom?: boolean;
}

export const SettingsDialog = memo(({
  open,
  onOpenChange
}: SettingsDialogProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [selectedTheme, setSelectedTheme] = useState<CustomTheme>(loadSavedTheme());
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customColors, setCustomColors] = useState<ThemeColors>(selectedTheme.colors);
  const [activeTab, setActiveTab] = useState("appearance");

  useEffect(() => {
    if (open) {
      const savedTheme = loadSavedTheme();
      setSelectedTheme(savedTheme);
      setCustomColors(savedTheme.colors);
      setIsCustomizing(savedTheme.id === 'custom');
    }
  }, [open]);

  const handleThemeChange = (themeId: string): void => {
    if (themeId === 'custom') {
      setIsCustomizing(true);
      const customTheme: CustomTheme = {
        id: 'custom',
        name: 'Custom Theme',
        colors: customColors,
        isCustom: true
      };
      setSelectedTheme(customTheme);
      applyTheme(customTheme);
    } else {
      setIsCustomizing(false);
      const theme = defaultThemes.find(t => t.id === themeId);
      if (theme) {
        setSelectedTheme(theme);
        applyTheme(theme);
      }
    }
  };

  const updateCustomColor = (key: keyof ThemeColors, value: string): void => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
    const customTheme: CustomTheme = {
      ...selectedTheme,
      colors: newColors,
      isCustom: true
    };
    setSelectedTheme(customTheme);
    applyTheme(customTheme);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your chat experience and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 h-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="appearance" className="space-y-6 p-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <div className="text-sm text-muted-foreground">
                      Choose your preferred theme
                    </div>
                  </div>
                  <Select 
                    value={selectedTheme.id} 
                    onValueChange={handleThemeChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>{selectedTheme.name}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {defaultThemes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Theme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 300px" }}>
                  {isCustomizing && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h5 className="font-medium mb-4">Customize Colors</h5>
                      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        {(Object.entries(customColors) as [keyof ThemeColors, string][]).map(([key, value]) => (
                          <ColorPicker
                            key={key}
                            name={key}
                            value={value}
                            onChange={(color) => updateCustomColor(key, color)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-6">
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
            </TabsContent>

            <TabsContent value="chat" className="space-y-6 p-1">
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
            </TabsContent>

            <TabsContent value="system" className="space-y-6 p-1">
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
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});

SettingsDialog.displayName = "SettingsDialog";
