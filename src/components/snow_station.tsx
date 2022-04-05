import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SnowStationElement from "./snow_station_element";
import SnowStationTitle from "./snow_station_title";
import SnowChart from "./snow_chart";

interface StationProps {
    stationId: string
}

const SnowStation: React.FunctionComponent<StationProps> = ({stationId}: StationProps) => {
    const [stationDetailsData, setStationDetailsData] = useState([{ time: '', date: '', snow: '', temperature: ''}]);
    const [lastStationId, setLastStationId] = useState('');
    const [oldSnow, setOldSnow] = useState(0);

    useEffect(() => { 
        const parser = new DOMParser();

        var starttime = new Date()
        starttime.setDate(starttime.getDate() - 5);

        if (stationId !== lastStationId) {
            setLastStationId(stationId);
            axios.get('https://opendata.fmi.fi/wfs', {
                params: {
                    service: 'WFS',
                    version: '2.0.0',
                    request: 'getFeature',
                    storedquery_id: 'fmi::observations::weather::daily::simple',
                    fmisid: stationId,
                    starttime: starttime.toISOString(),
                    parameters: 'snow,tday'
                }
            }).then(function (response) {
                var xmlDoc = parser.parseFromString(response.data, "text/xml");
                var stationData = [];
                var x = xmlDoc.getElementsByTagName("BsWfs:BsWfsElement");
                for (var i = 0; i < x.length; i = i + 2) {
                    const time = x[i].childNodes[3].childNodes[0].nodeValue;

                    if (time !== undefined && time !== null) {
                        const date = new Date(time);

                        const snow = x[i].childNodes[7].childNodes[0].nodeValue;
                        const temperature = x[i + 1].childNodes[7].childNodes[0].nodeValue;
                        stationData.push({
                            time: time,
                            date: date.toLocaleDateString(),
                            snow: snow === null? '': snow,
                            temperature: temperature === null? '': temperature,
                        });
                    }
                }

                const newOldSnow = x[0].childNodes[7].childNodes[0].nodeValue;

                if (newOldSnow != null) {
                    setOldSnow(Number.parseInt(newOldSnow))
                }
                
                setStationDetailsData(stationData);
            })
        }
    }, [stationId, lastStationId]);

    return (
        
        <div className="station">
            <SnowStationTitle stationId={stationId} oldSnow={oldSnow}/>
            <SnowStationElement stationData={stationDetailsData}></SnowStationElement>
            {/* <SnowChart stationData={stationDetailsData}></SnowChart> */}
        </div>
    )
};

export default SnowStation; 