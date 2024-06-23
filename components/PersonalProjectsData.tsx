import React, { useState } from 'react';

export const projectsData = [
  {
    id: 1,
    name: "Coach Matrix",
    description: "a multi-user blog for professionals working in education, similar to reddit",
    features: [
      "Users upvote and downvote favourite content",
      "Users post Questions and Answers", "Data hosted on Cloudinary and Heroku",
      "users can comment on posts",
      "users can bookmark favourite answers"],
    imageSrc: "projects/coachmatrix/1.png",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/path/to/logo.png", // Placeholder logo path
    liveDemoUrl: "https://example.com/coach-matrix-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/coach-matrix-repo", // Placeholder repository URL
    badges: ["Django", "Cloudinary", "Heroku"],
    readme: "/ReadmeText/CoachMatrix.md",
  },
  {
    id: 2,
    name: "React Project (in progress)",
    description: "Description for Project 2",
    features: ["React", "Node.js", "Express"],
    imageSrc: "/projects/react/1.jpg",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/path/to/logo.png", // Placeholder logo path
    liveDemoUrl: "https://example.com/react-project-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/react-project-repo", // Placeholder repository URL
    badges: ["Python", "Django", "PostgreSQL"],
    readme: "./ReadmeText/CoachMatrix.md",
  },
  {
    id: 3,
    name: "Steam Report",
    description: "Description for Project 3",
    features: ["React", "Node.js", "Express"],
    imageSrc: "projects/steamreport/1.png",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/path/to/logo.png", // Placeholder logo path
    liveDemoUrl: "https://example.com/steam-report-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/steam-report-repo", // Placeholder repository URL
    badges: ["Python", "Django", "PostgreSQL"],
    readme: "./ReadmeText/SteamReport.md", // Assuming a readme exists for this project
  },
  {
    id: 4,
    name: "Crocodile Kingdom",
    description: "Description for Project 4",
    features: ["React", "Node.js", "Express"],
    imageSrc: "/projects/crocodilekingdom/1.png",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/path/to/logo.png", // Placeholder logo path
    liveDemoUrl: "https://example.com/crocodile-kingdom-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/crocodile-kingdom-repo", // Placeholder repository URL
    badges: ["Python", "Django", "PostgreSQL"],
    readme: "./ReadmeText/CrocodileKingdom.md",
  },
  {
    id: 5,
    name: "Hoverboard",
    description: "Description for Project 5",
    features: ["React", "Node.js", "Express"],
    imageSrc: "/projects/hoverboard/1.png",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/path/to/logo.png", // Placeholder logo path
    liveDemoUrl: "https://example.com/hoverboard-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/hoverboard-repo", // Placeholder repository URL
    badges: ["Python", "Django", "PostgreSQL"],
    readme: "./ReadmeText/Hoverboard.md", // Assuming a readme exists for this project
  },
  {
    id: 6,
    name: "Portfolio Website",
    description: "Description for Project 6",
    features: ["React", "Node.js", "Express"],
    imageSrc: "/projects/portfolio/1.jpg",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/path/to/logo.png", // Placeholder logo path
    liveDemoUrl: "https://example.com/portfolio-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/portfolio-repo", // Placeholder repository URL
    badges: ["Python", "Django", "PostgreSQL"],
    readme: "./ReadmeText/PortfolioWebsite.md", // Assuming a readme exists for this project
  },
];