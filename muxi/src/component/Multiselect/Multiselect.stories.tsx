import type { Meta, StoryObj } from "@storybook/react";
import { MyMultiselect } from "./Multiselect";
import type { Option } from "./Multiselect";
import { useState } from "react";

const meta: Meta<typeof MyMultiselect> = {
  title: "Component/Multiselect",
  component: MyMultiselect,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    maxTagCount: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyMultiselect>;

const options: Option[] = [
  { value: "1", label: "选项一" },
  { value: "2", label: "选项二" },
  { value: "3", label: "选项三" },
  { value: "4", label: "选项四" },
  { value: "5", label: "选项五" },
];

const MultiselectWithState = (args: any) => {
  const [value, setValue] = useState<string[]>(args.value || []);
  return <MyMultiselect {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <MultiselectWithState {...args} />,
  args: {
    options,
    value: [],
    placeholder: "请选择",
    maxTagCount: 3,
  },
};

export const WithValue: Story = {
  render: (args) => <MultiselectWithState {...args} />,
  args: {
    options,
    value: ["1", "3"],
    placeholder: "请选择",
    maxTagCount: 3,
  },
};

export const Disabled: Story = {
  render: (args) => <MultiselectWithState {...args} />,
  args: {
    options,
    value: ["1", "2"],
    placeholder: "请选择",
    disabled: true,
    maxTagCount: 3,
  },
};

export const CustomMaxTagCount: Story = {
  render: (args) => <MultiselectWithState {...args} />,
  args: {
    options,
    value: ["1", "2", "3", "4", "5"],
    placeholder: "请选择",
    maxTagCount: 2,
  },
};

export const ManyOptions: Story = {
  render: (args) => <MultiselectWithState {...args} />,
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: String(i + 1),
      label: `选项 ${i + 1}`,
    })),
    value: ["1", "5", "10"],
    placeholder: "请选择",
    maxTagCount: 3,
  },
};

export const WithDisabledOption: Story = {
  render: (args) => <MultiselectWithState {...args} />,
  args: {
    options: [
      { value: "1", label: "可选一" },
      { value: "2", label: "可选二" },
      { value: "3", label: "禁用项", disabled: true },
      { value: "4", label: "可选三" },
    ],
    value: ["1"],
    placeholder: "请选择",
    maxTagCount: 3,
  },
};
