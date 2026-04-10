import { MyIcon, type IconType } from "./Icon";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof MyIcon> = {
  title: "Component/MyIcon",
  component: MyIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "search",
        "close",
        "arrow-down",
        "arrow-right",
        "check",
        "warning",
        "error",
        "info",
      ],
    },
    size: {
      control: { type: "range", min: 12, max: 48, step: 4 },
    },
    color: {
      control: "color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {
  args: {
    type: "search",
    size: 24,
  },
};

export const Close: Story = {
  args: {
    type: "close",
    size: 24,
  },
};

export const ArrowDown: Story = {
  args: {
    type: "arrow-down",
    size: 24,
  },
};

export const ArrowRight: Story = {
  args: {
    type: "arrow-right",
    size: 24,
  },
};

export const Check: Story = {
  args: {
    type: "check",
    size: 24,
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    size: 24,
    color: "#faad14",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    size: 24,
    color: "#ff4d4f",
  },
};

export const Info: Story = {
  args: {
    type: "info",
    size: 24,
    color: "#1890ff",
  },
};
