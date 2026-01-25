// src/components/items/ItemMenu.tsx
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";
import Card from "../common/Card";
import SetUsageEvent from "../action/SetUsageEvent";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import DailyUseReport from "../action/DailyUseReport";
import { useElectricalItems } from "../../hooks/useItem";

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
    setShowItemInput: React.Dispatch<React.SetStateAction<boolean>>;
    setShowDailyEvents: React.Dispatch<React.SetStateAction<boolean>>;
    showDailyEvents: boolean;
    setItemId: React.Dispatch<React.SetStateAction<string>>;
    setItemNickname: React.Dispatch<React.SetStateAction<string>>;
}> = ({
    propertyId, 
    setShowItemInput,
    setShowDailyEvents,
    showDailyEvents,
    setItemId, 
    setItemNickname,
}) => {

    /* State variables
    ----------------------------------------------------------------------------
    - infoOpenIndex: Index of the item with info popup open (null if none)
    - colors: Theme colors from context
    - items, categories, usageTypes: Data from useElectricalItems hook
    --------------------------------------------------------------------------*/
    const { colors } = useTheme();
    const [infoOpenIndex, setInfoOpenIndex] = useState<number | null>(null);
    const { items, categories, usageTypes } = useElectricalItems(propertyId);
    
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
            <div 
                className="card-header">
            <h2>Items</h2> 
            <button 
                onClick={() => setShowItemInput(true)}
                style={{ 
                    backgroundColor: colors.button,
                    color: colors.buttonText,
                }}
                >
                Add
            </button>
            </div>
            
            <ul className="list" style={{listStyle: "none"}}>
                {items.map((item, idx) => (
                    <React.Fragment key={item.item_id}>
                        <li 
                            className="list-item"
                            style={{
                                backgroundColor: colors.tertiaryBackground,
                                color: colors.tertiaryText,
                                position: "relative",
                            }}
                        >
            
                            <div className="row" style={{gap: "16px"}}>
                                {infoOpenIndex === idx ? (
                                    <FaAngleUp
                                        style={{ cursor: "pointer", color: colors.icon}}
                                        onClick={() => setInfoOpenIndex(null)}
                                    />
                                ) : ( 
                                    <FaAngleDown
                                        style={{ cursor: "pointer", color: colors.icon}}
                                        onClick={() => setInfoOpenIndex(idx)}
                                    />
                                )}
                                <span
                                    style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {item.nickname}
                                </span>
                            </div>
                            {/* Only for intermittent use items */}
                            {item.usage_type_id === 2 ? (
                                <SetUsageEvent itemId={item.item_id}/>
                            ) : null}
                        </li>
                        {infoOpenIndex === idx && (
                            <div
                                className="item-info-popup"
                                style={{
                                    background: colors.secondaryBackground,
                                    color: colors.secondaryText,
                                    position: "relative",
                                }}
                            >
                                <div className="row" style={{width: "100%", justifyContent: "space-between"}}>
                                    <DailyUseReport 
                                        itemId={item.item_id}
                                    />
                                    <button
                                        style={{
                                            backgroundColor: colors.button,
                                            color: colors.buttonText,
                                        }}
                                        onClick={() => {
                                            setItemId(item.item_id.toString());
                                            setItemNickname(item.nickname);
                                            setShowDailyEvents(prev => !prev);
                                        }}
                                    >
                                        {showDailyEvents ? "Hide All" : "View All"}
                                    </button>
                                </div>
                             
                                <div>Category | {categories[item.category_id]}</div>
                                <div>Usage Type | {usageTypes[item.usage_type_id]}</div>
                                <div>Rated Watts | {item.rated_watts}</div>
                                
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </Card>
    );
};

export default ItemMenu;