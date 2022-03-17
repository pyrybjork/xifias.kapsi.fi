import React from "react";
import "./home.css";
import { Link } from 'react-router-dom';
import { FaSnowflake } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

const Home: React.FunctionComponent = () => {
  return (
    <div className="Home">
        <div className="card">
          <Link to="/freshsnow" className="link"> Putsku dashboard <MdKeyboardArrowRight className="nav_icon"></MdKeyboardArrowRight> </Link>
        </div>
    </div> 
  );
};

export default Home;