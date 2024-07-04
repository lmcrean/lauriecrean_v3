import React, { useState } from 'react';
import { HtmlBadge, CssBadge, CloudinaryBadge, DjangoBadge, FramerBadge, JavascriptBadge, NextdotjsBadge, PythonBadge, ReactBadge, ReactBootstrapBadge, VercelBadge } from './LanguageBadges';


export const teamProjectsData = [
  {
    id: 6,
    name: "Retrolympic Rush",
    banner: "/project_banners/retrolympicrush.png",
    description: "A nostalgic sidescroller game with a nod to the 2024 Paris Olympics, completed for Code Institute's Retro-Themed Hackathon.",
    teamsize: 7,
    contributions: ["as scrum master I was responsible for overseeing delegating tasks effectively and ensuring the team met their deadlines. As scrum master I chaired daily sprints and standups with specific deadlines based on teams strengths.",],
    features: [
      "Consistent neon Retro 1980’s Olympic theme throughout the game",
      "Real-time score display for players to track their performance",
      "Intuitive controls for character movement",
      "Accessible tutorial screen for easy game understanding",
      "Volume control settings for personalized gaming experience",
      "Engaging animations for character movements and environmental interactions",
      "Interactive obstacles within the game environment",
      "Game Over page with options to restart and view final score",
      "Progressively challenging levels to maintain engagement and skill development"
    ],
    imageSrc: "/projects/retrolympicrush/a2.gif",
    images: ["/projects/retrolympicrush/1.png", "/projects/retrolympicrush/a1.gif", "/projects/retrolympicrush/a2.gif", "/projects/retrolympicrush/a3.gif",
      "/projects/retrolympicrush/2.png", "/projects/retrolympicrush/3.png",],
    logo: "/projects/retrolympicrush/logo.png",
    liveDemoUrl: "https://lmcrean.github.io/RetrOlympics-Rush/",
    repositoryUrl: "https://github.com/lmcrean/RetrOlympics-Rush",
    badges: ["Javascript", "Github Pages", "Kaboom.JS",],
    readme: "/ReadmeText/RetrolympicRush.md",
  },
  {
    id: 7,
    name: "Wealth Quest",
    banner: "/project_banners/wealthquest.png",
    description: "A front-end JavaScript game where the user goes on a quest for passive income. The user achieves passive income by navigating deals, paydays and life happenings.",
    teamsize: 6,
    contributions: [
      "as scrum master I was responsible for overseeing delegating tasks effectively and ensuring the team met their deadlines through daily sprints and standups.", 
      "in the Frontend Developer team I contributed modals, tooltips, color schemes and other surface elements to the game.",
    ],
    features: [      
      "Users select a profession to represent them in the game.",
      "Engaging the users with interactive prompts, such as life happenings, deals and expenses.",
      "Users can accept or reject deals that can positively or negatively effect their passive income. They have to weigh up the rewards vs. the risks.",
      "Users receive a payday",
      "Users recieve a life happening event which can positively or negatively effect their passive income",
      "Users view their passive income progress on a Financial Statement",
      ,],
    imageSrc: "/projects/wealthquest/2.png",
    images: ["/projects/wealthquest/1.png", "/projects/wealthquest/2.png", ],
    logo: "/projects/wealthquest/logo.png", 
    liveDemoUrl: "https://lmcrean.github.io/Wealth-Quest/",
    repositoryUrl: "https://github.com/lmcrean/Wealth-Quest",
    badges: ["Javascript", "Bootstrap", "Github Pages"],
    readme: "./ReadmeText/WealthQuest.md",
  },
];  