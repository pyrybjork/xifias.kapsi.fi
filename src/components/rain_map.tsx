import { MapContainer, TileLayer, WMSTileLayer, LayersControl } from 'react-leaflet'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { MdLegendToggle } from 'react-icons/md';
import React, { useState } from 'react';
import 'proj4leaflet';
import 'proj4';
import * as L from 'leaflet';

const RainMap: React.FunctionComponent = () => {
    const [selected, setSelected] = useState(12);

    var radarTime = new Date();
    radarTime.setMinutes(radarTime.getMinutes() -10);
    radarTime.setMinutes(0);
    radarTime.setSeconds(0);
    radarTime.setMilliseconds(0);

    var forecastTime = new Date();
    forecastTime.setMinutes(forecastTime.getMinutes() -10);
    forecastTime.setMinutes(0);
    forecastTime.setSeconds(0);
    forecastTime.setMilliseconds(0);

    const options = {
        transparent: true,
        format: 'image/png',
        opacity: 0.7,
        version: '1.3.0',
        url: 'https://openwms.fmi.fi/geoserver/wms?'
    };

    var wmsLayers: any = [];

    var i;

    for (i = 0; i < 12; i++) {
        wmsLayers.push({
            info: `Ennuste ${forecastTime.toLocaleString()}`,
            time: forecastTime.toISOString(),
            options: {...options, layers: 'Weather:precipitation-forecast', time: forecastTime.toISOString()}
        })
        forecastTime.setHours(forecastTime.getHours() + 1);
    }

    for (i = 0; i < 8; i++) {
        let startTime = new Date();
        startTime.setTime(radarTime.getTime());
        startTime.setHours(radarTime.getHours() - 12);

        wmsLayers.push({
            info: `${startTime.toLocaleString()} - ${radarTime.toLocaleString()}`,
            time: radarTime.toISOString(),
            options: {...options, layers: 'Radar:suomi_rr12h_eureffin' , time: radarTime.toISOString()}
        })
        radarTime.setHours(radarTime.getHours() - 12);
    }

    const crs = new L.Proj.CRS('EPSG:3067',
        '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
        resolutions: [
            8192, 4096, 2048, 1024, 512, 256, 128,
            64, 32, 16, 8, 4, 2, 1, 0.5, 0.25
        ],
        origin: [-548576, 8388608],
    });

    function previous() {
        let newSelected = selected + 1;
        if (newSelected < 20) {
            setSelected(newSelected)
        }
    }

    function next() {
        let newSelected = selected - 1;
        if (newSelected >= 0) {
            setSelected(newSelected)
        }
    }

    return ( 
        <div>
            <MapContainer className='rain_map' crs={crs} bounds={[[50, 20], [80, 30]]} center={[67, 25]} zoom={3}>
                <LayersControl>
                    <LayersControl.BaseLayer checked name="MML: Peruskartta">
                        <TileLayer
                            attribution='Kartat: MML, Tutkat: FMI'
                            url="https://tiles.kartat.kapsi.fi/peruskartta_3067/{z}/{x}/{y}.jpg"
                        />
                    </LayersControl.BaseLayer>
                    {
                        wmsLayers.map((layer: any, index: number) => (
                            <LayersControl.Overlay key={index} checked={selected === index? true: false} name={layer.time}>
                                <WMSTileLayer {...layer.options} />
                            </LayersControl.Overlay>
                        ))

                    }
                </LayersControl>
            </MapContainer>
            <div className='controls'>
                <div onClick={previous} className='button'><FaArrowLeft className='icon'/></div>
                <div>{wmsLayers[selected].info}</div>
                <div onClick={next} className='button'><FaArrowRight className='icon'/></div>
            </div>
        </div>
    )
};

export default RainMap; 