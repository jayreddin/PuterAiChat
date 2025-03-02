export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  'muted-foreground': string;
  popover: string;
  'popover-foreground': string;
  border: string;
  input: string;
  card: string;
  'card-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  ring: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const defaultThemes: Theme[] = [
  {
    id: "system",
    name: "System Default",
    colors: {
      primary: "#000000",
      secondary: "#6c757d",
      accent: "#007bff",
      background: "#ffffff",
      foreground: "#000000",
      muted: "#f1f5f9",
      'muted-foreground': "#64748b",
      popover: "#ffffff",
      'popover-foreground': "#000000",
      border: "#e2e8f0",
      input: "#e2e8f0",
      card: "#ffffff",
      'card-foreground': "#000000",
      destructive: "#ff0000",
      'destructive-foreground': "#ffffff",
      ring: "#007bff"
    }
  },
  {
    id: "light",
    name: "Light Theme",
    colors: {
      primary: "#1a1a1a",
      secondary: "#4a4a4a",
      accent: "#0066cc",
      background: "#ffffff",
      foreground: "#000000",
      muted: "#f1f5f9",
      'muted-foreground': "#64748b",
      popover: "#ffffff",
      'popover-foreground': "#000000",
      border: "#e2e8f0",
      input: "#e2e8f0",
      card: "#ffffff",
      'card-foreground': "#000000",
      destructive: "#dc2626",
      'destructive-foreground': "#ffffff",
      ring: "#0066cc"
    }
  },
  {
    id: "dark",
    name: "Dark Theme",
    colors: {
      primary: "#ffffff",
      secondary: "#a0a0a0",
      accent: "#3399ff",
      background: "#1a1a1a",
      foreground: "#ffffff",
      muted: "#27272a",
      'muted-foreground': "#a1a1aa",
      popover: "#1a1a1a",
      'popover-foreground': "#ffffff",
      border: "#27272a",
      input: "#27272a",
      card: "#1a1a1a",
      'card-foreground': "#ffffff",
      destructive: "#dc2626",
      'destructive-foreground': "#ffffff",
      ring: "#3399ff"
    }
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    colors: {
      primary: "#e6e6ff",
      secondary: "#b3b3ff",
      accent: "#4d4dff",
      background: "#000033",
      foreground: "#ffffff",
      muted: "#000066",
      'muted-foreground': "#b3b3ff",
      popover: "#000033",
      'popover-foreground': "#ffffff",
      border: "#000066",
      input: "#000066",
      card: "#000044",
      'card-foreground': "#ffffff",
      destructive: "#ff3333",
      'destructive-foreground': "#ffffff",
      ring: "#4d4dff"
    }
  },
  {
    id: "forest-green",
    name: "Forest Green",
    colors: {
      primary: "#e6ffe6",
      secondary: "#b3ffb3",
      accent: "#00cc00",
      background: "#003300",
      foreground: "#ffffff",
      muted: "#004400",
      'muted-foreground': "#b3ffb3",
      popover: "#003300",
      'popover-foreground': "#ffffff",
      border: "#004400",
      input: "#004400",
      card: "#003300",
      'card-foreground': "#ffffff",
      destructive: "#ff3333",
      'destructive-foreground': "#ffffff",
      ring: "#00cc00"
    }
  },
  {
    id: "desert-sand",
    name: "Desert Sand",
    colors: {
      primary: "#4d3319",
      secondary: "#996633",
      accent: "#ffcc99",
      background: "#fff5e6",
      foreground: "#000000",
      muted: "#f0e6d9",
      'muted-foreground': "#996633",
      popover: "#fff5e6",
      'popover-foreground': "#000000",
      border: "#d9c4b0",
      input: "#f0e6d9",
      card: "#fff5e6",
      'card-foreground': "#000000",
      destructive: "#cc3300",
      'destructive-foreground': "#ffffff",
      ring: "#ffcc99"
    }
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    colors: {
      primary: "#003366",
      secondary: "#0066cc",
      accent: "#66ccff",
      background: "#e6f3ff",
      foreground: "#000000",
      muted: "#d9ebff",
      'muted-foreground': "#0066cc",
      popover: "#e6f3ff",
      'popover-foreground': "#000000",
      border: "#b3d9ff",
      input: "#d9ebff",
      card: "#e6f3ff",
      'card-foreground': "#000000",
      destructive: "#cc0000",
      'destructive-foreground': "#ffffff",
      ring: "#66ccff"
    }
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    colors: {
      primary: "#ff6600",
      secondary: "#ff944d",
      accent: "#ffb380",
      background: "#fff0e6",
      foreground: "#000000",
      muted: "#ffe6d9",
      'muted-foreground': "#cc5200",
      popover: "#fff0e6",
      'popover-foreground': "#000000",
      border: "#ffccb3",
      input: "#ffe6d9",
      card: "#fff0e6",
      'card-foreground': "#000000",
      destructive: "#cc0000",
      'destructive-foreground': "#ffffff",
      ring: "#ffb380"
    }
  }
];

export const getThemeById = (id: string): Theme | undefined => {
  return defaultThemes.find(theme => theme.id === id);
};

export const generatePreviewColors = (colors: ThemeColors) => {
  return {
    light: {
      '--background': colors.background,
      '--foreground': colors.foreground,
      '--primary': colors.primary,
      '--secondary': colors.secondary,
      '--accent': colors.accent,
      '--muted': colors.muted,
      '--muted-foreground': colors['muted-foreground'],
      '--popover': colors.popover,
      '--popover-foreground': colors['popover-foreground'],
      '--border': colors.border,
      '--input': colors.input,
      '--card': colors.card,
      '--card-foreground': colors['card-foreground'],
      '--destructive': colors.destructive,
      '--destructive-foreground': colors['destructive-foreground'],
      '--ring': colors.ring,
    },
    dark: {
      '--background': colors.background,
      '--foreground': colors.foreground,
      '--primary': colors.primary,
      '--secondary': colors.secondary,
      '--accent': colors.accent,
      '--muted': colors.muted,
      '--muted-foreground': colors['muted-foreground'],
      '--popover': colors.popover,
      '--popover-foreground': colors['popover-foreground'],
      '--border': colors.border,
      '--input': colors.input,
      '--card': colors.card,
      '--card-foreground': colors['card-foreground'],
      '--destructive': colors.destructive,
      '--destructive-foreground': colors['destructive-foreground'],
      '--ring': colors.ring,
    }
  };
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const { colors } = theme;
  const previewColors = generatePreviewColors(colors);
  const isDark = document.documentElement.classList.contains('dark');
  const colorSet = isDark ? previewColors.dark : previewColors.light;

  // Apply each CSS variable
  Object.entries(colorSet).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Save theme preference
  localStorage.setItem('selectedTheme', theme.id);
};

export const loadSavedTheme = (): Theme => {
  const savedThemeId = localStorage.getItem('selectedTheme');
  return getThemeById(savedThemeId || 'system') || defaultThemes[0];
};