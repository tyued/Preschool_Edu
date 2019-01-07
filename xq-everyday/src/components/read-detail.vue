<template>
  <div
    :class="[hasUser ? 'read-detail read-detail-hasuser':'read-detail read-detail-nouser']"
    ref="read-detail"
  >
    <div class="download" v-if="!hasUser">
      <img src="@/../static/img/download-bg.png" alt>
      <span @click="goDownload()"></span>
    </div>
    <!-- 编辑 -->
    <div class="detail-edit-box">
      <div class="detail-edit" v-if="hasUser">
        <img :src="editBg" alt @click="editSwitch()">
        <div class="edit-right">
          <div class="edit-input" v-if="isInput">
            <input
              type="text"
              name
              id
              v-model="inputVal"
              maxlength="160"
              ref="edit-input"
              @focus="inputFocus()"
              @blur="inputBlur()"
            >
            <span v-show="inputVal" @click="inputDel()" @mousedown="eventBlur($event)"></span>
            <div
              :class="[inputVal ? 'edit-sendbtn sendbtn-can' : 'edit-sendbtn']"
              @click="sendComment()"
            >发送</div>
          </div>
          <div
            :class="[isRecord ? 'edit-btn edit-record' : 'edit-btn']"
            v-if="!isInput"
            @touchstart="recordStart($event)"
            @touchend="recordEnd()"
            @touchmove="recordCancel($event)"
          >长按 跟读</div>
        </div>
      </div>
    </div>
    <!-- 录音遮罩 -->
    <div class="record-mask" v-show="isRecord">
      <div :class="[cancelRecord ? 'cancel-record mask-con' : 'recording mask-con']">
        <i v-show="loopShow">{{loopTime}}</i>
        <span v-show="!loopShow"></span>
        <p>{{cancelRecordText}}</p>
      </div>
    </div>
    <!-- 返回顶部 -->
    <div class="goback-box">
      <transition name="slide-fade">
        <div class="goback" v-show="gobackShow" @click="gobackClick()">
          <img :src="gobackImg" alt>
        </div>
      </transition>
    </div>
    <!--助教-->
    <!--<div :class="[zjShow ? 'zj-btn zj-show' : 'zj-btn zj-hide']"  v-if="hasUser" @click="gotoQq()">
      <img src="@/../static/img/zj-btn.gif" alt="">
    </div>-->
    <!--删除评论-->
    <transition name="mask">
      <div class="com-delete mask" v-show="ComDelShow">
        <div class="delete-box">
          <img src="@/../static/img/delete.png" alt>
          <div class="del-close" @click="comDelClose()"></div>
          <p>确定删除宝贝成长的印记吗？</p>
          <div class="del-btn clearfix">
            <span @click="comDelClose()">取消</span>
            <span class="sure" @click="comDelSure()">确定</span>
          </div>
        </div>
      </div>
    </transition>
    <!-- 主体 -->
    <div :class="[hasUser ? 'detail-main':'detail-main-nouser']" @scroll="scrollFun()">
      <div class="detail-main-box">
        <div class="detail-bg"></div>
        <!-- 内容 -->
        <div class="detail-content">
          <div class="detail-pic">
            <div class="detail-pic-btn" @click="downloadImg()" v-show="hasUser"></div>
            <div ref="detail-pic" v-html="detailPic"></div>
            <!--<img :src="detailPic" alt="">-->
          </div>
          <!-- 示例声音 -->
          <div
            :class="[musicOn ? 'music-btn music-off' : 'music-btn music-on']"
            @click="musicClick()"
          >
            <span></span>
            <audio :src="detailAudio" ref="music-audio" class="music-audio" @pause="musicOn=false"></audio>
          </div>
          <div
            :class="[musicOn2 ? 'music-btn music-off' : 'music-btn music-on']"
            @click="musicClick2()"
          >
            <span></span>
            <audio
              :src="detailAudio2"
              ref="music-audio2"
              class="music-audio"
              @pause="musicOn2=false"
            ></audio>
          </div>
        </div>
        <!-- 老师有话说 -->
        <div class="detail-teacher clearfix">
          <div class="detail-golist" v-show="hasUser">
            <span @click="gotoList()">查看全部每日一句</span>
          </div>
          <!--<h4 class="detail-item-name">老师有话说</h4>-->
          <div class="teacher-con clearfix">
            <img :src="teacherHead" alt class="teacher-head left">
            <div class="teacher-text left">
              <div class="teacher-text-con" v-html="teacherText"></div>
              <span></span>
            </div>
          </div>
        </div>
        <!-- 精选跟读 -->
        <div class="detail-choice">
          <h4 class="detail-item-name">精选跟读</h4>
          <ul v-if="choiceList.length>0">
            <li v-for="(list,index) in choiceList" :key="index" class="comment-list choice-list">
              <div class="choice-bg1"></div>
              <!--<img src="@/../static/img/choice-bg1.png" alt="" class="choice-bg">-->
              <div class="choice-center clearfix">
                <img :src="list.UserAvatar" alt class="comment-head left">
                <div class="comment-con left">
                  <div class="comment-user clearfix">
                    <div class="user-name">{{list.UserName}}</div>
                    <i v-show="list.IsTop==1">置顶</i>
                    <span>跟读{{list.Days}}天</span>
                    <!--<em v-show="list.hasDelete" @click="comDelBtn(list,index)">删除</em>-->
                  </div>
                  <div class="comment-text">
                    <p>{{list.Content}}</p>
                    <div class="clearfix" v-show="list.SoundTime && list.SoundTime>0">
                      <div
                        :class="[list.voiceOn ? 'voiceing comment-voice left' : 'comment-voice left']"
                        @click="choiceVoice(list,index)"
                      >{{list.SoundTime}}″</div>
                      <audio
                        preload="none"
                        :src="list.SoundUrl"
                        class="choice-audio"
                        @play="list.voiceOn=true"
                        @pause="list.voiceOn=false"
                      ></audio>
                    </div>
                  </div>
                  <div class="comment-time clearfix">
                    <span>{{list.dateTime}}</span>
                    <em
                      v-show="hasUser"
                      :class="[list.IsPraised ? 'islike' : '']"
                      @click="likeClick(list,index)"
                    >{{list.PraiseCount}}</em>
                  </div>
                </div>
              </div>
              <div class="choice-bg3"></div>
              <!--<img src="@/../static/img/choice-bg3.png" alt="" class="choice-bg">-->
            </li>
          </ul>
          <div class="bottom-tips" v-show="choiceList.length==0">暂无数据</div>
        </div>
        <!-- 最新跟读 -->
        <div class="detail-new" id="detail-new">
          <h4 class="detail-item-name">最新跟读</h4>
          <ul>
            <li v-for="(list,index) in newList" :key="index" class="comment-list clearfix new-list">
              <img :src="list.UserAvatar" alt class="comment-head left">
              <div class="comment-con left">
                <div class="comment-user clearfix">
                  <div class="user-name">{{list.UserName}}</div>
                  <i v-show="list.IsTop==1">置顶</i>
                  <span>跟读{{list.Days}}天</span>
                  <!--<em v-show="list.hasDelete" @click="comDelBtn(list,index)">删除</em>-->
                </div>
                <div class="comment-text">
                  <p>{{list.Content}}</p>
                  <div class="clearfix" v-show="list.SoundTime && list.SoundTime>0">
                    <div
                      :class="[list.voiceOn ? 'voiceing comment-voice left' : 'comment-voice left']"
                      @click="newVoice(list,index)"
                    >{{list.SoundTime}}″</div>
                    <audio
                      preload="none"
                      :src="list.SoundUrl"
                      class="new-audio"
                      @play="list.voiceOn=true"
                      @pause="list.voiceOn=false"
                    ></audio>
                  </div>
                </div>
                <div class="comment-time clearfix">
                  <span>{{list.dateTime}}</span>
                  <em
                    v-show="hasUser"
                    :class="[list.IsPraised ? 'islike' : '']"
                    @click="likeClick(list,index)"
                  >{{list.PraiseCount}}</em>
                </div>
              </div>
            </li>
          </ul>
          <div class="bottom-tips" v-show="newList.length==0">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  axAddView,
  axDetail,
  axComment,
  axLike,
  axAddComment
} from "@/api/index";

