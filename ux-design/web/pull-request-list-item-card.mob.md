# Pull Request List Item Card - Mobile Wireframe

## Design Goals
- **Mobile-first responsive design**
- **Quick scan information** at a glance
- **Clear visual hierarchy** 
- **Touch-friendly interaction areas**
- **Compact but informative**

## Layout Wireframe (Mobile 375px)

```
┌─────────────────────────────────────┐
│ ┌─ • merged ──────────── 2 days ago ┐ │
│ │                                   │ │
│ │ 🔄 refactor frontend dir to       │ │
│ │    apps/web                       │ │
│ │                                   │ │
│ │ 📝 this will be for greater       │ │
│ │    sustainability                 │ │
│ │                                   │ │
│ │ 📦 developer-portfolio                 │ │
│ │ 🏷️  TypeScript                    │ │
│ │                                   │ │
│ │ #20 ──────────────── 👆 View PR  │ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Visual Hierarchy

### **Top Row: Status & Timing**
```
┌─ • merged ──────────── 2 days ago ┐
```
- **Status Badge**: `• merged` / `○ open` / `× closed`
- **Relative Time**: `2 days ago` / `just now` / `3 weeks ago`

### **Title Section**
```
🔄 refactor frontend dir to
   apps/web
```
- **Icon**: Context emoji (🔄 refactor, ✨ feat, 🐛 fix, 📝 docs)
- **Title**: 2-line max, truncated with ellipsis
- **Font**: Bold, 16px

### **Description Preview**
```
📝 this will be for greater
   sustainability
```
- **Description**: 2-line preview, fade to ellipsis
- **Font**: Regular, 14px, muted color

### **Repository & Language**
```
📦 developer-portfolio
🏷️  TypeScript
```
- **Repository**: Name with folder icon
- **Language**: Badge with language color

### **Bottom Row: PR Number & Action**
```
#20 ──────────────── 👆 View PR
```
- **PR Number**: Left aligned
- **Action Button**: Right aligned, touch target 44px+

## Color Scheme

### **Status Colors**
- **Merged**: `#8250df` (Purple)
- **Open**: `#1a7f37` (Green) 
- **Closed**: `#cf222e` (Red)
- **Draft**: `#656d76` (Gray)

### **Language Colors**
- **TypeScript**: `#3178c6`
- **JavaScript**: `#f1e05a`
- **Python**: `#3572a5`
- **Other**: Dynamic GitHub colors

## Interactive States

### **Default State**
```
┌─────────────────────────────────────┐
│ ┌─ • merged ──────────── 2 days ago ┐ │
│ │ Background: #ffffff               │ │
│ │ Border: #d0d7de                   │ │
│ │ Shadow: none                      │ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### **Hover/Active State**
```
┌─────────────────────────────────────┐
│ ┌─ • merged ──────────── 2 days ago ┐ │
│ │ Background: #f6f8fa               │ │
│ │ Border: #0969da                   │ │
│ │ Shadow: 0 2px 4px rgba(0,0,0,0.1) │ │
│ │ Transform: translateY(-1px)       │ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Typography Scale

- **Title**: 16px Bold, line-height 1.3
- **Description**: 14px Regular, line-height 1.4  
- **Meta Info**: 12px Regular, line-height 1.2
- **PR Number**: 12px Mono, line-height 1.2

## Spacing & Layout

- **Card Padding**: 16px
- **Vertical Spacing**: 12px between sections
- **Horizontal Spacing**: 8px between inline elements
- **Touch Target**: Minimum 44px height for actions
- **Border Radius**: 8px
- **Border**: 1px solid #d0d7de

## Responsive Breakpoints

### **Mobile (375px - 767px)**
- Full width cards
- 16px side padding
- Stacked layout

### **Tablet (768px+)**
- Cards in 2-column grid
- 24px padding
- Maintain mobile proportions

## Accessibility

- **Semantic HTML**: `<article>` wrapper, `<header>`, `<main>`, `<footer>`
- **ARIA Labels**: "Pull request #20, merged 2 days ago"
- **Focus States**: Clear outline on keyboard navigation
- **Screen Reader**: All content readable in logical order
- **Touch Targets**: 44px minimum for all interactive elements

## Animation

### **Card Entry**
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### **Hover Transition**
```css
transition: all 0.2s ease-in-out;
```

## Data Mapping

```typescript
interface PRCardData {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  merged_at: string | null;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  repository: {
    name: string;
    language: string | null;
  };
}
```

## Implementation Notes

- **Truncation**: Use CSS `text-overflow: ellipsis`
- **Time Display**: Use relative time library (e.g., `date-fns`)
- **Touch Events**: Use proper touch event handlers
- **Loading States**: Skeleton loader while fetching
- **Error States**: Fallback content for missing data
