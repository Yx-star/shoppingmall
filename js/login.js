$(function () {
  init();
  function init() {
    
    eventList();
  }

  function eventList() {
    
    // 注册登录事件
    $("#login_btn").on("tap",function () {
      /* 
      1 验证值合法性
      2 非法 给出提示
      3 合法 跳转页面 暂时 index.html
       */
      var mobile_txt=$("[name='mobile']").val().trim();
      var pwd=$("[name='pwd']").val().trim();

      // 验证手机号码
      if(!$.checkPhone(mobile_txt)){
        mui.toast("手机非法");
        return;
      }

      // 验证密码 长度小于6 个 非法
      if(pwd.length<6){
        mui.toast("密码非法");
        return;
      }

      // console.log("ok");
      $.post("login",{
        username:mobile_txt,
        password:pwd
      },function (ret) {

        // 成功
        if(ret.meta.status==200){
          // 提示
          mui.toast(ret.meta.msg);
          /* 
          本地存储复习
          1 sessionStorage  会话存储 浏览器一关闭 就不存在 
          2 localStorage 永久存储 除非手动删除否则一直存在
          3 api
              setItem(key,val) 设置值
              getItem(key)
              removeItem(key)
              clear() 清空
          4 存储的数据类型
            1 当存的简单类型 => 全部先转成字符串格式 
            2 当存的复杂类型   '[object object]'
                先转成json字符串 再存储 
                JSON.stringify(obj)
            3 取数据(复杂类型) 
                字符串 先解析成原来的状态 
                JSON.parse()
           */
          //把用户信息永久存入到存储中
          localStorage.setItem("userinfo",JSON.stringify(ret.data));
          setTimeout(function () {
            //判断有没有来源页面
            var pageName = sessionStorage.getItem("pageName");
            console.log(pageName);
            if (pageName) {
              location.href = pageName;
            }else{
              location.href="/index.html";
            }
          },1000)
        }else{
          mui.toast(ret.meta.msg);
        }
      })
      
    })
    
  }
  
})