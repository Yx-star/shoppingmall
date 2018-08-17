$(function () {
  init();

  //判断是否登录
  function init() {
    //判断是否已经等录
    if (!$.checkLogin()) {
      //重新跳转登录页面
      sessionStorage.setItem("pageName", location.href);
      location.href = "/pages/login.html";
      return;
    } else {
      $("body").fadeIn();
    }
    getCartData();
    eventList();
  }

  // 点击事件
  function eventList() {
    // 给加号和-号添加tap= 计算总价格
    $(".p_cart_content").on("tap", "button", function () {
      countAll();
    })

    // 点击编辑-完成
    $("#edit_btn").on("tap", function () {
      $("body").toggleClass("edit_status");

      // 动态切换文字内容
      if ($("body").hasClass("edit_status")) {
        $("#edit_btn").text("完成");
      } else {
        $("#edit_btn").text("编辑");
        /* 
        0 判断有没有商品
        1 获取所有的li标签 
        2 循环 li标签
           1 获取 li 身上obj 
           2 改变 obj里面 obj.amount（要购买的数量 ） = 所在li标签的 里面 input标签的值
           3 再去构造请求的参数  infos:{}
         */
        var lis = $('.p_cart_content li');
        //判断有没有商品
        if (lis.length == 0) {
          mui.toast("还没购买商品")
          return;
        }
        //要发送到后台的infos 对象
        var infos = {};
        for (var i = 0; i < lis.length; i++) {
          var li = lis[i];
          //商品对象
          // console.log(li);
          var obj = $(li).data("obj");
          // console.log(obj);
          // console.log(obj.amount);
          obj.amount = $(li).find(".mui-numbox-input").val();
          infos[obj.goods_id] = obj;
        }
        syncCart(infos);
      }
    })

    // 点击删除
    $('#delete_btn').on('tap', function () {
      // console.log('点击了');
      /* 
      1 获取已经选中的复选框的个数 
         如果长度 0  提示：还没有选中任何商品
         长度不 为 0
      2 弹出确认框 确定要删除  确定 取消
      3 确定；=》
      4 删除 接口-同步购物车
        1 10种商品 2 删除第一种 3 发送被删除的商品的购物车的id到后台。。。。
        2 10种商品 2 删除第一种 3 发送后（未选中）9种商品到后台！！！ 
      5 获取未删除的li标签  构造参数 发送请求 
      6 发送请求
          删除失败 弹出提示 status 
          删除成功了  重新发送请求 渲染页面
       */

      // 1 如果长度 0  提示：还没有选中任何商品
      var chks = $(".p_cart_content [name='g_chk']:checked")
      if (chks.length == 0) {
        mui.toast("大哥，你还没选中呢");
        return;
      }
      //选中的时候询问，是否真的要删除
      mui.confirm("确定要删除吗？", "警告", ["确定", "取消"], function (etype) {
        //确定
        if (etype.index == 0) {
          // console.log(etype);
          //获取未被选中的商品信息 获取未被选中的复选框的父元素li
          var unSelect = $(".p_cart_content [name='g_chk']").not(":checked").parents("li");
          // console.log(unSelect);
          //被删除的对象字段
          var infos = {};
          for (var i = 0; i < unSelect.length; i++) {
            // js dom 对象
            var li = unSelect[i];
            // console.log(li);
            // $(li).data("obj")  data() 帮你做了一件事  json.parse() 
            // var obj=li.dataset.obj
            var obj = $(li).data("obj");
            // console.log(obj);
            infos[obj.goods_id] = obj;
            // console.log(infos);
          }
          //同步数据
          syncCart(infos);
        } else if (etype.index == 1) {
          console.log('取消');
        }
      })
    })
    //点击生成订单
    $('.o_create').on('tap',function () {
      // console.log('点击了生成订单');
      /*
      判断有没有数据
      构造请求的参数
      */
     var lis = $('.p_cart_content li');
     //判断有没有商品
     if (lis.length==0){
       mui.toast("你还没购买商品");
       return;
     }
     var paramsObj={
       order_price:$(".total_price").text(),
       consignee_addr:"广州天河吉山",
       goods:[]
     };
     for (var i = 0; i < lis.length; i++) {
       var li = lis[i];
       var obj = $(li).data("obj");
       var temp={
         goods_id:obj.goods_id,
         goods_price:obj.goods_price,
         goods_number:$(li).find(".mui-numbox-input").val()
       };
       paramsObj.goods.push(temp);
      //  console.log(paramsObj);
     }
     //发送数据
     orderCreate(paramsObj);
    })
  }
  //生成订单
  function orderCreate(params) {
    $.ajax({
      url:"my/orders/create",
      type:"post",
      data:params,
      headers:{
        Authorization:$.token()
      },
      success:function (res) {
        //成功的时候
        if(res.meta.status==200){
          mui.toast(res.meta.msg);
          // 等一秒后再跳转
          setTimeout(function() {
            location.href = "/pages/order.html";
          }, 1000);
        }else{
          mui.toast(res.meta.msg);
        }
      }
    })
  }
  
  // 查询购物车数据
  function getCartData() {
    //获取token
    var token = $.token();
    //检查永久存储 userinfo
    $.ajax({
      url: "my/cart/all",
      headers: {
        Authorization: token
      },
      success: function (ret) {
        console.log(ret);
        // 数据存放在了 cart_info=》 json字符串

        // 判断token是否有效
        if (ret.meta.status == 200) {
          var cart_info = JSON.parse(ret.data.cart_info);
          // console.log(cart_info);
          var html = template("mainTpl", {
            obj: cart_info
          });
          $(".pyg_cart ul").html(html);
          //初始化数字输入框
          mui(".mui-numbox").numbox();
          countAll()
        } else {
          console.log(ret.meta.msg);
        }
      }
    })
  }
  // 计算总价格
  function countAll() {
    /* 
        1 获取所有的li标签
        2 循环 
            1 计算每一个li标签所对应的商品的总价格（单价*数量）
            2 叠加不同种类的商品的总价格
        3 拿到总价格 =》 给标签赋值 
         */

    var lis = $(".p_cart_content li");
    // 总价格
    var total = 0;
    for (var i = 0; i < lis.length; i++) {
      var li = lis[i];
      var obj = $(li).data("obj");
      // 单价
      var tmp_goods_price = obj.goods_price;
      // 购买的数量
      var nums = $(li).find(".mui-numbox-input").val();
      total += tmp_goods_price * nums;
    }
    // console.log(total);
    $(".total_price").text(total);
  }
  //同步更新数据
  function syncCart(infos) {
    //发送ajax请求
    $.ajax({
      url: "my/cart/sync",
      type: "post",
      data: {
        infos: JSON.stringify(infos)
      },
      headers: {
        Authorization: $.token()
      },
      //如果成功则更新查询购物车的数据，失败则返回失败提示
      success: function (res) {
        if (res.meta.status == 200) {
          mui.toast(res.meta.msg);
          getCartData();
        } else {
          //失败
          mui.toast(res.meta.msg);
        }
      }
    })
  }
})