import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../App.css";
import "../Components.css";

const ItemMenu: React.FC<{
  propertyId: string;
  setShowItemInput: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ propertyId, setShowItemInput }) => {
  const [options, setOptions] = useState([
    { value: "add", label: "Add Item" },
  ]);

  useEffect(() => {
    if (!propertyId) return;
    fetch(`http://127.0.0.1:5000/electrical_items/property/${propertyId}`)
        .then((response) => response.json())
        .then((data) => {
        if (Array.isArray(data)) {
            setOptions([
            { value: "add", label: "Add Item" },
            ...data.map((item: any) => ({
                value: item.item_id,
                label: item.nickname,
            })),
            ]);
        } else {
            setOptions([{ value: "add", label: "Add Item" }]);
            console.error("Unexpected response:", data);
        }
        })
        .catch((error) => {
        console.error("Error fetching items:", error);
        });
    }, [propertyId]);

  const handleChange = (selected: any) => {
    if (!selected) return;
    if (selected.value === "add") {
      setShowItemInput(true);
    } else {
      sessionStorage.setItem("currentItem", selected.value);
    }
  };

  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      color: "black",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
    }),
  };

  return (
    <Select
      options={options}
      onChange={handleChange}
      placeholder="Select or add an item..."
      styles={customStyles}
    />
  );
};

export default ItemMenu;