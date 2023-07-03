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
          
          <Link to="/live-podcast" className="feature">
            <i className="fas fa-microphone"></i>
            <h3>What would Lex ask?</h3>
            <p>See what kind of podcast questions AI can come up with</p>
          </Link>

          <Link to="/prd-creator" className="feature">
            <i className="fas fa-briefcase"></i>
            <h3>Generate PRD</h3>
            <p>Create your Product Requirements Document</p>
          </Link>
        </div>
      </section>

      <footer>
        <p>ChatGPT Experiment - 2023</p>
      </footer>
    </div>
  );
}

export default Home;
