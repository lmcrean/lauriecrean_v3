# Pull Request Detail Modal - Mobile Wireframe

## Design Goals
- **Full-screen mobile modal** for detailed view
- **Complete PR information** with all metadata
- **Easy navigation back** to list
- **Action buttons** for external links
- **Scrollable content** for long descriptions

## Layout Wireframe (Mobile 375px)

```
┌─────────────────────────────────────┐
│ ┌─ ← Back ──────────────────── × ─┐ │ ← Header
│ │                                 │ │
│ │ ┌─ • merged ──── Jun 30, 2025 ─┐ │ │ ← Status Bar
│ │ │                             │ │ │
│ │ │ 🔄 refactor frontend dir to │ │ │ ← Title
│ │ │    apps/web                 │ │ │
│ │ │                             │ │ │
│ │ │ 👤 lmcrean                  │ │ │ ← Author
│ │ │ #20 • lauriecrean_v3        │ │ │ ← PR & Repo
│ │ │ 🏷️  TypeScript              │ │ │ ← Language
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │ ┌─ Description ──────────────┐   │ │ ← Description
│ │ │                           │   │ │
│ │ │ this will be for greater  │   │ │
│ │ │ sustainability            │   │ │
│ │ │                           │   │ │
│ │ │ • Moved frontend to apps/ │   │ │
│ │ │ • Updated build configs   │   │ │
│ │ │ • Fixed import paths      │   │ │
│ │ │                           │   │ │
│ │ └───────────────────────────┘   │ │
│ │                                 │ │
│ │ ┌─ Stats ────────────────────┐   │ │ ← Statistics
│ │ │                           │   │ │
│ │ │ 📊 +245 -123 changes      │   │ │
│ │ │ 📁 15 files changed       │   │ │
│ │ │ 💬 3 comments             │   │ │
│ │ │ ✅ 12 commits             │   │ │
│ │ │                           │   │ │
│ │ └───────────────────────────┘   │ │
│ │                                 │ │
│ │ ┌─ Timeline ─────────────────┐   │ │ ← Timeline
│ │ │                           │   │ │
│ │ │ Created: Jun 30, 10:39 AM │   │ │
│ │ │ Updated: Jun 30, 03:30 PM │   │ │
│ │ │ Merged:  Jun 30, 04:39 PM │   │ │
│ │ │                           │   │ │
│ │ └───────────────────────────┘   │ │
│ │                                 │ │
│ │ ┌─ Actions ──────────────────┐   │ │ ← Action Buttons
│ │ │                           │   │ │
│ │ │ [   View on GitHub   ]    │   │ │
│ │ │ [   Copy Link        ]    │   │ │
│ │ │ [   Share           ]     │   │ │
│ │ │                           │   │ │
│ │ └───────────────────────────┘   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Header Section
```
┌─ ← Back ──────────────────── × ─┐
```
- **Back Button**: `← Back` - returns to list
- **Close Button**: `×` - dismisses modal
- **Background**: Semi-transparent overlay
- **Height**: 56px with safe area

## Status & Title Section
```
┌─ • merged ──── Jun 30, 2025 ─┐
│                             │
│ 🔄 refactor frontend dir to │
│    apps/web                 │
│                             │
│ 👤 lmcrean                  │
│ #20 • lauriecrean_v3        │
│ 🏷️  TypeScript              │
└─────────────────────────────┘
```
- **Status Badge**: Large, colored indicator
- **Full Date**: Absolute timestamp  
- **Complete Title**: Full text, multi-line
- **Author**: Username with avatar
- **PR Number & Repository**: Clear identification
- **Language**: Colored language badge

## Description Section
```
┌─ Description ──────────────┐
│                           │
│ this will be for greater  │
│ sustainability            │
│                           │
│ • Moved frontend to apps/ │
│ • Updated build configs   │
│ • Fixed import paths      │
│                           │
└───────────────────────────┘
```
- **Full Description**: Complete markdown rendering
- **Formatted Text**: Bullet points, code blocks, links
- **Scrollable**: If content exceeds viewport
- **Collapsible**: If very long descriptions

## Statistics Section
```
┌─ Stats ────────────────────┐
│                           │
│ 📊 +245 -123 changes      │
│ 📁 15 files changed       │
│ 💬 3 comments             │
│ ✅ 12 commits             │
│                           │
└───────────────────────────┘
```
- **Code Changes**: Additions/deletions with color coding
- **Files Changed**: Number of modified files
- **Comments**: Discussion count
- **Commits**: Number of commits in PR

## Timeline Section
```
┌─ Timeline ─────────────────┐
│                           │
│ Created: Jun 30, 10:39 AM │
│ Updated: Jun 30, 03:30 PM │
│ Merged:  Jun 30, 04:39 PM │
│                           │
└───────────────────────────┘
```
- **Created Date**: When PR was opened
- **Last Updated**: Most recent activity
- **Merged/Closed**: Final action timestamp
- **Format**: Absolute dates and times

## Action Buttons
```
┌─ Actions ──────────────────┐
│                           │
│ [   View on GitHub   ]    │
│ [   Copy Link        ]    │
│ [   Share           ]     │
│                           │
└───────────────────────────┘
```
- **Primary Action**: View on GitHub (external link)
- **Secondary Actions**: Copy link, share functionality
- **Full Width**: Easy thumb interaction
- **Spacing**: 12px between buttons

## Modal Behavior

### **Opening Animation**
```
From: translateY(100%) opacity(0)
To:   translateY(0) opacity(1)
Duration: 300ms ease-out
```

### **Closing Animation** 
```
From: translateY(0) opacity(1)  
To:   translateY(100%) opacity(0)
Duration: 250ms ease-in
```

### **Backdrop**
```
Background: rgba(0, 0, 0, 0.5)
Backdrop-filter: blur(4px)
```

## Color Scheme

### **Status Indicators**
- **Merged**: `#8250df` background, white text
- **Open**: `#1a7f37` background, white text  
- **Closed**: `#cf222e` background, white text
- **Draft**: `#656d76` background, white text

