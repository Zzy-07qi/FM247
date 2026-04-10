import { fn } from "storybook/test";
import { MyInput } from "./Input";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof MyInput> = {
  title: "Component/MyInput",
  component: MyInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "search"],
    },
  },
  args: {
    onChange: fn(),
    onFocus: fn(),

  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "请输入内容",
    size: "md",
  },
};

export const WithPrefix: Story = {
  args: {
    placeholder: "搜索",
    size: "md",
  },
};

export const WithSuffix: Story = {
  args: {
    placeholder: "输入内容",
    size: "md",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "禁用状态",
    disabled: true,
    size: "md",
  },
};

export const Small: Story = {
  args: {
    placeholder: "小尺寸",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    placeholder: "大尺寸",
    size: "lg",
  },
};
