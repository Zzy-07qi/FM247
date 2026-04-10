import request from "../utils/request"

export const getCalendar = (date) => {
    return request({
        method: 'get',
        url: `/calendar/event/${date}`
    })
}
export const putCalendar = (id, data) => {
    return request({
        method: 'put',
        url: `/calendar/event/${id}`,
        data
    })
}
export const postCalendar = (data) => {
    return request({
        method: 'post',
        url: `/calendar/event`,
        data
    })
}