// import IScroll from 'iscroll'

export default {
  name: "readDetail",
  data() {
    return {
      // hasUser:'',
      hasUser: getParames("userid"),
      newsid: getParames("newsid"),
      editBg: "@/../static/img/edit-input.png",
      isInput: false,
      inputVal: "",
      delShow: false,
      permission: false,
      isRecord: false,
      recordFile: "",
      cancelRecord: false,
      cancelRecordText: "手指上滑，取消发送",
      // recordMask:'@/../static/img/record1.png',
      isOverTime: false,
      loopShow: false,
      Loop: null,
      loopTime: 0,
      startX: 0,
      startY: 0,
      detailPic: "",
      musicOn: false,
      musicPlay: true,
      detailAudio: "",
      musicOn2: false,
      // musicPlay2:true,
      detailAudio2: "",
      teacherHead: "",
      teacherText: "",
      choiceList: [],
      newList: [],
      //返回顶部
      gobackShow: false,
      gobackImg: "@/../static/img/goback.png",
      //助教
      zjShow: true,
      zjClass: "zj-btn",
      //
      ComDelShow: false
    };
  },
  created: function() {
    this.$parent.loadShow = true;
    touchFalse();

    let that = this;

    if (!this.hasUser) {
      window.scrollTo(0, 0);
      window.addEventListener("scroll", this.scrollFun, false);
    }

    // var  myScroll  = new IScroll(' #wrapper ');

    // let permission=localStorage.getItem("permission");//录音权限
    // if(permission==1){
    //   this.permission=true;
    // }

    let permission = localStorage.getItem("permission"); //录音权限
    if (permission == 1) {
      if (isMobile) {
        requestPermission({}, function(result) {
          // alertMask(that.$parent,result.ret)
          if (result.ret == 1) {
            that.permission = true;
            localStorage.setItem("permission", 1);
          } else {
            that.permission = false;
            localStorage.setItem("permission", 0);
            alertMask(that.$parent, "录音权限未开启");
          }
        });
      } else {
        that.permission = true;
        localStorage.setItem("permission", 1);
      }
    }

    //手机端
    if (isMobile && this.hasUser) {
      if (!isApiReady) {
        let isFirst = getParames("isFirst");
        let navLeftData = {};
        if (isFirst) {
          navLeftData = {
            tag: "0",
            fuc: "navLeftFun"
          };
        } else {
          window.navLeftFun2 = this.navLeftFun2 = function() {
            // window.history.back();
            that.$router.push({ path: "/?userid=" + userId + "&isList=1" });
          };
          navLeftData = {
            tag: "1",
            fuc: "navLeftFun2"
          };
        }
        // alertMask(that.$parent,navLeftData)
        updateNavLeftBtn(navLeftData, function(result) {});

        window.navRightFun1 = this.navRightFun1 = function() {
          let shareData = {
            title: shareTitle, // 文字标题
            text: shareText, //内容
            image: "", //图片地址
            url: shareurl + "/#/readDetail?newsid=" + that.newsid //网址
          };
          getActivityShare(shareData, function(result) {});
        };
        let navRightData = {
          title: "分享",
          tag: 1000,
          fuc: "navRightFun1"
        };
        updateNavRightBtn(navRightData, function(result) {});
      }
    }

    this.addView();
    this.detailInit();
    this.commentList();
  },
  mounted: function() {
    let that = this;
    /*************** 自动播放 **************/
    // this.$nextTick(()=> {
    //   this.$refs['read-detail'].addEventListener('touchstart',function(){
    //     if(that.musicPlay){
    //       that.musicPlay=false;
    //       that.musicOn=true;
    //       that.$refs['music-audio'].play();
    //     }
    //   })
    // })
    /*************** 自动播放 **************/
  },
  methods: {
    //浏览数
    addView() {
      let axViewData = {
        newsid: this.newsid
      };
      axAddView(axViewData).then(res => {
        // console.log(res)
      });
    },
    //详情页信息
    detailInit() {
      let axDetailData = {
        newsid: this.newsid
      };
      axDetail(axDetailData).then(res => {
        // console.log(res)

        this.detailPic = res.Value.Content;
        if (res.Value.SoundUrl) {
          let soundJson = JSON.parse(res.Value.SoundUrl);
          this.detailAudio = soundJson.Url;
          this.detailAudio2 = soundJson.Url;
        }
        this.teacherHead = res.Value.UserAvatar;
        this.teacherText = res.Value.Summary;
      });
    },
    //评论列表
    commentList() {
      let that = this;
      let axCommentData = {
        newsid: this.newsid,
        userid: userId
      };
      axComment(axCommentData).then(res => {
        let choiceJson = res.Value.TopList;
        choiceJson.forEach(function(item, i) {
          item.dateTime = item.CreateDate.substring(5, 16);
          item.num = 666;
          item.voiceOn = false;
          item.hasDelete = false;
          if (!item.PraiseCount) {
            item.PraiseCount = 0;
          }
          if (userId && item.UserId == userId) {
            item.hasDelete = true;
          }
          // that.choiceList.push(item);
        });
        that.choiceList = choiceJson;

        let newJson = res.Value.List;
        newJson.forEach(function(item, i) {
          item.dateTime = item.CreateDate.substring(5, 16);
          item.num = 666;
          item.voiceOn = false;
          item.hasDelete = false;
          if (!item.PraiseCount) {
            item.PraiseCount = 0;
          }
          if (userId && item.UserId == userId) {
            item.hasDelete = true;
          }
          // that.newList.push(item);
          // if(item.Id!==5 && item.Id!==9){
          //   that.newList.push(item);
          // }
        });
        that.newList = newJson;

        this.$parent.loadShow = false;
        touchTrue();
      });
    },
    //输入框
    sendComment() {
      let that = this;
      let regu = /^\s*$/g;
      if (this.inputVal) {
        // console.log(regu.test(this.inputVal))
        if (regu.test(this.inputVal)) {
          alertMask(this.$parent, "输入为空");
        } else {
          this.addComment(that, that.inputVal, "", 0);
        }
      } else {
        alertMask(this.$parent, "请输入内容");
      }
    },
    //添加评论
    addComment(that, con, sound, time) {
      if (userName && userAvatar) {
        let axAddCommentData = {
          newsid: that.newsid,
          userid: userId,
          UserName: userName,
          UserAvatar: userAvatar,
          Content: con,
          SoundUrl: sound,
          SoundTime: time
        };
        axAddComment(axAddCommentData).then(res => {
          console.log(res);
          if (res.ResultCode == 1) {
            that.inputVal = "";
            alertMask(that.$parent, "发表成功");
            that.commentList(); //重新加载评论列表
            this.$el.querySelector("#detail-new").scrollIntoView();
          } else {
            alertMask(that.$parent, "发表失败");
          }
        });
      } else {
        alertMask(that.$parent, "用户丢失");
      }
    },
    //删除按钮
    inputDel() {
      this.inputVal = "";
      this.$refs["edit-input"].value = "";
    },
    eventBlur(event) {
      event.preventDefault();
    },
    inputFocus() {
      touchFalse();
      // setTimeout(()=>{           //低版本系统不支持ES6，that=this
      //    alertMask(this.$parent,document.body.clientHeight)
      // },1000);
    },
    inputBlur() {
      window.scrollTo(0, 0);
      touchTrue();
    },
    //录音切换
    editSwitch() {
      // let audios=document.getElementsByTagName("audio")
      // console.log(audios.length)
      // for(let i=0;i<audios.length;i++){
      //   console.log(i)
      //   audios[i].pause();
      // }

      /***********评论功能关闭*********/
      this.isInput = !this.isInput;
      if (this.isInput) {
        this.editBg = "@/../static/img/edit-record.png";
      } else {
        this.editBg = "@/../static/img/edit-input.png";
      }
      /***********评论功能关闭*********/
    },
    //录音
    recordStart(event) {
      let that = this;
      this.isOverTime = false;
      if (this.permission) {
        that.recordFile = "";
        that.cancelRecord = false;
        that.cancelRecordText = "手指上滑，取消发送";
        that.isRecord = true;
        touchFalse();

        let audios = document.getElementsByTagName("audio");
        for (let i = 0; i < audios.length; i++) {
          audios[i].pause();
        }

        let touch = event.changedTouches[0]; //获取第一个触点
        that.startX = Number(touch.pageX); //页面触点X坐标
        that.startY = Number(touch.pageY); //页面触点Y坐标
        // that.recordMask='@/../static/img/record1.png'
        that.timeLoop(that);
        if (isMobile) {
          //手机端，开始录音
          window.overtime = that.overtime = function() {
            that.isOverTime = true;
            that.isRecord = false;
            touchTrue();

            // clearInterval(that.Loop);
            // if(that.cancelRecord){//取消录音
            //   let cancelData = {
            //     filename:that.recordFile,
            //   }
            //   cancelRecord(cancelData, function(result) {});
            // }else{//录音完成

            alertMask(that.$parent, "发送当前录音");
            that.recordSend(that, 30);

            // }
          };
          window.notRecord = that.notRecord = function() {};
          let startData = {
            maxTime: 31,
            minTime: 1.5,
            maxTimeStopRecordCompletion: "overtime", //超过最大时长的回调 参数 {time:120, filename:''} ,
            cannotRecordCompletion: "notRecord" //不能录音的回调
          };
          startRecord(startData, function(result) {
            that.recordFile = result.filename;
          });
        }
      } else {
        //录音权限
        if (isMobile) {
          requestPermission({}, function(result) {
            // alertMask(that.$parent,result.ret)
            if (result.ret == 1) {
              that.permission = true;
              localStorage.setItem("permission", 1);
            } else {
              that.permission = false;
              localStorage.setItem("permission", 0);
              alertMask(that.$parent, "录音权限未开启");
            }
          });
        } else {
          that.permission = true;
          localStorage.setItem("permission", 1);
        }
      }
    },
    recordEnd() {
      if (this.permission && !this.isOverTime) {
        let that = this;
        this.isRecord = false;
        touchTrue();
        clearInterval(that.Loop);
        if (this.cancelRecord) {
          //取消录音
          let cancelData = {
            filename: that.recordFile
          };
          cancelRecord(cancelData, function(result) {});
        } else {
          //录音完成
          this.recordSend(that);
        }
      }
    },
    //录音停止并上传
    recordSend(that, time) {
      stopRecord({}, function(result) {
        if (result.ret == 1) {
          that.recordFile = result.filename;
          let recordTime = "";

          if (time) {
            recordTime = 30;
          } else {
            recordTime = result.time;
          }

          //上传录音
          let uploadData = {
            filename: that.recordFile
          };
          uploadRecord(uploadData, function(result) {
            console.log(result.time);
            if (result.ret == 1) {
              that.addComment(that, "", result.url, recordTime);
              // alertMask(that.$parent,'上传成功')
            } else {
              alertMask(that.$parent, "上传失败");
            }
          });
        } else {
          alertMask(that.$parent, "录音时间太短");
        }
      });
    },
    recordCancel($event) {
      if (this.permission) {
        let that = this;
        let touch = event.changedTouches[0]; //获取第一个触点
        let moveEndY = Number(touch.pageY); //页面触点Y坐标
        let y = "";
        y = moveEndY - this.startY;
        // console.log(y)
        // console.log(Math.abs(y))
        let absY = Math.abs(y);
        if (y < 0 && absY > 50) {
          this.cancelRecord = true;
          this.cancelRecordText = "松开手指，取消发送";
          // this.recordMask='@/../static/img/record-cancel.png'
        } else {
          this.cancelRecord = false;
          this.cancelRecordText = "手指上滑，取消发送";
          // this.recordMask='@/../static/img/record1.png'
        }
      }
    },
    //计时
    timeLoop(that) {
      that.loopShow = false;
      that.loopTime = 6;
      let count = 0;
      clearInterval(that.Loop); //再次清空定时器，防止重复注册
      that.Loop = setInterval(() => {
        if (count < 30) {
          count = count + 1;
          if (count > 25) {
            that.loopTime--;
            that.loopShow = true;
          }
        } else {
          clearInterval(that.Loop);
        }
      }, 1000);
    },
    //声音
    musicClick() {
      let audios = document.getElementsByTagName("audio");
      // console.log(audios)
      for (let i = 0; i < audios.length; i++) {
        audios[i].pause();
      }
      this.musicPlay = false;
      if (this.detailAudio) {
        this.musicOn = !this.musicOn;
        if (this.musicOn) {
          this.$refs["music-audio"].play();
        } else {
          this.$refs["music-audio"].pause();
        }
      } else {
        alertMask(this.$parent, "没有示范音频");
      }
    },
    musicClick2() {
      let audios = document.getElementsByTagName("audio");
      // console.log(audios)
      for (let i = 0; i < audios.length; i++) {
        audios[i].pause();
      }
      // this.musicPlay2=false;
      if (this.detailAudio2) {
        this.musicOn2 = !this.musicOn2;
        if (this.musicOn2) {
          this.$refs["music-audio2"].play();
        } else {
          this.$refs["music-audio2"].pause();
        }
      } else {
        alertMask(this.$parent, "没有示范音频");
      }
    },
    choiceVoice(list, index) {
      this.musicOn = false;
      this.musicOn2 = false;
      // this.$refs['music-audio'].pause();
      let audios = document.getElementsByTagName("audio");
      for (let i = 0; i < audios.length; i++) {
        audios[i].pause();
      }
      document
        .getElementsByClassName("choice-list")
        [index].getElementsByClassName("choice-audio")[0]
        .play();
    },
    newVoice(list, index) {
      // alertMask(this.$parent,list.Id)
      this.musicOn = false;
      this.musicOn2 = false;
      // this.$refs['music-audio'].pause();
      let audios = document.getElementsByTagName("audio");
      for (let i = 0; i < audios.length; i++) {
        audios[i].pause();
      }
      document
        .getElementsByClassName("new-list")
        [index].getElementsByClassName("new-audio")[0]
        .play();
    },
    //点赞
    likeClick(list, index) {
      if (list.IsPraised) {
        alertMask(this.$parent, "已经点赞过啦");
      } else {
        let axLikeData = {
          newsId: this.newsid,
          commentId: list.Id,
          userid: userId
        };
        axLike(axLikeData).then(res => {
          if (res.ResultCode == 1) {
            list.IsPraised = true;
            list.PraiseCount = parseInt(list.PraiseCount) + 1;
          } else {
            alertMask(this.$parent, res.ResultMessage);
          }
        });
      }
    },
    //删除评论
    comDelBtn(list, index) {
      this.ComDelShow = true;
      touchFalse();
    },
    comDelClose() {
      this.ComDelShow = false;
      touchTrue();
    },
    comDelSure() {
      let that = this;
      if (userId) {
        let axDelCommentData = {
          newsid: that.newsid,
          userid: userId
        };
        axDelComment(axDelCommentData).then(res => {
          console.log(res);
          if (res.ResultCode == 1) {
            this.ComDelShow = false;
            touchTrue();
          } else {
            alertMask(that.$parent, "删除失败");
          }
        });
      } else {
        alertMask(that.$parent, "用户丢失");
      }
    },
    gotoList() {
      this.$router.push({ path: "/?userid=" + userId + "&isList=1" });
    },
    goDownload() {
      window.location.href =
        "http://a.app.qq.com/o/simple.jsp?pkgname=com.tianying.xuequyouer.activity";
    },
    //手机端
    //图片下载
    downloadImg() {
      let that = this;
      let detailPicUrl = this.$refs["detail-pic"].getElementsByTagName("img")[0]
        .src;
      console.log(detailPicUrl);
      let imgData = {
        image: detailPicUrl //图片地址
      };
      downloadImage(imgData, function(result) {});
    },
    //助教
    gotoQq() {
      let that = this;
      //给手机端传参，调用qq/微信
      let key = "";
      let uA = navigator.userAgent;
      let isAndroid = uA.indexOf("Android") > -1 || uA.indexOf("Adr") > -1; //android终端
      let isiOS = !!uA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS && !isAndroid) {
        //ios终端
        key =
          "cd089b02f6cf05ae0bb5b74ecbbfda04bcec63ed0fa6951a4dc0f39688107321";
      } else if (isAndroid && !isiOS) {
        //android终端
        key = "f3ELncM9Bfam_4JORFWPZRc6qYT-NyP7";
      } else {
        key = "f3ELncM9Bfam_4JORFWPZRc6qYT-NyP7";
      }

      /********************* 数据埋点 ***********************/
      // let axLogData={
      //     "userid":userId,
      //     "typeid":43,
      // }
      // axAddLog(axLogData).then(res => {})
      /********************* 数据埋点 ***********************/

      let isFunction = false;
      try {
        isFunction = typeof eval("callMobileQq") == "function";
      } catch (e) {}

      if (isFunction) {
        let qqdata = {
          qqNum: "491559295",
          key: key
        };
        callMobileQq(qqdata, function(result) {});
      } else {
        alertMask(that.$parent, "敬请期待");
      }
    },
    //返回顶部
    scrollFun() {
      let hScroll = 0;
      let bodyH = 0;
      if (this.hasUser) {
        hScroll = document.getElementsByClassName("detail-main")[0].scrollTop;
        bodyH = document.getElementsByClassName("detail-main")[0].clientHeight;
      } else {
        hScroll = document.documentElement.scrollTop || document.body.scrollTop;
        bodyH =
          document.documentElement.clientHeight || document.body.clientHeight;
      }
      /*************** 自动播放 **************/
      if (this.musicPlay) {
        this.musicPlay = false;
        this.musicOn = true;
        this.$refs["music-audio"].play();
      }
      /*************** 自动播放 **************/
      // console.log(hScroll)
      // console.log(bodyH)
      if (hScroll > 80) {
        // this.zjClass='zj-btn zj-hide'
        this.zjShow = false;
      } else {
        this.zjShow = true;
        // this.zjClass='zj-btn zj-show'
      }
      if (hScroll > bodyH) {
        this.gobackShow = true;
      } else {
        this.gobackShow = false;
      }
    },
    gobackClick() {
      window.scrollTo(0, 0);
      document.getElementsByClassName("detail-main")[0].scrollTop = 0;
      // var Tween = {
      //   Linear: function(t, b, c, d) { //匀速运动
      //     return c * t / d + b;
      //   }
      // }
      // Math.tween = Tween;
      // let t = 1;
      // const b = document.getElementsByClassName('detail-main')[0].scrollTop;
      // const c = 150;
      // const d = 2;
      // const setInt = setInterval(()=>{
      //   t--;
      //   // console.log(t)
      //   if(document.getElementsByClassName('detail-main')[0].scrollTop == 0){clearInterval(setInt)}
      //   // console.log(t);
      //   const backTop = Tween.Linear(t,b,c,d);
      //     // console.log(backTop);
      //   document.getElementsByClassName('detail-main')[0].scrollTop = backTop;
      // },5)
    }
  }
};
</script>