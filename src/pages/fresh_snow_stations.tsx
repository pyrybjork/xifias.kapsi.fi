import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMap } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdClear, MdSearch } from 'react-icons/md';
import "./fresh_snow_stations.css";
import fmisid from '../data/fmisid'

import SnowStation from "../components/snow_station";

const FreshSnowStations: React.FunctionComponent = () => {
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [customContent, setCustomContent] = useState(<></>);

  const id_list = ['101885', '107081', '101950', '101914', '101990', '101987', 'custom'];

  var options: any = [];

  Object.entries(fmisid).forEach((key, index) => {
    options.push({value: key[0], label: key[1]});
  })

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

  function handleQueryChange(event: any) {
    setQuery(event.target.value);
  }

  function handleSubmit(event: any) {
    const stationId = Object.keys(fmisid).find(key => {
      const keyTyped = Number.parseInt(key) as keyof typeof fmisid;
      return fmisid[keyTyped] === query;
    });

    if (stationId != undefined) {
      setCustomContent(<SnowStation stationId={stationId}></SnowStation>);
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

              <div className='searchControls'>
                <button className='searchClear searchButton' onClick={() => { setQuery('') }}> <MdClear /> </button>
                {' '}
                <button type="submit" className='searchSubmit searchButton'><MdSearch /></button>
              </div>
            </form>

            {customContent}
          </div>
        }
        
        <div className='stationButton right' onClick={next}><IoIosArrowForward /></div>
        <div className='stationButton left' onClick={previous}><IoIosArrowBack /></div>
        <div className='stationIndicators'>
          {id_list.map((_item, index) => (
            <div key={index} className={`stationIndicator ${index === selected? 'bigCircle' : 'smallCircle'}`}>{index == id_list.length -1? <AiOutlinePlus /> : '' }</div>
          ))}
        </div>
      </div>
    </div> 
  );
};

export default FreshSnowStations;