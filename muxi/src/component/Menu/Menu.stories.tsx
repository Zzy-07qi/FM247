import type { Meta, StoryObj } from "@storybook/react";
import { MyMenu } from "./Menu";
import type { MenuItem } from "./Menu";

const meta: Meta<typeof MyMenu> = {
  title: "Component/Menu",
  component: MyMenu,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    trigger: {
      control: "select",
      options: ["click", "hover"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyMenu>;

const menuItems: MenuItem[] = [
  { key: "1", label: "首页" },
  {
    key: "2",
    label: "产品",
    children: [
      { key: "2-1", label: "产品A" },
      { key: "2-2", label: "产品B" },
    ],
  },
  { key: "3", label: "关于" },
  { key: "4", label: "禁用项", disabled: true },
];

export const Default: Story = {
  args: {
    items: menuItems,
    mode: "vertical",
    trigger: "hover",
  },
};

export const Horizontal: Story = {
  args: {
    items: menuItems,
    mode: "horizontal",
    trigger: "hover",
  },
};
