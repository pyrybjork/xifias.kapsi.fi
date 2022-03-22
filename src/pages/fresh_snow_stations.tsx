import React, { useState, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { FaMap } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdClear, MdSearch, MdRefresh, MdInfoOutline } from 'react-icons/md';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import "./fresh_snow_stations.css";
import fmisid from '../data/fmisid'

import SnowStation from "../components/snow_station";

const FreshSnowStations: React.FunctionComponent = () => {
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [customMessage, setCustomMessage] = useState('Lisää valitsemasi havaintoasema.');
  const [infoExpanded, setInfoExpanded] = useState(false);
  
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

  function toggleInfo() {
    setInfoExpanded(!infoExpanded);
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
      let oldMessage = customMessage;
      setCustomMessage(`"${query}" ei ole hyväksytty havaintoasema`)
      setTimeout(() => {
        setCustomMessage(oldMessage)
      }, 2000);
    }
    event.preventDefault();
  }

  return (
    <div className="fresh_snow_stations">
      <div className="card">
        <Link className="link" to="/freshsnow/map"><FaMap className="nav_icon" /> Sadetutkat </Link>
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
                  <button onClick={resetStations} type="button" className='clearCookie'> <MdRefresh />nollaa muutokset</button>
                </div>
                <div>
                  <button type="submit" className='searchSubmit'> <AiOutlinePlusCircle></AiOutlinePlusCircle> </button>
                </div>
            </form>
          </div>
        }
          <div className='topButton infoButton' onClick={toggleInfo}> <MdInfoOutline /> </div>
        {
          id_list[selected]  !== 'custom'? 
          <div className='topButton removeButton' onClick={removeCurrent}> <MdClear /> </div>:
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

      {
        infoExpanded?
        <div className='stationCard infoCard'>
          <p>Tässä voit katsella lumi- ja lämpötilahavaintoja Ilmatieteenlaitoksen havaintoasemilta viiden päivän ajalta.</p>
          <p>Voit poistaa valmiina olevat esimerkkiasemat oikean yläkulman rastista ja lisätä omia (Listassa on vain havaintoasemia, joilta saa lumi- ja lämpötilahavainnon).</p>
          <p>Muutoksesi tallennetaan evästeeseen, joten ne säilyvät tällä laitteella.</p>
          <p>Viimeisimmän päivän lämpötila ei ole saatavilla kuin tiettyinä aikoina, sillä lämpötila-arvot ovat päivän keskiarvoja. Voit sen sijaan katsoa otsikkoriviltä tämänhetkisen lämpötilalukeman</p>
          <div className='topButton removeButton' onClick={toggleInfo}> <MdClear /> </div>
        </div>:
        ''
      }

      <div className='spacer1'>
        <svg id="visual" viewBox="0 0 900 300" width="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="900" height="300" fill="#232529"></rect><path d="M0 99L18.8 92.5C37.7 86 75.3 73 112.8 68.8C150.3 64.7 187.7 69.3 225.2 86.2C262.7 103 300.3 132 337.8 137.2C375.3 142.3 412.7 123.7 450.2 122C487.7 120.3 525.3 135.7 562.8 123.5C600.3 111.3 637.7 71.7 675.2 50.5C712.7 29.3 750.3 26.7 787.8 33.8C825.3 41 862.7 58 881.3 66.5L900 75L900 301L881.3 301C862.7 301 825.3 301 787.8 301C750.3 301 712.7 301 675.2 301C637.7 301 600.3 301 562.8 301C525.3 301 487.7 301 450.2 301C412.7 301 375.3 301 337.8 301C300.3 301 262.7 301 225.2 301C187.7 301 150.3 301 112.8 301C75.3 301 37.7 301 18.8 301L0 301Z" fill="#1b2f9b"></path><path d="M0 144L18.8 135.3C37.7 126.7 75.3 109.3 112.8 97.7C150.3 86 187.7 80 225.2 95.8C262.7 111.7 300.3 149.3 337.8 167.7C375.3 186 412.7 185 450.2 166.5C487.7 148 525.3 112 562.8 109.8C600.3 107.7 637.7 139.3 675.2 159.2C712.7 179 750.3 187 787.8 186.5C825.3 186 862.7 177 881.3 172.5L900 168L900 301L881.3 301C862.7 301 825.3 301 787.8 301C750.3 301 712.7 301 675.2 301C637.7 301 600.3 301 562.8 301C525.3 301 487.7 301 450.2 301C412.7 301 375.3 301 337.8 301C300.3 301 262.7 301 225.2 301C187.7 301 150.3 301 112.8 301C75.3 301 37.7 301 18.8 301L0 301Z" fill="#013181"></path><path d="M0 166L18.8 165.3C37.7 164.7 75.3 163.3 112.8 169.5C150.3 175.7 187.7 189.3 225.2 193.2C262.7 197 300.3 191 337.8 177.2C375.3 163.3 412.7 141.7 450.2 149.8C487.7 158 525.3 196 562.8 210.2C600.3 224.3 637.7 214.7 675.2 195C712.7 175.3 750.3 145.7 787.8 133.5C825.3 121.3 862.7 126.7 881.3 129.3L900 132L900 301L881.3 301C862.7 301 825.3 301 787.8 301C750.3 301 712.7 301 675.2 301C637.7 301 600.3 301 562.8 301C525.3 301 487.7 301 450.2 301C412.7 301 375.3 301 337.8 301C300.3 301 262.7 301 225.2 301C187.7 301 150.3 301 112.8 301C75.3 301 37.7 301 18.8 301L0 301Z" fill="#0c2f64"></path><path d="M0 256L18.8 256.2C37.7 256.3 75.3 256.7 112.8 245.8C150.3 235 187.7 213 225.2 203C262.7 193 300.3 195 337.8 190.8C375.3 186.7 412.7 176.3 450.2 183.8C487.7 191.3 525.3 216.7 562.8 221.2C600.3 225.7 637.7 209.3 675.2 203.2C712.7 197 750.3 201 787.8 200.2C825.3 199.3 862.7 193.7 881.3 190.8L900 188L900 301L881.3 301C862.7 301 825.3 301 787.8 301C750.3 301 712.7 301 675.2 301C637.7 301 600.3 301 562.8 301C525.3 301 487.7 301 450.2 301C412.7 301 375.3 301 337.8 301C300.3 301 262.7 301 225.2 301C187.7 301 150.3 301 112.8 301C75.3 301 37.7 301 18.8 301L0 301Z" fill="#1b2b46"></path><path d="M0 239L18.8 238C37.7 237 75.3 235 112.8 240.8C150.3 246.7 187.7 260.3 225.2 257.3C262.7 254.3 300.3 234.7 337.8 227C375.3 219.3 412.7 223.7 450.2 231.2C487.7 238.7 525.3 249.3 562.8 246.5C600.3 243.7 637.7 227.3 675.2 227.7C712.7 228 750.3 245 787.8 252.8C825.3 260.7 862.7 259.3 881.3 258.7L900 258L900 301L881.3 301C862.7 301 825.3 301 787.8 301C750.3 301 712.7 301 675.2 301C637.7 301 600.3 301 562.8 301C525.3 301 487.7 301 450.2 301C412.7 301 375.3 301 337.8 301C300.3 301 262.7 301 225.2 301C187.7 301 150.3 301 112.8 301C75.3 301 37.7 301 18.8 301L0 301Z" fill="#232529"></path></svg>
      </div>

      <div className='imageCard'>
        <img src="https://api.met.no/weatherapi/radar/2.0/?type=5level_reflectivity&amp;area=nordic&amp;content=animation" alt="met no radar image" />
      </div>
    </div> 
  );
};

export default FreshSnowStations;