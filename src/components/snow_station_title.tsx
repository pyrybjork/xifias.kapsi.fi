import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {fmisidFull} from '../data/fmisid'

interface StationProps {
    stationId: string,
    oldSnow: number
}

const SnowStationTitle: React.FunctionComponent<StationProps> = ({stationId, oldSnow}: StationProps) => {
    const [snow, setSnow] = useState('NaN');
    const [temp, setTemp] = useState('NaN');
    const [lastStationId, setLastStationId] = useState('');

    useEffect(() => { 
        const parser = new DOMParser();
        var starttime = new Date()

        if (stationId !== lastStationId) {
            setLastStationId(stationId);
            axios.get('https://opendata.fmi.fi/wfs', {
                params: {
                    service: 'WFS',
                    version: '2.0.0',
                    request: 'getFeature',
                    storedquery_id: 'fmi::observations::weather::simple',
                    fmisid: stationId,
                    endtime: starttime.toISOString(),
                    parameters: 'snow_aws,t2m',
                    timestep: '60',
                    maxlocations: '1'
                }
            }).then(function (response) {
                const xmlDoc = parser.parseFromString(response.data, "text/xml");
                const x = xmlDoc.getElementsByTagName("BsWfs:BsWfsElement");

                const snow = x[0].childNodes[7].childNodes[0].nodeValue;
                const temp = x[1].childNodes[7].childNodes[0].nodeValue;

                if (snow != null) { setSnow(snow); }
                if (temp != null) { setTemp(temp); }
            })
            
        }
    }, [stationId, lastStationId]);

    return (
        <h3 className='stationTitle'>{fmisidFull.find(station => station.fmisid === stationId)?.name} {snow === 'NaN'? '[ei\u00A0saatavilla]' : `${snow}cm${'\u00A0|\u00A0'}${Number.parseInt(snow) - oldSnow >= 0? '+': ''}${Number.parseInt(snow) - oldSnow}cm`}{'\u00A0|\u00A0'}{temp}°C</h3>
    )
};

export default SnowStationTitle; 