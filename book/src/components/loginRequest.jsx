import axios from 'axios';

/**
 * 登录请求封装
 * @param {Object} loginParams - 登录参数
 * @param {string} loginParams.username - 用户名（必传）
 * @param {string} loginParams.password - 密码（必传）
 * @returns {Promise<Object>} 登录成功后的响应数据
 */
const loginRequest = async (loginParams) => {
    if (!loginParams.username || !loginParams.password) {
        throw new Error('用户名和密码不能为空');
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'http://8.148.72.91:8080/api/login',
            data: {
                "username": loginParams.username.trim(),
                "password": loginParams.password.trim(),
            },
            timeout: 10000,
            withCredentials: true
        });
        console.log('登录成功1：', response.data.data.session_token);
        localStorage.setItem('token', response.data.data.session_token)
        return response.data;

    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            const errorMsg = data?.message || `登录失败（状态码：${status}）`;
            console.error('登录响应错误：', errorMsg);
            throw new Error(errorMsg);

        } else if (error.request) {
            console.error('登录网络错误：', error.request);
            throw new Error('网络异常，请检查服务器连接或端口是否开放');

        } else {
            console.error('登录其他错误：', error.message);
            throw new Error(error.message);
        }
    }
};
export default loginRequest;