### **Statistics Colors**
- **Additions**: `#1a7f37` (green)
- **Deletions**: `#cf222e` (red)
- **Neutral**: `#656d76` (gray)

## Typography

### **Hierarchy**
- **Title**: 20px Bold, line-height 1.3
- **Meta Text**: 14px Regular, color #656d76
- **Description**: 16px Regular, line-height 1.5
- **Stats**: 14px Regular with colored numbers
- **Buttons**: 16px Medium, centered

### **Spacing**
- **Section Margin**: 24px between major sections
- **Inner Padding**: 16px within cards
- **Button Height**: 48px for touch targets

## Responsive Layout

### **Mobile Portrait (375px)**
- Full screen modal
- Single column layout
- 16px side margins

### **Mobile Landscape (667px)**
- Maintain full screen
- Adjust header for notch
- Same content layout

### **Tablet (768px+)**
- Centered modal (max-width: 600px)
- Add drop shadow
- Same content proportions

## Accessibility Features

### **Keyboard Navigation**
- **Escape**: Close modal
- **Tab**: Navigate action buttons
- **Enter/Space**: Activate buttons
- **Focus Trap**: Keep focus within modal

### **Screen Reader**
- **Modal Role**: `role="dialog"`
- **ARIA Labels**: Descriptive labels for all actions
- **Live Regions**: Announce state changes
- **Focus Management**: Return focus to trigger element

### **Touch Accessibility**
- **Touch Targets**: Minimum 44px for all interactive elements
- **Swipe Gestures**: Swipe down to dismiss modal
- **Safe Areas**: Respect device safe areas

## Data Structure

```typescript
interface PRDetailData {
  id: number;
  number: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  closed_at: string | null;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  repository: {
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
  };
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}
```

## Error & Loading States

### **Loading State**
```
┌─ ← Back ──────────────────── × ─┐
│                                 │
│ ┌─ ■■■■■■■■ ── ■■■■■■■■■■■ ─┐ │
│ │                             │ │
│ │ ■■■■■■■■■■■■■■■■■■■■■■■   │ │
│ │ ■■■■■■■■■■                │ │
│ │                             │ │
│ │ ■■■■■■■■■                 │ │
│ │ ■■■ • ■■■■■■■■■            │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Skeleton loading animation]    │
└─────────────────────────────────┘
```

### **Error State**
```
┌─ ← Back ──────────────────── × ─┐
│                                 │
│ ┌─ ⚠️  Error Loading PR ─────┐   │
│ │                           │   │
│ │ Unable to load pull       │   │
│ │ request details.          │   │
│ │                           │   │
│ │ [    Try Again    ]       │   │
│ │                           │   │
│ └───────────────────────────┘   │
└─────────────────────────────────┘
```

## Performance Considerations

- **Lazy Loading**: Load detailed data only when modal opens
- **Image Optimization**: Optimize avatar images
- **Content Caching**: Cache PR details for quick re-opening
- **Smooth Animations**: Use transform/opacity for 60fps animations
- **Memory Management**: Clean up event listeners on close
