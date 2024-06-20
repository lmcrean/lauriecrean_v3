"use client" // this enables framer-motion to work with Next.js 

import React from 'react';
import ReactDOM from "react-dom";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card'; //todo: convert section to card. https://react-bootstrap.netlify.app/docs/components/cards
import { motion } from 'framer-motion';

const projectsData = [
  {
    id: 1,
    name: "Project 1",
    description: "Description for Project 1",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    imageSrc: "/images/project1.png"
  },
  {
    id: 2,
    name: "Project 2",
    description: "Description for Project 2",
    features: ["Feature A", "Feature B", "Feature C"],
    imageSrc: "/images/project2.png"
  },
  // Add more projects here...
];

const PersonalProjects = () => {
    return (
      <section className="personal-projects container mx-auto px-auto">
        <h2 className="text-center text-white text-xl font-bold mb-3 mt-5">Personal Projects</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          {projectsData.map(project => (
            <div key={project.id} className="bg-white shadow-md rounded-lg p-4">
              <div className='d-flex justify-content-between'>
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                <a className='mr-0'>More info</a>
              </div>
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
                {/* Example badges */}
                <Badge pill bg="primary">Html</Badge>
                <Badge pill bg="secondary">React</Badge>
                <Badge pill bg="success">Django</Badge>
              </Stack>
            </div>
          ))}
        </div>
      </section>
    );
  };

export default PersonalProjects;
