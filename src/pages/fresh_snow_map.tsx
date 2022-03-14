import React from "react";
import "./fresh_snow_map.css";
import { BsArrowReturnLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import RainMap from "../components/rain_map";

const FreshSnow: React.FunctionComponent = () => {
  return (
    <div className="fresh_snow_map">
      <RainMap />
      <div className="back_button button"> <Link to="/freshsnow" className="link"><BsArrowReturnLeft></BsArrowReturnLeft></Link></div>
    </div> 
  );
};

export default FreshSnow;