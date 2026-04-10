// src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Calendar.module.css';
import { getCalendar, postCalendar, putCalendar } from '../../api/calendar';

const GIF_LIST = [
    '/gif/点赞.gif', '/gif/爱心 1.gif', '/gif/笑.gif', '/gif/哭 1.gif',
    '/gif/生气.gif', '/gif/睡觉(普通).gif', '/gif/打字(普通).gif', '/gif/期待.gif',
    '/gif/玫瑰.gif', '/gif/加油.gif', '/gif/蛋糕.gif', '/gif/庆祝.gif',
    '/gif/摸头.gif', '/gif/点头.gif', '/gif/摇头.gif', '/gif/呆 1.gif',
    '/gif/工作(疲倦).gif', '/gif/打字(生气).gif', '/gif/画板.gif', '/gif/惊吓.gif',
    '/gif/停止工作.gif', '/gif/睡觉(准备阶段2).gif', '/gif/唱歌.gif', '/gif/得分(10分).gif',
    '/gif/得分(0分).gif', '/gif/问号.gif', '/gif/记录 1.gif', '/gif/钱.gif',
    '/gif/情书.gif', '/gif/荧光棒 1.gif', '/gif/坐牢 2.gif', '/gif/枪.gif',
    '/gif/叹号.gif', '/gif/头晕.gif', '/gif/死亡.gif', '/gif/敲头.gif',
    '/gif/到达.gif', '/gif/通知_提示 点赞.gif', '/gif/通知_提示 爱心_喜欢.gif', '/gif/通知_提示 Bits.gif'
];

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
    const [title, setTitle] = useState('');
    const [selectedGif, setSelectedGif] = useState('');
    const [eventId, setEventId] = useState(null);
    const [showGifPicker, setShowGifPicker] = useState(false);

    // 状态管理：当前年月、当天日期
    const [currentDate, setCurrentDate] = useState(new Date());
    const [today] = useState(new Date()); // 记录当天（固定不变）

    // 初始化加载当天数据
    useEffect(() => {
        getCal(selectedDate);
    }, []);

    const getCal = async (date) => {
        try {
            const res = await getCalendar(date)
            console.log('getCal result:', res)
            const item = res?.data?.[0]
            if (item) {
                setTitle(item.title || '')
                setSelectedGif(item.gificon || '')
                setEventId(item.id || null)
            } else {
                setTitle('')
                setSelectedGif('')
                setEventId(null)
            }
            setSelectedDate(date)
        } catch (err) {
            console.log(err)
        }
    }

    // 保存事件
    const saveEvent = async () => {
        const data = {
            title,
            date: selectedDate,
            gificon: selectedGif,
        }
        console.log('Saving:', eventId ? 'put' : 'post', data)
        try {
            if (eventId) {
                const res = await putCalendar(eventId, data)
                console.log('put result:', res)
            } else {
                const res = await postCalendar(data)
                console.log('post result:', res)
            }
            alert('保存成功')
        } catch (err) {
            console.error('保存失败:', err)
            alert('保存失败')
        }
    }

    // 点击日期处理
    const handleDateClick = (day) => {
        const year = currentYear;
        const month = String(currentMonth + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;
        getCal(dateStr);
    };

    // 解构当前年月
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0 = 1月，11 = 12月

    // 计算当月关键数据（实时更新）
    const getMonthData = () => {
        const firstDay = new Date(currentYear, currentMonth, 1); // 当月第一天
        const lastDay = new Date(currentYear, currentMonth + 1, 0); // 当月最后一天
        const firstDayOfWeek = firstDay.getDay(); // 当月第一天是星期几（0 = 周日）
        const totalDays = lastDay.getDate(); // 当月总天数

        // 计算上月需要显示的天数（填充日历第一行空白）
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        const prevMonthDays = [];
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            prevMonthDays.push(prevMonthLastDay - i);
        }

        // 当月天数
        const currentMonthDays = Array.from({ length: totalDays }, (_, i) => i + 1);

        // 计算下月需要显示的天数（填充日历最后一行空白）
        const nextMonthDays = [];
        const totalCells = 42;
        const remainingCells = totalCells - prevMonthDays.length - currentMonthDays.length;
        for (let i = 1; i <= remainingCells; i++) {
            nextMonthDays.push(i);
        }

        return { prevMonthDays, currentMonthDays, nextMonthDays };
    };

    const { prevMonthDays, currentMonthDays, nextMonthDays } = getMonthData();

    // 切换月份（更新状态 → 触发样式更新）
    const changeMonth = (type) => {
        setCurrentDate(
            new Date(currentYear, type === 'prev' ? currentMonth - 1 : currentMonth + 1, 1)
        );
    };

    // 判断是否是当天（用于高亮样式）
    const isToday = (day, type) => {
        if (type !== 'current') return false; // 只高亮当月的当天
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    // 判断是否是已过期日期（用于置灰样式）
    const isPastDate = (day, type) => {
        if (type === 'prev') return true; // 上月日期默认过期
        if (type === 'next') return false; // 下月日期不过期
        // 当月日期：小于今天则过期（排除当前月不是今天所在月的情况）
        return (
            day < today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    return (
        <div className={styles.caAll}>
            <div className={styles.calendarContainer}>
                {/* 月份切换栏 */}
                <div className={styles.monthHeader}>
                    <button onClick={() => changeMonth('prev')} className={styles.monthBtn}>
                        ←
                    </button>
                    <h2 className={styles.monthTitle}>
                        {currentYear}年{currentMonth + 1}月
                    </h2>
                    <button onClick={() => changeMonth('next')} className={styles.monthBtn}>
                        →
                    </button>
                </div>

                {/* 星期头部 */}
                <div className={styles.weekRow}>
                    {['日', '一', '二', '三', '四', '五', '六'].map((week) => (
                        <span key={week} className={styles.weekItem}>
                            {week}
                        </span>
                    ))}
                </div>

                {/* 日期网格（动态渲染 + 实时样式） */}
                <div className={styles.dayGrid}>
                    {/* 上月日期 */}
                    {prevMonthDays.map((day) => (
                        <span
                            key={`prev-${day}`}
                            className={`${styles.dayItem} ${styles.otherMonth} ${styles.pastDate}`}
                        >
                            {day}
                        </span>
                    ))}

                    {/* 当月日期（实时样式：当天高亮、过期置灰） */}
                    {currentMonthDays.map((day) => (
                        <span
                            key={`current-${day}`}
                            className={`${styles.dayItem} 
              ${isToday(day, 'current') ? styles.today : ''} 
              ${isPastDate(day, 'current') ? styles.pastDate : ''}`}
                            onClick={() => handleDateClick(day, 'current')}
                        >
                            {day}
                        </span>
                    ))}

                    {/* 下月日期 */}
                    {nextMonthDays.map((day) => (
                        <span
                            key={`next-${day}`}
                            className={`${styles.dayItem} ${styles.otherMonth}`}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.diary}>
                <textarea
                    className={styles.titleInput}
                    placeholder='今天怎么样...'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className={styles.gifButtonWrapper}>
                    <div className={styles.gifButton} onClick={() => setShowGifPicker(!showGifPicker)}>
                        {selectedGif ? (
                            <img src={selectedGif} alt='' className={styles.selectedGif} />
                        ) : (
                            <span className={styles.gifIcon}>😊</span>
                        )}
                    </div>
                </div>

                {showGifPicker && (
                    <div className={styles.gifPicker}>
                        <div className={styles.gifGrid}>
                            {GIF_LIST.map((gif) => (
                                <img
                                    key={gif}
                                    src={gif}
                                    alt=''
                                    className={`${styles.gifItem} ${selectedGif === gif ? styles.gifSelected : ''}`}
                                    onClick={() => {
                                        setSelectedGif(gif)
                                        setShowGifPicker(false)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <button className={styles.saveBtn} onClick={saveEvent}>
                    保存
                </button>
            </div>
        </div>
    );
};

export default Calendar;