import request from "../utils/request"


export const getEnvirMusic = () => {
    return request({
        url: '/ambient-sounds',
        method: 'GET'
    })
}
