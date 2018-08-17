$(function () {
  init();
  function init() {
    eventList();
  }

  function eventList() {
    // 获取验证
    $("#code_btn").on("tap", function () {
      /* 
      1 获取手机号码->  合法性的验证
      2 验证不通过 给出用户提示 同时 return
      3 通过 -> 
        1 发送请求 
        1.5 成功了 
        2 按钮禁用
        3 显示倒计时 到了  去除 禁用 重新 设置按钮的文本
       */

      var mobile_txt = $("[name='mobile']").val().trim();
      //  通过js来打断点 debugger
      
      // 判断合法性
      if(!$.checkPhone(mobile_txt)){
        
        // mui 提示框
        mui.toast("手机非法");
        return;
      }

      $.post("users/get_reg_code",{
        mobile:mobile_txt
      },function (ret) {
       if(ret.meta.status==200){
         // 成功
         console.log(ret.data);
         $("#code_btn").attr("disabled","disabled");

         // 要到计的时间
         var times=5;
         $("#code_btn").text(times+"秒之后再获取");
         // 开启倒计时
         var timeId=setInterval(function () {
          times--;
          $("#code_btn").text(times+"秒之后再获取");

          // 时间到了
          if(times==0){
            clearInterval(timeId);
            $("#code_btn").text("获取验证码");
            $("#code_btn").removeAttr("disabled");

          }
         },1000);
       }else{
         mui.toast(ret.meta.msg)
       }
        
      })

    })

    // 点击注册
    $("#reg_btn").on("tap",function () {
     /* 
     1 获取一坨输入框的值 挨个 去验证
     2 验证失败 给出用户提示  return
     3 通过  构造参数发送
     4 返回值 成功 => 1 给出用户提示 2 稍等 再跳转页面-登录 
     5       失败 => 1 给出提示 
      */

      var mobile_txt=$("[name='mobile']").val().trim();
      var code_txt=$("[name='code']").val().trim();
      var email_txt=$("[name='email']").val().trim();
      var pwd_txt=$("[name='pwd']").val().trim();
      var pwd2_txt=$("[name='pwd2']").val().trim();
      var gender_txt=$("[name='gender']:checked").val().trim();
      
        // 判断手机合法性
        if(!$.checkPhone(mobile_txt)){
        
          // mui 提示框
          mui.toast("手机非法");
          return;
        }

        // 验证验证码 长度不为4 就是非法!!!
        if(code_txt.length!=4){
          mui.toast("验证码不合法");
          return;
        }

        // 验证邮箱
        if(!$.checkEmail(email_txt)){
          mui.toast("邮箱非法")
          return;
        }

        // 验证密码 长度小于6 非法
        if(pwd_txt.length<6){
          mui.toast("密码不合法");
          return;
        }

        // 验证重复密码  两个密码不一致 非法
        if(pwd_txt!=pwd2_txt){
          mui.toast("两次密码不一致");
          return;
        }

        // 发送请求
        // 请求路径：http://api.pyg.ak48.xyz/api/public/v1/users/reg
// 参数名	参数说明	备注
// mobile	手机号	必填
// code	验证码	必填
// email	邮箱	必填
// pwd	密码	必填
// gender	性别	必填
// 响应数据
          $.post("users/reg",{
            mobile:mobile_txt,
            code:code_txt,
            email:email_txt,
            pwd:pwd_txt,
            gender:gender_txt
          },function (ret) {
            if(ret.meta.status==200){
              mui.toast(ret.meta.msg);
              setTimeout(function () {
                location.href="/pages/login.html";
              },1000);
            }else{
              mui.toast(ret.meta.msg);
            }
            
          })
    })
  }

})