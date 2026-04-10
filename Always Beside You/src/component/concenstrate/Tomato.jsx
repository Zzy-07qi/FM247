import '../../styles/Tomato.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { postTomatoData, getTotalData } from '../../api/tomatoData';
// 番茄钟卡片组件（纯样式，无JS逻辑）
const postData = async (data) => {
    try {
        const res = await postTomatoData(data)
        console.log(res)
    } catch (err) {
        console.log(err)
    }
}

const Tomato = ({ onTomatoStatusChange, onTomatoComplete }) => {

    const isRequestSentRef = useRef(true);
    const [isDisable, setDisable] = useState(false);
    const [isTomatoActive, setTomatoActive] = useState(false);

    const [time, setTime] = useState({ min: 25, second: 0, initmin: 25, initsecond: 0 });
    const [restTime, setRestTime] = useState({ min: 5, second: 0, initmin: 5, initsecond: 0 });
    const [circleNum, setCircleNum] = useState(2);
    const [isWorking, setIsWorking] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const isWorkingRef = useRef(true);
    const timeRef = useRef(null);

    const startTimerRef = useRef(null);

    const startTimer = useCallback(() => {
        const currentIsWorking = isWorkingRef.current;
        const currentTime = currentIsWorking ? time : restTime;
        const { initmin, initsecond } = currentTime;
        
        if (initmin === 0 && initsecond === 0) {
            setDisable(false);
            return;
        }
        
        if (timeRef.current) clearInterval(timeRef.current);

        timeRef.current = setInterval(() => {
            const working = isWorkingRef.current;
            if (working) {
                setTime(prevTime => {
                    let { min, second } = prevTime;
                    min = Number(min);
                    second = Number(second);

                    if (min === 0 && second === 0) {
                        clearInterval(timeRef.current);
                        timeRef.current = null;
                        setIsPaused(true);
                        if (onTomatoComplete) onTomatoComplete();
                        if (isRequestSentRef.current) {
                            postData({ studytime: Number(time.initmin), tomatoes: 1 });
                            isRequestSentRef.current = false;
                        }
                        setCircleNum(prevCircle => {
                            isWorkingRef.current = false;
                            setIsWorking(false);
                            setRestTime(prev => ({
                                ...prev,
                                min: prev.initmin,
                                second: prev.initsecond
                            }));
                            isRequestSentRef.current = true;
                            setTimeout(() => {
                                if (startTimerRef.current) startTimerRef.current();
                            }, 0);
                            return prevCircle;
                        });
                        return prevTime;
                    }

                    if (second > 0) {
                        return { ...prevTime, second: second - 1 };
                    }

                    if (second === 0 && min > 0) {
                        return { ...prevTime, min: min - 1, second: 59 };
                    }

                    return prevTime;
                });
            } else {
                setRestTime(prevTime => {
                    let { min, second } = prevTime;
                    min = Number(min);
                    second = Number(second);

                    if (min === 0 && second === 0) {
                        clearInterval(timeRef.current);
                        timeRef.current = null;
                        setCircleNum(prevCircle => {
                            const newCircle = prevCircle - 1;
                            if (newCircle > 0) {
                                isWorkingRef.current = true;
                                setIsWorking(true);
                                setTime(prev => ({
                                    ...prev,
                                    min: prev.initmin,
                                    second: prev.initsecond
                                }));
                                isRequestSentRef.current = true;
                                setTimeout(() => {
                                    if (startTimerRef.current) startTimerRef.current();
                                }, 0);
                                return newCircle;
                            } else {
                                setDisable(false);
                                setTomatoActive(false);
                                setIsPaused(false);
                                return 0;
                            }
                        });
                        return prevTime;
                    }

                    if (second > 0) {
                        return { ...prevTime, second: second - 1 };
                    }

                    if (second === 0 && min > 0) {
                        return { ...prevTime, min: min - 1, second: 59 };
                    }

                    return prevTime;
                });
            }
        }, 1000);
    }, [time, restTime]);

    // 挂载时把startTimer赋值给ref
    useEffect(() => {
        startTimerRef.current = startTimer;
    }, [startTimer]);

    // 监听番茄钟状态变化，通知父组件
    useEffect(() => {
        if (onTomatoStatusChange) {
            onTomatoStatusChange(isTomatoActive);
        }
    }, [isTomatoActive, onTomatoStatusChange]);

    // 核心开始函数
    const handleStart = () => {
        if (isPaused) {
            setIsPaused(false);
            startTimer();
        } else {
            isRequestSentRef.current = true;
            setDisable(true);
            setTomatoActive(true);
            setIsPaused(false);
            startTimer();
        }
    };

    const handlePause = () => {
        if (timeRef.current) {
            clearInterval(timeRef.current);
            timeRef.current = null;
        }
        setIsPaused(true);
    };

    // 格式化时间函数
    const formatTime = (num) => {
        return num < 10 ? `0${num}` : `${num}`;
    };

    const handleReset = () => {
        setDisable(false);
        if (timeRef.current) {
            clearInterval(timeRef.current);
            timeRef.current = null;
        }
        setTime({ min: 25, second: 0, initmin: 25, initsecond: 0 });
        setRestTime({ min: 5, second: 0, initmin: 5, initsecond: 0 });
        setCircleNum(2);
        isRequestSentRef.current = true;
        setTomatoActive(false);
        setIsWorking(true);
        setIsPaused(false);
        isWorkingRef.current = true;
    };

    const currentTime = isWorking ? time : restTime;
    const totalSeconds = isWorking 
        ? (time.initmin * 60 + time.initsecond)
        : (restTime.initmin * 60 + restTime.initsecond);
    const currentSeconds = currentTime.min * 60 + currentTime.second;
    const progress = totalSeconds > 0 ? ((totalSeconds - currentSeconds) / totalSeconds) * 100 : 100;

    const isRunning = isTomatoActive && !isPaused;
    const displayProgress = isRunning ? progress : 100;

    return (
        <div className="card-tomato">
            <div className="circle" style={{ '--progress': displayProgress }}>
                <svg className="circle-progress" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="47" />
                </svg>
                <p className="timeText">   {`${formatTime(currentTime.min)}:${formatTime(currentTime.second)}`}</p>
                <p className="statusText">{isWorking ? '专注' : '休息'}</p>
            </div>
            <div className="setTomatotime " >专注<input type="number" min="0" max="60" step="1" value={time.initmin} onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                const clampedValue = Math.max(0, Math.min(60, value));
                setTime(prev => { return { ...prev, min: clampedValue, initmin: clampedValue } });
            }} />分钟</div>
            <div className="setTomatotime">休息<input type="number" min="0" max="60" step="1" value={restTime.initmin} onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                const clampedValue = Math.max(0, Math.min(60, value));
                setRestTime(prev => ({ ...prev, min: clampedValue, initmin: clampedValue }));
            }} />分钟</div>
            <div className="setTomatotime">循环<input type="number" min="1" max="10" step="1" value={circleNum} onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                const clampedValue = Math.max(1, Math.min(10, value));
                setCircleNum(clampedValue);
            }} />次</div>
            <div className="buttons">
                {isPaused || !isTomatoActive ? (
                    <button className="btn playBtn" onClick={handleStart}>▶</button>
                ) : (
                    <button className="btn pauseBtn" onClick={handlePause}>⏸</button>
                )}
                <button className="btn resetBtn" onClick={handleReset} >↻</button>
            </div>
        </div>
    );
};

export default Tomato;