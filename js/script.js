(function($) {
  var GETCLASSES = "http://imoocnote.calfnote.com/inter/getClasses.php?curPage=1";

  $.ajaxSetup({
    error: function() {
      alert('调用接口失败');
      return false;
    }
  })
  function renderTemplate(templateSelector, data, htmlSelector) {
      var t = $(templateSelector).html();
      var f = Handlebars.compile(t);
      var h = f(data);
      $(htmlSelector).html(h);
  }

  function refreshClasses(curPage) {
    $.getJSON(GETCLASSES, {curPage: curPage}, function(data) {
      renderTemplate("#class-template", data.data, "#classes");
      renderTemplate("#page-template", formatPage(data), "#page");
    })
  }

  function showNote(show) {
    if(show) {
      $(".overlap").css("display", "block");
      $(".notedetail").css("display", "block");
    } else {
      $(".overlap").css("display", "none");
      $(".notedetail").css("display", "none");
    }
  }

  function bindPageEvent() {
    $("#page").on("click", "li.clickable", function() {
      $this = $(this);
      refreshClasses($this.data('id'));
    })
  }

  bindPageEvent();

  $.getJSON(GETCLASSES, {curPage: 1}, function(data) {
    renderTemplate("#class-template", data.data, "#classes");
    renderTemplate("#page-template", formatPage(data), "#page");
  })

  Handlebars.registerHelper("equal", function(v1, v2, options) {
    if(v1 == v2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })

  Handlebars.registerHelper("long", function(v, options) {
    if(v.indexOf('小时') != -1) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })

  function formatPage(pageData) {
    var arr = [];
    var total = parseInt(pageData.totalCount);
    var cur = parseInt(pageData.curPage);
    // 处理到首页的逻辑
    var toLeft =  {};
    toLeft.index = 1;
    toLeft.text = '&laquo;';
    if(cur != 1) {
      toLeft.clickable = true;
    }
    arr.push(toLeft);
    // 处理到上一页的逻辑
    var pre = {};
    pre.index = cur - 1;
    pre.text = '&lsaquo;';
    if(cur != 1) {
      pre.clickable = true;
    }
    arr.push(pre);
    // 处理到cur页前的逻辑
    if(cur <= 5) {
      for(var i=1; i<cur; i++) {
        var page = {};
        page.text = i;
        page.index = i;
        page.clickable = true;
        arr.push(page);
      }
    } else {
      // 如果cur>5，那么cur前的页要显示...
      var page = {};
      page.text = 1;
      page.index = 1;
      page.clickable = true;
      arr.push(page);
      var page = {};
      page.text = '...';
      arr.push(page);
      for(var i=cur-2; i< cur; i++) {
        var page = {};
        page.text = i;
        page.index = i;
        page.clickable = true;
        arr.push(page);
      }
    }
    // 处理到cur页的逻辑
    var page = {};
    page.text = cur;
    page.index = cur;
    page.cur = true;
    arr.push(page);
    // 处理到cur页后的逻辑
    if(cur >= total-4) {
      for(var i=cur+1; i<=total; i++) {
        var page = {};
        page.text = i;
        page.index = i;
        page.clickable = true;
        arr.push(page);
      }
    } else {
      // 如果cur<total-4，那么cur后的页要显示...
      for(var i=cur+1;i<=cur+2;i++) {
        var page = {};
        page.text = i;
        page.index = i;
        page.clickable = true;
        arr.push(page);
      }
      var page = {};
      page.text = "...";
      arr.push(page);
      var page = {};
      page.text = total;
      page.index = total;
      page.clickable = true;
      arr.push(page);
    }
    // 处理到下一页的逻辑
    var next = {};
    next.index = cur + 1;
    next.text = '&rsaquo;';
    if(cur != total) {
      next.clickable = true;
    }
    arr.push(next);
    // 处理到尾页的逻辑
    var toRight = {};
    toRight.index = total;
    toRight.text = '&raquo;';
    if(cur != total) {
      toRight.clickable = true;
    }
    arr.push(toRight);
    return arr;
  }
})(jQuery)
