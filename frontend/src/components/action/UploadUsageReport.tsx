// src/components/report/UploadUsageReport.tsx
import React from "react";

// Type for individual interval reading (tuple)
type IntervalReading = {
    hour: string; // e.g. "14:00"
    kWh: number; // e.g. 1.234
};

// Props for UploadUsageReport component
type UploadUsageReportProps = {
    setReadings: React.Dispatch<React.SetStateAction<IntervalReading[]>>;
    setDate: React.Dispatch<React.SetStateAction<string>>;
};

/* Parse XML usage report
    - Extracts IntervalReading nodes
    - Converts epoch start time to hour string
    - Converts Wh value to kWh
    - Populates readings array
    - Extracts date from first reading and sets via setDate
------------------------------------------------------------------------------*/
function parseXml(
    xmlString: string, 
    setDate: React.Dispatch<React.SetStateAction<string>>
): IntervalReading[] {
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

        // If both nodes exist, parse values
        if (startNode && valueNode) {
            const startEpoch = parseInt(startNode.textContent || "0", 10);
            const currentDate = new Date(startEpoch * 1000);
            console.log("Parsed date:", currentDate.toISOString());
            if (!isNaN(currentDate.getTime())) {
                const isoString = currentDate.toISOString();
                const datePart = isoString.split('T')[0];
                if (datePart) setDate(datePart);
            }           
            const hour = 
                currentDate.toLocaleTimeString(
                    [], 
                    { hour: '2-digit', minute: '2-digit' }
                );
            // Value is in Wh, convert to kWh (kWh displayed on SDGE portal)
            const kWh = parseFloat(valueNode.textContent || "0") / 1000;
            readings.push({ hour, kWh });
        }
    });

    return readings;
}

const UploadUsageReport: React.FC<UploadUsageReportProps> = ({
    setReadings,
    setDate
}) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setReadings(parseXml(text, setDate));
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