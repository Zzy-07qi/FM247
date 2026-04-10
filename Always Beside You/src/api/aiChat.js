import request from "../utils/request";

export const getAiChat = () => {
    return request({
        method: 'get',
        url: '/ai-chat'
    })
}

export const postAiChat = (data) => {

    return request({
        url: '/ai-chat',
        method: 'post',
        data
    })
}


