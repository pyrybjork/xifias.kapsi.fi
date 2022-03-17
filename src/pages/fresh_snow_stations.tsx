import React, { useState, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { FaMap } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdClear, MdSearch, MdRefresh } from 'react-icons/md';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import "./fresh_snow_stations.css";
import fmisid from '../data/fmisid'

import SnowStation from "../components/snow_station";

const FreshSnowStations: React.FunctionComponent = () => {
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [customMessage, setCustomMessage] = useState('Lisää valitsemasi havaintoasema. Voit poistaa havaintoasemia oikean yläkulman rastista. Muutoksesi tallenetaan evästeeseen.');
  
  const stations  = localStorage.getItem( 'stations' ) || ['101885', '107081', '101950', '101914', '101990', '101987', 'custom'].join(',');
  
  const [id_list, set_id_list] = useState(stations.split(','));

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  var options: any = [];

  Object.entries(fmisid).forEach((key, index) => {
    options.push({value: key[0], label: key[1]});
  })

  function updateCookie() {
    localStorage.setItem( 'stations', id_list.join(','))
  }

  function resetStations() {
    localStorage.removeItem('stations');
    set_id_list(['101885', '107081', '101950', '101914', '101990', '101987', 'custom']);
    setSelected(6);
    forceUpdate();
  }

  function next() {
    var new_selected = selected + 1;
    if (new_selected < id_list.length) {
      setSelected(new_selected);
    } else {
      setSelected(0);
    }
  }

  function previous() {
    var new_selected = selected - 1;
    if (new_selected < 0) {
      setSelected(id_list.length - 1);
    } else {
      setSelected(new_selected);
    }
  }

  function removeCurrent() {
    if (selected < id_list.length - 1) {
      let modified_id_list = id_list;
      modified_id_list.splice(selected, 1);
      set_id_list(modified_id_list);
      forceUpdate();
      updateCookie();
    }
  }

  function handleQueryChange(event: any) {
    setQuery(event.target.value);
  }

  function handleSubmit(event: any) {
    const stationId = Object.keys(fmisid).find(key => {
      const keyTyped = Number.parseInt(key) as keyof typeof fmisid;
      return fmisid[keyTyped] === query;
    });

    if (stationId != undefined) {
      let modified_id_list = id_list;
      modified_id_list.splice(id_list.length - 1, 0, stationId);
      set_id_list(modified_id_list);
      forceUpdate();
      updateCookie();
    } else {
      setCustomMessage(`"${query}" ei ole hyväksytty havaintoasema`)
      setTimeout(function() {
        setCustomMessage('Lisää valitsemasi havaintoasema. Voit poistaa havaintoasemia oikean yläkulman rastista. Muutoksesi tallenetaan evästeeseen.')
      }, 2000);
    }
    event.preventDefault();
  }

  return (
    <div className="fresh_snow_stations">
      <div className="card">
        <Link className="link" to="/freshsnow/map"><FaMap className="navIcon" /> Sadetutkat </Link>
      </div>
      <div className='stationCard'>
        {id_list[selected] !== 'custom' ? 
          <SnowStation stationId={id_list[selected]}></SnowStation> :
          <div className="customStation">
            <form className='customSearch' onSubmit={handleSubmit}>
              <input className='searchBar' type="text" list="data" value={query} onChange={handleQueryChange}/>

              <datalist id="data">
                {options.map((item: any, index: any) =>
                  <option key={index} value={item.label} />
                )}
              </datalist>
                <button className='searchClear' onClick={() => { setQuery('') }}> <MdClear /> </button>
                <div className='customMessage'>
                  {customMessage}{' '}
                  <button onClick={resetStations} type="button" className='clearCookie'> <MdRefresh />nollaa</button>
                </div>
                <div>
                  <button type="submit" className='searchSubmit'> <AiOutlinePlusCircle></AiOutlinePlusCircle> </button>
                </div>
            </form>
          </div>
        }

        {
          id_list[selected]  !== 'custom'? 
          <div className='removeButton' onClick={removeCurrent}> <MdClear></MdClear> </div>:
          ''
        }
        <div className='stationButton right' onClick={next}><IoIosArrowForward /></div>
        <div className='stationButton left' onClick={previous}><IoIosArrowBack /></div>
        <div className='stationIndicators'>
          {id_list.map((_item, index) => (
            <div key={index} className={`stationIndicator ${index === selected? 'bigCircle' : 'smallCircle'}`}>{index == id_list.length -1? <MdSearch /> : '' }</div>
          ))}
        </div>
      </div>
      <div className='imageCard'>
        <img src="https://api.met.no/weatherapi/radar/2.0/?type=5level_reflectivity&amp;area=nordic&amp;content=animation" alt="met no radar image" />
      </div>
    </div> 
  );
};

export default FreshSnowStations;