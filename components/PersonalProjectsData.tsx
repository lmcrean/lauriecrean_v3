import React, { useState } from 'react';
import { HtmlBadge, CssBadge, CloudinaryBadge, DjangoBadge, FramerBadge, JavascriptBadge, NextdotjsBadge, PythonBadge, ReactBadge, ReactBootstrapBadge, VercelBadge } from './LanguageBadges';



export const projectsData = [
  {
    id: 1,
    name: "Coach Matrix",
    banner: "/project_banners/coachmatrix.svg",
    description: "a multi-user blog for professionals working in education, similar to reddit",
    features: [
      "Users upvote and downvote favourite content",
      "Users post Questions and Answers", 
      "Data hosted on Cloudinary and ElephantSQL",
      "users bookmark favourite content"],
    imageSrc: "projects/coachmatrix/1.png",
    images: ["/projects/coachmatrix/1.png", "/projects/coachmatrix/2.png", "/projects/coachmatrix/3.png", "/projects/coachmatrix/4.png", "/projects/coachmatrix/5.png",],
    logo: "/projects/coachmatrix/logo.png",
    liveDemoUrl: "http://coachmatrix.org/",
    repositoryUrl: "https://github.com/lmcrean/Coach-Matrix",
    badges: ["Django Rest Framework", "Cloudinary", "Heroku", "PostgreSQL", "ElephantSQL"],
    readme: "/ReadmeText/CoachMatrix.md",
  },
  {
    id: 2,
    name: "Odyssey",
    banner: "/project_banners/odyssey.png",
    description: "A social media for finding users with similar goals with a messaging feature",
    features: [      
      "User authentication and profile management",
      "Photo upload and sharing with Cloudinary integration",
      "Like and comment functionality on posts",
      "Real-time messaging between users",
      "Follow/unfollow system to connect with other users",
      "Responsive design for mobile and desktop",
      "Infinite scroll for seamless content browsing",
    ],
    imageSrc: "/projects/odyssey/1.png",
    images: ["/projects/odyssey/1.png", "/projects/odyssey/2.png", "/projects/odyssey/3.png"],
    logo: "/projects/odyssey/1.png", // Placeholder logo path
    liveDemoUrl: "https://odyssey.lauriecrean.dev", // Placeholder live demo URL
    repositoryUrl: "https://github.com/lmcrean/odyssey-api", // Placeholder repository URL
    badges: ["React", "Django Rest Framework", "Cloudinary", "PostgreSQL", "Bootstrap", "Heroku"],
    readme: "./ReadmeText/ReactProject.md",
  },
  {
    id: 3,
    name: "Steam Report",
    banner: "/project_banners/steamreport.svg",
    description: "A personal report that hybrids Personality Trait Test and Trivia quiz. Steam Report provides young people with a recommended career pathway based on their unique traits and subject knowledge",
    features: [
      "Using algorithms that assess personality and subject knowledge. It then uses this data to work out optimal environment for user \"e.g. supportive and collaborative.\". ",
      "Compares user's data with other user scores e.g. \"top 30% of agreeable, Ranked 5 in Science.\"",
      "Personalized Reports for each user, with a list of recommended careers and a list of recommended subjects to study.",
      "Stores user data on a Google Sheets database through the Google Sheets API."
    ],
    imageSrc: "projects/steamreport/6.png",
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
    banner: "/project_banners/crocodilekingdom.svg",
    description: "Crocodile Kingdom is a memory game for 5 year olds developed using vanilla Javascript",
    features: [
      "Random array of Crocodile Reactions to engage the user",
      "High Score table with unique ranking system using LocalStorage",
      "Animated Progress Bar that visualises Turns Left",
      "Sound Effects to enhance experience",
      "Animations including confetti, card-flip and fade in.",
      "Responsive to Mobile and Desktop view"
    ],
    imageSrc: "/projects/crocodilekingdom/a1.gif",
    images: ["projects/crocodilekingdom/a1.gif", "/projects/crocodilekingdom/1.png", "/projects/crocodilekingdom/2.png", "/projects/crocodilekingdom/3.png", "/projects/crocodilekingdom/4.png", "/projects/crocodilekingdom/5.png"],
    logo: "/projects/crocodilekingdom/logo.png",
    liveDemoUrl: "https://lmcrean.github.io/Crocodile-Kingdom/", // Placeholder live demo URL
    repositoryUrl: "https://github.com/lmcrean/crocodile-kingdom", // Placeholder repository URL
    badges: ["Javascript", "Github Pages", "JQuery", "Bootstrap"],
    readme: "./ReadmeText/CrocodileKingdom.md",
  },
  {
    id: 5,
    name: "Hoverboard",
    banner: "/project_banners/hoverboard.svg",
    description: "A fully responsive SaaS product home page themed on Education Software",
    features: [
      "Multi-layered background squiggles, banners, filtered shapes",
      "Detailed CSS Grid displays that change columns",
      "Dynamic content that moves around the page, sometimes expanding, hiding or reappearing somewhere else"
    ],
    imageSrc: "/projects/hoverboard/2.png",
    images: ["/projects/hoverboard/1.png", "/projects/hoverboard/2.png", "/projects/hoverboard/3.png", "/projects/hoverboard/4.png"],
    logo: "/projects/hoverboard/logo.png",
    liveDemoUrl: "https://lmcrean.github.io/Hoverboard/", // Placeholder live demo URL
    repositoryUrl: "https://github.com/lmcrean/Hoverboard", // Placeholder repository URL
    badges: ["CSS", "JS", "HTML", "Github Pages"],
    readme: "./ReadmeText/Hoverboard.md", 
  },
  {
    id: 6,
    name: "Portfolio Website",
    banner: "/project_banners/lauriecrean.svg",
    description: "A fully responsive portfolio website built using Next.js, using Framer Motion for engaging animations",
    features: [
      "Dynamic content that moves around the page, sometimes expanding, hiding or reappearing somewhere else",
      "Animations that engage the user, such as hover effects, page transitions and scroll animations",
      "Resuable components that can be easily updated and added to",
    ],
    imageSrc: "/projects/portfolio/2.png",
    images: ["/projects/portfolio/2.png"],
    logo: "/projects/portfolio/logo.png",
    liveDemoUrl: "http://lauriecrean.dev", 
    repositoryUrl: "https://github.com/lmcrean/lauriecrean_nextjs",
    badges: ["React", "React Bootstrap", "Framer Motion", "Next.js", "Vercel"],
    readme: "./ReadmeText/PortfolioWebsite.md", 
  },
];  