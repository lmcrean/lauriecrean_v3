"use client" // this enables framer-motion to work with Next.js 

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from "react-dom";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card'; //todo: convert section to card. https://react-bootstrap.netlify.app/docs/components/cards

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
    imageSrc: "/images/project1.png",
    badges: ["Django", "Cloudinary", "Heroku"]
  },
  {
    id: 2,
    name: "Project 2",
    description: "Description for Project 2",
    features: ["React", "Node.js", "Express"],
    imageSrc: "/images/project2.png",
    badges: ["Python", "Django", "PostgreSQL"]
  },
  // Add more projects here...
];

const PersonalProjects = () => {
  const [selectedId, setSelectedId] = useState(null);

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
                <Badge key={index} pill variant="info">{badge}</Badge>
              ))}
            </Stack>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            layoutId={`project-${selectedId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="bg-white shadow-md rounded-lg p-4 fixed inset-0 z-10"
          >
            {/* Detailed view of the selected project goes here */}
            <button onClick={() => setSelectedId(null)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PersonalProjects;
