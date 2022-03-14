import React from "react";
import { Link } from 'react-router-dom';
import { FaMap } from 'react-icons/fa';
import "./fresh_snow_stations.css";

import SnowStation from "../components/snow_station";


const FreshSnowStations: React.FunctionComponent = () => {
  return (
    <div className="fresh_snow_stations">
      <div className="card">
        <Link className="link" to="/freshsnow/map"><FaMap className="navIcon" /> Sadetutkat </Link>
      </div>
      <SnowStation stationId="101950"></SnowStation>
    </div> 
  );
};

export default FreshSnowStations;