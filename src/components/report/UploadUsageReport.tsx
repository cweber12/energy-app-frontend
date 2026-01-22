import React, { useState } from "react";

type IntervalReading = {
    hour: string;
    kWh: number;
};

type UploadUsageReportProps = {
    xmlText: string;
    setXmlText: React.Dispatch<React.SetStateAction<string>>;
    readings: IntervalReading[];
    setReadings: React.Dispatch<React.SetStateAction<IntervalReading[]>>;
};

function parseXml(xmlString: string,): IntervalReading[] {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");
    const readings: IntervalReading[] = [];

    // Find all IntervalReading nodes
    const intervalReadings = Array.from(
        xml.getElementsByTagNameNS("*", "IntervalReading")
    );

    intervalReadings.forEach((reading) => {
        // Get start time (epoch seconds)
        const startNode = reading.getElementsByTagNameNS("*", "start")[0];
        const valueNode = reading.getElementsByTagNameNS("*", "value")[0];

        if (startNode && valueNode) {
            const startEpoch = parseInt(startNode.textContent || "0", 10);
            const date = new Date(startEpoch * 1000);
            const hour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Value is in Wh, convert to kWh
            const kWh = parseFloat(valueNode.textContent || "0") / 1000;
            readings.push({ hour, kWh });
        }
    });

    return readings;
}

const UploadUsageReport: React.FC<UploadUsageReportProps> = ({
    xmlText,
    setXmlText,
    readings,
    setReadings,
}) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setXmlText(text);
            setReadings(parseXml(text));
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <input type="file" accept=".xml" onChange={handleFileChange} />
        </div>
    );
};

export default UploadUsageReport;