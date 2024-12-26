# Next.js Development Notes

This documentation covers the Next.js aspects of the portfolio project.

## Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The development server will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

The project follows the standard Next.js 13+ structure with the App Router:

- `app/`: Contains the main application routes and components
- `components/`: Reusable React components
- `public/`: Static assets
- `styles/`: CSS and styling files

## Key Features

### Font Optimization

This project uses `next/font` to automatically optimize and load Inter, a custom Google Font. This ensures optimal performance and consistent typography across the site.

### Styling

The project uses Tailwind CSS for styling, providing:
- Utility-first CSS framework
- Responsive design
- Custom configurations in `tailwind.config.ts`

## Development Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js/) 