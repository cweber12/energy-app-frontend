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
import {
  InfoIcon,
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../icons";
import CardHeader from "../common/CardHeader";
import CustomButton from "../button/CustomButton";
import { INTERMITTENT_USAGE_TYPE_ID } from "../../constants/utilities";


/* ItemMenu Component
--------------------------------------------------------------------------------
Description: Displays a list of electrical items for a selected property.
- Props:
    - propertyId: ID of the selected property
    - setShowItemInput: Function to show/hide the ItemInput component
    - setShowDailyEvents: Function to show/hide daily events view
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
    // Track the expanded item by its stable item.id, not array index.
    const [openItemId, setOpenItemId] = useState<number | null>(null);
    const { colors } = useTheme();
    const { items, categories, usageTypes, isLoading, error } = 
        useAllItems(propertyId, refreshItems);

    const handleToggleItem = (id: number) => {
        if (openItemId === id) {
            setOpenItemId(null);
            setShowDailyEvents(false);
        } else {
            setOpenItemId(id);
            setShowDailyEvents(false);
        }
    };

    /* Render ItemMenu component
    ----------------------------------------------------------------------------
    Displays list of electrical items with expandable info popups and an
    absolutely-positioned events panel that anchors to the right of the card.
    --------------------------------------------------------------------------*/
    return (
        <div className="item-menu-wrapper">
            <Card>
                <CardHeader>
                    <div className="row" style={{ gap: "var(--space-2)" }}>
                        <h3 className="card-section-label" style={{ color: colors.primaryText }}>
                            Items
                        </h3>
                        {items.length > 0 && (
                            <InfoIcon
                                size={16}
                                color={colors.iconSecondary}
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowItemInfo(prev => !prev)}
                                title="About items"
                            />
                        )}
                    </div>
                    <CustomButton
                        onClick={() => setShowItemInput(true)}
                        disabled={showItemInput}
                    >
                        <PlusIcon size={16} />
                        Add Item
                    </CustomButton>
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

                {isLoading && (
                    <p style={{ padding: "var(--space-4)", fontSize: "var(--font-sm)", color: colors.mutedText }}>
                        Loading itemsâ€¦
                    </p>
                )}

                {!isLoading && error && (
                    <p style={{ padding: "var(--space-4)", fontSize: "var(--font-sm)", color: colors.warning }}>
                        {error}
                    </p>
                )}

                {!isLoading && !error && items.length === 0 && (
                    <p style={{ padding: "var(--space-4)", fontSize: "var(--font-sm)", color: colors.mutedText }}>
                        No items yet. Add your first item above.
                    </p>
                )}

                <ul className="list" style={{ listStyle: "none" }}>
                    {items.map((item) => (
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
                                    <button
                                        type="button"
                                        aria-label={openItemId === item.id ? "Collapse item details" : "Expand item details"}
                                        aria-expanded={openItemId === item.id}
                                        onClick={() => handleToggleItem(item.id)}
                                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }}
                                    >
                                        {openItemId === item.id ? (
                                            <ChevronUpIcon size={18} color={colors.iconTertiary} />
                                        ) : (
                                            <ChevronDownIcon size={18} color={colors.iconTertiary} />
                                        )}
                                    </button>
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
                                    {item.usage_type_id === INTERMITTENT_USAGE_TYPE_ID && (
                                        <ToggleUsageEvent itemId={item.id} />
                                    )}
                                    <LastUseReport itemId={item.id} />
                                </div>
                            </li>

                            {/* Expanded info row â€” category/wattage + events toggle */}
                            {openItemId === item.id && (
                                <div
                                    className="item-info-popup"
                                    style={{
                                        background: colors.tertiaryBackground,
                                        color: colors.secondaryText,
                                    }}
                                >
                                    {/* Item metadata: category and rated watts */}
                                    <div className="item-meta" style={{ textAlign: "left", whiteSpace: "normal" }}>
                                        {categories[item.category_id] && (
                                            <span>{categories[item.category_id]}</span>
                                        )}
                                        {item.rated_watts > 0 && (
                                            <span>{item.rated_watts} W Â· {usageTypes[item.usage_type_id]}</span>
                                        )}
                                    </div>

                                    {/* Usage events toggle */}
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
                                        <button
                                            type="button"
                                            aria-label={showDailyEvents ? "Hide usage events" : "Show usage events"}
                                            aria-expanded={showDailyEvents}
                                            onClick={() => setShowDailyEvents(prev => !prev)}
                                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
                                        >
                                            {showDailyEvents ? (
                                                <ChevronUpIcon size={18} color={colors.iconSecondary} />
                                            ) : (
                                                <ChevronDownIcon size={18} color={colors.iconSecondary} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </Card>

            {/* Events panel â€” absolutely positioned to the right of the card */}
            {showDailyEvents && openItemId !== null && items.find(i => i.id === openItemId) && (
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
                            {items.find(i => i.id === openItemId)!.nickname} â€” Events
                        </span>
                        <button
                            type="button"
                            aria-label="Close events panel"
                            onClick={() => setShowDailyEvents(false)}
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
                        >
                            <ChevronUpIcon
                                size={16}
                                color={colors.iconSecondary}
                            />
                        </button>
                    </div>
                    <ItemEventsReport itemId={openItemId} />
                </div>
            )}
        </div>
    );
};

export default ItemMenu;

