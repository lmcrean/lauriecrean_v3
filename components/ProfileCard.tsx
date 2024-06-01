import React from 'react';
import styles from '../styles/Master.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ProfileCard = () => (
  <div className={styles.profileCard}>
    <TopBanner />
    <h1 className={styles.name}>Laurie Crean</h1>
    <h2 className={styles.title}>Junior Full-Stack Software Developer</h2>
    <a
      href="https://github.com/lmcrean"
      target="_blank"
      className={styles.githubLink}
    >
      <i className="fas fa-github"></i>
    </a>
    
    <RainbowGrid />
  </div>
);

const TopBanner = () => (
  <div className={styles.topBanner}>
    <div className={styles.trafficLights}>
      <span className={`${styles.trafficDot} ${styles.red}`}></span>
      <span className={`${styles.trafficDot} ${styles.yellow}`}></span>
      <span className={`${styles.trafficDot} ${styles.green}`}></span>
    </div>
    <div className={styles.controlButtons}>
      <button className={styles.controlBtn}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className={styles.controlBtn}>
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
    <div className={styles.searchBar}>
      <input type="text" placeholder="Search" />
      <i className="fas fa-search"></i>
    </div>
    <div className={styles.stackedDots}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  </div>
);

const RainbowGrid = () => {
  const rows = 3;
  const columns = 13;
  const squares = [];

  for (let i = 0; i < rows * columns; i++) {
    squares.push(<div className={styles.gridSquare} key={i} />);
  }

  return <div className={styles.rainbowGrid}>{squares}</div>;
};

export default ProfileCard; TopBanner; RainbowGrid;