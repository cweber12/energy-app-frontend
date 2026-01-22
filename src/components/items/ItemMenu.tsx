import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { MdInfoOutline } from "react-icons/md";
import { MdClose } from "react-icons/md";
import "../../App.css";
import "../Components.css";

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
        <div className="card" 
            style={{ 
                backgroundColor: colors.cardBackground, 
                color: colors.cardText,
                fontSize: "1.5rem"
            }}>
            
            <button onClick={() => setShowItemInput(true)}>+ Add Item</button>
            
            <ul style={{ listStyle: "none", padding: 0 }}>
                {items.map((item, idx) => (
                
                <li key={item.item_id} className="list-item">
                    <span style={{ marginRight: "8px" }}>{item.nickname}</span>
                    <MdInfoOutline
                    style={{ cursor: "pointer", color: colors.icon}}
                    onClick={() => setInfoOpenIndex(idx)}
                    />
                    {infoOpenIndex === idx && (
                        <div
                            className="item-info-popup"
                            style={{
                                background: colors.popupBackground,
                                color: colors.popupText,
                            }}>       
                            <MdClose 
                            style={{alignSelf: "flex-end", cursor: "pointer"}}
                            onClick={() => setInfoOpenIndex(null)}
                            />
                            <strong>{item.nickname}</strong>
                            <div>Category: {item.category_id}</div>
                            <div>Usage Type: {item.usage_type_id}</div>
                            <div>Rated Watts: {item.rated_watts}</div>
                        </div>
                    )}
                </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemMenu;