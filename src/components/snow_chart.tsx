import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import { getStationHourly } from "./fmiRequests"


interface SnowChartProps {
    station: string
}

const SnowChart: React.FunctionComponent<SnowChartProps> = ({station}: SnowChartProps) => {
    const [stationData, setStationData] = useState([{ time: '', timeObject: new Date(), temperature: '', windSpeed: '', windDirection: ''}]);
    const [lastStationId, setLastStationId] = useState('');

    useEffect(() => { 

        if (station !== lastStationId) {
            setLastStationId(station);
            getStationHourly(station).then((stationData: any) => {
                setStationData(stationData);
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
            <ComposedChart data={stationData}>
                <XAxis dataKey="timeObject" tickFormatter={(date) => date.toLocaleString()} />
                <YAxis yAxisId="temp" type='number' unit='°C' ticks={[-30, -20, -10, 0, 10, 20, 30]}/>
                <YAxis yAxisId="speed" orientation="right" type='number' unit='m/s' ticks={[0, 5, 10, 15, 20, 25, 30]}/>
                <YAxis yAxisId="direction" orientation="right" type='number' unit='°' ticks={[0, 60, 120, 180, 240, 300, 360]}/>
                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#f57e42" dot={false}/>
                <Line yAxisId="speed" type="monotone" dataKey="windSpeed" stroke="#29a6ff" dot={false}/>
                <Line yAxisId="direction" type="monotone" dataKey="windDirection" stroke="#71fc68" dot={false}/>
                <Tooltip formatter={tooltipFormatter} labelFormatter={(date) => date.toLocaleString()} />
                <Legend formatter={legendFormatter} />
            </ComposedChart>
        </ResponsiveContainer>
    </div>
    
    
};

export default SnowChart; 