"use client" // this enables framer-motion to work with Next.js 

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from "react-dom";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card'; //todo: convert section to card. https://react-bootstrap.netlify.app/docs/components/cards
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactMarkdown from 'react-markdown';
import { projectsData } from './PersonalProjectsData';

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

  useEffect(() => {
    const fetchReadme = async () => {
      if (selectedId !== null) {
        const project = projectsData.find(p => p.id === selectedId);
        if (project?.readme) {
          const response = await fetch(project.readme);
          const text = await response.text();
          setReadmeContent(text);
        }
      }
    };
    fetchReadme();
  }, [selectedId]);
  
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
          >
            <h3 className="text-xl text-center font-semibold mb-4">{project.name}</h3>
            <img src={project.imageSrc} alt={`${project.name}`} />
            <p>{project.description}</p>
            <br /><br />

            <p>Key features:</p>
            <ul>
              {project.features.map(feature => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <br /><br />

            <Stack direction="horizontal" gap={2}>
              {project.badges.map((badge, index) => (
                <Badge key={index} pill bg="info">{badge}</Badge>
              ))}
            </Stack>
          </motion.div>
        ))}
      </div>

<AnimatePresence>
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
        <Row>
        <Col md={6}>
        <button onClick={handleClose}>Close</button>
        <h2>{projectsData[selectedId - 1].name}</h2>
        <p>{projectsData[selectedId - 1].description}</p>
        <img src={projectsData[selectedId - 1].imageSrc} alt={projectsData[selectedId - 1].name} style={{ maxWidth: '500px' }}/>
        <h3>Key Features:</h3>
        <ul>
          {projectsData[selectedId - 1].features.map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <Stack direction="horizontal" gap={2}>
          {projectsData[selectedId - 1].badges.map((badge, index) => (
            <Badge key={index} pill bg="info">{badge}</Badge>
          ))}
        </Stack>
        </Col>
        <Col md={6}>
        <h2>README</h2>
        <ReactMarkdown>{readmeContent}</ReactMarkdown>
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
