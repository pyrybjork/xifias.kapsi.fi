import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from 'recharts';

interface SnowChartProps {
    station: string
}

const SnowChart: React.FunctionComponent<SnowChartProps> = ({station}: SnowChartProps) => {
    const [stationData, setStationData] = useState([{ time: '', timeObject: new Date(), temperature: '', windSpeed: '', windDirection: ''}]);
    const [lastStationId, setLastStationId] = useState('');
    const [oldSnow, setOldSnow] = useState(0);

    useEffect(() => { 
        const parser = new DOMParser();

        var starttime = new Date()
        starttime.setDate(starttime.getDate() - 5);

        if (station !== lastStationId) {
            setLastStationId(station);
            axios.get('https://opendata.fmi.fi/wfs', {
                params: {
                    service: 'WFS',
                    version: '2.0.0',
                    request: 'getFeature',
                    storedquery_id: 'fmi::observations::weather::hourly::simple',
                    fmisid: station,
                    starttime: starttime.toISOString(),
                    parameters: 'TA_PT1H_AVG,WS_PT1H_AVG,WD_PT1H_AVG'
                }
            }).then(function (response) {
                var xmlDoc = parser.parseFromString(response.data, "text/xml");
                var newStationData = [];
                var x = xmlDoc.getElementsByTagName("BsWfs:BsWfsElement");
                for (var i = 0; i < x.length; i = i + 3) {
                    const time = x[i].childNodes[3].childNodes[0].nodeValue;

                    if (time !== undefined && time !== null) {
                        const date = new Date(time);

                        const temperature = x[i].childNodes[7].childNodes[0].nodeValue;
                        const windSpeed = x[i + 1].childNodes[7].childNodes[0].nodeValue;
                        const windDirection = x[i + 2].childNodes[7].childNodes[0].nodeValue;

                        newStationData.push({
                            time: time,
                            timeObject: date,
                            temperature: temperature === null? '': temperature,
                            windSpeed: windSpeed === null? '': windSpeed,
                            windDirection: windDirection === null? '': windDirection,
                        });
                    }
                }

                const newOldSnow = x[0].childNodes[7].childNodes[0].nodeValue;

                if (newOldSnow != null) {
                    setOldSnow(Number.parseInt(newOldSnow))
                }
                
                setStationData(newStationData);
            })
        }
    }, [station, lastStationId]);

    function tooltipFormatter(value: number, name: any, props: any) {
        if (name === 'temperature') {
            return [`${value} °C`, 'Lämpötila'];
        } else if (name === 'windSpeed') {
            return [`${value} m/s`, 'Tuulen nopeus'];
        } else if (name === 'windDirection') {
            return [`${value} °`, 'Tuulen suunta'];
        }
    }

    function legendFormatter(value: any, entry: any, index: any) {
        if (value === 'temperature') {
            return 'Lämpötila';
        } else if (value === 'windSpeed') {
            return 'Tuulen nopeus';
        } else if (value === 'windDirection') {
            return 'Tuulen suunta';
        }
    }

    return <div className='snow_chart_container'>
        <ResponsiveContainer width='100%' height={500}>
            <LineChart data={stationData}>
                <XAxis dataKey="timeObject" tickFormatter={(date) => date.toLocaleString()} />
                <YAxis yAxisId="temp" type='number' unit='°C' name='lämpötila' dataKey='temperature' ticks={[-30, -20, -10, 0, 10, 20, 30]}/>
                <YAxis yAxisId="speed" orientation="right" type='number' unit='m/s' name='tuulen nopeus' dataKey='windSpeed' ticks={[0, 5, 10, 15, 20, 25, 30]}/>
                <YAxis yAxisId="direction" orientation="right" type='number' unit='°' name='tuulen suunta' dataKey='windDirection' ticks={[0, 60, 120, 180, 240, 300, 360]}/>
                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#f57e42" dot={false}/>
                <Line yAxisId="speed" type="monotone" dataKey="windSpeed" stroke="#29a6ff" dot={false}/>
                <Line yAxisId="direction" type="monotone" dataKey="windDirection" stroke="#71fc68" dot={false}/>
                <Tooltip formatter={tooltipFormatter} labelFormatter={(date) => date.toLocaleString()} />
                <Legend formatter={legendFormatter} />
            </LineChart>
        </ResponsiveContainer>
    </div>
    
    
};

export default SnowChart; 