// src/components/SettingsPanel.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from '../../styles/Setting.module.css';
import { changeUserInfo, changeFile } from '../../api/user';
const handleChangeUserInfo = async (changeData) => {
    try {
        await changeUserInfo(changeData)
        window.location.reload()

    } catch (err) {
        console.log('更改失败', err)
    }
}

const Setting = ({ setShow, data }) => {

    const [activeTab, setActiveTab] = useState('userInfo');
    const [dragging, setDragging] = useState(null);
    const [adata, setData] = useState({})
    const [previewAvatar, setPreviewAvatar] = useState(null)
    const fileInputRef = useRef(null)
    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return alert('请选择文件');

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            alert('请选择有效的图片文件（JPEG、PNG、GIF、WebP）')
            return
        }

        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            alert('图片大小不能超过5MB')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            setPreviewAvatar(e.target.result)
        }
        reader.readAsDataURL(file)

        const formData = new FormData()
        formData.append('avatar', file);
        try {
            const res = await changeFile(formData)
            console.log(res)
            if (res && res.data && res.data.avatar_url) {
                setData(prev => ({ ...prev, avatar: res.data.avatar_url }))
                setPreviewAvatar(res.data.avatar_url)

                alert('头像上传成功！')
            } else {
                alert('头像上传成功！')
            }
        } catch (err) {
            console.log(err)
            alert('头像上传失败，请重试')
        }
    }
    const sliderRefs = {
        volume: useRef(null),
        voice: useRef(null),
        systemSound: useRef(null),
        ambientSound: useRef(null),
    };
    useEffect(() => {
        setData(data)
    }, [data])

    // 从本地存储加载初始值
    const [sliders, setSliders] = useState(() => {
        const saved = localStorage.getItem('appSettings');
        return saved ? JSON.parse(saved) : {
            volume: 70,
            voice: 80,
            systemSound: 60,
            ambientSound: 50,
        };
    });

    // 保存设置到本地存储
    const saveSettings = () => {
        localStorage.setItem('appSettings', JSON.stringify(sliders));
        alert('设置已保存');
    };

    // 更新滑块值
    const updateSliderValue = useCallback((e, key) => {
        const slider = sliderRefs[key].current;
        if (!slider) return;

        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        let value = (x / rect.width) * 100;
        value = Math.max(0, Math.min(100, value));
        setSliders(prev => ({ ...prev, [key]: Math.round(value) }));
    }, []);

    // 处理鼠标按下开始拖动
    const handleMouseDown = (e, key) => {
        setDragging(key);
        updateSliderValue(e, key);
    };

    // 处理鼠标移动更新值
    const handleMouseMove = useCallback((e) => {
        if (dragging) {
            updateSliderValue(e, dragging);
        }
    }, [dragging, updateSliderValue]);

    // 处理鼠标释放结束拖动
    const handleMouseUp = () => {
        setDragging(null);
    };

    // 监听全局鼠标移动和释放事件
    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, handleMouseMove]);

    return (
        <div className={styles.settingback}>
            <div className={styles.panelContainer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>设置</h2>
                    <button className={styles.closeBtn} onClick={() => setShow(false)}>×</button>
                </div>

                <div className={styles.content}>
                    <div className={styles.sidebar}>
                        <button
                            className={`${styles.navItem} ${activeTab === 'userInfo' ? styles.active : ''}`}
                            onClick={() => setActiveTab('userInfo')}
                        >
                            用户信息
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'system' ? styles.active : ''}`}
                            onClick={() => setActiveTab('system')}
                        >
                            系统设置
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'log' ? styles.active : ''}`}
                            onClick={() => setActiveTab('log')}
                        >
                            更新日志
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'dev' ? styles.active : ''}`}
                            onClick={() => setActiveTab('dev')}
                        >
                            开发人员
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'tutorial' ? styles.active : ''}`}
                            onClick={() => setActiveTab('tutorial')}
                        >
                            使用教程
                        </button>
                    </div>

                    <div className={styles.mainContent}>
                        {activeTab === 'userInfo' && (
                            <div>
                                <div className={styles.userProfile}>
                                    <div className={styles.avatarContainer}>
                                        <div className={styles.avatarWrapper}>
                                            <img
                                                src={previewAvatar || adata.avatarpath || '/image/member.png'}
                                                alt="用户头像"
                                                className={styles.avatarImage}
                                            />
                                            <div className={styles.avatarOverlay}>
                                                <button
                                                    className={styles.avatarUploadBtn}
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    更换头像
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleUpload}
                                            className={styles.avatarInput}
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        />
                                    </div>
                                    <div className={styles.userInfo}>
                                        <span className={styles.label}>用户昵称</span>
                                        <input
                                            className={styles.input}
                                            value={adata.username ? adata.username : ''}
                                            onChange={(e) => setData(prev => { return { ...prev, username: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <div className={styles.dataRow}>
                                    <span className={styles.dataLabel}>用户等级</span>
                                    <span className={styles.dataValue}>{`当前等级：${adata.level}级`}</span>
                                </div>
                                <div className={styles.dataRow}>
                                    <span className={styles.dataLabel}>总学习时长</span>
                                    <span className={styles.dataValue}>{`${adata.studytime}min`}</span>
                                </div>
                                <div className={styles.dataRow}>
                                    <span className={styles.dataLabel}>完成番茄钟数</span>
                                    <span className={styles.dataValue}>{`${adata.tomatoes}个`}</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className={styles.sliderGroup}>
                                {Object.entries({
                                    volume: { label: '主音量' },
                                    voice: { label: '语音' },
                                    systemSound: { label: '系统音效' },
                                    ambientSound: { label: '环境音' },
                                }).map(([key, { label }]) => (
                                    <div className={styles.sliderRow} key={key}>
                                        <div className={styles.sliderIcon}>{label} <span className={styles.sliderValue}>{sliders[key]}%</span></div>

                                        <div
                                            className={styles.slider}
                                            ref={sliderRefs[key]}
                                            onClick={(e) => updateSliderValue(e, key)}
                                        >
                                            <div
                                                className={styles.sliderThumb}
                                                style={{ left: `${sliders[key]}%` }}
                                                onMouseDown={(e) => handleMouseDown(e, key)}
                                            />
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'log' && <div className={styles.updatelog}>
                            版本1.0.0
                        </div>}
                        {activeTab === 'dev' && <div className={styles.dev}>
                            <div className={styles.devtitle}>开发人员</div>
                            <div className={styles.devbox}>  <div className={styles.member}><img className={styles.imgmem} src="/image/member.png" alt="" />彭乐楚</div>
                                <div className={styles.member}><img className={styles.imgmem} src="/image/member.png" alt="" />丘雯杰</div>
                                <div className={styles.member}><img className={styles.imgmem} src="/image/member.png" alt="" />朱正邺</div>
                                <div className={styles.member}><img className={styles.imgmem} src="/image/member.png" alt="" />陈博文</div>
                                <div className={styles.member}><img className={styles.imgmem} src="/image/member.png" alt="" />唐崇耀</div>
                                <div className={styles.member2}><img className={styles.imgmem} src="/image/member2.png" alt="" />旮旯木犀</div></div>

                        </div>}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.saveBtn} onClick={() => { saveSettings(); handleChangeUserInfo(adata) }}>保存设置</button>
                </div>
            </div>
        </div>
    );
};

export default Setting;
