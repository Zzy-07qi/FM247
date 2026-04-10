import axios from 'axios';

/**
 * 登录请求封装
 * @param {Object} regisParams - 登录参数
 * @param {string} regisParams.username - 用户名（必传）
 * @param {string} regisParams.password - 密码（必传）
 * @param {string} regisParams.repassword
 * @returns {Promise<Object>} 登录成功后的响应数据
 */
const regisRequest = async (regisParams) => {
    if (!regisParams.username || !regisParams.password) {
        throw new Error('用户名和密码不能为空');
    }
    if (regisParams.password !== regisParams.repassword) {
        throw new Error('密码输入不一致')
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'http://8.148.72.91:8080/api/register',
            data: {
                "username": regisParams.username.trim(),
                "password": regisParams.password.trim(),
            },
            timeout: 10000,
            withCredentials: true

        });
        console.log('注册：', response.data);
        return response.data;

    } catch (error) {
        console.error(error)
    }
};
export default regisRequest;