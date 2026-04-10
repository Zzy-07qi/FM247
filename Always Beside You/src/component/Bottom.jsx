// src/components/Bottom.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Bottom.module.css';
import { getMusicFile, postMusicFile } from '../api/user';

const BASE_URL = 'http://8.148.72.91:8080';

const Bottom = () => {
    const [Musiclist, setMusic] = useState([])
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(50)
    const [showAddMusicCard, setShowAddMusicCard] = useState(false)
    const [newMusic, setNewMusic] = useState({ title: '', author: '', file: null })
    
    const audioRef = useRef(new Audio())

    const currentMusic = currentIndex >= 0 && currentIndex < Musiclist.length ? Musiclist[currentIndex] : null

    const getFullUrl = (url) => {
        if (!url) return ''
        if (url.startsWith('http')) return url
        return `${BASE_URL}${url}`
    }

    const getMusic = async () => {
        try {
            const res = await getMusicFile()
            const list = res.data || []
            setMusic(list)
            if (list.length > 0 && currentIndex === -1) {
                setCurrentIndex(0)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handlePlayNext = () => {
        if (Musiclist.length === 0) return
        setCurrentIndex(prev => (prev + 1) % Musiclist.length)
        setIsPlaying(true)
    }

    const handlePlayPrev = () => {
        if (Musiclist.length === 0) return
        setCurrentIndex(prev => {
            const newIdx = prev <= 0 ? Musiclist.length - 1 : prev - 1
            return newIdx
        })
        setIsPlaying(true)
    }

    useEffect(() => {
        getMusic()
        audioRef.current.addEventListener('ended', handlePlayNext)
        return () => {
            audioRef.current.pause()
        }
    }, [])

    useEffect(() => {
        if (!currentMusic) return
        const url = getFullUrl(currentMusic.url)
        console.log('加载音乐:', url)
        audioRef.current.src = url
        if (isPlaying) {
            audioRef.current.play().catch(err => console.error('播放失败:', err))
        }
    }, [currentIndex])

    useEffect(() => {
        audioRef.current.volume = volume / 100
    }, [volume])

    useEffect(() => {
        if (!currentMusic) return
        if (isPlaying) {
            audioRef.current.play().catch(err => console.error('播放失败:', err))
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    const handleTogglePlay = () => setIsPlaying(!isPlaying)
    const handleVolumeChange = (e) => setVolume(Number(e.target.value))
    const handleAddMusicClick = () => setShowAddMusicCard(!showAddMusicCard)

    const handleInputChange = (e) => {
        setNewMusic(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type !== 'audio/mpeg') {
            alert('请上传MP3格式')
            return
        }
        setNewMusic(prev => ({ ...prev, file }))
    }

    const handleConfirmUpload = async () => {
        if (!newMusic.title || !newMusic.author || !newMusic.file) {
            alert('请填写完整信息')
            return
        }
        try {
            const formData = new FormData()
            formData.append('music', newMusic.file)
            formData.append('title', newMusic.title)
            formData.append('author', newMusic.author)
            await postMusicFile(formData)
            setNewMusic({ title: '', author: '', file: null })
            setShowAddMusicCard(false)
            getMusic()
            alert('上传成功')
        } catch (err) {
            console.error(err)
            alert('上传失败')
        }
    }

    return (<>
        <div className={styles.playerBar}>
            <div className={styles.songInfo}>
                <div className={styles.songName}>
                    {currentMusic ? `${currentMusic.title} - ${currentMusic.author}` : '暂无音乐'}
                </div>
            </div>
            <div className={styles.controlButtons}>
                <button className={styles.controlButton} onClick={handlePlayPrev} disabled={Musiclist.length === 0}>
                    <img src="/image/Icon.png" alt="上一首" />
                </button>
                <button className={styles.controlButton} onClick={handleTogglePlay} disabled={!currentMusic}>
                    <img src={isPlaying ? '/image/暂停.png' : '/image/Icon (1).png'} alt="播放" />
                </button>
                <button className={styles.controlButton} onClick={handlePlayNext} disabled={Musiclist.length === 0}>
                    <img src="/image/Icon (2).png" alt="下一首" />
                </button>
                <div className={styles.volumeWrapper}>
                    <button className={styles.volumeButton} disabled={!currentMusic}>
                        <img src="/image/Icon (3).png" alt="音量" />
                    </button>
                    <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className={styles.volumeSlider} disabled={!currentMusic} />
                </div>
                <button className={styles.controlButton} onClick={handleAddMusicClick}>
                    <img src="/image/音乐.png" alt="添加" />
                </button>
            </div>
        </div>

        {showAddMusicCard && (
            <div className={styles.addMusicCard}>
                <div className={styles.cardHeader}>
                    <h3>添加音乐</h3>
                    <button onClick={() => setShowAddMusicCard(false)}>×</button>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.formGroup}>
                        <label>歌名</label>
                        <input type="text" name="title" value={newMusic.title} onChange={handleInputChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>作者</label>
                        <input type="text" name="author" value={newMusic.author} onChange={handleInputChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>上传文件</label>
                        <input type="file" accept=".mp3" onChange={handleFileChange} className={styles.fileInput} />
                    </div>
                </div>
                <div className={styles.cardFooter}>
                    <button onClick={handleConfirmUpload} className={styles.confirmButton}>确认上传</button>
                </div>
            </div>
        )}
    </>);
}

export default Bottom;