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
import { projectsData } from './PersonalProjectsData';
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
  id: number;
  name: string;
  description: string;
  imageSrc: string;
  features: string[];
  badges: string[];
  readme?: string;
}

const PersonalProjects = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [prevId, setPrevId] = useState<number | null>(null);
  const [readmeContent, setReadmeContent] = useState('');

  const handleClose = () => {
    setPrevId(selectedId);
    setSelectedId(null);
  };
  
  return (
    <section className="personal-projects container mx-auto px-auto">
      <h2 className="text-center text-white text-xxxl font-bold mb-3 mt-5">Personal Projects</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {projectsData.map(project => (
          <motion.div
            key={project.id}
            layoutId={`project-${project.id}`}
            onClick={() => setSelectedId(project.id)}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
            whileHover={{ scale: 1.05 }} // Scale up to 105% of original size on hover
            transition={{ duration: 0.3 }} // Smooth transition
          >
            <img src={project.banner} alt={project.name} className="mx-auto d-block" style={{ maxWidth: '100%', maxHeight: '200px' }} />

            <img src={project.imageSrc} alt={`${project.name}`} />
            <p>{project.description}</p>
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

<AnimatePresence>

  {selectedId!== null && (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 15, 0.8)', // Transparent blue overlay
        zIndex: 999, // Ensure it's below the modal
      }}
    />
  )}
  {selectedId!== null && (
    <motion.div
      key={selectedId}
      layoutId={`project-${selectedId}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '80%',
        height: '80%',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <motion.div
        style={{
          backgroundColor: 'white',
          boxShadow: 'md',
          borderRadius: '25px',
          padding: '1rem',
          width: '100%',
          height: '100%',
          maxWidth: '4xl',
          overflowY: 'auto',
        }}
      >
        {/* Detailed view of the selected project goes here, with a Readme in the second column */}
        <Row className="h-100">
        <Col md={6} className="position-sticky top-0" style={{ top: 0, position: 'sticky' }}>
        <button onClick={handleClose}>
          <FontAwesomeIcon icon={faCircleXmark} /> close
        </button>
      
        {/*banner image*/}
        <img src={projectsData[selectedId - 1].banner} alt={projectsData[selectedId - 1].name} className="mx-auto d-block" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        <p className='text-right'>{projectsData[selectedId - 1].description}</p>
        <h3 className='text-right mt-3'>Key Features:</h3>
        <ul className='text-right'>
          {projectsData[selectedId - 1].features.map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {projectsData.map((project, index) => 
        project.id === selectedId && (
        <Stack 
          key={index}
          className='mb-5 d-flex flex-wrap justify-end' 
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
        ))}

        {projectsData.map((project, index) =>
        project.id === selectedId && (
        <div className="d-flex justify-end" key={index}>
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
        ))}

        </Col>
        <Col md={6} className="h-100 overflow-hidden">
          <h2 className='text-center'>Gallery</h2>
          {selectedId !== null && (
            <Carousel>
            {projectsData[selectedId - 1].images.map((imageSrc, index) => (
              <Carousel.Item key={index} className="carousel-item">
                <img
                  className="carousel-img"
                  src={imageSrc}
                  alt={`Project Image ${index}`}
                />
                <Carousel.Caption>
                  <p>{`Image ${index + 1}`}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
          )}
        </Col>
        </Row>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </section>
  );
};

export default PersonalProjects;
