import { useState } from "react";
import "./Menu.css";

// 菜单项数据类型
export interface MenuItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
}

// 菜单组件属性
interface MenuProps {
  items: MenuItem[];
  mode?: "horizontal" | "vertical";
  trigger?: "click" | "hover";
  onSelect?: (key: string) => void;
}

// 菜单组件
export const MyMenu = ({
  items,
  mode = "vertical",
  trigger = "hover",
  onSelect,
}: MenuProps) => {
  // 记录已展开的子菜单
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 记录当前选中的菜单项
  const [selectedKey, setSelectedKey] = useState<string>("");

  // 处理菜单项点击
  const handleClick = (item: MenuItem) => {
    if (item.disabled) return;
    setSelectedKey(item.key);
    onSelect?.(item.key);
  };

  // 处理子菜单展开/收起切换
  const handleSubMenuToggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // 渲染单个菜单项（递归渲染子菜单）
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openKeys.includes(item.key);
    const isSelected = selectedKey === item.key;

    return (
      <li
        key={item.key}
        className={`menu-item ${item.disabled ? "menu-item-disabled" : ""} ${item.danger ? "menu-item-danger" : ""} ${isSelected ? "menu-item-selected" : ""} ${hasChildren ? "menu-item-has-children" : ""} `}
        onClick={() => {
          if (hasChildren) {
            handleSubMenuToggle(item.key);
          } else {
            handleClick(item);
          }
        }}
      >
        <span className="menu-item-label">{item.label}</span>
        {hasChildren && (
          <span className={`menu-arrow ${isOpen ? "menu-arrow-open" : ""}`}>
            ▶
          </span>
        )}
        {hasChildren && isOpen && (
          <ul className="menu-submenu">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul className={`menu menu-${mode} menu-trigger-${trigger}`}>
      {items.map((item) => renderMenuItem(item))}
    </ul>
  );
};
