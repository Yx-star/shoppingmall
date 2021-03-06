$(function () {
  // 查询参数
  var QueryObj = {
    query: "",
    cid: $.getURLValue("cid"),
    pagenum: 1,
    pagesize: 6
  };
  // 总的页数
  var totalPage = 1;


  init()
  function init() {
    eventList();
    mui.init({
      pullRefresh: {
        container: ".pyg_view",
        down: {
          auto: true,
          callback: function () {
            // 发送ajax请求 获取数据 动态渲染=> 结束下拉刷新组件 
            $(".pyg_view ul").html("");
            QueryObj.pagenum = 1;
            // 重置上拉刷新组件!!! 
            search(function () {
              mui('.pyg_view').pullRefresh().endPulldownToRefresh();
              // 重置 上拉组件
              mui('.pyg_view').pullRefresh().refresh(true);
            });
          }
        },
        up: {
          callback: function () {
            /* 
            1 判断还没有下一页 有 QueryObj.pagenum++;
            2 没有了 不执行了!! 
            3 计算总页数 
              totalPage=Math.ceil(total/QueryObj.pagesize)
            4 当前页码和总页数做判断 
             */

            if (QueryObj.pagenum >= totalPage) {
              console.log("没有数据了 不再执行");
              //  // 结束上拉加载更多 如果没有数据 传入 true 否则 传入 false
              mui('.pyg_view').pullRefresh().endPullupToRefresh(true);
              return;
            } else {
              QueryObj.pagenum++;
              search(function () {
                console.log($(".pyg_view li").length);
                mui('.pyg_view').pullRefresh().endPullupToRefresh();
              });
            }
          }
        }
      }
    });
  }

  function eventList() {

    // 给内容里面的a标签绑定tap
    $(".pyg_view").on("tap","a",function () {
      // console.log("aaa");
      var href=this.href;
      // console.log(href);
      location.href=href;
      
    })
    
  }



  // 获取列表数据
  // callback 为了 可以自定义结束下拉还是上拉 
  function search(callback) {
    $.get("goods/search", QueryObj, function (ret) {
      // 总页数
      totalPage = Math.ceil(ret.data.total / QueryObj.pagesize);
      console.log("总页数" + totalPage);

      var html = template("mainTpl", { arr: ret.data.goods });
      // 为了加载下一页 目的 不断的去appen 追加
      $(".pyg_view ul").append(html);

      callback && callback();

    })

  }
})