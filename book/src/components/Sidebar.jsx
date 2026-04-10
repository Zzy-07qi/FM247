import React from 'react';

import { useState } from 'react';

const Sidebar = () => {
    // 状态管理：当前激活的模块
    const [activeModule, setActiveModule] = useState('book');

    return (
        <aside className="sidebar">
            <ul className="menu">
                {/* 读者借阅模块 */}
                <li className={activeModule === 'borrow' ? 'active' : ''}>
                    <a href="#" onClick={() => setActiveModule('borrow')}>
                        <span>读者借阅</span>
                    </a>
                </li>
                {/* 管理员图书管理模块 */}
                <li className={activeModule === 'book' ? 'active' : ''}>
                    <a href="#" onClick={() => setActiveModule('book')}>
                        <span>图书管理</span>
                    </a>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;