// src/components/items/ItemMenu.tsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";
import Card from "../common/Card";
import ToggleUsageEvent from "../button/ToggleUsageEvent";
import LastUseReport from "../report/LastUseReport";
import { useAllItems } from "../../hooks/useItem";
import ItemEventsReport from "../report/ItemEventsReport";
import {
  InfoIcon,
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../icons";
import CardHeader from "../common/CardHeader";
import CustomButton from "../button/CustomButton";


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

    // Close events panel when the expanded item changes
    useEffect(() => {
        setShowDailyEvents(false);
    }, [infoOpenIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Render ItemMenu component
    ----------------------------------------------------------------------------
    Displays list of electrical items with expandable info popups and an
    absolutely-positioned events panel that anchors to the right of the card.
    --------------------------------------------------------------------------*/
    return (
        <div className="item-menu-wrapper">
            <Card>
                <CardHeader>
                    {items.length > 0 && (
                        <div className="row" style={{ gap: "var(--space-2)" }}>
                            <h3 className="card-section-label" style={{ color: colors.primaryText }}>
                                Items
                            </h3>
                            <InfoIcon
                                size={16}
                                color={colors.iconSecondary}
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowItemInfo(prev => !prev)}
                                title="About items"
                            />
                        </div>
                    )}
                    {!showItemInput && (
                        <CustomButton onClick={() => setShowItemInput(true)}>
                            <PlusIcon size={16} />
                            Add Item
                        </CustomButton>
                    )}
                </CardHeader>

                {showItemInfo && (
                    <div
                        className="info-popup"
                        style={{
                            background: colors.secondaryBackground,
                            color: colors.secondaryText,
                        }}
                    >
                        <p>This section lists all electrical items associated with the selected property.</p>
                        <ul>
                            <li>Click the chevron to view item details and events</li>
                            <li>Start and stop usage events for intermittent-use items using the coloured buttons</li>
                            <li>View all usage events by expanding the item details</li>
                        </ul>
                    </div>
                )}

                <ul className="list" style={{ listStyle: "none" }}>
                    {items.map((item, idx) => (
                        <React.Fragment key={item.id}>
                            <li
                                className="list-item"
                                style={{
                                    backgroundColor: colors.secondaryBackground,
                                    color: colors.tertiaryText,
                                    borderBottom: `1px solid ${colors.border}`,
                                }}
                            >
                                {/* Left: expand chevron + item name */}
                                <div className="child-row" style={{ minWidth: 0, flex: 1 }}>
                                    {infoOpenIndex === idx ? (
                                        <button
                                            type="button"
                                            aria-label="Collapse item details"
                                            aria-expanded={true}
                                            onClick={() => {
                                                setInfoOpenIndex(null);
                                                setShowDailyEvents(false);
                                            }}
                                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }}
                                        >
                                            <ChevronUpIcon
                                                size={18}
                                                color={colors.iconTertiary}
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            aria-label="Expand item details"
                                            aria-expanded={false}
                                            onClick={() => setInfoOpenIndex(idx)}
                                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }}
                                        >
                                            <ChevronDownIcon
                                                size={18}
                                                color={colors.iconTertiary}
                                            />
                                        </button>
                                    )}
                                    <span
                                        style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.nickname}
                                    </span>
                                </div>

                                {/* Right: action button + secondary metadata */}
                                <div className="item-action-meta">
                                    {item.usage_type_id === 2 && (
                                        <ToggleUsageEvent itemId={item.id} />
                                    )}
                                    <LastUseReport itemId={item.id} />
                                </div>
                            </li>

                            {/* Expanded info row — events toggle only */}
                            {infoOpenIndex === idx && (
                                <div
                                    className="item-info-popup"
                                    style={{
                                        background: colors.tertiaryBackground,
                                        color: colors.secondaryText,
                                    }}
                                >
                                    <div
                                        className="child-row"
                                        style={{ width: "100%", justifyContent: "space-between" }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "var(--font-xs)",
                                                color: colors.mutedText,
                                                fontWeight: "var(--font-weight-medium)",
                                                letterSpacing: "0.04em",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Usage Events
                                        </span>
                                        {showDailyEvents ? (
                                            <button
                                                type="button"
                                                aria-label="Hide usage events"
                                                aria-expanded={true}
                                                onClick={() => setShowDailyEvents(false)}
                                                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
                                            >
                                                <ChevronUpIcon
                                                    size={18}
                                                    color={colors.iconSecondary}
                                                />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                aria-label="Show usage events"
                                                aria-expanded={false}
                                                onClick={() => setShowDailyEvents(true)}
                                                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
                                            >
                                                <ChevronDownIcon
                                                    size={18}
                                                    color={colors.iconSecondary}
                                                />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </Card>

            {/* Events panel — absolutely positioned to the right of the card */}
            {showDailyEvents && infoOpenIndex !== null && items[infoOpenIndex] && (
                <div
                    className="events-panel"
                    style={{
                        backgroundColor: colors.secondaryBackground,
                        borderColor: colors.border,
                    }}
                >
                    <div
                        className="events-panel-header"
                        style={{
                            backgroundColor: colors.tertiaryBackground,
                            borderBottom: `1px solid ${colors.border}`,
                            color: colors.tertiaryText,
                        }}
                    >
                        <span className="card-section-label">
                            {items[infoOpenIndex].nickname} — Events
                        </span>
                        <ChevronUpIcon
                            size={16}
                            color={colors.iconSecondary}
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowDailyEvents(false)}
                            title="Close events panel"
                        />
                    </div>
                    <ItemEventsReport itemId={items[infoOpenIndex].id} />
                </div>
            )}
        </div>
    );
};

export default ItemMenu;
