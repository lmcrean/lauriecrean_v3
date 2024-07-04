"use client" // this enables framer-motion to work with Next.js 

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from "react-dom";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'; //todo: convert section to card. https://react-bootstrap.netlify.app/docs/components/cards
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactMarkdown from 'react-markdown';
import { teamProjectsData } from './TeamProjectsData';
import { HtmlBadge, BootstrapBadge, CssBadge, CloudinaryBadge, DjangoBadge, FramerBadge, JQueryBadge, JavascriptBadge, GithubPagesBadge, HerokuBadge, NextdotjsBadge, PostgresSQLBadge, PythonBadge, ReactBadge, ReactBootstrapBadge, VercelBadge } from './LanguageBadges';
import { Carousel } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';



const getBadgeComponent = (badgeName: string) => {
  switch (badgeName) {
    case 'HTML': return <HtmlBadge />;
    case 'Bootstrap': return <BootstrapBadge />;
    case 'CSS': return <CssBadge />;
    case 'Cloudinary': return <CloudinaryBadge />;
    case 'Django': return <DjangoBadge />;
    case 'Framer Motion': return <FramerBadge />;
    case 'Github Pages': return <GithubPagesBadge />;
    case 'Heroku': return <HerokuBadge />;
    case 'Javascript': return <JavascriptBadge />;
    case 'JQuery': return <JQueryBadge />;
    case 'Next.js': return <NextdotjsBadge />;
    case 'PostgreSQL': return <PostgresSQLBadge />;
    case 'Python': return <PythonBadge />;
    case 'React.JS': return <ReactBadge />;
    case 'React Bootstrap': return <ReactBootstrapBadge />;
    case 'Vercel': return <VercelBadge />;
    default: return null;
  }
};

interface Project {
  banner: string;
  id: number;
  name: string;
  description: string;
  imageSrc: string;
  features: string[];
  badges: string[];
  readme?: string;
}

const TeamProjects = () => {
  const [selectedId2, setSelectedId] = useState<number | null>(null);
  const [prevId, setPrevId] = useState<number | null>(null);
  const [readmeContent, setReadmeContent] = useState('');

  const handleClose = () => {
    setPrevId(selectedId2);
    setSelectedId(null);
  };
  
  return (
    <section className="personal-projects container mx-auto px-auto">
      <h2 className="text-center text-white text-xxxl font-bold mb-3 mt-5">Team Projects</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {teamProjectsData.map(project => (
          <motion.div
            key={project.id}
            layoutId={`project-${project.id}`}
            onClick={() => setSelectedId(project.id)}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
            whileHover={{ scale: 1.05 }} // Scale up to 105% of original size on hover
            transition={{ duration: 0.3 }} // Smooth transition
          >
            <img 
              src={project.banner} 
              alt={project.name} 
              className="mx-auto d-block" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px',
                filter: project.banner === "/project_banners/wealthquest.png" ? 'invert(1)' : 'none',
              }} 
            />

            <img src={project.imageSrc} alt={`${project.name}`} />
            <p className='text-center'>Team Size: {project.teamsize}</p>
            <p>{project.description}</p>
            <p className='italic'>{project.contributions}</p>
            <br /><br />

            <p>Key features:</p>
            <ul>
              {project.features.map(feature => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            
            
            <Stack 
              className='mb-5 d-flex justify-content-center flex-wrap' 
              direction="horizontal" 
              gap={2}
            >
              {project.badges.map((badgeName, index) => {
                const badgeElement = getBadgeComponent(badgeName);
                return badgeElement 
                  ? React.cloneElement(badgeElement, { 
                      key: `${project.id}-${badgeName}-${index}`,
                      className: `mb-2 ${badgeElement.props.className || ''}`
                    }) 
                  : null;
              })}
            </Stack>

            <div className="d-flex justify-center">
              <Link href={project.repositoryUrl} target="_blank">
                <Button variant="dark" size="lg">
                  Repository
                </Button>
              </Link>
              <Link href={project.liveDemoUrl} target="_blank">
                <Button className="ml-3" variant="primary" size="lg">
                  Live Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamProjects;
