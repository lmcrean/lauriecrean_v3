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
      badges: ["Django", "Cloudinary", "Heroku"],
      readme: "/ReadmeText/CoachMatrix.md", // just displays plain text, expecting to display markdown readme file
    },
    {
      id: 2,
      name: "React Project (in progress)",
      description: "Description for Project 2",
      features: ["React", "Node.js", "Express"],
      imageSrc: "/projects/react/1.jpg",
      badges: ["Python", "Django", "PostgreSQL"],
      readme: "./ReadmeText/CoachMatrix.md",
    },
    {
      id: 3,
      name: "Steam Report",
      description: "Description for Project 3",
      features: ["React", "Node.js", "Express"],
      imageSrc: "projects/steamreport/1.png", 
      badges: ["Python", "Django", "PostgreSQL"]
    },
    {
      id: 4,
      name: "Crocodile Kingdom",
      description: "Description for Project 4",
      features: ["React", "Node.js", "Express"],
      imageSrc: "/projects/crocodilekingdom/1.png",
      badges: ["Python", "Django", "PostgreSQL"],
      readme: "./ReadmeText/CrocodileKingdom.md",
    },
    {
      id: 5,
      name: "Hoverboard",
      description: "Description for Project 5",
      features: ["React", "Node.js", "Express"],
      imageSrc: "/projects/hoverboard/1.png",
      badges: ["Python", "Django", "PostgreSQL"]
    },
    {
      id: 6,
      name: "Portfolio Website",
      description: "Description for Project 6",
      features: ["React", "Node.js", "Express"],
      imageSrc: "/projects/portfolio/1.jpg",
      badges: ["Python", "Django", "PostgreSQL"]
    },
  ];