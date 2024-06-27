import React, { useState } from 'react';
import { HtmlBadge, CssBadge, CloudinaryBadge, DjangoBadge, FramerBadge, JavascriptBadge, NextdotjsBadge, PythonBadge, ReactBadge, ReactBootstrapBadge, VercelBadge } from './LanguageBadges';


export const projectsData = [
  {
    id: 1,
    name: "Coach Matrix",
    description: "a multi-user blog for professionals working in education, similar to reddit",
    features: [
      "Users upvote and downvote favourite content",
      "Users post Questions and Answers", "Data hosted on Cloudinary and Heroku",
      "users comment on posts",
      "users bookmark favourite answers"],
    imageSrc: "projects/coachmatrix/1.png",
    images: ["/projects/coachmatrix/1.png", "/projects/coachmatrix/2.png", "/projects/coachmatrix/3.png", "/projects/coachmatrix/4.png", "/projects/coachmatrix/5.png",],
    logo: "/projects/coachmatrix/logo.png",
    liveDemoUrl: "http://coachmatrix.org/",
    repositoryUrl: "https://github.com/lmcrean/Coach-Matrix",
    badges: [<DjangoBadge />, <CloudinaryBadge />, "Heroku", "PostgreSQL"],
    readme: "/ReadmeText/CoachMatrix.md",
  },
  {
    id: 2,
    name: "React Project (in progress)",
    description: "A social media platform for sharing photos.",
    features: [      
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Data hosted on Cloudinary and Heroku",]
      ,
    imageSrc: "/projects/react/1.jpg",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/projects/react/logo.png", // Placeholder logo path
    liveDemoUrl: "https://example.com/react-project-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/react-project-repo", // Placeholder repository URL
    badges: ["React.JS", "Django", "Cloudinary", "Heroku", "PostgreSQL"],
    readme: "./ReadmeText/ReactProject.md",
  },
  {
    id: 3,
    name: "Steam Report",
    description: "A hybrid of Personality Trait Test and Trivia quiz that provides young people with a recommended career pathway based on their unique traits and subject knowledge",
    features: [
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    ],
    imageSrc: "projects/steamreport/1.png",
    images: ["/projects/steamreport/1.png", "/projects/steamreport/2.png", "/projects/steamreport/a1.gif", "/projects/steamreport/a2.gif", "/projects/steamreport/3.png", "projects/steamreport/4.png", "projects/steamreport/5.png", "projects/steamreport/6.png"],
    logo: "/projects/steamreport/logo.png",
    liveDemoUrl: "https://steam-report-4c5b92c32ae5.herokuapp.com/",
    repositoryUrl: "https://github.com/lmcrean/Steam-Report",
    badges: ["Python", "PostgreSQL", "Heroku", "JSON", "Node.JS"],
    readme: "./ReadmeText/SteamReport.md", 
  },
  {
    id: 4,
    name: "Crocodile Kingdom",
    description: "Crocodile Kingdom is a memory game for 5 year olds developed using vanilla Javascript",
    features: [
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    ],
    imageSrc: "/projects/crocodilekingdom/1.png",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/projects/crocodilekingdom/logo.png",
    liveDemoUrl: "https://example.com/crocodile-kingdom-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/crocodile-kingdom-repo", // Placeholder repository URL
    badges: ["Python", "Django", "PostgreSQL"],
    readme: "./ReadmeText/CrocodileKingdom.md",
  },
  {
    id: 5,
    name: "Hoverboard",
    description: "A fully responsive SaaS product home page themed on Education Software",
    features: [
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    ],
    imageSrc: "/projects/hoverboard/1.png",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/projects/hoverboard/logo.png",
    liveDemoUrl: "https://example.com/hoverboard-demo", // Placeholder live demo URL
    repositoryUrl: "https://github.com/user/hoverboard-repo", // Placeholder repository URL
    badges: ["CSS", "JS", "HTML"],
    readme: "./ReadmeText/Hoverboard.md", 
  },
  {
    id: 6,
    name: "Portfolio Website",
    description: "A fully responsive portfolio website built using Next.js and React.js, using Framer Motion for engaging animations",
    features: [
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Users Lorum Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    ],
    imageSrc: "/projects/portfolio/1.jpg",
    images: ["/projects/react/1.jpg", "/projects/react/1.jpg", "/projects/react/1.jpg"],
    logo: "/projects/portfolio/logo.png",
    liveDemoUrl: "http://lauriecrean.dev", 
    repositoryUrl: "https://github.com/lmcrean/lauriecrean_nextjs",
    badges: ["React", "React-Bootstrap", "Framer-Motion", "Next.js", "Vercel"],
    readme: "./ReadmeText/PortfolioWebsite.md", 
  },
];