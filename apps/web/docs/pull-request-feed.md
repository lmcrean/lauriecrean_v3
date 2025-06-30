# Pull Request Feed Component

A responsive React component that displays GitHub pull request activity with detailed modal views.

## Features

- **Mobile-first responsive design** with full-screen modals on mobile
- **Real-time pull request data** from GitHub API
- **Interactive list cards** with quick scan information
- **Detailed modal views** with complete PR metadata
- **Pagination support** for large datasets
- **Loading and error states** with retry functionality
- **Tailwind CSS styling** with smooth animations
- **Accessibility features** including keyboard navigation and screen reader support

## Basic Usage

```tsx
import PullRequestFeed from '../components/pull-request-feed/PullRequestFeed';

// Basic usage with default username (lmcrean)
<PullRequestFeed />

// With custom username
<PullRequestFeed username="octocat" />

// With custom styling
<PullRequestFeed 
  username="lmcrean" 
  className="my-8" 
/>
```

## Component Structure

The feed consists of three main components:

### 1. PullRequestFeed (Main Container)
- Manages state and API calls
- Handles pagination
- Coordinates between list and detail views

### 2. PullRequestFeedListCard
- Individual PR cards in the list view
- Shows status, title, description preview, repository, and language
- Responsive mobile-first design

### 3. PullRequestFeedDetailCard
- Full-screen modal with complete PR details
- Statistics, timeline, and action buttons
- Smooth animations and backdrop blur

## API Integration

The component connects to the GitHub API backend:

- **Local Development**: `http://localhost:3001/api/github/pull-requests`
- **Production**: `https://api-github-lmcreans-projects.vercel.app/api/github/pull-requests`

### Endpoints Used

1. **List PRs**: `GET /api/github/pull-requests`
   - Query params: `username`, `page`, `per_page`
   - Returns paginated list of pull requests

2. **PR Details**: `GET /api/github/pull-requests/:owner/:repo/:number`
   - Returns detailed PR information including stats and timeline

## Props

### PullRequestFeed

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| username | string | 'lmcrean' | GitHub username to fetch PRs for |
| className | string | '' | Additional CSS classes to apply |

## Data Types

```typescript
interface PullRequestListData {
  id: number;
  number: number;
  title: string;
  description: string | null;
  created_at: string;
  merged_at: string | null;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  repository: {
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
  };
}

interface DetailedPullRequestData extends PullRequestListData {
  updated_at: string;
  closed_at: string | null;
  draft?: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
  comments: number;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}
```

## Design System

### Status Colors
- **Merged**: Purple (`text-purple-600`)
- **Open**: Green (`text-green-600`)
- **Closed**: Red (`text-red-600`)
- **Draft**: Gray (`text-gray-600`)

### Language Colors
Dynamic background colors based on GitHub's language color scheme:
- TypeScript: Blue (`bg-blue-600`)
- JavaScript: Yellow (`bg-yellow-400`)
- Python: Blue (`bg-blue-500`)
- And more...

### Typography Hierarchy
- **Card Title**: Bold, 16px, line-clamp-2
- **Modal Title**: Bold, 20px with emoji icon
- **Meta Information**: 12px, gray text
- **Descriptions**: 14px, leading-relaxed

## Mobile Experience

### List View (Mobile)
- Full-width cards with touch-friendly 44px+ targets
- Clear visual hierarchy with status indicators
- Relative timestamps (e.g., "2 days ago")
- Repository and language badges

### Detail Modal (Mobile)
- Full-screen modal with slide-up animation
- Sticky header with back/close buttons
- Scrollable content with organized sections
- Large action buttons for easy interaction

### Desktop Experience
- Centered layout with max-width constraints
- Hover states with subtle animations
- Modal appears centered with backdrop blur
- Improved spacing and larger touch targets

## Accessibility Features

- **Semantic HTML** with proper roles and ARIA labels
- **Keyboard navigation** with focus management
- **Screen reader support** with descriptive text
- **Focus trapping** within modals
- **Escape key** to close modals
- **Color contrast** meeting WCAG guidelines

## Loading States

### Initial Load
- Skeleton cards with pulse animation
- Maintains layout structure during loading
- Clear loading message

### Pagination Loading
- Spinner icon with loading text
- Disabled pagination buttons
- Preserves existing content

### Modal Loading
- Skeleton content within modal
- Header remains functional for closing
- Smooth transition to loaded content

## Error Handling

### Network Errors
- Clear error messages with retry buttons
- Timeout handling (10-second timeout)
- Distinction between client/server errors

### API Errors
- 404: User not found
- 500+: Server error messages
- Rate limiting: Appropriate messaging

## Performance Considerations

- **Lazy Loading**: Modal data loaded only when opened
- **Pagination**: Limits data fetching to manageable chunks
- **Caching**: Browser caching for API responses
- **Optimistic UI**: Immediate feedback for user actions

## Development

### Dependencies
- React 18+
- axios for HTTP requests
- Tailwind CSS for styling

### Local Development
1. Ensure GitHub API backend is running on port 3001
2. Component will automatically detect localhost environment
3. Test with different usernames and scenarios

### Testing
The component includes comprehensive error handling and loading states for thorough testing of various scenarios.

## Examples

### Basic Implementation
```tsx
export default function MyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1>GitHub Activity</h1>
      <PullRequestFeed username="lmcrean" />
    </div>
  );
}
```

### With Error Boundary
```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}) {
  return (
    <div className="text-center p-8">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function MyPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <PullRequestFeed username="octocat" />
    </ErrorBoundary>
  );
}
```
