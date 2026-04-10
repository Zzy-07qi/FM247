import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import '../styles/Top.css'

const notificationGifs = [
    '/gif/通知_提示 点赞.gif',
    '/gif/通知_提示 爱心_喜欢.gif',
    '/gif/通知_提示 Bits.gif'
]

const Top = ({ isTomatoComplete, onTomatoCompleteReset }) => {
    const [currentTime, setTime] = useState({
    })
    const [showGif, setShowGif] = useState('')
    useEffect(() => {
        const time = setInterval(() => {
            const now = dayjs();
            setTime(
                {
                    date: now.format('YYYY-MM-DD'),
                    time: now.format('HH:mm:ss'),
                    week: now.format('dddd')
                }
            )
        }, 1000);
        return () => clearInterval(time)
    }, [])

    useEffect(() => {
        if (isTomatoComplete) {
            setShowGif(notificationGifs[Math.floor(Math.random() * notificationGifs.length)])
            setTimeout(() => {
                setShowGif('')
                if (onTomatoCompleteReset) onTomatoCompleteReset()
            }, 3000)
        }
    }, [isTomatoComplete, onTomatoCompleteReset])

    const hasTimeData = !!currentTime?.date && !!currentTime?.time && !!currentTime?.week;
    return (
        <div className={`top ${hasTimeData ? 'show' : ''}`}>
            {showGif && <img src={showGif} />}
            <div className="year">{`${currentTime?.date ?? ''} (${currentTime?.week ?? ''})`}</div>
            <div className="time">{currentTime?.time ?? ''}</div>
        </div>
    )
}

export default Top;