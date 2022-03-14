import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { assert } from 'console';

interface StationProps {
    stationId: string
}

const SnowStationTitle: React.FunctionComponent<StationProps> = ({stationId}: StationProps) => {
    const parser = new DOMParser();

    const [stationTitle, setStationTitle] = useState('');
    const [firstRender, setFirstRender] = useState(true);

    var starttime = new Date()

    useEffect(() => { 
        if (firstRender) {
            setFirstRender(false);
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

                console.log(x.length)

                const snow = x[0].childNodes[7].childNodes[0].nodeValue;
                const temp = x[1].childNodes[7].childNodes[0].nodeValue;

                setStationTitle(`${stationId} ${snow}cm | ${temp}°C`)
            })
        }
    });

    return (
        <h3 className='stationTitle'>{stationTitle}</h3>
    )
};

export default SnowStationTitle; 