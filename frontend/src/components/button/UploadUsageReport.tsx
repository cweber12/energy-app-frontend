// src/components/report/UploadUsageReport.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { FiUpload } from "react-icons/fi";
import { useSaveUsageReport } from "../../hooks/useSaveUsageReport";
import { BsUpload } from "react-icons/bs";
import CustomButton from "../button/CustomButton";

// type definition for hourly reading from usage report
type IntervalReading = {
  hour: string;
  kWh: number;
};

// type definition for component props
type UploadUsageReportProps = {
    propertyId: string;
    setReadings: React.Dispatch<React.SetStateAction<IntervalReading[]>>;
    setDate: React.Dispatch<React.SetStateAction<string>>;

};

/* Function to parse XML usage report and extract interval readings
--------------------------------------------------------------------------------
Params  | xmlString: string - XML content as string
        | setDate: function to update date state in parent component
--------------------------------------------------------------------------------
Returns | Array of IntervalReading objects with hour and kWh values
------------------------------------------------------------------------------*/
function parseXml(
  xmlString: string,
  setDate: React.Dispatch<React.SetStateAction<string>>
): IntervalReading[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");
  const readings: IntervalReading[] = [];

  const intervalReadings = Array.from(xml.getElementsByTagNameNS("*", "IntervalReading"));

  intervalReadings.forEach((reading) => {
    const startNode = reading.getElementsByTagNameNS("*", "start")[0];
    const valueNode = reading.getElementsByTagNameNS("*", "value")[0];

    if (startNode && valueNode) {
      const startEpoch = parseInt(startNode.textContent || "0", 10);
      const currentDate = new Date(startEpoch * 1000);
      console.log("Parsed date:", currentDate);

      if (!isNaN(currentDate.getTime())) {
        const localDate = currentDate.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
        console.log("Local Date:", localDate);
        setDate(localDate);
        console.log("Report date set to:", localDate);
      }

      const hour = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const kWh = parseFloat(valueNode.textContent || "0") / 1000;
      readings.push({ hour, kWh });
    }
  });

  return readings;
}

/*  UploadUsageReport Component
--------------------------------------------------------------------------------
Props | propertyId: ID of the selected property
      | setReadings: Function to update interval readings state in parent 
      | setDate: Function to update report date state in parent component
------------------------------------------------------------------------------*/
const UploadUsageReport: React.FC<UploadUsageReportProps> = ({
    propertyId,
    setReadings,
    setDate,
}) => {
  const { colors } = useTheme();
  const { saveReport, isSaving, saveError } = useSaveUsageReport();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target?.result as string;

      let reportDate = "";
      const captureDate: React.Dispatch<React.SetStateAction<string>> = (v) => {
        const next = typeof v === "function" ? v(reportDate) : v;
        reportDate = next;
        setDate(next);
      };

      const parsed = parseXml(text, captureDate);
      setReadings(parsed);

      if (!reportDate) return;

      try {
        await saveReport({
          property_id: propertyId ? parseInt(propertyId, 10) : 0,
          report_date: reportDate,
          readings: parsed,
          interval_minutes: 60,
          source_filename: file.name,
        });
      } catch (err) {
        console.error("Failed to save usage report:", err);
      }
    };

    reader.readAsText(file);
  };

  /* Render upload button and file input
  ----------------------------------------------------------------------------*/
  return (
    <div>
      <CustomButton
        disabled={isSaving}
        type="button"
        style={{width: "fit-content"}}
      >
        <label
          htmlFor="xml-upload"
          style={{
            display: "flex",
            alignItems: "center",
            cursor: isSaving ? "not-allowed" : "pointer",
            margin: 0,
          }}
        >
          <BsUpload size={32} style={{ color: colors.primaryText, marginRight: "0.5rem" }} />
          <input
            id="xml-upload"
            type="file"
            accept=".xml"
            onChange={handleFileChange}
            style={{ display: "none" }}
            disabled={isSaving}
          />
          {isSaving ? "Saving..." : "Upload Usage Report"}
        </label>
      </CustomButton>
      {saveError && <div style={{ marginTop: 8 }}>{saveError}</div>}
    </div>
  );
};

export default UploadUsageReport;