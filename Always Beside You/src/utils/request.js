import axios from "axios";
import { useNavigate } from "react-router-dom";
const request = axios.create({
    baseURL: 'http://8.148.72.91:8080/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
})
let navigate;
export const setNavigate = (nav) => {
    navigate = nav;
}
request.interceptors.request.use((config) => {
    console.log('请求中');

    const token = localStorage.getItem('token');
    if (token) {
        // console.log(token)
        config.headers.Authorization = `${token}`;
    }
    if (config.method === 'get' && config.params) {
        config.params = { ...config.params, _t: Date.now() };
    }
    return config;
}, (error) => {
    console.error('请求发送失败');
    return Promise.reject(error)
});

request.interceptors.response.use((response) => {

    const res = response.data;
    if (res.code === 200) {
        return res;
    } else {
        console.error('请求失败1 ', res.message || '');
        if (res.message === "token无效或已过期") {
            localStorage.removeItem("token")
            navigate("/login")
        }
        return Promise.reject(new Error(res.message || 'Error'))
    }

}, (error) => {
    let errMsg = '服务器响应失败';
    if (error.response) {
        const status = error.response.status;
        switch (status) {
            case 401: errMsg = '登录状态过期,请重新登录';
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                navigate && navigate('/login');
                break;
            case 403: errMsg = '暂无权限访问该资源'; break;
            case 404: errMsg = '请求的接口不存在'; break;
            case 500: errMsg = '服务器内部错误,请稍后再试'; break;
            default: errMsg = error.response.data?.msg || `请求错误${status}`;

        }
    } else if (error.request) {
        errMsg = '请求超时,请检查网络';
    }
    console.error(errMsg);
    return Promise.reject(error);
});
export default request;