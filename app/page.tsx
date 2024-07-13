import React from 'react';
import styles from '../styles/Master.module.scss';
import ProfileCard from '../components/ProfileCard';
import PersonalProjects from '../components/PersonalProjects';
import TeamProjects from '../components/TeamProjects';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom";
import SocialHeader from '@/components/SocialHeader';
import '../styles/globals.scss'; 
import '../styles/Typography.scss';


const App = () => {
  return (
    <div className={styles.layout}>
      <ProfileCard />
      <SocialHeader />
      <PersonalProjects />
      <TeamProjects />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
