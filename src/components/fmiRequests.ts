import axios from 'axios';

interface statioData {
    time: string;
    date: string;
    snow: string;
    temperature: string;
}

interface latestStatioData {
    snow: string;
    temperature: string;
}

interface hourlyStatioData {
    time: string;
    timeObject: Date;
    temperature: string;
    windSpeed: string;
    windGust: string;
    windDirection: string;
}

export async function getStation(stationId: string): Promise<statioData[]> {
    const parser = new DOMParser();

    var starttime = new Date()
    starttime.setDate(starttime.getDate() - 5);

    return axios.get('https://opendata.fmi.fi/wfs', {
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
        var stationData: statioData[] = [];
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
                    snow: snow === null? 'NaN': snow,
                    temperature: temperature === null? 'NaN': temperature,
                });
            }
        }

        return stationData;
    })
}

export async function getStationLatest(stationId: string): Promise<latestStatioData[]> {
    const parser = new DOMParser();

    var starttime = new Date()

    return axios.get('https://opendata.fmi.fi/wfs', {
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
        const temperature = x[1].childNodes[7].childNodes[0].nodeValue;

        var stationData: latestStatioData[] = [];

        stationData.push({
            snow: snow === null? 'NaN': snow,
            temperature: temperature === null? 'NaN': temperature,
        });

        return stationData;
    })
}

export async function getStationHourly(stationId: string): Promise<hourlyStatioData[]> {
    const parser = new DOMParser();

    var starttime = new Date()
    starttime.setDate(starttime.getDate() - 1);

    return axios.get('https://opendata.fmi.fi/wfs', {
        params: {
            service: 'WFS',
            version: '2.0.0',
            request: 'getFeature',
            storedquery_id: 'fmi::observations::weather::hourly::simple',
            fmisid: stationId,
            starttime: starttime.toISOString(),
            parameters: 'TA_PT1H_AVG,TA_PT1H_MAX,WS_PT1H_AVG,WD_PT1H_AVG'
        }
    }).then(function (response) {
        var xmlDoc = parser.parseFromString(response.data, "text/xml");
        var stationData: hourlyStatioData[] = [];
        var x = xmlDoc.getElementsByTagName("BsWfs:BsWfsElement");
        for (var i = 0; i < x.length; i = i + 4) {
            const time = x[i].childNodes[3].childNodes[0].nodeValue;

            if (time !== undefined && time !== null) {
                const date = new Date(time);

                const temperature = x[i].childNodes[7].childNodes[0].nodeValue;
                const windSpeed = x[i + 1].childNodes[7].childNodes[0].nodeValue;
                const windGust = x[i + 2].childNodes[7].childNodes[0].nodeValue;
                const windDirection = x[i + 3].childNodes[7].childNodes[0].nodeValue;

                stationData.push({
                    time: time,
                    timeObject: date,
                    temperature: temperature === null? '': temperature,
                    windSpeed: windSpeed === null? '': windSpeed,
                    windGust: windGust === null? '': windGust,
                    windDirection: windDirection === null? '': windDirection,
                });
            }
        }

        return stationData;
    })
}


