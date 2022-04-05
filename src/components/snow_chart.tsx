import React, { useState, useEffect } from 'react';
import { LineChart, Line } from 'recharts';

interface SnowChartProps {
    stationData: {
        time: string,
        snow: string,
        temperature: string
    }[]
}

const SnowChart: React.FunctionComponent<SnowChartProps> = ({stationData}: SnowChartProps) => {

    return <div className='snow_chart_container'>
        <LineChart width={400} height={400} data={stationData}>
            <Line type="monotone" dataKey="snow" stroke="#8884d8" />
        </LineChart>
    </div>
    
    
};

export default SnowChart; 