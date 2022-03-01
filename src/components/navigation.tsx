import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaCaretDown, FaCaretRight, FaMountain, FaSnowflake } from 'react-icons/fa';
import { RiRadarLine } from 'react-icons/ri';
import React, { useState } from 'react';

const Navigation: React.FunctionComponent = () => {
  const [expanded, setExpanded] = useState(false);

  function expand() {
    setExpanded(true);
  }

  function close() {
    setExpanded(false);
  }

  function toggle() {
    setExpanded(!expanded);
  }

  return ( <nav className="navigation">
      <ul>
        <li onClick={close}><Link to="/"><FaHome className="navIcon" /> Home</Link></li>
        <li onClick={close}><Link to="/about"><FaInfoCircle className="navIcon" /> About</Link></li>
        <li>
          <div className='dropdown_button' tabIndex={0} onClick={toggle} /* onFocus={expand} onBlur={close} */>{expanded ? <FaCaretDown className="navIcon" /> : <FaCaretRight className="navIcon" />} Apps</div>
          
          <div className='dropdown' >
          {expanded ? (
            <ul>
              <li onClick={close}><Link to="/freshsnow"><FaSnowflake className="navIcon" />  Fresh snow</Link></li>
              <li onClick={close}><Link to="/radars"><RiRadarLine className="navIcon" />  FMI Radars</Link></li>
              <li onClick={close}><Link to="/avalanche"><FaMountain className="navIcon" />  Avalanche terrain maps</Link></li>
          </ul>
          ) : null}
          </div>
        </li>
      </ul>
    </nav>
  )};

export default Navigation; 
//https://stackoverflow.com/questions/32553158/detect-click-outside-react-component#answer-37491578