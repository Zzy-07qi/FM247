import { fn } from "storybook/test";
import { MyAlert } from "./Alert";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof MyAlert> = {
  title: "Component/MyAlert",
  component: MyAlert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Deafault: Story = {
  args: {
    type: "info",
    title: "提示",
    message: "这是一条提示信息",
    closable: true,
  },
};

