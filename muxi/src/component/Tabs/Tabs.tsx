import { useState } from "react";
import "./Tabs.css";

export interface TabItem {
    key: string;
    label: string;
    children?: React.ReactNode;
}

export type TabsType = "success" | "warning" | "error" | "info";
export type TabsMode = "vertical" | "horizontal"
interface TabsProps {
    type?: TabsType;
    tabs: TabItem[];
    defaultActiveKey?: string;
    onChange?: (key: string) => void;
    mode?: TabsMode
}

export const MyTabs = ({
    type = "info",
    tabs,
    defaultActiveKey,
    mode,
    onChange,
}: TabsProps) => {
    const [active, setActive] = useState(defaultActiveKey || tabs[0]?.key);

    const handleClick = (key: string) => {
        setActive(key);
        onChange?.(key);
    };

    return (
        <div className={`tabs tabs-${type}`}>
            <div className={`tabs-header tabs-${mode}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleClick(tab.key)}
                        className={`tabs-nav ${active === tab.key ? "active" : ""}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                {tabs.find((t) => t.key === active)?.children}
            </div>
        </div>
    );
};
