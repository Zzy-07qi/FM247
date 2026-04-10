import request from "../utils/request";
//登录接口:参数为账号密码
export const login = (params) => {
    return request({
        url: '/auth/login',
        method: 'post',
        data: params
    })
}

//注册接口
export const regis = (params) => {
    return request({
        url: '/auth/register',
        method: 'post',
        data: params
    })
}

//修改密码接口
export const resetPassword = (params) => {
    return request({
        url: '/user/update_password',
        method: 'post',
        data: params
    })
}

//获取用户信息 
export const getUserInfo = () => {
    return request({
        url: '/user/info',
        method: 'get',
    })
}

//修改用户信息
export const changeUserInfo = (params) => {
    return request({
        url: '/user/update_info',
        method: 'post',
        data: params
    })
}

export const changeFile = (data) => {
    return request({
        url: '/user/avatar',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const postMusicFile = (data) => {
    return request({
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        url: '/music',
        data: data,
        method: 'post'
    })
}
export const getMusicFile = () => {
    return request({
        url: '/music',
        method: 'get'
    })
}
