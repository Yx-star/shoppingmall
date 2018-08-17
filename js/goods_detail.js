$(function () {
  //商品详情信息
  var GoodsObj;

  init();

  function init() {
    getDetail();
    eventList();
  }

  //注册点击加入购物车事件
  function eventList() {
    $(".add_btn").on("tap", function () {
      // 判断永久储存中有没有userinfo
      if(!$.checkLogin()){
        //没有用户信息 没登录过
        mui.toast("未登录");
        sessionStorage.setItem("pageName",location.herf);
        setTimeout(() => {
          location.href = "/pages/login.html"
        }, 1000);
        return;
      }
      var token = $.token();
      //商品对象 GoodsObj.cat_id
      var obj = {
        cat_id: GoodsObj.cat_id,
        goods_id: GoodsObj.goods_id,
        goods_name: GoodsObj.goods_name,
        goods_number: GoodsObj.goods_number,
        goods_price: GoodsObj.goods_price,
        goods_weight: GoodsObj.goods_weight,
        goods_small_logo: GoodsObj.goods_small_logo
      };
      // 发送到后台的参数分为两种
      // 1 常规的参数   $.ajax({data:obj})
      // 2 token 登录验证使用 => 请求头中 

      // 获取token
      // var token = JSON.parse(localStorage.getItem("userinfo")).token;
      // console.log(token);
      $.ajax({
        url: "my/cart/add",
        type: "post",
        data: {
          info: JSON.stringify(obj)
        },
        headers: {
          Authorization: token
        },
        success: function (ret) {
          console.log(ret);
          // 无效token
          if (ret.meta.status == 401) {
            mui.toast("未登录");
            sessionStorage.setItem("pageName", location.href);
            setTimeout(function () {
              location.href = "/pages/login.html";
            }, 1000);
          } else if (ret.meta.status == 200) {
            // 添加成功
            /* 
            1 弹出一个确认框
            2 跳转到购物车页面
            3 留在当前页面 
             */
            mui.confirm("是否跳转到购物车页面", "添加成功", ["跳转", "取消"], function (etype) {
              // 跳转
              if (etype.index == 0) {
                setTimeout(function () {
                  location.href = "/pages/cart.html";
                }, 1000);
              } else if (etype.index == 1) {
                // 不跳转 留在当前页面
              }
            });
          }
        }
      })


      //   // http://api.pyg.ak48.xyz/api/public/v1/my/cart/add      
      //   $.post("/my/cart/add",{},function (ret) {
      //     console.log(ret);
      //     //无效token
      //     if(ret.meta.status == 401){
      //       mui.toast("未登录");
      //       sessionStorage.setItem("pageName",location.href);
      //       setTimeout(function() {
      //         location.href = "/pages/login.html";
      //       }, 1000);
      //     }
      //   })
    })
  }

  // 商品详情数据
  function getDetail() {
    $.get("goods/detail", {
      goods_id: $.getURLValue("goods_id")
    }, function (ret) {
      // console.log(ret);
      // 把商品信息赋值给全局变量
      GoodsObj = ret.data;

      var html = template("mainTpl", {
        data: ret.data
      });
      $(".pyg_view").html(html);

      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
      });
    })
  }
})