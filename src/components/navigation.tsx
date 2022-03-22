import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaCaretDown, FaCaretRight, FaMountain, FaSnowflake } from 'react-icons/fa';
import { MdOutlineMenu, MdClose } from 'react-icons/md';
import React, { useState } from 'react';

const Navigation: React.FunctionComponent = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [appsExpanded, setAppsExpanded] = useState(false);

  function close() {
    setAppsExpanded(false);
    setMenuExpanded(false);
  }

  function toggleApps() {
    setAppsExpanded(!appsExpanded);
  }

  function toggleMenu() {
    setMenuExpanded(!menuExpanded);
  }

  return ( <nav className="navigation">
      <ul>
        <li onClick={close} ><Link to="/"><FaHome className="home_icon" /></Link></li>
        <li onClick={close} className='big_nav'><Link to="/about"><FaInfoCircle className="nav_icon" /> Info</Link></li>
        <li className='big_nav'>

          <div className='dropdown_button' tabIndex={0} onClick={toggleApps} /* onFocus={expand} onBlur={close} */>{appsExpanded ? <FaCaretDown className="nav_icon" /> : <FaCaretRight className="nav_icon" />} Sovellukset</div>
          
          <div className='dropdown' >
          {appsExpanded ? (
            <ul>
              <li onClick={close}><Link to="/freshsnow"><FaSnowflake className="nav_icon" />  Putsku</Link></li>
              <li onClick={close}><Link to="/avalanche_terrain_maps"><FaMountain className="nav_icon" />  Jyrkkyyskarttoja</Link></li>
          </ul>
          ) : null}
          </div>
        </li>

        <li onClick={toggleMenu} className='menu_button'>{menuExpanded ? <MdClose/> : <MdOutlineMenu/>}</li>
        <li className='small_nav'>
          {menuExpanded ? (
            <ul className='small_nav menu'>
              <li onClick={close}><Link to="/about"><FaInfoCircle className="nav_icon" /> Info</Link></li>

              <li onClick={toggleApps} className='dropdown_button'>{appsExpanded ? <FaCaretDown className="nav_icon" /> : <FaCaretRight className="nav_icon" />} Sovellukset</li>
          
              <div className='menu_dropdown' >
                {appsExpanded ? (
                  <ul>
                    <li onClick={close}><Link to="/freshsnow"><FaSnowflake className="nav_icon" />  Putsku</Link></li>
                    <li onClick={close}><Link to="/avalanche_terrain_maps"><FaMountain className="nav_icon" />  Jyrkkyyskarttoja</Link></li>
                  </ul>
                ) : null}
              </div>

            </ul>
            ) : null}
        </li>
      </ul>
    </nav>
  )};

export default Navigation; 
//https://stackoverflow.com/questions/32553158/detect-click-outside-react-component#answer-37491578