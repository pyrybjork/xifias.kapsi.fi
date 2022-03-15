import React, { useState, useEffect } from 'react';

interface StationElementRowProps {
    timeString: string,
    snow: string,
    lastSnow: string,
    tday: string
}

const SnowStationElementRow: React.FunctionComponent<StationElementRowProps> = ({ timeString, snow, lastSnow, tday}: StationElementRowProps) => {
    const time = new Date(timeString);
    const difference = Number.parseInt(snow) - Number.parseInt(lastSnow);

    return (
        <div>
            <h5>{time.toLocaleDateString()}</h5>
            Lumensyvyys{'\u00A0'}{snow.slice(0, -2)}cm{difference === 0? '' : `\u00A0${difference > 0? '+': ''}${difference}`}, Lämpötila{'\u00A0'}{tday === 'NaN'? '[ei\u00A0saatavilla]' : `${tday}°C`}
        </div>
    )
};


interface StationElementProps {
    stationData: object
}

const SnowStationElement: React.FunctionComponent<StationElementProps> = ({stationData}: StationElementProps) => {
    const stationDataKeys = Object.keys(stationData);
    const stationDataValues = Object.values(stationData);

    return <div className='stationTimeseries'>
        {
            stationDataKeys.map((item, index) => (
                <SnowStationElementRow key={index} timeString={stationDataKeys[index]} snow={stationDataValues[index].snow} lastSnow={stationDataValues[index - 1 < 0? index: index -1].snow} tday={stationDataValues[index].tday}/>
            ))
        }
    </div>
    
    
};

export default SnowStationElement; 