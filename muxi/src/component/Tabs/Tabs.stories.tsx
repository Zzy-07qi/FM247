import { fn } from "storybook/test";
import { MyTabs, type TabItem } from "./Tabs";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof MyTabs> = {
    title: "Component/MyTabs",
    component: MyTabs,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    argTypes: {
        type: {
            control: "select",
            options: ["success", "warning", "error", "info"],
        },
    },
    args: {
        onChange: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const tabs: TabItem[] = [
    { key: "1", label: "Tab 1", children: "内容 1" },
    { key: "2", label: "Tab 2", children: "内容 2" },
    { key: "3", label: "Tab 3", children: "内容 3" },
];

export const Default: Story = {
    args: {
        tabs,
        defaultActiveKey: "1",
        type: "info",
    },
};

export const Success: Story = {
    args: {
        tabs,
        defaultActiveKey: "1",
        type: "success",
    },
};

export const Warning: Story = {
    args: {
        tabs,
        defaultActiveKey: "1",
        type: "warning",
    },
};

export const Error: Story = {
    args: {
        tabs,
        defaultActiveKey: "1",
        type: "error",
    },
};
