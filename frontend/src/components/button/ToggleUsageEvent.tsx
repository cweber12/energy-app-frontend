// src/components/items/SetUsageEvent.tsx
import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLastEvent } from "../../hooks/useEvent";
import { EventStart, EventEnd } from "../../../types/eventTypes";
import { startEvent, endEvent } from "../../supabase_services/eventsService";
import "../../App.css";
import "../../styles/Components.css";
import { PlayIcon, StopIcon } from "../icons";
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
  const [running, setRunning] = React.useState<boolean>(false);
  const [currentEventId, setCurrentEventId] = React.useState<number | null>(null);
  const [pending, setPending] = React.useState<boolean>(false);

  /* Fetch last event timestamps for an item when itemId changes
  ----------------------------------------------------------------------------*/
  const { startTs, endTs, eventId} = useLastEvent(itemId);
  
  useEffect(() => {
    if (startTs === null) {
        // no events yet
    } else {
      setCurrentEventId(eventId);
      if (endTs === null) {
          setRunning(true);
      } else {
          setRunning(false);
      }
    }
  }, [startTs, endTs, eventId]); 

  /* Start a new usage event
  ------------------------------------------------------------------------------
  - Sends POST request to start a new usage event for the item
  ----------------------------------------------------------------------------*/
  const startUsageEvent = () => {
      setPending(true);
      startEvent(itemId, new Date().toISOString())
        .then((data: EventStart) => {
          setRunning(true);
          setCurrentEventId(data.event_id);
          setPending(false);
        })
        .catch(error => {
          console.error('Error creating usage event:', error);
          setPending(false);
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
      setPending(true);
      endEvent(currentEventId, new Date().toISOString())
        .then((_data: EventEnd) => {
          setRunning(false);
          setCurrentEventId(null);
          setPending(false);
        })
        .catch(error => {
          console.error('Error ending usage event:', error);
          setPending(false);
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
        <CustomButton
          onClick={startUsageEvent}
          disabled={pending}
          style={{
            backgroundColor: colors.buttonStart,
            color: "#FFFFFF",
          }}
        >
          <PlayIcon size={16} color="#FFFFFF" />
          Start
        </CustomButton>
      ) : (
        <CustomButton
          onClick={endUsageEvent}
          disabled={pending}
          style={{
            backgroundColor: colors.buttonStop,
            color: "#FFFFFF",
          }}
        >
          <StopIcon size={16} color="#FFFFFF" />
          Stop
        </CustomButton>
      )}
    </>
  );
};

export default ToggleUsageEvent;