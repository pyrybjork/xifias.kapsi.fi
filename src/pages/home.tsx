import React from "react";
import "./home.css";
import { Link } from 'react-router-dom';
import { FaSnowflake } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

const Home: React.FunctionComponent = () => {
  return (
    <div className="Home">
        <div className="card slide_down">
          <Link to="/freshsnow" className="link"> Putsku dashboard <MdKeyboardArrowRight className="nav_icon"></MdKeyboardArrowRight> </Link>
        </div>

        <div className="home_content">
          <h1>Pyry Björk</h1>
          <p>Hei! Olen 15-vuotias opiskelija Oulusta.</p>
    <br />
          <h3>Harrastukset</h3>
          <ul>
            <li>Partio</li>
            <li>Kiipeily</li>
            <li>Melonta</li>
            <li>Koodaus</li>
          </ul>

          <h3>Koodaus taidot</h3>
          <ul>
            <li>HTML / CSS / Javascript</li>
            <li>Typescript + React</li>
            <li>Python</li>
          </ul>

          <h3>Koulutus</h3>
          <ul>
            <li>Kohta peruskoulu</li>
            <li>SPR:n EA 1</li>
            <li>FINLAV 1 -lumivyörykurssi (puoliksi)</li>
            <li>Oulun kiipeilykeskuksen alaköysivarmistuskortti</li>
          </ul>
        </div>
    </div> 
  );
};

export default Home;