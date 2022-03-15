import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SnowStationElement from "./snow_station_element";
import SnowStationTitle from "./snow_station_title";

interface StationProps {
    stationId: string
}

const SnowStation: React.FunctionComponent<StationProps> = ({stationId}: StationProps) => {
    const parser = new DOMParser();

    const [stationDetailsData, setStationDetailsData] = useState({});
    const [lastStationId, setLastStationId] = useState('');
    const [oldSnow, setOldSnow] = useState(0);

    var starttime = new Date()
    starttime.setDate(starttime.getDate() - 5);

    useEffect(() => { 
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
                var stationData: any = {};
                var x = xmlDoc.getElementsByTagName("BsWfs:BsWfsElement");
                for (var i = 0; i < x.length; i++) {
                    const time = x[i].childNodes[3].childNodes[0].nodeValue;
                    const key = x[i].childNodes[5].childNodes[0].nodeValue;

                    if (time != null && key != null) {
                        if (i % 2 === 0) {
                            stationData[time] = {};
                        }

                        stationData[time][key] = x[i].childNodes[7].childNodes[0].nodeValue;  
                    } 
                }

                const newOldSnow = x[0].childNodes[7].childNodes[0].nodeValue;

                if (newOldSnow != null) {
                    setOldSnow(Number.parseInt(newOldSnow))
                }
                
                setStationDetailsData(stationData);
            })
        }
    });

    return (
        
        <div className="station">
            <SnowStationTitle stationId={stationId} oldSnow={oldSnow}/>
            <SnowStationElement stationData={stationDetailsData}></SnowStationElement>
        </div>
    )
};

export default SnowStation; 