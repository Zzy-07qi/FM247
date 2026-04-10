
import React from 'react';
import styles from '../../styles/Sound.module.css';
import { useState, useRef, useEffect } from 'react';
import { getEnvirMusic } from '../../api/music';


const Sound = () => {
    const [soundlist, setSoundList] = useState(null)
    const getSound = async () => {
        try {
            const sound = await getEnvirMusic()
            console.log(sound.data)
            setSoundList(sound.data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getSound()
    }, [])
    const [isActive, setActive] = useState(false)
    const [playingAudio, setPlayingAudio] = useState(null)
    const soundRef = useRef(null)
    useEffect(() => {
        if (soundlist) {
            soundRef.current = soundlist.reduce((acc, item) => {
                acc[item.name] = new Audio(item.url);
                return acc;
            }, {});
        }
    }, [soundlist])


    const toggleSound = (name) => {
        const audio = soundRef.current[name];
        if (!audio) return;
        if (playingAudio == name) {
            audio.pause()
            setPlayingAudio(null)
        } else {
            if (playingAudio) {
                soundRef.current[playingAudio].pause()
            }
            audio.play().catch(err => console.error('播放失败', err))
            setPlayingAudio(name)
        }
    }
    return (
        <div className={styles.panelContainer}>
            {/* 顶部开关行 */}
            <div className={styles.headerRow}>
                <span className={styles.headerLabel}>随时间变化场景</span>
                <div className={isActive ? `${styles.switch} ${styles.active}` : styles.switch} onClick={() => { setActive((prev) => { return !prev }) }}></div>
            </div>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>时间</h3>
                <div className={styles.buttonGrid}>

                    <button className={styles.circleButton}><img src="/image/light_mode.png" alt="" /></button>
                    <button className={styles.circleButton}><img src="/image/dark_mode.png" alt="" /></button>
                    <button className={styles.circleButton}><img src="/image/Sunset.png" alt="" /></button>
                </div>
            </div>

            {/* 景色区块 */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>景色</h3>
                <div className={styles.buttonGrid}>
                    <button className={styles.circleButton} onClick={() => toggleSound('雨')}><img src="/image/Cloud drizzle.png" alt="" /></button>
                    <button className={styles.circleButton} onClick={() => toggleSound('雪')}><img src="/image/Cloud snow.png" alt="" /></button>
                    <button className={styles.circleButton} onClick={() => toggleSound('小雨')}><img src="/image/Cloud lightning.png" alt="" /></button>

                </div>
            </div>

            {/* 环境音区块 */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>环境音</h3>
                <div className={styles.buttonGrid}>

                    <button className={styles.circleButton} onClick={() => toggleSound('键盘')}><img src="/image/keyboard.png" alt="" /></button>
                    <button className={styles.circleButton} onClick={() => toggleSound('写字')}><img src="/image/edit.png" alt="" /></button>
                    <button className={styles.circleButton}><img src="/image/directions_subway.png" alt="" /></button>
                    <button className={styles.circleButton} onClick={() => toggleSound('轿车')}><img src="/image/directions_car.png" alt="" /></button>
                    <button className={styles.circleButton}><img src="/image/Book open.png" alt="" /></button>
                    <button className={styles.circleButton}><img src="/image/light_mode.png" alt="" /></button>
                </div>
            </div>
        </div>
    );
};

export default Sound;