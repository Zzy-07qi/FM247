import request from "../utils/request";
export const createTodo = (params) => {
    return request({
        url: '/todos',
        method: 'post',
        data: params
    })
}

export const getTodo = () => {
    return request({
        url: '/todos',
        method: 'get',
    })
}
export const deleteTodo = (id) => {
    return request({
        url: `/todos/${id}`,
        method: 'delete'
    })
}
export const changeTodo = (id, params) => {
    return request({
        url: `/todos/${id}`,
        method: 'put',
        data: params
    })
}