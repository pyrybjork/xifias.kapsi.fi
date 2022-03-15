import React from "react";
import "./fresh_snow_map.css";
import { IoExitOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import RainMap from "../components/rain_map";

const FreshSnow: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="fresh_snow_map">
      <RainMap />
      <div className="back_button button" onClick={() => navigate('/freshsnow')}><IoExitOutline /></div>
    </div> 
  );
};

export default FreshSnow;