import React from 'react';
import styles from '../styles/Banner.module.scss';

const YellowSquares = () => {
  return (
    <div className="yellow-squares">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="yellow-square" />
      ))}
    </div>
  );
};

const CodeArtCard = () => {
  // Array representing the indentation of each code line
  const indentation = [0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0];

  // Generate the code lines with varying indentation
  const codeLines = indentation.map((indent, index) => (
    <div key={index} className={`code-line indent-${indent}`}>
      {/* Use a loop to generate colored divs for each line */}
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className={`code-color-${(idx % 5) + 1}`}></div>
      ))}
    </div>
  ));

  return (
    <div className="blue-card">
      <YellowSquares />
      <div className="vertical-line"></div>
      <div className="code-lines-art">
        <i className="fas fa-code code-icon"></i>
        {codeLines}
        <i className="fas fa-code code-icon"></i>
      </div>
    </div>
  );
};

const ProfileCard = () => (
  <div className="profile-card">
    <TopBanner />
    <h1 className="name">Laurie Crean</h1>
    <h2 className="title">Junior Full-Stack Software Developer</h2>
    <a
      href="https://github.com/lmcrean"
      target="_blank"
      className="github-link"
    >
      github.com/lmcrean
    </a>
    <RainbowGrid />
  </div>
);

const TopBanner = () => (
  <div className="top-banner">
    <div className="traffic-lights">
      <span className="traffic-dot red"></span>
      <span className="traffic-dot yellow"></span>
      <span className="traffic-dot green"></span>
    </div>
    <div className="control-buttons">
      <button className="control-btn">
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="control-btn">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
    <div className="search-bar">
      <input type="text" placeholder="Search" />
      <i className="fas fa-search"></i>
    </div>
    <div className="stacked-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  </div>
);

const RainbowGrid = () => {
  const rows = 3;
  const columns = 13;
  const squares = [];

  for (let i = 0; i < rows * columns; i++) {
    squares.push(<div className="grid-square" key={i} />);
  }

  return <div className="rainbow-grid">{squares}</div>;
};

const App = () => {
  return (
    <div className="banner">
      <CodeArtCard />
      <ProfileCard />
    </div>
  );
};

export default App;