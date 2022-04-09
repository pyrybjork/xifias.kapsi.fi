import React, { useState, useEffect, FunctionComponent } from 'react';
import { ComposedChart, Line, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import { getStationHourly } from "./fmiRequests";
import { FiArrowUp, FiArrowUpRight, FiArrowRight, FiArrowDownRight, FiArrowDown, FiArrowDownLeft, FiArrowLeft, FiArrowUpLeft } from 'react-icons/fi';

interface SnowChartProps {
    station: string
}

const SnowChart: React.FunctionComponent<SnowChartProps> = ({station}: SnowChartProps) => {
    const [stationData, setStationData] = useState([{ time: '', timeObject: new Date(), temperature: '', windSpeed: '',windGust: '' , windDirection: ''}]);
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
            return [`${value}°C`, 'Lämpötila'];
        } else if (name === 'windSpeed') {
            return [`${value}m/s ${windDirectionFromDegrees(props.payload.windDirection)} (${props.payload.windDirection}°)`, 'Tuuli'];
        } else if (name === 'windGust') {
            return [`${value}m/s`, 'Tuulen puuska'];
        }
    }

    function legendFormatter(value: any, entry: any, index: any) {
        if (value === 'temperature') {
            return 'Lämpötila';
        } else if (value === 'windSpeed') {
            return 'Tuuli';
        } else if (value === 'windGust') {
            return 'Puuska';
        }
    }

    function windDirectionFromDegrees(degrees: number): string {
        if (degrees >= 337.5 || degrees < 22.5) {
            return 'Pohjoinen';
        } else if (degrees >= 22.5 && degrees < 67.5) {
            return 'Koillinen';
        } else if (degrees >= 67.5 && degrees < 112.5) {
            return 'Itä';
        } else if (degrees >= 112.5 && degrees < 157.5) {
            return 'Kaakko';
        } else if (degrees >= 157.5 && degrees < 202.5) {
            return 'Etelä';
        } else if (degrees >= 202.5 && degrees < 247.5) {
            return 'Lounas';
        } else if (degrees >= 247.5 && degrees < 292.5) {
            return 'Länsi';
        } else if (degrees >= 292.5 && degrees < 337.5) {
            return 'Luode';
        } else {
            return ''
        }
    }

    const WindDirectionDot: FunctionComponent<any> = (props: any) => {
        const { cx, cy, payload, size } = props;
        let degrees = payload.windDirection;

        let color = '#3b4a61';
        let x = cx - size / 2;
        let y = cy - size / 2;

        if (degrees >= 337.5 || degrees < 22.5) { // N
            return <FiArrowDown color={color} x={x} y={y} size={size}/>;
        } else if (degrees >= 22.5 && degrees < 67.5) { // NE
            return <FiArrowDownLeft color={color} x={x} y={y} size={size}/>;
        } else if (degrees >= 67.5 && degrees < 112.5) { // E
            return <FiArrowLeft color={color} x={x } y={y} size={size}/>;
        } else if (degrees >= 112.5 && degrees < 157.5) { // SE
            return <FiArrowUpLeft color={color} x={x } y={y} size={size}/>;
        } else if (degrees >= 157.5 && degrees < 202.5) { // S
            return <FiArrowUp color={color} x={x} y={y} size={size}/>;
        } else if (degrees >= 202.5 && degrees < 247.5) { // SW
            return <FiArrowUpRight color={color} x={x} y={y} size={size}/>;
        } else if (degrees >= 247.5 && degrees < 292.5) { // W
            return <FiArrowRight color={color} x={x} y={y} size={size}/>;
        } else if (degrees >= 292.5 && degrees < 337.5) { // NW
            return <FiArrowDownRight color={color} x={x} y={y} size={size}/>;
        } else {
            return <></>
        }
    }

    return <div className='snow_chart_container'>
        <ResponsiveContainer width='100%' height={500}>
            <ComposedChart data={stationData}>
                <XAxis dataKey="timeObject" tickFormatter={(date) => date.toLocaleString()} />
                <YAxis yAxisId="temp" type='number' unit='°C' ticks={[-30, -20, -10, 0, 10, 20, 30]}/>
                <YAxis yAxisId="speed" orientation="right" type='number' unit='m/s' ticks={[0, 5, 10, 15, 20, 25, 30]}/>
                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#f57e42" dot={false}/>
                <Line yAxisId="speed" type="monotone" dataKey="windGust" strokeDasharray="3 3" stroke="#00d10e" dot={false}/>
                <Line yAxisId="speed" type="monotone" dataKey="windSpeed" stroke="#29a6ff" dot={<WindDirectionDot size={15}/>} activeDot={<WindDirectionDot size={25}/>}/>
                <Tooltip formatter={tooltipFormatter} labelFormatter={(date) => date.toLocaleString()} />
                <Legend formatter={legendFormatter} />
            </ComposedChart>
        </ResponsiveContainer>
    </div>
    
    
};

export default SnowChart; 