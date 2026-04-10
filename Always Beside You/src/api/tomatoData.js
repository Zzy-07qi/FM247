import request from "../utils/request";

export const postTomatoData = (data) => {
    return request({
        url: '/studydata',
        method: 'post',
        data: data
    })
}

export const getTotalData = () => {
    return request({
        url: '/studydata/total',
    })
}

export const getStudyData = (url) => {
    return request({
        url
    })
}

