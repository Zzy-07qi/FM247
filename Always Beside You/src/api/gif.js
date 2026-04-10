import request from "../utils/request";


export const getGif = () => {
    return request({
        url: '/gifs',
        method: 'GET'
    })
}