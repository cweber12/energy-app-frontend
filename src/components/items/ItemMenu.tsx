import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { MdInfoOutline } from "react-icons/md";
import { MdClose } from "react-icons/md";
import "../../App.css";
import "../Components.css";
import Card from "../common/Card";

const ItemMenu: React.FC<{
  propertyId: string;
  setShowItemInput: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ propertyId, setShowItemInput }) => {
    const { colors } = useTheme();
    const [items, setItems] = useState<any[]>([]);
    const [infoOpenIndex, setInfoOpenIndex] = useState<number | null>(null);

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
    }, [propertyId]);

    return (
        <Card>
            
            <button 
                onClick={() => setShowItemInput(true)}
                style={{ 
                    backgroundColor: colors.button,
                    color: colors.buttonText,
                    alignSelf: "flex-end",
                    marginBottom: "10px",
                    border: "none",
                    padding: "10px 15px",
                    cursor: "pointer", 
                    width: "100%",
                }}
                >
                + Add Item
            </button>
            
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
                            <span style={{ marginRight: "8px" }}>{item.nickname}</span>
                            <MdInfoOutline
                                style={{ cursor: "pointer", color: colors.icon }}
                                onClick={() => setInfoOpenIndex(idx)}
                            />
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
                                <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
                                    <MdClose
                                        style={{ 
                                            cursor: "pointer", 
                                            position: "absolute", 
                                            top: "10px", 
                                            right: "10px",
                                            color: colors.icon 
                                        }}
                                        onClick={() => setInfoOpenIndex(null)}
                                    />
                                </div>
                                <div>Category: {item.category_id}</div>
                                <div>Usage Type: {item.usage_type_id}</div>
                                <div>Rated Watts: {item.rated_watts}</div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </Card>
    );
};

export default ItemMenu;