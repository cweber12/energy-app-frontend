// src/components/items/ItemMenu.tsx
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";
import Card from "../common/Card";
import ToggleUsageEvent from "../button/ToggleUsageEvent";
import LastUseReport from "../report/LastUseReport";
import { useAllItems } from "../../hooks/useItem";
import ItemEventsReport from "../report/ItemEventsReport";
import { LuMinimize2, LuMaximize2 } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { LuInfo } from "react-icons/lu";
import CardHeader from "../common/CardHeader";


/* ItemMenu Component
--------------------------------------------------------------------------------
Description: Displays a list of electrical items for a selected property.
- Props:
    - propertyId: ID of the selected property
    - setShowItemInput: Function to show/hide the ItemInput component
    - setShowDailyEvents: Function to show/hide daily events view
    - setItemId: Function to set the selected item ID for daily events
------------------------------------------------------------------------------*/
const ItemMenu: React.FC<{
    propertyId: string;
    refreshItems: number;
    setShowItemInput: React.Dispatch<React.SetStateAction<boolean>>;
    showItemInput: boolean;
    setShowDailyEvents: React.Dispatch<React.SetStateAction<boolean>>;
    showDailyEvents: boolean;
}> = ({
    propertyId, 
    refreshItems,
    setShowItemInput,
    showItemInput,
    setShowDailyEvents,
    showDailyEvents,
}) => {
    const [showItemInfo, setShowItemInfo] = useState<boolean>(false);
    const [infoOpenIndex, setInfoOpenIndex] = useState<number | null>(null);
    const { colors } = useTheme();
    const { items, categories, usageTypes } = 
        useAllItems(propertyId, refreshItems);

    /* Render ItemMenu component
    ----------------------------------------------------------------------------
    Displays list of electrical items with expandable info popups
    --------------------------------------------------------------------------*/
    return (
        <Card>
            <CardHeader>
                {items.length > 0 && (
                    <>
                        <div className="row">
                            <h3>ITEMS</h3>
                            <LuInfo
                                style={{
                                    cursor: "pointer",
                                    color: colors.iconTertiary,
                                    width: "24px",
                                    height: "24px",
                                    marginLeft: "0.5rem",
                                }}
                                onClick={() => setShowItemInfo(prev => !prev)}
                            />
                            
                        </div>
                        
                    </>
                )}
                {!showItemInput && (
                    <button
                        style={{backgroundColor: colors.button, color: colors.buttonText}}
                        onClick={() => setShowItemInput(true)}
                    >
                    <FiPlus 
                        style={{ 
                            cursor: "pointer", 
                            color: colors.buttonText,
                            width: "32px",
                            height: "32px",
                            marginRight: "0.5rem",
                        }}
                    />
                    Add Item
                    </button>
                )}
            </CardHeader>
            {showItemInfo && (
                <div
                    className="info-popup"
                    style={{
                        background: colors.secondaryBackground,
                        color: colors.secondaryText,
                        maxWidth: "30vw",
                        padding: "0.5rem",
                        fontSize: "1.1rem",
                    }}
                >
                    <p>This section lists all electrical items associated with the selected property. </p>
                    <ul>
                        <li>Click the down arrow to the left to view item details</li>
                        <li>Start and stop usage events <strong>for intermittent use items</strong> using the play and stop buttons</li>
                        <li>View detailed usage event reports by expanding the item details.</li>
                    </ul>
                </div>
            )}
            
            <ul className="list" style={{listStyle: "none"}}>
                {items.map((item, idx) => (
                    <React.Fragment key={item.id}>
                        <li 
                            className="list-item"
                            style={{
                                backgroundColor: colors.secondaryBackground,
                                color: colors.tertiaryText,
                                position: "relative",
                            }}
                        >
            
                            <div className="child-row">
                                {infoOpenIndex === idx ? (
                                    <FiChevronUp
                                        style={{ cursor: "pointer", color: colors.iconTertiary}}
                                        onClick={() => (
                                            setInfoOpenIndex(null),
                                            setShowDailyEvents(false)
                                        )}

                                    />
                                ) : ( 
                                    <FiChevronDown
                                        style={{ cursor: "pointer", color: colors.iconTertiary}}
                                        onClick={() => setInfoOpenIndex(idx)}
                                    />
                                )}
                                <span
                                    style={{ 
                                        maxWidth: "300px", 
                                        overflow: "hidden", 
                                        textOverflow: "ellipsis", 
                                        whiteSpace: "nowrap" 
                                    }}>
                                    {item.nickname}
                                </span>
                            </div>
                            {/* Only for intermittent use items */}
                            {item.usage_type_id === 2 ? (
                                <ToggleUsageEvent itemId={item.id}/>
                            ) : null}
                        </li>
                        {infoOpenIndex === idx && (
                            <>
                                <div
                                    className="item-info-popup"
                                    style={{
                                        background: colors.secondaryBackground,
                                        color: colors.secondaryText,
                                        position: "relative",
                                    }}
                                >
                                    {item.id &&  (
                                        <div className="child-row" style={{width: "100%", justifyContent: "space-between"}}>
                                            <div style={{color: colors.secondaryText}}>
                                                <p><strong>Category:</strong> {categories[item.category_id]}<br/>
                                                <strong>Frequency:</strong> {usageTypes[item.usage_type_id]}<br/>
                                                {item.rated_watts > 0 && `Rated Watts: ${item.rated_watts}W`}
                                                </p>
                                            </div>
                                            <LastUseReport itemId={item.id} />
                                            {showDailyEvents ? (
                                                <LuMinimize2
                                                    style={{
                                                        cursor: "pointer",
                                                        color: colors.iconSecondary,
                                                        width: "32px",
                                                        height: "32px",
                                                    }}
                                                    onClick={() => {
                                                        setShowDailyEvents(prev => !prev);
                                                    }}
                                                />
                                            ) : (
                                                <LuMaximize2
                                                    style={{
                                                        cursor: "pointer",
                                                        color: colors.iconSecondary,
                                                        width: "32px",
                                                        height: "32px",
                                                    }}
                                                    onClick={() => {
                                                        setShowDailyEvents(prev => !prev);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {showDailyEvents && <ItemEventsReport itemId={item.id} />}
                            </>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </Card>
    );
};

export default ItemMenu;