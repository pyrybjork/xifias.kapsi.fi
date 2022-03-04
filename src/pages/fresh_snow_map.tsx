import React from "react";
import "./fresh_snow_map.css";

import RainMap from "../components/rain_map";

const FreshSnow: React.FunctionComponent = () => {
  return (
    <div className="fresh_snow_map">
      <RainMap />
    </div> 
  );
};

export default FreshSnow;