import axios from 'axios';


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  // baseURL: "http://192.168.0.65:3322",
  timeout: 10000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  //console.log("这里是请求拦截器")
  // Do something before request is sent
//   if (window.localStorage.getItem("token")) {
    // config.headers['Authorization'] = window.localStorage.getItem("token"); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
//   }
  return config;
}, error => {
  // Do something with request error
  //console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if(response.status === 200 || response.status === 304){
        if(response.data.ResultCode==1){
          // console.log(response.data.ResultMessage)
          // console.log(response)
          return response.data;
        }else{
          console.log('网络异常，请重新尝试')
        }
    }else{
      console.log('网络不太给力哦，检查一下您的网络再试吧！')
    }
  },
  error => {
    console.log('err' + error); // for debug
    alert('网络不太给力哦，检查一下您的网络再试吧！')
    return Promise.reject(error);
  }
);
export default service;


