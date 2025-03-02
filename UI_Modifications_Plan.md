# UI Modifications Implementation Plan

## 1. Chat Messages Modifications

### Message Display
- Remove .reverse() from message mapping to show user messages above AI replies
- Update message container styling for proper ordering

### Chat Bubble Styling
- Add theme-based borders
  - Light mode: Black border
  - Dark mode: White border
- Reduce bubble height with adjusted padding
- Maintain current text size
- Update role/timestamp text styles
  - Light mode: Black for AI, dark grey for user
  - Dark mode: White for AI, light grey for user
- Add persistent copy button below each bubble with icon

## 2. Input Area Layout Changes

### Button Organization
- Left side buttons (+ and clock)
  - Stack vertically
  - Combined height matches input box
  - Consistent width for symmetry
- Right side buttons (send and microphone)
  - Stack vertically
  - Combined height matches input box
  - Same width as left buttons
  - Black icons for consistency
  - Microphone icon glows red when active

### Input Box
- Remove internal send button
- Maintain current border styling
- Adjust spacing for external buttons
- Reduce footer spacing to 1rem

### Microphone Implementation
- Add browser permission handling
- Implement speech recognition with real-time transcription
- Add silence detection for auto-stop
- Show permission request dialog
- Display error messages for denied access
- Visual indicator: glowing red icon for active state

## 3. Dialog Enhancements

### Web Address Dialog
- Fix URL context integration with conversation
- Add live thumbnail preview
  - Responsive size to fit dialog width
  - Cache previews for performance
  - Show loading state during generation
  - Maintain aspect ratio
- Implement proper error handling
- Add loading states for preview generation

### Code Input Dialog
- Implement scrollable container with fixed height
- Maintain dialog within viewport bounds
- Add max-height constraint based on viewport
- Update scroll behavior for overflow content
- Preserve editor functionality within constrained space

### Settings Dialog
- Add theme selection and customization
  - Default themes:
    - System default
    - Light theme
    - Dark theme
    - Midnight blue
    - Forest green
    - Desert sand
    - Ocean breeze
    - Sunset orange
  - Theme customization options:
    - Primary color
    - Secondary color
    - Accent color
    - Background color
    - Text color
  - Theme preview functionality
  - Apply themes to all components including dialogs
  - Save theme preferences
- Theme persistence across sessions
- Organize settings into categories:
  - Appearance
  - Chat Preferences
  - System Settings

## 4. Upload Functionality Fixes

### Image Upload
- Implement Puter AI integration using provided example:
```javascript
puter.ai.chat(
    message, 
    imageUrl
).then(handleResponse);
```
- Add error handling and user feedback
- Improve upload progress indication

### File Upload
- Update URL construction for Puter file system
- Implement proper file handling and storage
- Add error recovery and feedback

## 5. Deep Think Enhancements

### Reasoning Model Selection
- Add dropdown menu above reasoning box
- Include models:
  - Deepseek Reasoner
  - o3 Mini
  - o1 Mini
  - Gemini 2.0 Flash Thinking
  - Codestral
- Implement dynamic model loading
- Save user's last selected model
- Show active model indicator above input box
- Handle model switching logic

### Examples Feature
- Add "Examples" button to dialog
- Create popup with selectable example categories
- Include default example set (placeholders)
- Implement example selection and insertion
- Add dismissal handling

## Implementation Phases

1. Chat UI Updates
   - Message ordering
   - Bubble styling
   - Text modifications
   - Copy button changes

2. Input Area Restructuring
   - Button repositioning
   - Layout adjustments
   - Style consistency
   - Spacing fixes

3. Dialog Improvements
   - Web address preview with caching
   - Code dialog scrolling
   - Settings themes and customization
   - Error handling

4. Upload System Fixes
   - Image upload implementation
   - File upload correction
   - Error handling
   - Progress indication

5. Deep Think Enhancement
   - Model selection system
   - Examples feature
   - UI updates
   - State management

```mermaid
flowchart TB
    subgraph Chat Messages
        A[Remove reverse()] --> B[Messages in correct order]
        C[Update bubble styles] --> D[Borders & reduced height]
        E[Update text styles] --> F[Bolder colors]
        G[Copy button] --> H[Persistent with icon]
    end
    
    subgraph Input Area Layout
        I[Left buttons] --> J[Stack + and clock vertically]
        K[Input box] --> L[Remove internal send button]
        M[Right buttons] --> N[Stack send and mic vertically]
    end
    
    subgraph Dialog Updates
        O[Web Address] --> P[Cached preview]
        Q[Code Input] --> R[Scrollable view]
        S[Settings] --> T[Theme customization]
    end
    
    subgraph Deep Think
        U[Model selection] --> V[Dynamic loading]
        W[Examples] --> X[Popup system]
    end

    style Chat Messages fill:#f9f,stroke:#333,stroke-width:4px
    style Input Area Layout fill:#bbf,stroke:#333,stroke-width:4px
    style Dialog Updates fill:#fbf,stroke:#333,stroke-width:4px
    style Deep Think fill:#bfb,stroke:#333,stroke-width:4px
```

_This plan will be updated as additional modifications are added._