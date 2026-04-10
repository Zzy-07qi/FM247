import axios from 'axios';
import './AuthForm.css';
import { useState } from 'react';
import loginRequest from './loginRequest';
import regisRequest from './regisRequest'
import { useNavigate } from 'react-router-dom'
const getUserInfo = async () => {
    try {
        const response = await axios.get('http://8.148.72.91:8080/api/user', {
            withCredentials: true,
            headers: {

                'Content-Type': 'application/json'
            }
        });

        // 解析后端返回的响应数据
        const { code, message, data } = response.data;
        if (code === 200) {
            console.log('获取用户信息成功：', data);
            return data; // 返回用户数据（id、username、is_admin等）
        } else {
            console.error('请求失败1：', message);
            return null;
        }

    } catch (error) {
        // 分场景处理错误
        if (error.response) {
            // 后端返回错误状态码（如401未找到session_token）
            console.error('接口报错：', error.response.data?.message || '未找到session_token');
        } else if (error.request) {
            // 请求发出去但没收到响应（网络/后端宕机）
            console.error('网络错误，未收到响应');
        } else {
            // 请求配置错误
            console.error('请求配置异常：', error.message);
        }
    }




};

// 调用示例

const AuthForm = () => {
    const navigate = useNavigate()
    const [isActive, setActive] = useState('login')
    const [loginMsg, setLoginMsg] = useState({})
    const [regisMsg, setRegisMsg] = useState({})
    const [isShow, setShow] = useState({ username: 'none', password: 'none' })
    const [isShow2, setShow2] = useState({ username: 'none', password: 'none', repassword: 'none' })
    const handleRegis = (e, mod) => {
        setShow2({})
        if (mod === 'username')
            setRegisMsg({ ...regisMsg, username: e.target.value });
        if (mod === 'password')
            setRegisMsg({ ...regisMsg, password: e.target.value });
        if (mod === 'repassword')
            setRegisMsg({ ...regisMsg, repassword: e.target.value });
    }
    const submitRegis = async (setActive) => {


        if (regisMsg.username.trim() === '') {
            setShow({ ...isShow2, username: 'block' });
            return;
        } else {
            setShow({ ...isShow2, username: 'none' });
        }
        // 密码校验
        if (regisMsg.password.trim() === '') {
            setShow({ ...isShow2, password: 'block' });
            return; // 终止后续逻辑
        } else {
            setShow({ ...isShow2, password: 'none' });
        }
        console.log(regisMsg.username, regisMsg.password);

        try {
            const result = await regisRequest(regisMsg);
            console.log(result);
            setActive('regis')
            console.log('asd')

        } catch (error) {

            console.error(error.message);
        }
    };
    const handleLogin = (e, mod) => {
        setShow({})
        if (mod === 'username')
            setLoginMsg({ ...loginMsg, username: e.target.value });
        if (mod === 'password')
            setLoginMsg({ ...loginMsg, password: e.target.value });

    }


    const submitLogin = async () => {
        // 用户名校验

        if (loginMsg.username.trim() === '') {
            setShow({ ...isShow, username: 'block' });
            return;
        } else {
            setShow({ ...isShow, username: 'none' });
        }
        // 密码校验
        if (loginMsg.password.trim() === '') {
            setShow({ ...isShow, password: 'block' });
            return;
        } else {
            setShow({ ...isShow, password: 'none' });
        }

        console.log(loginMsg.username, loginMsg.password);

        try {
            const result = await loginRequest(loginMsg);
            const result2 = await getUserInfo();
            navigate('/booklist');

        } catch (error) {
            // 错误提示
            alert(error.message);
        }
    };

    return (
        <div className="auth-container">
            {/* 切换标签 */}
            <div className="auth-tabs">
                <div className={isActive === 'login' ? 'auth-tab active' : 'auth-tab'} data-tab="login" onClick={() => setActive('login')}>登录</div>
                <div className={isActive === 'regis' ? 'auth-tab active' : 'auth-tab'} data-tab="register" onClick={() => setActive('regis')}>注册</div>
            </div>

            {/* 表单区域 */}
            <div className="auth-forms">
                {/* 登录表单 */}
                <div className={isActive === 'login' ? 'auth-form active' : 'auth-form'} id="login-form">
                    <div className="form-group">
                        <label className="form-label">用户名</label>
                        <input
                            type="text"
                            className="form-input username"
                            placeholder="请输入用户名"
                            onChange={(e) => { handleLogin(e, 'username') }}

                        />
                        <div className="error-tip" style={{ display: isShow.username }}>用户名不能为空</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">密码</label>
                        <input
                            type="password"
                            className="form-input password"
                            placeholder="请输入密码"
                            onChange={(e) => { handleLogin(e, 'password') }}
                        />
                        <div className="error-tip" style={{ display: isShow.password }}>密码不能为空</div>
                    </div>
                    <button className="auth-btn" onClick={() => { submitLogin() }}>登录</button>
                    <div className="auth-footer">
                        还没有账号？ <a href="javascript:;" className="auth-link" onClick={() => setActive('regis')}>立即注册</a>
                    </div>
                </div>

                {/* 注册表单 */}
                <div className={isActive === 'regis' ? 'auth-form active' : 'auth-form'} id="register-form">
                    <div className="form-group">
                        <label className="form-label">用户名</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="请设置用户名"
                            onChange={(e) => { handleRegis(e, 'username') }}
                        />
                        <div className="error-tip" style={{ display: isShow2.username }}>用户名不能为空</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">密码</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="请设置密码"
                            onChange={(e) => { handleRegis(e, 'password') }}
                        />
                        <div className="error-tip" style={{ display: isShow2.password }}>密码不能为空</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">确认密码</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="请再次输入密码"
                            onChange={(e) => { handleRegis(e, 'repassword') }}
                        />
                        <div className="error-tip" style={{ display: regisMsg.password === regisMsg.repassword ? 'none' : 'block' }}>两次密码输入不一致</div>
                    </div>
                    <button className="auth-btn" onClick={() => { submitRegis(setActive) }}>注册</button>
                    <div className="auth-footer">
                        已有账号？ <a href="javascript:;" className="auth-link" onClick={() => setActive('login')}>立即登录</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;