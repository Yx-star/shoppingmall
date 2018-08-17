$(function () {
  init();
  function init() {
    //判断是否已经登录
    if(!$.checkLogin()){
      //重新跳转登录页面
      $.setPage();
      location.href = "/pages/login.html";
      return;
    }else{
      $("body").fadeIn();
    }
    eventList();
    getUserInfo();
  }
  //退出登录
  function eventList() {
    $("#loginOutBtn").on('tap',function () {
      /* 
      0 弹出确认框 
      1 手动删除本地存储中数据 userinfo 
      2 跳转页面=> 登录页面
       */
      mui.confirm("退出干嘛？","提示！",["不想玩了","不退了"],function (etype) {
        if (etype.index==0) {
          $.removeUser();
          $.setPage();
          location.href="/pages/me.html";
        }else if(etype.index==1){
        }
      })
    })
  }
  //这是动态渲染
  function getUserInfo() {
    $.ajax({
      url:"my/users/userinfo",
      headers:{
        Authorization:$.token()
      },
      success:function (res) {
        // console.log(res);
        if(res.meta.status==200){
          var html = template("userTpl",{data:res.data});
          console.log(html);
          $('.userinfo').html(html);
        }else {
          // 提示
          mui.toast(ret.meta.msg);
          // 剩下的行为 后期再加上
        }
      }
    })
  }
})