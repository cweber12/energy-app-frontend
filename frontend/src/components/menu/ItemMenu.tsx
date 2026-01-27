// src/components/items/ItemMenu.tsx
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";
import Card from "../common/Card";
import SetUsageEvent from "../action/SetUsageEvent";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import LastUseReport from "../report/LastUseReport";
import { useAllItems } from "../../hooks/useItem";
import { IoMdAdd } from "react-icons/io";
import { IoOpenOutline } from "react-icons/io5";
import ItemEventsReport from "../report/ItemEventsReport";
import { LuMinimize2, LuMaximize2 } from "react-icons/lu";
import { set } from "react-hook-form";

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
    setItemId: React.Dispatch<React.SetStateAction<number>>;
    setItemNickname: React.Dispatch<React.SetStateAction<string>>;
}> = ({
    propertyId, 
    refreshItems,
    setShowItemInput,
    showItemInput,
    setShowDailyEvents,
    showDailyEvents,
    setItemId,
    setItemNickname,
}) => {

    /* State variables
    ----------------------------------------------------------------------------
    - infoOpenIndex: Index of the item with info popup open (null if none)
    - colors: Theme colors from context
    - items, categories, usageTypes: Data from useAllItems hook
    --------------------------------------------------------------------------*/
    const { colors } = useTheme();
    const [infoOpenIndex, setInfoOpenIndex] = useState<number | null>(null);
    const { items, categories, usageTypes } = useAllItems(propertyId, refreshItems);

    /* Render ItemMenu component
    ----------------------------------------------------------------------------
    Displays list of electrical items with expandable info popups
    Elements:
        - Header with title and Add Item button
        - List of items with nickname and expand/collapse icon
        - Info popup with daily usage, category, usage type, rated watts
    --------------------------------------------------------------------------*/
    return (
        <Card>
            <div className="card-header">
            {items.length > 0 && <h3>ITEMS</h3>}
            {!showItemInput && (
                <div 
                    className="upload-button"
                    style={{ backgroundColor: colors.iconTertiary }}
                    onClick={() => setShowItemInput(true)}
                >
                <IoMdAdd 
                    style={{ 
                        cursor: "pointer", 
                        color: colors.iconSecondary,
                        width: "32px",
                        height: "32px",
                    }}
                />
                Add Item
                </div>
            )}
            </div>
            
            <ul className="list" style={{listStyle: "none"}}>
                {items.map((item, idx) => (
                    <React.Fragment key={item.id}>
                        <li 
                            className="list-item"
                            style={{
                                backgroundColor: colors.tertiaryBackground,
                                color: colors.tertiaryText,
                                position: "relative",
                            }}
                        >
            
                            <div className="child-row">
                                {infoOpenIndex === idx ? (
                                    <FaAngleUp
                                        style={{ cursor: "pointer", color: colors.iconTertiary}}
                                        onClick={() => (
                                            setInfoOpenIndex(null),
                                            setShowDailyEvents(false)
                                        )}

                                    />
                                ) : ( 
                                    <FaAngleDown
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
                                <SetUsageEvent itemId={item.id}/>
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
                            {showDailyEvents && (
                                <ItemEventsReport
                                    itemId={item.id}
                                    itemNickname={item.nickname}
                                    setShowDailyEvents={setShowDailyEvents}
                                />
                    
                            )} 
                            </>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </Card>
    );
};

export default ItemMenu;