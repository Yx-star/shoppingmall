$(function () {

  init();
  function init() {

    getSwiperData();
    getCatitems();
    getGoodslist();
  }


  // 获取轮播图数据
  function getSwiperData() {
    // http://api.pyg.ak48.xyz/api/public/v1/home/swiperdata
    $.get("home/swiperdata", function (ret) {

      var html = template("swiperTpl", { arr: ret.data });
      $(".mui-slider").html(html);
      // 初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
      });
    })
  }

  // 获取首页导航菜单
  function getCatitems() {
    $.get("home/catitems", function (ret) {
      // console.log(ret);
      var html = template("navTpl", { arr: ret.data });
      $(".index_nav").html(html);

    })

  }

  // 首页商品列表
  function getGoodslist() {
    $.get("home/goodslist",function (ret) {
      // console.log(ret);

      var html=template("goodsTpl",{arr:ret.data});
      $(".index_goodlist").html(html);
      
    })
    
  }
})