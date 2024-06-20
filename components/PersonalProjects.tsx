"use client" // this enables framer-motion to work with Next.js 

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from "react-dom";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card'; //todo: convert section to card. https://react-bootstrap.netlify.app/docs/components/cards
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const projectsData = [
  {
    id: 1,
    name: "Coach Matrix",
    description: "a multi-user blog for professionals working in education, similar to reddit",
    features: [
      "⬆️Users upvote and downvote favourite content",
      "Users post Questions and Answers", "Data hosted on Cloudinary and Heroku",
      "users can comment on posts",
      "users can bookmark favourite answers"],
    imageSrc: "projects/coachmatrix/1.png", // doesn't work
    badges: ["Django", "Cloudinary", "Heroku"]
  },
  {
    id: 2,
    name: "React Project (in progress)",
    description: "Description for Project 2",
    features: ["React", "Node.js", "Express"],
    imageSrc: "/projects/react/1.jpg",
    badges: ["Python", "Django", "PostgreSQL"]
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
    badges: ["Python", "Django", "PostgreSQL"]
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

const PersonalProjects = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [prevId, setPrevId] = useState<number | null>(null);

  const handleClose = () => {
    setPrevId(selectedId);
    setSelectedId(null);
  };

  return (
    <section className="personal-projects container mx-auto px-auto">
      <h2 className="text-center text-white text-xl font-bold mb-3 mt-5">Personal Projects</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {projectsData.map(project => (
          <motion.div
            key={project.id}
            layoutId={`project-${project.id}`}
            onClick={() => setSelectedId(project.id)}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
          >
            <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.</p>
        <h3>Header 2</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.</p>
        <h3>Header 3</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.</p>
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
