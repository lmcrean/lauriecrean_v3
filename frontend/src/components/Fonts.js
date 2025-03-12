import React from 'react';
import { Helmet } from 'react-helmet';

export default function Fonts() {
  return (
    <Helmet>
      {/* Import Google Fonts as a reliable fallback */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet" />
      
      {/* Custom font imports - Etna and Funnel Display */}
      <style>
        {`
          @font-face {
            font-family: 'Etna';
            src: url('/fonts/etna-free-font.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: 'Funnel Display';
            src: url('/fonts/FunnelDisplay-VariableFont_wght.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          /* Apply fonts to elements with reliable fallbacks */
          h1, h2, h3, h4, h5, h6, .sidebar-title {
            font-family: 'Etna', serif !important;
            color: var(--text-color) !important;
            opacity: 0.9;
          }

          h1 {
            font-size: 3rem !important;
          }

          h2 {
            font-size: 2.5rem !important;
          }

          span, li {
            font-family: 'Montserrat', sans-serif !important;
            font-weight: 400;
          }

          p {
            font-family: 'Funnel Display', sans-serif !important;
            font-size: 1rem !important;
            line-height: 1.5rem !important;
          }
        `}
      </style>
    </Helmet>
  );
} 