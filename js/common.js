$(function () {

  var BaseUrl = " http://api.pyg.ak48.xyz/";
  // 导入模板变量
  template.defaults.imports.iconUrl = BaseUrl;
  // 修改接口的使用方式
  // 拦截器 
  // 在每一次发送请求 之前对请求做一些处理 
  // 发送请求之前,提前对于 接口的url进行处理 
  // var oobj={};
  // $.ajax(oobj);
  // http://api.pyg.ak48.xyz/api/public/v1/  +   home/swiperdata

  // 发送请求的个数
  var ajaxNums = 0;
  $.ajaxSettings.beforeSend = function (xhr, obj) {
    obj.url = BaseUrl + "api/public/v1/" + obj.url;
    // console.log(obj.url);
    ajaxNums++;
    $("body").addClass("wait");
  }

  // 获得返回值之后会调用一次
  $.ajaxSettings.complete = function () {
    // console.log("请求回来了");
    // 同时发送了3个请求  要求=> 最后一个请求 再去隐藏!!! 
    // 第一个请求回来   做隐藏
    // 外面还两个请求还没有回来

    ajaxNums--;
    if (ajaxNums == 0) {
      // 最后一个请求了!!!
      $("body").removeClass("wait");
    }

  }

  // 拓展zepto-> 给$对象添加自定义的属性或者方法 
  $.extend($, {
    getURLValue: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    },
    checkPhone: function (phone) {
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        return false;
      } else {
        return true;
      }
    },
    checkEmail: function (myemail) {　　
      var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
      if (myReg.test(myemail)) {　　　　
        return true;　　
      } else {　　　　
        return false;
      }
    },
    checkLogin: function () {
      // 判断永久存储中有没有userinfo
      return localStorage.getItem("userinfo");
    },
    token: function () {
      //如果userinfo 存在 返回token 否则返回 ""
      var token;
      if (!localStorage.getItem("userinfo")) {
        token = "";
      } else {
        token = JSON.parse(localStorage.getItem("userinfo")).token;
      }
      return token;
    },
    // 把页面的url从 会话存储 中取出
    getPage: function () {
      return sessionStorage.getItem("pageName");
    },
    // 把用户信息存放到 永久存储 中
    setUser: function (obj) {
      localStorage.setItem("userinfo", JSON.stringify(obj));
    },
    // 从 永久存储 中取出 用户信息
    getUser: function () {
      return localStorage.getItem("userinfo") ? JSON.parse(localStorage.getItem("userinfo")) : false;
    },
    // 删除永久存储中的userinfo数据
    removeUser: function () {
      localStorage.removeItem("userinfo");
    }
  });
})