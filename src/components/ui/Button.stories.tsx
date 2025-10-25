import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"], // enables docs & prop tables
  argTypes: {
    onClick: { action: "clicked" }, // logs clicks in Actions panel
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

// ✅ Default
export const Default: Story = {
  args: {
    children: "Click Me",
    variant: "default",
    size: "default",
  },
};

// ✅ Variants
export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
    loadingText: "Deleting"
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Go to link",
    variant: "link",
  },
};

// ✅ Sizes
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
    asChild: false,
    loading: true
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const Icon: Story = {
  args: {
    children: "🔍",
    size: "icon",
  },
};

// ✅ Loading
export const Loading: Story = {
  args: {
    children: "Submit",
    loading: true,
    loadingText: "Submitting...",
  },
};
