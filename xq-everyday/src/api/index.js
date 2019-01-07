import fetch from '@/utils/fetch';
import axios from 'axios';

// const userUrl='http://192.168.0.3:8014'
const userUrl='http://www.dadashi.cn'

const apiUrl='/WeiInterface/'

//用户信息
// export function axUserInfo(query){
//     return fetch({
//         url: '/ios/GetLoginUserInfo',
//         method: 'get',
//         params: query
//     })
// }

export function axUserInfo(paramObj){  
    return new Promise((resolve, reject) => {
        var getUrl = userUrl + '/ios/GetLoginUserInfo'
        axios.get(getUrl,paramObj).then(response => {
            // console.log(response)
            resolve(response.data);
        }, response => {
            // console.log(response);
        })
    })  
}

//列表页
export function axList(query){
    return fetch({
        url: apiUrl+'GetNewsList',
        method: 'get',
        params: query
    })
}

//详情页
export function axAddView(query){
    return fetch({
        url: apiUrl+'AddNewsUserView',
        method: 'get',
        params: query
    })
}
export function axDetail(query){
    return fetch({
        url: apiUrl+'GetNewsDetail',
        method: 'get',
        params: query
    })
}

//评论列表
export function axComment(query){
    return fetch({
        url: apiUrl+'GetNewsComment',
        method: 'get',
        params: query
    })
}

//发表评论
export function axAddComment(query){
    return fetch({
        url: apiUrl+'AddNewsComment',
        method: 'post',
        params: query
    })
}

//点赞
export function axLike(query){
    return fetch({
        url: apiUrl+'AddNewsCommentPraise',
        method: 'post',
        params: query
    })
}