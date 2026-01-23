// src/components/items/SetUsageEvent.tsx
import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";

type SetUsageEventProps = {
  itemId: number; // ID of the electrical item
};

/*  SetUsageEvent Component
--------------------------------------------------------------------------------
Description: Component to start and end usage events for an electrical item.
Props:
    - itemId: ID of the electrical item.
------------------------------------------------------------------------------*/
const SetUsageEvent: React.FC<SetUsageEventProps> = ({ itemId }) => {
  const { colors } = useTheme();
  const [startTime, setStartTime] = React.useState<any | null>(null);
  const [endTime, setEndTime] = React.useState<any | null>(null);
  const [eventId, setEventId] = React.useState<number | null>(null);

  /* Fetch latest start and end timestamps when itemId changes
  ----------------------------------------------------------------------------
  - Fetches latest start and end timestamps for the given itemId
  - Sets startTime, endTime, and eventId state variables based on response
  --------------------------------------------------------------------------*/
  useEffect(() => {
    if (!itemId) return;
    console.log("Fetching usage event data for item ID:", itemId);

    /* Fetch latest start timestamp
    ----------------------------------------------------------------------------
    - GET request to fetch latest start timestamp for the item
    - Sets startTime and eventId state variables based on response
    --------------------------------------------------------------------------*/
    fetch(`http://127.0.0.1:5000/item_usage_event_start/item/${itemId}/latest_start`)
      .then(async response => {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.error) {
            setStartTime(null);
            setEventId(null);
            return;
          }
          if (data.latest_start_ts) {
            setStartTime(new Date(data.latest_start_ts));
            setEventId(data.event_id);
          } else {
            setStartTime(null);
            setEventId(null);
          }
        } catch {
          console.error('Non-JSON response:', text);
          setStartTime(null);
          setEventId(null);
        }
      })
      .catch(error => {
        console.error('Error fetching latest start timestamp:', error);
      });

    /* Fetch latest end timestamp
    ----------------------------------------------------------------------------
    - GET request to fetch latest end timestamp for the item
    - Sets endTime state variable based on response
    --------------------------------------------------------------------------*/
    fetch(`http://127.0.0.1:5000/item_usage_event_end/item/${itemId}/latest_end`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }) 
        .then(response => response.json())
        .then(data => {
            if (data && !data.error && data.latest_end_ts) {
                console.log("Latest end timestamp data:", data);
                setEndTime(new Date(data.latest_end_ts));
            } else {
                setEndTime(null);
            }
        })
        .catch(error => {
            console.error('Error fetching latest end timestamp:', error);
        });
  }, [itemId]);

  /* Start a new usage event
  ------------------------------------------------------------------------------
  - Sends POST request to create a new usage event for the item
  - Sets startTime, eventId, and resets endTime on success
  - Button to trigger is only shown if there is no ongoing event 
    - No startTime or endTime is set for that item (no starts recorded)
    - Most recent startTime has endTIme with same eventId (last use ended)
  ----------------------------------------------------------------------------*/
  const startUsageEvent = () => {
      fetch(`http://127.0.0.1:5000/item_usage_event_start`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              item_id: itemId,
              start_ts: new Date().toISOString()
          })
      })
          .then(response => {
              if (!response.ok) throw new Error("Network response was not ok");
              return response.json();
          })
          .then(data => {
              setStartTime(new Date(data.start_ts));
              setEventId(data.event_id);
              setEndTime(null);
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
    if (!eventId) return;
    fetch(`http://127.0.0.1:5000/item_usage_event_end`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            event_id: eventId,
            end_ts: new Date().toISOString()
        })
    })
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            setEndTime(new Date(data.end_ts)); 
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
      {endTime || !startTime ? (
      <div className="item-usage-event">
        <button
        style={{
            backgroundColor: colors.buttonStart,
            color: colors.buttonText,
        }}
          onClick={() => {
            startUsageEvent();
          }}
        >
          Start 
        </button>
      </div>
      ) : (
        <div className="item-usage-event">
          <button
          style={{
              backgroundColor: colors.buttonStop,
              color: colors.buttonText,
          }}
            onClick={() => {
              endUsageEvent();
              
            }}
          >
            End
          </button>
          {startTime instanceof Date ? (
            <div> 
              Started at: {startTime.toLocaleTimeString()}
            </div>
          ) : null}
          {endTime instanceof Date ? (
            <div>
              Ended at: {endTime.toLocaleTimeString()}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

export default SetUsageEvent;