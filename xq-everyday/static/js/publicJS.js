// 禁止长按调用系统
// window.addEventListener('contextmenu', function(e){  
//     e.preventDefault();  
// });


// 获取地址栏
// function getParames(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//     var r = window.location.search.substr(1).match(reg);
//     if (r != null) return unescape(r[2]);
//     return null;
// }
function getParames(name) {
    // console.log(location)
    var after = window.location.hash.split("?")[1];
    if(after){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = after.match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
}

// 遍历删除
// function listRemove(_arr,obj,val){
//     for (let i = 0; i < _arr.length; i++) {
//         if (_arr[i].obj == val){
//             _arr.splice(i, 1);
//         }
//     }
// };


//禁用手机默认的触屏滚动行为
function touchFalse(){
    document.body.style.overflow='hidden';
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);
}
//恢复手机默认的触屏滚动行为
function touchTrue(){
    document.body.style.overflow='auto';
    document.addEventListener("touchmove", function (event) {
        event.returnValue = true;  
    });
}

// 提示弹层
function alertMask(obj,text){
    touchFalse()
    obj.alertMaskShow=true;
    obj.alertMaskText=text;
    setTimeout(function(){           //低版本系统不支持ES6，that=this
        touchTrue()
        obj.alertMaskShow=false;    
    },1000);
}

//图片加载
function imgLoad(img, callback) {
    var timer = setInterval(function() {
        if (img.complete) {
        callback(img)
        clearInterval(timer)
        }
    }, 50)
}


