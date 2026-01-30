// src/components/items/SetUsageEvent.tsx
import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLastEvent } from "../../hooks/useEvent";
import { EventStart, EventEnd } from "../../../types/eventTypes";
import { startEvent, endEvent } from "../../supabase_services/eventsService";
import "../../App.css";
import "../../styles/Components.css";
import { set } from "react-hook-form";
import { IoPlayOutline, IoStopOutline } from "react-icons/io5";
import { FaCirclePlay, FaCircleStop } from "react-icons/fa6";
import { TbClock, TbClockPlay, TbClockStop } from "react-icons/tb";
import CustomButton from "../button/CustomButton";

type SetUsageEventProps = {
  itemId: number; // ID of the electrical item
};

/*  SetUsageEvent Component
--------------------------------------------------------------------------------
Description: Component to start and end usage events for an electrical item.
Props:
    - itemId: ID of the electrical item.
------------------------------------------------------------------------------*/
const ToggleUsageEvent: React.FC<SetUsageEventProps> = ({ itemId }) => {
  const { colors } = useTheme();
  const [startTimeString, setStartTimeString] = React.useState<string>("");
  const [endTimeString, setEndTimeString] = React.useState<string>("");
  const [running, setRunning] = React.useState<boolean>(false);
  const [currentEventId, setCurrentEventId] = React.useState<number | null>(null);

  /* Fetch last event timestamps for an item when itemId changes
  ----------------------------------------------------------------------------*/
  const { startTs, endTs, eventId} = useLastEvent(itemId);

  const [playHovered, setPlayHovered] = React.useState(false);
  const [stopHovered, setStopHovered] = React.useState(false);
  
  useEffect(() => {
    if (startTs === null) {
        setStartTimeString("");
    } else {
      setStartTimeString(startTs.toLocaleString());
      setCurrentEventId(eventId);
      if (endTs === null) {
          setEndTimeString("");
          setRunning(true);
      } else {
          setRunning(false);
          setEndTimeString(endTs.toLocaleString());
      }
    }
  }, [startTs, endTs]); 

  /* Start a new usage event
  ------------------------------------------------------------------------------
  - Sends POST request to start a new usage event for the item
  ----------------------------------------------------------------------------*/
  const startUsageEvent = () => {
      startEvent(itemId, new Date().toISOString())
        .then((data: EventStart) => {
          setRunning(true);
          const start = new Date(data.start_ts);
          setStartTimeString(start.toLocaleString());
          setCurrentEventId(data.event_id); 
          console.log(data);
        })
        .catch(error => {
          console.error('Error creating usage event:', error);
        });
  };

  /* End the current usage event
  ------------------------------------------------------------------------------
  - Sends POST request to end the current usage event for the item
  - Sets endTime on success
  ----------------------------------------------------------------------------*/
  const endUsageEvent = () => {
      if (currentEventId === null) {
          console.error('No ongoing event to end.');
          return;
      }
      endEvent(currentEventId, new Date().toISOString())
        .then((data: EventEnd) => {
          const end = new Date(data.end_ts);
          setEndTimeString(end.toLocaleString());
          setRunning(false);
          setCurrentEventId(null);
          console.log(data);
        })
        .catch(error => {
          console.error('Error ending usage event:', error);
        });
  };

  /* Render SetUsageEvent component
  ------------------------------------------------------------------------------
  - Shows Start button if no ongoing event
  - Shows End button if there is an ongoing event
  - Displays start and end times if available
  ----------------------------------------------------------------------------*/
  return (
    <>
      {!running ? (
        <CustomButton onClick={startUsageEvent}>
          Start
          <TbClockPlay size={32} style={{ marginRight: "8px" }}/>
        </CustomButton>
      ) : (
        <div className="column" style={{ alignItems: "flex-end" }}>
          <CustomButton onClick={endUsageEvent}>
            Stop
            <TbClockStop size={32} style={{ marginRight: "8px" }}/>
          </CustomButton>
          {startTimeString ? (
            <div style={{ fontSize: "0.9rem", color: colors.mutedText }}>
              Started at: {startTimeString}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

export default ToggleUsageEvent;