import { useState, useEffect } from 'react';
import styles from '../../styles/StudyStatsPanel.module.css';
import { getStudyData } from '../../api/tomatoData';

const StudyStatsPanel = () => {
    // 顶部统计数据
    const [stats, setStats] = useState({
        todayStudyMinutes: 0,
        finishedTomato: 0,
        continuousDays: 0,
        dateRange: '',
        totalTime: '',
    });

    // 图表数据
    const [chartData, setChartData] = useState({
        timerData: [],     // 蓝色柱子：studytime
        appRunData: [],    // 绿色柱子：tomatoes
        xLabels: [],       // X轴日期标签
    });

    // 动画触发器 - 用于强制重新渲染柱子以触发动画
    const [animationKey, setAnimationKey] = useState(0);

    // 当前选中：week | month | year
    const [activeTab, setActiveTab] = useState('week');

    // 日期偏移：0=当前，-1=上一周/月/年，+1=下一周/月/年
    const [dateOffset, setDateOffset] = useState(0);

    // ======================
    // 格式化日期显示
    // ======================
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    };

    // ======================
    // 【核心】根据 tab + 偏移量 请求对应接口
    // ======================
    const fetchData = async () => {
        try {
            let url = '';
            const nowData = await getStudyData('/studydata/weekly');
            // 👉 这里换成你真实的三个接口
            if (activeTab === 'week') {
                url = `/studydata/weekly`;
            } else if (activeTab === 'month') {
                url = `/studydata/monthly`;
            } else if (activeTab === 'year') {
                url = `/studydata/yearly`;
            }

            const result = await getStudyData(url);
            console.log(result)

            if (result.code !== 200 || !Array.isArray(result.data)) {
                throw new Error('数据格式错误');
            }

            const dataList = result.data;
            const date = new Date()
            const day = date.getDay()
            // 计算统计数据
            const todayStudyMinutes = nowData.data[day - 1]?.studytime || 0;
            const finishedTomato = dataList[day - 1]?.tomatoes || 0;
            const continuousDays = dataList.filter(item => item.studytime > 0).length;
            const totalStudyTime = dataList.reduce((sum, item) => sum + item.studytime, 0);
            const totalTomatoes = dataList.reduce((sum, item) => sum + item.tomatoes, 0);

            // 生成日期范围
            const startDate = formatDate(dataList[0]?.date);
            const endDate = formatDate(dataList[dataList.length - 1]?.date);
            const dateRange = `${startDate} ~ ${endDate}`;
            const totalTime = `${totalStudyTime}min`; // 可根据单位调整

            // 生成图表数据
            const timerData = dataList.map(item => item.studytime);
            const appRunData = dataList.map(item => item.tomatoes);
            const xLabels = dataList.map(item => formatDate(item.date));

            setStats({
                todayStudyMinutes,
                totalTomatoes,
                finishedTomato,
                continuousDays,
                dateRange,
                totalTime,
            });

            setChartData({
                timerData,
                appRunData,
                xLabels,
            });

            // 更新动画key以触发重新渲染和动画
            setAnimationKey(prev => prev + 1);
        } catch (err) {
            console.error('获取数据失败', err);
            // 出错清空
            setStats({
                totalTomatoes: 0,
                todayStudyMinutes: 0,
                finishedTomato: 0,
                continuousDays: 0,
                dateRange: '',
                totalTime: '',
            });
            setChartData({ timerData: [], appRunData: [], xLabels: [] });
        }
    };

    // Tab 切换 / 日期偏移 时重新请求
    useEffect(() => {
        fetchData();
    }, [activeTab, dateOffset]);

    // 切换周/月/年
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setDateOffset(0); // 切换类型时回到「当前」
    };

    return (
        <div className={styles.panelContainer}>
            {/* 顶部三个数据卡片 */}
            <div className={styles.statsCards}>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.todayStudyMinutes}</span>
                    <span className={styles.statLabel}>今日学习 分钟</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.totalTomatoes}</span>
                    <span className={styles.statLabel}>完成番茄 个</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.continuousDays}</span>
                    <span className={styles.statLabel}>连续天数 天</span>
                </div>
            </div>

            {/* 周/月/年 TAB */}
            <div className={styles.tabBar}>
                <div
                    className={`${styles.tabItem} ${activeTab === 'week' ? styles.active : ''}`}
                    onClick={() => handleTabChange('week')}
                >
                    周
                </div>
                <div
                    className={`${styles.tabItem} ${activeTab === 'month' ? styles.active : ''}`}
                    onClick={() => handleTabChange('month')}
                >
                    月
                </div>
                <div
                    className={`${styles.tabItem} ${activeTab === 'year' ? styles.active : ''}`}
                    onClick={() => handleTabChange('year')}
                >
                    年
                </div>
            </div>

            {/* 图表区域 */}
            <div className={styles.chartArea}>
                <div className={styles.chartYLabel}>
                    <span className={styles.ylabelItem}>100</span>
                    <span className={styles.ylabelItem}>75</span>
                    <span className={styles.ylabelItem}>50</span>
                    <span className={styles.ylabelItem}>25</span>
                    <span className={styles.ylabelItem}>0</span>
                </div>

                <div className={styles.chartGrid}>
                    <div className={styles.gridLine}></div>
                    <div className={styles.gridLine}></div>
                    <div className={styles.gridLine}></div>
                    <div className={styles.gridLine}></div>
                </div>

                <div key={animationKey} className={styles.chartBars}>
                    {chartData.timerData.map((h, i) => (
                        <div
                            key={`t-${i}-${animationKey}`}
                            className={styles.chartBar1}
                            style={{
                                height: `${Math.min(h, 100)}%`,
                                animationDelay: `${i * 0.1}s`
                            }} // 按比例缩放高度，添加延迟动画
                        />
                    ))}
                    {chartData.appRunData.map((h, i) => (
                        <div
                            key={`a-${i}-${animationKey}`}
                            className={styles.chartBar2}
                            style={{
                                height: `${Math.min(h, 100)}%`,
                                animationDelay: `${i * 0.1 + 0.05}s`
                            }} // 按比例缩放高度，添加延迟动画
                        />
                    ))}
                </div>

                {/* X轴标签 */}
                {/* <div className={styles.chartXLabels}>
                    {chartData.xLabels.map((label, i) => (
                        <span key={i} className={styles.xLabelItem}>{label}</span>
                    ))}
                </div> */}
            </div>

            {/* 日期切换 ← 日期 总时长 → */}
            <div className={styles.dateControl}>
                {/* <button
                    className={styles.dateBtn}
                    onClick={() => setDateOffset(prev => prev - 1)}
                >
                    ‹
                </button> */}
                <div>{stats.dateRange}</div>
                <div>{stats.totalTime}</div>
                {/* <button
                    className={styles.dateBtn}
                    onClick={() => setDateOffset(prev => prev + 1)}
                >
                    ›
                </button> */}
            </div>

            {/* 图例 */}
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: '#409eff' }}></span>
                    <span>学习时长</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: '#67c23a' }}></span>
                    <span>番茄钟</span>
                </div>
            </div>
        </div>
    );
};

export default StudyStatsPanel;
