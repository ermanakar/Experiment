import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="Home">
      <header>
        <h1>An exploration into AI's potential.</h1>
        <p> Just testing some ideas and use cases. Join the experiment!</p>
      </header>

      <section className="features">
        <h2>Discover Our Experiments</h2>

        <div className="featureBox">
          <Link to="/hr-interview" className="feature">
            <i className="fas fa-users"></i>
            <h3>HR Interview</h3>
            <p>Explore AI-powered interview scenarios</p>
          </Link>

          <Link to="/book-summary" className="feature">
            <i className="fas fa-book"></i>
            <h3>Book Summary</h3>
            <p>Get a detailed summary of your favorite books</p>
          </Link>
          
          <a href="https://api.shopofluba.de/gptproject" className="feature" target="_blank" rel="noopener noreferrer">
            <i className="fas fa-microphone"></i>
            <h3>Chat with a Resume</h3>
            <p>Don't want to read complicated CV's? Talk to it and ask questions!</p>
          </a>

          <Link to="/prd-creator" className="feature">
            <i className="fas fa-briefcase"></i>
            <h3>Generate PRD</h3>
            <p>Create your Product Requirements Document</p>
          </Link>
        </div>
      </section>

      <footer>
        <p>OpenAI api Experiment - 2023</p>
      </footer>
    </div>
  );
}

export default Home
