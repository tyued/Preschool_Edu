<template>
  <div class="read-list">
    <div class="list-top">
         <img src="@/../static/img/list-top.png" alt="">
    </div>
    <div class="list-body" ref="list-body" @scroll="scrollLoad()">
        <ul>
            <li v-for="(list,index) in readList" :key="index" class="clearfix">
                <div class="list-label" v-if="list.labelShow">HOT</div>
                <img :src="list.ImageUrl" alt="" class="list-pic left"  @click="gotoDetail(list,index)">
                <div class="list-con left">
                    <h4 @click="gotoDetail(list,index)">{{list.Title}}</h4>
                    <p><em>{{list.CommentCount}}跟读</em><span>{{list.ViewCount}}浏览</span></p>
                </div>
            </li>
        </ul>
        <div class="bottom-tips">{{bottomTip}}</div>
    </div>
       
  </div>
</template>

<script>
// import Vue from 'vue'
import { axList } from '@/api/index'

export default {
  name: 'readList',
  data () {
    return {
        readList:[],
        listPage:1,
        totalPage:1,
        bottomTip:'暂无数据',
    }
  },
  created:function(){
      
      this.$parent.loadShow=true;
      touchFalse();

      this.listRequest(1);
  },
  mounted:function() {  
    //   window.addEventListener("scroll",this.scrollLoad,false)
  },
  methods: {
    //转到第一天
    isListFun(){
        let that=this;
        let isList=getParames('isList');
        // console.log(isList)
        if(isList){
            //手机端
            if(!isApiReady){
                window.navLeftFun1 = this.navLeftFun1 = function() {
                    // window.history.back();
                    that.$router.push({path:'/readDetail?userid='+userId+'&newsid='+that.readList[0].Id+'&isFirst=1'});
                }
                let navLeftData = {
                    tag:'1', 
                    fuc:'navLeftFun1',
                }
                updateNavLeftBtn(navLeftData, function(result) {});

                let navRightData = {
                    title: '', 
                    tag:1, 
                    fuc:'navRightFun',
                }
                updateNavRightBtn(navRightData, function(result) {});
            }
            this.$parent.loadShow=false;
            touchTrue();
        }else{
            this.$router.push({path:'/readDetail?userid='+userId+'&newsid='+this.readList[0].Id+'&isFirst=1'});
        }
    },
    //列表请求
    listRequest(page){
        let that=this;
        let axListData={
            'School':400,
            // 'Category':704,
            'Category':1806,
            'P':page,
            'Ps':10,
        }
        axList(axListData).then(res => {
            // console.log(res)
            let readListJson=res.Value.List;
            // if(this.readList.length>0){
                readListJson.forEach(function(list,i){
                    if(list.IsTop==1){
                        list.labelShow=true;
                    }else{
                        list.labelShow=false;
                    }
                    that.readList.push(list)
                })

                if(page==1){
                    this.totalPage=res.Value.TotalPage
                    firstNewsid=this.readList[0].Id;
                    this.isListFun();   
                }
                if(page<this.totalPage){
                    this.bottomTip='上拉加载更多'
                }else{
                    this.bottomTip=''
                }
            // }else if(this.readList.length==0){
            //     this.$parent.loadShow=false;
            //     touchTrue();
            // }
            
            
        })
    },
    // 滚动加载
    scrollLoad(){
        let bodyH = document.documentElement.clientHeight || document.body.clientHeight;
        let scrollH = this.$refs['list-body'].scrollTop;
        let listH=this.$refs['list-body'].scrollHeight;
        // console.log(scrollH,listH)
        if(scrollH+bodyH==listH){
            this.bottomTip='努力加载中...'
            // console.log(this.totalPage)
            this.listPage=this.listPage+1;
            if(this.listPage<this.totalPage || this.listPage == this.totalPage){
                let page=this.listPage;
                this.listRequest(page);   
            }else{
                this.bottomTip=''
                console.log('没有更多数据')
            }
            
        }

        // var curbox = document.getElementById("scrollload");
        // let height = document.getElementById("scrolldetail").clientHeight;
        // if(hScroll+bodyH+100>height){
        //     this.listPage=this.listPage+1;
        //     let page=this.listPage;

        //     this.comNewRequest(page)  
        // }
        
    },
    //详情页
    gotoDetail(list,index){
        if(index==0){
            this.$router.push({path:'/readDetail?userid='+userId+'&newsid='+list.Id+'&isFirst=1'});
        }else{
            this.$router.push({path:'/readDetail?userid='+userId+'&newsid='+list.Id});
        }
        
    }
  },
}
</script>