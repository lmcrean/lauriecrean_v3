import React from 'react';
import { Helmet } from 'react-helmet';

export default function Fonts() {
  return (
    <Helmet>
      {/* Import Google Fonts as a reliable fallback */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet" />
      
      {/* Custom font imports - Funnel Display and GlacialIndifference */}
      <style>
        {`
          @font-face {
            font-family: 'Funnel Display';
            src: url('/fonts/FunnelDisplay-VariableFont_wght.ttf') format('truetype-variations');
            font-weight: 100 900; /* Variable font weight range */
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: 'GlacialIndifference';
            src: url('/fonts/GlacialIndifference-Regular.woff') format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: 'GlacialIndifference';
            src: url('/fonts/GlacialIndifference-Bold.woff') format('woff');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }

          /* Default font for all text - apply GlacialIndifference to everything */
          html body * {
            font-family: 'GlacialIndifference', sans-serif !important;
          }

          /* Apply Funnel Display only to headings with reliable fallbacks - using higher specificity */
          html body h1, 
          html body h2, 
          html body h3, 
          html body h4, 
          html body h5, 
          html body h6, 
          html body .sidebar-title {
            font-family: 'Funnel Display', serif !important;
            color: var(--text-color) !important;
            opacity: 0.9;
          }

          html body h1 {
            font-size: 3rem !important;
          }

          html body h2 {
            font-size: 2.5rem !important;
          }

          /* Specific styles for other text elements - all using GlacialIndifference */
          html body p {
            font-size: 1rem !important;
            line-height: 1.5rem !important;
          }
        `}
      </style>
    </Helmet>
  );
} 