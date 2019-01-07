<template>
  <div id="app">
    <!-- 加载过渡 -->
    <transition name='page'>
      <div class="loading" v-if="loadShow">
        <div class="loading-con">
          <img src="@/../static/img/load.gif" alt="">
          <p>加载中...</p>
        </div>
      </div>
    </transition>
    <!-- 内容 -->
    <transition name='page'>
      <router-view/>
    </transition>
    <!-- 提示弹框 -->
    <div class="alert-mask-body" v-if="alertMaskShow">
      <div class="alert-mask">{{alertMaskText}}</div>
    </div>
    <!-- 图片缓存 -->
    <ul class="pic-cache">
        <li class="pic0"></li>
        <li class="pic1"></li>
        <li class="pic2"></li>
        <li class="pic3"></li>
        <li class="pic4"></li>
        <li class="pic5"></li>
    </ul>
  </div>
</template>

<script>
import { axUserInfo } from '@/api/index'

export default {
  name: 'App',
  data () {
    return {
      loadShow:true,
      // 提示弹框
      alertMaskShow:false,
      alertMaskText:'',
    }
  },
  created:function() {
    touchFalse();
    let that=this;
    if(userId){
      this.getUserInfo();
    }
    


    //手机端
    window.navLeftFun = this.navLeftFun = function() {
      let audios=document.getElementsByTagName("audio")
      // console.log(audios)
      for(let i=0;i<audios.length;i++){
        audios[i].pause(); 
      }
    }
    window.navRightFun = this.navRightFun = function() {
        let shareData = {
          title:shareTitle, // 文字标题
          text:shareText, //内容
          image:'', //图片地址
          url:shareurl+'/#/readDetail?newsid='+firstNewsid, //网址
        }
        getActivityShare(shareData, function(result) {}); 
    }
    window.apiReady = this.apiReady = function() {
      //左，返回按钮
      let navLeftData = {
        tag:0, 
        fuc:'navLeftFun',
      }
      updateNavLeftBtn(navLeftData, function(result) {});

      //右，分享按钮 
      let navRightData = {
        title: '分享', 
        tag:1000, 
        fuc:'navRightFun',
      }
      updateNavRightBtn(navRightData, function(result) {});

      // let permission=localStorage.getItem("permission");//录音权限
      // if(permission==1){
      //   if(isMobile){
      //     requestPermission({}, function(result) {
      //       if(result.ret==1){
      //         localStorage.setItem("permission",1);
      //       }else{
      //         localStorage.setItem("permission",0);
      //         alertMask(that.$parent,'录音权限未开启')
      //       }
      //     });  
      //   }else{
      //     localStorage.setItem("permission",1);
      //   }
      // }

      isApiReady=false;
    }
    
    // // 获取用户活动信息
    // userId=getParames('userId');
    // // console.log(userId)

    // if(userId && userId!=='undefined' && userId!=='null' && userId!=='undefined%3FsourceType%3Dweixin'){
    // }else{
    //   that.loadShow=false;
    //   that.$router.push({path:'/upIndex?userId='+userId});
    // }

  },
  methods: {
    //获取用户信息
    getUserInfo(){
        // let axUserInfoData={
        //     'userid':userId,
        // }
        axUserInfo({
          params: {
            userid: userId,
          }
        }).then(res => {
            userName=res.Value.babyname;
            userAvatar=res.Value.babypic;
            // console.log(userName,userAvatar)
        })
    },
  },
}
</script>

<style>

</style>
