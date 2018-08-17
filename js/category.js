$(function () {
  // 后台返回来的数据
  var Datas;
  // 左侧的滚动条
  var LeftScroll;

  init();
  function init() {
    setHTML();
    eventList();
    getCategories();
  }

  function eventList() {
    //绑定左侧菜单的点击事件 委托!!!!
    $(".left").on("tap", "li", function () {
      /* 
      1 点击到li标签中的第n个  显示返回值中的第n个
      2 获取被点击的li标签的索引
       */

      // this 当前被点击的dom对象 li标签  js对象还是jq
      //  js
      //  var index=this.dataset.index;
      //  console.log(index);
      // jq
      var index = $(this).data("index");
      $(this).addClass("active").siblings().removeClass("active");
      // LeftScroll.scrollToElement(jsdom对象);
      // 往上滚动置顶
      LeftScroll.scrollToElement(this);
      renderRight(index);
    })

  }

  function getCategories() {
    $.get("categories", function (ret) {
      // console.log(ret);
      var html = template("leftTpl", { arr: ret.data });
      $(".left ul").html(html);
      // 只有容器元素的第一个子元素可以滚动 其他被忽略
      LeftScroll = new IScroll(".left");

      Datas = ret.data;
      renderRight(0);
    })
  }


  // 根据索引来渲染右侧的数据
  function renderRight(index) {
    // 渲染右侧数据 默认渲染 大家电 0 索引
    var arr = Datas[index].children;
    // console.log(arr);
    var html2 = template("rightTpl", { arr: arr });
    $(".right").html(html2);

    /* 
    1 标签都加载完了 图片一定就是加载完吗
      <img src="谷歌的地址">
    2 图片还没有加载回来 此时 图片标签 没有高度!!!
    3 要求初始化滚动条 必须要等到标签和图片都加载完了 图片标签都有高度了
      此时
     */

    // 假设要渲染的图片一共有100张 
    var nums = $(".right img").length;
    console.log(nums);
    // 最后一张(不是指索引最后) 图片都加载完了 自动去执行里面的代码!!!
    // 最后加载完的图片 
    $(".right img").on("load", function () {
      nums--;
      if (nums == 0) {
        console.log("===" + nums);
        console.log("初始化");
        new IScroll(".right");
      }
    })
  }

  // 根据屏幕的宽度动态设置html标签的fontsize
  function setHTML() {
    // 设计的宽度 / 基础值 = 要适配的屏幕的宽度 / fz
    // fz=要适配的屏幕的宽度*基础值/设计的宽度

    // 基础值
    var baseVal = 100;
    // 设计稿的宽度
    var pageWidth = 375;
    // 当前屏幕的宽度
    var screenWidth = document.querySelector("html").offsetWidth;
    // 要设置fontsize
    var fz = screenWidth * baseVal / pageWidth;

    // 赋值给HTML标签
    document.querySelector("html").style.fontSize = fz + "px";
  }

  window.onresize = function () {
    setHTML();
  }
})