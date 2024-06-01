import React from 'react';

const About = () => {
  return (
    <section className="py-4">
    <div className="container">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="text-center text-white text-center my-3 text-xl font-bold mb-3 mt-5">About Me</h2>
        <p className="text-center text-white lead">
          I am a passionate software developer with a focus on creating intuitive and efficient web applications. With a background in education, I enjoy solving complex problems and improving user experiences.
        </p>
      </div>
    </div>
    </section>
  );
};

export default About;