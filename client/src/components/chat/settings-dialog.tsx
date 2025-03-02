import { memo, forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDarkMode } from "@/hooks/use-dark-mode";

interface SettingItemProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const SettingItem = memo(({ 
  id, 
  label, 
  description, 
  checked, 
  onCheckedChange,
  disabled = false 
}: SettingItemProps) => (
  <div className="flex items-center justify-between space-x-4">
    <div className="space-y-0.5">
      <Label 
        htmlFor={id}
        className={disabled ? "text-muted-foreground cursor-not-allowed" : ""}
      >
        {label}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={label}
    />
  </div>
));

SettingItem.displayName = "SettingItem";

interface Settings {
  darkMode: boolean;
  compactMode: boolean;
  autoSave: boolean;
  notifications: boolean;
}

const useSettings = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [settings, setSettings] = useState<Settings>(() => ({
    darkMode: isDarkMode,
    compactMode: localStorage.getItem("compactMode") === "true",
    autoSave: localStorage.getItem("autoSave") === "true",
    notifications: localStorage.getItem("notifications") === "true",
  }));

  const updateSetting = (key: keyof Settings, value: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem(key, String(value));
      return newSettings;
    });
    
    if (key === "darkMode") {
      toggleDarkMode();
    }
  };

  return { settings, updateSetting };
};

const SettingsDialogComponent = forwardRef<HTMLButtonElement>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting } = useSettings();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          ref={ref} 
          variant="ghost" 
          size="icon" 
          className="hover:bg-muted"
          aria-label="Settings"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[425px]"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <SettingItem
            id="dark-mode"
            label="Dark Mode"
            description="Toggle dark color theme"
            checked={settings.darkMode}
            onCheckedChange={(checked) => updateSetting("darkMode", checked)}
          />
          <SettingItem
            id="compact-mode"
            label="Compact Mode"
            description="Reduce spacing in the interface"
            checked={settings.compactMode}
            onCheckedChange={(checked) => updateSetting("compactMode", checked)}
          />
          <SettingItem
            id="auto-save"
            label="Auto Save"
            description="Automatically save changes"
            checked={settings.autoSave}
            onCheckedChange={(checked) => updateSetting("autoSave", checked)}
          />
          <SettingItem
            id="notifications"
            label="Notifications"
            description="Show desktop notifications"
            checked={settings.notifications}
            onCheckedChange={(checked) => updateSetting("notifications", checked)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});

SettingsDialogComponent.displayName = "SettingsDialog";

export const SettingsDialog = memo(SettingsDialogComponent);
