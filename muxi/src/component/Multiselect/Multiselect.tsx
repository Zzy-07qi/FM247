import { useState, useRef, useEffect } from "react";
import "./Multiselect.css";

// 选项数据类型
export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

// 多选组件属性
interface MultiselectProps {
  options: Option[];
  value?: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string[]) => void;
  maxTagCount?: number;
}

// 多选下拉组件
export const MyMultiselect = ({
  options,
  value = [],
  placeholder = "请选择",
  disabled = false,
  onChange,
  maxTagCount = 3,
}: MultiselectProps) => {
  // 下拉框是否展开
  const [isOpen, setIsOpen] = useState(false);
  // 容器DOM引用，用于检测点击外部
  const containerRef = useRef<HTMLDivElement>(null);

  // 监听点击外部，关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 切换下拉框显示/隐藏
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // 处理选项选择（选中/取消选中）
  const handleSelect = (option: Option) => {
    if (option.disabled) return;

    const newValue = value.includes(option.value)
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];

    onChange?.(newValue);
  };

  // 移除已选中的标签
  const handleRemoveTag = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== val);
    onChange?.(newValue);
  };

  // 获取所有已选选项的标签
  const getSelectedLabels = () => {
    return options.filter((o) => value.includes(o.value)).map((o) => o.label);
  };

  // 显示的标签（限制数量）
  const displayTags = getSelectedLabels().slice(0, maxTagCount);
  // 超出数量的计数
  const extraCount = getSelectedLabels().length - maxTagCount;

  return (
    <div className="multiselect-container" ref={containerRef}>
      <div
        className={`multiselect-trigger ${isOpen ? "multiselect-open" : ""} ${disabled ? "multiselect-disabled" : ""}`}
        onClick={handleToggle}
      >
        <div className="multiselect-value">
          {value.length === 0 ? (
            <span className="multiselect-placeholder">{placeholder}</span>
          ) : (
            <div className="multiselect-tags">
              {displayTags.map((label, idx) => (
                <span key={idx} className="multiselect-tag">
                  {label}
                  <span
                    className="multiselect-tag-remove"
                    onClick={(e) => handleRemoveTag(e, value[idx])}
                  >
                    ×
                  </span>
                </span>
              ))}
              {extraCount > 0 && (
                <span className="multiselect-tag-extra">+{extraCount}</span>
              )}
            </div>
          )}
        </div>
        <span className="multiselect-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="multiselect-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`multiselect-option ${value.includes(option.value) ? "multiselect-option-selected" : ""} ${option.disabled ? "multiselect-option-disabled" : ""} `}
              onClick={() => handleSelect(option)}
            >
              <span
                className={`multiselect-checkbox ${value.includes(option.value) ? "multiselect-checkbox-checked" : ""}`}
              >
                {value.includes(option.value) && "✓"}
              </span>
              <span className="multiselect-option-label">{option.label}</span>
            </div>
          ))}
          {options.length === 0 && (
            <div className="multiselect-empty">暂无数据</div>
          )}
        </div>
      )}
    </div>
  );
};
