import { fn } from "storybook/test";
import { MyButton } from "./Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta: Meta<typeof MyButton> = {
  title: "Component/MyButton",
  component: MyButton,
  tags: ["autodocs"],
  argTypes: { background: { control: "color" } },
  parameters: {
    layout: "centered",
  },
  args: {
    onClick: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "默认按钮",
    size: "lg",
    onClick: fn(() => alert("默认按钮")),
    background: "#a85151",
    type: "primary",
    disabled: false,
  },
};
