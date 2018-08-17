$(function () {
  init();
  function init() {
    //判断是否登录了
    if(!$.checkLogin()){
      //重新跳转到登录页面
      $.setPage();
      location.href = "/pages/login.html";
      return;
    }else{
      $("body").fadeIn();
    }
    orders();
  }
  // 查询订单
  function orders() {
    $.ajax({
      url:"my/orders/all",
      type:"get",
      data:{
        type:1
      },
      headers:{
        Authorization:$.token()
      },
      success:function (res) {
        // console.log(res);
        if(res.meta.status==200){
          var arr = res.data;
          // console.log(arr);
          var html = template("liTpl",{arr:arr});
          $("#item1 ul").html(html);
        }else{
          mui.toast(res.meta.msg);
        }
      }
    })
  }
})