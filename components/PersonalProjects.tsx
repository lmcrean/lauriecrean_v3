import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card'; //todo: convert section to card. https://react-bootstrap.netlify.app/docs/components/cards


const PersonalProjects = () => {
    return (
      <section className="personal-projects container mx-auto px-auto">
        <h2 className="text-center text-white text-xl font-bold mb-3 mt-5">Personal Projects</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <div className='d-flex justify-content-between'>
              <h3 className="text-lg font-semibold mb-2">Project {index + 1}</h3><a className='mr-0'>More info</a>
              </div>
              <img src="/images/steamreport.png" alt="SteamReport" />
              <p>A brief description of what Project {index + 1} does.</p>
              <br></br>

              <p>Key features:</p>
              <ul>
                <li>- Feature 1</li>
                <li>- Feature 2</li>
                <li>- Feature 3</li>
              </ul>
              <br></br>
              
              <Stack direction="horizontal" gap={2}>
                <Badge pill  bg="primary">Html</Badge>
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