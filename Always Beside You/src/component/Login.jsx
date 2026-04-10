// src/components/AuthPanel.jsx
import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import { login, regis, resetPassword } from '../api/user';
const handleLogin = async (loginMsg) => {
    try {
        const res = await login(loginMsg)
        localStorage.setItem('token', res.data.Authorization);
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
        window.location.reload()

    } catch (err) {
        console.log('登录失败', err)
    }
}
const handleRegis = async (regisMsg) => {
    try {
        const res = await regis(regisMsg)
        console.log('注册成功')
    } catch (err) {
        console.log('登录失败', err)
    }

}
const handleReset = async (resetMsg) => {
    try {
        const res = await resetPassword(resetMsg)
    } catch (err) {
        console.log('重置失败', err)
    }
}


const Login = () => {
    const [loginMsg, setLoginMsg] = useState({})
    const [regisMsg, setRegisMsg] = useState({})
    const [resetMsg, setResetMsg] = useState({})
    const [activePanel, setActivePanel] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const switchPanel = (panel) => {
        setActivePanel(panel);
    };

    return (
        <div className={styles['auth-container']}>
            {activePanel === 'login' && (
                <>
                    <h1 className={styles['auth-title']}>欢迎回来</h1>
                    <div className={styles['auth-panel']}>
                        <button className={styles['auth-close-btn']} onClick={() => switchPanel('')}>×</button>
                        <form onSubmit={(e) => { e.preventDefault }}>
                            <div className={styles['auth-form-group']}>
                                <label className={styles['auth-label']}>邮箱</label>
                                <div className={styles['auth-input-wrapper']}>
                                    <img className={styles['auth-input-icon']} src="/image/id.png" alt="邮箱图标" />
                                    <input
                                        type="email"
                                        className={styles['auth-input']}
                                        placeholder="请输入您的邮箱"
                                        onChange={(e) => setLoginMsg(prev => ({ ...prev, email: e.target.value }))}
                                        required

                                    />
                                </div>
                            </div>

                            <div className={styles['auth-form-group']}>
                                <label className={styles['auth-label']}>密码</label>
                                <div className={styles['auth-input-wrapper']}>
                                    <img className={styles['auth-input-icon']} src="/image/password.png" alt="密码图标" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={styles['auth-input']}
                                        placeholder="请输入密码"
                                        onChange={(e) => setLoginMsg(prev => ({ ...prev, password: e.target.value }))}
                                        required
                                    />
                                    <img
                                        className={styles['auth-eye-icon']}
                                        src="/image/Eye.png"
                                        alt="显示密码"
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                </div>
                            </div>

                            <div className={styles['auth-options']}>
                                <label className={styles['auth-remember-me']}>
                                    <input
                                        type="checkbox"
                                        className={styles['auth-checkbox']}
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    记住我
                                </label>
                                <span className={styles['auth-forgot-link']} onClick={() => switchPanel('reset')}>忘记密码?</span>
                            </div>

                            <button type="button" className={styles['auth-action-btn']} onClick={() => handleLogin(loginMsg)}>登录</button>

                            <div className={styles['auth-switch-link']}>
                                还没有账号? <a onClick={() => switchPanel('register')}>立即注册</a>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {activePanel === 'register' && (
                <div className={styles['auth-panel']}>
                    <button className={styles['auth-close-btn']} onClick={() => switchPanel('login')}>×</button>
                    <h2 className={styles['auth-title']}>账号注册</h2>
                    <form>
                        <div className={styles['auth-form-group']}>
                            <label className={styles['auth-label']}>邮箱</label>
                            <div className={styles['auth-input-wrapper']}>
                                <img className={styles['auth-input-icon']} src="/image/id.png" alt="邮箱图标" />
                                <input
                                    type="email"
                                    className={styles['auth-input']}
                                    placeholder="请输入您的邮箱"
                                    required
                                    onChange={(e) => { setRegisMsg(prev => { return { ...prev, email: e.target.value } }) }}
                                />
                            </div>
                        </div>

                        <div className={styles['auth-form-group']}>
                            <label className={styles['auth-label']}>密码</label>
                            <div className={styles['auth-input-wrapper']}>
                                <img className={styles['auth-input-icon']} src="/image/password.png" alt="密码图标" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles['auth-input']}
                                    placeholder="请输入密码"
                                    required
                                    onChange={(e) => { setRegisMsg(prev => { return { ...prev, password: e.target.value } }) }}
                                />
                                <img
                                    className={styles['auth-eye-icon']}
                                    src="/image/Eye.png"
                                    alt="显示密码"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <div className={styles['auth-form-group']}>
                            <label className={styles['auth-label']}>用户名</label>
                            <div className={styles['auth-input-wrapper']}>
                                <img className={styles['auth-input-icon']} src="/image/password.png" alt="密码图标" />
                                <input
                                    type='text'
                                    className={styles['auth-input']}
                                    placeholder="请输入用户名"
                                    required
                                    onChange={(e) => { setRegisMsg(prev => { return { ...prev, username: e.target.value } }) }}
                                />
                            </div>
                        </div>

                        <button type="button" className={styles['auth-action-btn']} onClick={() => handleRegis(regisMsg)}>确认</button>

                        <div className={styles['auth-switch-link']}>
                            已有账号? <a onClick={() => switchPanel('login')}>立即登录</a>
                        </div>
                    </form>
                </div>
            )}

            {activePanel === 'reset' && (
                <div className={styles['auth-panel']}>
                    <button className={styles['auth-close-btn']} onClick={() => switchPanel('login')}>×</button>
                    <h2 className={styles['auth-title']}>重置密码</h2>
                    <form>
                        <div className={styles['auth-form-group']}>
                            <label className={styles['auth-label']}>邮箱</label>
                            <div className={styles['auth-input-wrapper']}>
                                <img className={styles['auth-input-icon']} src="/image/message.png" alt="邮箱图标" />
                                <input
                                    type="email"
                                    className={styles['auth-input']}
                                    placeholder="请输入您的邮箱"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles['auth-form-group']}>
                            <label className={styles['auth-label']}>请输入新密码</label>
                            <div className={styles['auth-input-wrapper']}>
                                <img className={styles['auth-input-icon']} src="/image/password.png" alt="密码图标" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles['auth-input']}
                                    placeholder="请输入新密码"
                                    required
                                />
                                <img
                                    className={styles['auth-eye-icon']}
                                    src="/image/Eye.png"
                                    alt="显示密码"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <div className={styles['auth-form-group']}>
                            <label className={styles['auth-label']}>请再次输入新密码</label>
                            <div className={styles['auth-input-wrapper']}>
                                <img className={styles['auth-input-icon']} src="/image/password.png" alt="密码图标" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles['auth-input']}
                                    placeholder="请再次输入新密码"
                                    required
                                />
                            </div>
                        </div>

                        <button type="button" className={styles['auth-action-btn']}>确认</button>

                        <div className={styles['auth-switch-link']}>
                            返回 <a onClick={() => switchPanel('login')}>登录</a>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Login;
