import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Image,
  Upload,
  Brain,
  Globe,
  Code2,
  Settings
} from "lucide-react";
import { ImageUploadDialog } from "./image-upload-dialog";
import { FileUploadDialog } from "./file-upload-dialog";
import { DeepThinkDialog } from "./deep-think-dialog";
import { WebAddressDialog } from "./web-address-dialog";
import { CodeInputDialog } from "./code-input-dialog";
import { SettingsDialog } from "./settings-dialog";

interface UploadedImage {
  id: string;
  url: string;
}

interface UtilityBarProps {
  onImageUploaded: (images: UploadedImage[]) => void;
  onFileUploaded?: (files: { id: string; url: string; name: string }[]) => void;
  onDeepThink?: (prompt: string) => void;
  onWebAddress?: (url: string) => void;
  onCodeInput?: (code: string, language: string) => void;
  disabled?: boolean;
}

type DialogType = 'image' | 'file' | 'deepThink' | 'web' | 'code' | 'settings';

export function UtilityBar({
  onImageUploaded,
  onFileUploaded,
  onDeepThink,
  onWebAddress,
  onCodeInput,
  disabled
}: UtilityBarProps) {
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);

  const handleDialogClose = () => {
    setActiveDialog(null);
  };

  const handleDeepThink = (prompt: string) => {
    onDeepThink?.(prompt);
    handleDialogClose();
  };

  const handleWebAddress = (url: string) => {
    onWebAddress?.(url);
    handleDialogClose();
  };

  const handleCodeInput = (code: string, language: string) => {
    onCodeInput?.(code, language);
    handleDialogClose();
  };

  const handleImageUpload = (images: UploadedImage[]) => {
    onImageUploaded(images);
    handleDialogClose();
  };

  const handleFileUpload = (files: { id: string; url: string; name: string }[]) => {
    onFileUploaded?.(files);
    handleDialogClose();
  };

  return (
    <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-muted/50">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveDialog('image')}
        disabled={disabled}
        className="bg-background/95 backdrop-blur-sm shadow-sm"
        title="Upload Images"
      >
        <Image className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveDialog('file')}
        disabled={disabled}
        className="bg-background/95 backdrop-blur-sm shadow-sm"
        title="Upload Files"
      >
        <Upload className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveDialog('deepThink')}
        disabled={disabled}
        className="bg-background/95 backdrop-blur-sm shadow-sm"
        title="Deep Think"
      >
        <Brain className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveDialog('web')}
        disabled={disabled}
        className="bg-background/95 backdrop-blur-sm shadow-sm"
        title="Web Address"
      >
        <Globe className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveDialog('code')}
        disabled={disabled}
        className="bg-background/95 backdrop-blur-sm shadow-sm"
        title="Code"
      >
        <Code2 className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveDialog('settings')}
        disabled={disabled}
        className="bg-background/95 backdrop-blur-sm shadow-sm"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <ImageUploadDialog
        open={activeDialog === 'image'}
        onOpenChange={(open) => setActiveDialog(open ? 'image' : null)}
        onImagesUploaded={handleImageUpload}
      />

      <FileUploadDialog
        open={activeDialog === 'file'}
        onOpenChange={(open) => setActiveDialog(open ? 'file' : null)}
        onFilesUploaded={handleFileUpload}
      />

      <DeepThinkDialog
        open={activeDialog === 'deepThink'}
        onOpenChange={(open) => setActiveDialog(open ? 'deepThink' : null)}
        onSubmit={handleDeepThink}
      />

      <WebAddressDialog
        open={activeDialog === 'web'}
        onOpenChange={(open) => setActiveDialog(open ? 'web' : null)}
        onSubmit={handleWebAddress}
      />

      <CodeInputDialog
        open={activeDialog === 'code'}
        onOpenChange={(open) => setActiveDialog(open ? 'code' : null)}
        onSubmit={handleCodeInput}
      />

      <SettingsDialog
        open={activeDialog === 'settings'}
        onOpenChange={(open) => setActiveDialog(open ? 'settings' : null)}
      />
    </div>
  );
}
