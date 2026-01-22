import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";
import Card from "../common/Card";
import SetUsageEvent from "./SetUsageEvent";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import GetDailyUse from "./GetDailyUse";
import { data } from "react-router-dom";

/*  ItemMenu Component
--------------------------------------------------------------------------------
Description: Component that displays a list of electrical items for a property.
------------------------------------------------------------------------------*/
type ItemType = {
    item_id: number;
    nickname: string;
    category_id: number;
    usage_type_id: number;
    rated_watts: number;

};

const ItemMenu: React.FC<{
    propertyId: string;
    setShowItemInput: React.Dispatch<React.SetStateAction<boolean>>;
    setShowDailyEvents: React.Dispatch<React.SetStateAction<boolean>>;
    setItemId: React.Dispatch<React.SetStateAction<string>>;
}> = ({
    propertyId, 
    setShowItemInput,
    setShowDailyEvents,
    setItemId
}) => {
    const { colors } = useTheme();
    const [items, setItems] = useState<ItemType[]>([]);
    const [categories, setCategories] = useState<{ [key: number]: string }>({});
    const [usageTypes, setUsageTypes] = useState<{ [key: number]: string }>({});
    const [infoOpenIndex, setInfoOpenIndex] = useState<number | null>(null);

    /* Fetch items when propertyId changes
    --------------------------------------------------------------------------*/
    useEffect(() => {
        if (!propertyId) return;
        fetch(`http://127.0.0.1:5000/electrical_items/property/${propertyId}`)
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
            setItems(data);
            } else {
            setItems([]);
            console.error("Unexpected response:", data);
            }
        })
        .catch((error) => {
            setItems([]);
            console.error("Error fetching items:", error);
        });

        fetchCategory();
        fetchUsageType();
    }, [propertyId]);

    /* Fetch category and usage type mappings
    --------------------------------------------------------------------------*/
    const fetchCategory = async () => {
        console.log("Fetching categories");
        fetch(`http://127.0.0.1:5000/item_categories`)
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                // Transform array to map: { [id]: name }
                const categoryMap: { [key: number]: string } = {};
                data.forEach((cat: any) => {
                    categoryMap[cat.category_id] = cat.category_name;
                });
                setCategories(categoryMap);
                console.log("Fetched categories:", categoryMap);
            } else {
                setCategories({});
                console.error("Unexpected response:", data);
            }
        })
        .catch((error) => {
            console.error("Error fetching category:", error);
            setCategories({});
        });
    };

    /* Fetch usage type mappings
    --------------------------------------------------------------------------*/
    const fetchUsageType = async () => {
        console.log("Fetching usage types");
        fetch(`http://127.0.0.1:5000/usage_types`)
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                // Transform array to map: { [id]: name }
                const usageTypeMap: { [key: number]: string } = {};
                data.forEach((ut: any) => {
                    usageTypeMap[ut.usage_type_id] = ut.usage_type_name;
                });
                setUsageTypes(usageTypeMap);
                console.log("Fetched usage types:", usageTypeMap);
            } else {
                setUsageTypes({});
                console.error("Unexpected response:", data);
            }
        })
        .catch((error) => {
            console.error("Error fetching usage types:", error);
            setUsageTypes({});
        });
    };

    return (
        <Card>
            <div 
            className="row" 
            style={{ 
                justifyContent: "space-between", 
                alignItems: "center", 
                boxSizing: "border-box",
                width: "100%", 
                backgroundColor: colors.cardBackground,
                padding: "1rem",
                }}>
            <h2>Electrical Items</h2> 
            <button 
                onClick={() => setShowItemInput(true)}
                style={{ 
                    backgroundColor: colors.button,
                    color: colors.buttonText,
                }}
                >
                + Add Item
            </button>
            </div>
            
            <ul className="list" style={{padding: 0, margin: 0, borderRadius: "8px", listStyle: "none"}}>
                {items.map((item, idx) => (
                    <React.Fragment key={item.item_id}>
                        <li 
                            className="list-item"
                            style={{
                                backgroundColor: colors.listItemBackground,
                                color: colors.listItemText,
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
                                    background: colors.popupBackground,
                                    color: colors.popupText,
                                    position: "relative",
                                }}
                            >
                                <GetDailyUse itemId={item.item_id} />
                                <div>Category | {categories[item.category_id]}</div>
                                <div>Usage Type | {usageTypes[item.usage_type_id]}</div>
                                <div>Rated Watts | {item.rated_watts}</div>
                                <button
                                    style={{
                                        marginTop: "1rem",
                                        backgroundColor: colors.button,
                                        color: colors.buttonText,
                                    }}
                                    onClick={() => {
                                        setItemId(item.item_id.toString());
                                        setShowDailyEvents(true);
                                    }}
                                >
                                    Usage Log
                                </button>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </Card>
    );
};

export default ItemMenu;