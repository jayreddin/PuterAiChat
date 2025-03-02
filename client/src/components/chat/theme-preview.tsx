import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeColors } from "@/lib/themes";

interface ThemePreviewProps {
  colors: ThemeColors;
  className?: string;
}

export function ThemePreview({ colors, className = "" }: ThemePreviewProps) {
  return (
    <div 
      className={`rounded-lg p-4 ${className}`}
      style={{ background: colors.background, color: colors.foreground }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 style={{ color: colors.primary }} className="font-medium">Theme Preview</h3>
          <p style={{ color: colors["muted-foreground"] }} className="text-sm">
            See how your theme will look
          </p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Card Example */}
          <Card 
            className="p-3"
            style={{ 
              background: colors.card,
              color: colors["card-foreground"],
              borderColor: colors.border
            }}
          >
            <p className="text-sm mb-2">Card Example</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                style={{
                  background: colors.primary,
                  color: colors.background
                }}
              >
                Primary
              </Button>
              <Button
                size="sm"
                variant="secondary"
                style={{
                  background: colors.secondary,
                  color: colors.background
                }}
              >
                Secondary
              </Button>
              <Button
                size="sm"
                variant="destructive"
                style={{
                  background: colors.destructive,
                  color: colors["destructive-foreground"]
                }}
              >
                Destructive
              </Button>
            </div>
          </Card>

          {/* Input Example */}
          <div 
            className="flex items-center p-2 rounded-lg"
            style={{ background: colors.input }}
          >
            <input
              type="text"
              placeholder="Input example"
              className="bg-transparent outline-none flex-1 text-sm"
              style={{ color: colors.foreground }}
            />
            <Button
              size="sm"
              style={{
                background: colors.accent,
                color: colors.background
              }}
            >
              Action
            </Button>
          </div>

          {/* Muted Text */}
          <div 
            className="p-2 rounded-lg text-sm"
            style={{ background: colors.muted }}
          >
            <span style={{ color: colors["muted-foreground"] }}>
              Muted text example
            </span>
          </div>

          {/* Interactive Elements */}
          <div className="flex gap-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ background: colors.accent }}
            />
            <div 
              className="w-4 h-4 rounded-full"
              style={{ background: colors.ring }}
            />
            <div 
              className="w-4 h-4 rounded-full"
              style={{ background: colors.destructive }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}