<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="keywords" content="index">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp" />
<meta name="apple-mobile-web-app-title" content="Amaze UI" />
<title>Bootstrap后台管理</title>
<!-- 引入CSS样式文件 -->
<link rel="icon" type="image/png" href="/static/image/favicon.png">
<link rel="apple-touch-icon-precomposed" href="/static/image/app-icon72x72@2x.png">
<!-- <link rel="stylesheet" href="//cdn.bootcss.com/tether/1.3.6/css/tether.min.css"/>
<link rel="stylesheet" href="/static/plugin/bootstrap-4.0/css/bootstrap.min.css"/> -->
<link rel="stylesheet" type="text/css" href="/static/css/amazeui.min.css"/>
<link rel="stylesheet" type="text/css" href="/static/css/admin.css">
<!-- 引入JAVASCRIPT脚本文件 -->
<script type="text/javascript" src="/static/plugin/jquery/jquery.min.js"></script>
<script type="text/javascript" src="/static/plugin/angular-1.6/angular.min.js"></script>
<script type="text/javascript" src="/static/plugin/angular-1.6/angular-route.min.js"></script>
<script type="text/javascript" src="/static/plugin/angular-1.6/angular-resource.min.js"></script>
<!-- <script type="text/javascript" src="//cdn.bootcss.com/tether/1.3.6/js/tether.min.js"></script>
<script type="text/javascript" src="/static/plugin/bootstrap-4.0/js/bootstrap.min.js"></script> -->
<!-- 引入模板脚本 -->
<script type="text/javascript" src="/static/js/app.js"></script>
<script type="text/javascript" src="/static/js/amazeui.min.js"></script>
<!-- 引入项目脚本 -->
<script type="text/javascript" src="/static/js/route-config.js"></script>
<script type="text/javascript" src="/static/js/controller/index.js"></script>
<script type="text/javascript" src="/static/js/controller/goods/add.js"></script>
<script type="text/javascript" src="/static/js/controller/goods/type.js"></script>
<script type="text/javascript" src="/static/js/controller/goods/goods.js"></script>
<script type="text/javascript" src="/static/js/controller/order/order.js"></script>
</head>
<body ng-app="springbootApp">
	<header class="am-topbar admin-header">
	  <div class="am-topbar-brand"><img src="/static/image/logo.png"></div>
	  <div class="am-collapse am-topbar-collapse" id="topbar-collapse">
	    <ul class="am-nav am-nav-pills am-topbar-nav admin-header-list">
		   	<li class="am-dropdown tognzhi" data-am-dropdown>
			  	<button class="am-btn am-btn-primary am-dropdown-toggle am-btn-xs am-radius am-icon-bell-o" data-am-dropdown-toggle> 消息管理<span class="am-badge am-badge-danger am-round">6</span></button>
			 	<ul class="am-dropdown-content">
				    <li class="am-dropdown-header">所有消息都在这里</li>
				    <li><a href="#">未激活会员 <span class="am-badge am-badge-danger am-round">3</span></a></li>
				    <li><a href="#">未激活代理 <span class="am-badge am-badge-danger am-round">2</span></a></a></li>
				    <li><a href="#">未处理汇款</a></li>
				    <li><a href="#">未发放提现</a></li>
				    <li><a href="#">未发货订单</a></li>
				    <li><a href="#">低库存产品</a></li>
				    <li><a href="#">信息反馈</a></li>
			    </ul>
			</li>
			<li class="kuanjie">
			 	<a href="#">会员管理</a>          
			 	<a href="#">奖金管理</a> 
			 	<a href="#">订单管理</a>   
			 	<a href="#">产品管理</a> 
			 	<a href="#">个人中心</a> 
			 	<a href="#">系统设置</a>
			</li>
			<li class="soso">
				<p>   
					<select data-am-selected="{btnWidth: 70, btnSize: 'sm', btnStyle: 'default'}">
			          <option value="b">全部</option>
			          <option value="o">产品</option>
			          <option value="o">会员</option>
			        </select>
				</p>
				<p class="ycfg"><input type="text" class="am-form-field am-input-sm" placeholder="圆角表单域" /></p>
				<p><button class="am-btn am-btn-xs am-btn-default am-xiao"><i class="am-icon-search"></i></button></p>
			</li>
	      	<li class="am-hide-sm-only" style="float: right;"><a href="javascript:;" id="admin-fullscreen"><span class="am-icon-arrows-alt"></span> <span class="admin-fullText">开启全屏</span></a></li>
	     </ul>
	  </div>
	</header>
	<div class="am-cf admin-main"> 
		<div class="nav-navicon admin-main admin-sidebar">
		    <div class="sideMenu am-icon-dashboard" style="color:#aeb2b7; margin: 10px 0 0 0;"> 欢迎系统管理员：清风抚雪</div>
		    <div class="sideMenu">
		      <h3 class="am-icon-flag"><em></em><a href="#"> 商品管理</a></h3>
		      <ul>
		        <li><a href="#!/goods/list">商品列表</a></li>
		        <li><a href="#!/goods/add">添加新商品</a></li>
		        <li><a href="#!/goods/type">商品分类</a></li>
		        <li>用户评论</li>
		        <li>商品回收站</li>
		        <li>库存管理 </li>
		      </ul>
		      <h3 class="am-icon-cart-plus"><em></em><a href="#"> 订单管理</a></h3>
		      <ul>
		        <li>订单列表</li>
		        <li>合并订单</li>
		        <li>订单打印</li>
		        <li>添加订单</li>
		        <li>发货单列表</li>
		        <li>换货单列表</li>
		      </ul>
		      <h3 class="am-icon-users"><em></em><a href="#"> 会员管理</a></h3>
		      <ul>
		        <li>会员列表 </li>
		        <li>未激活会员</li>
		        <li>团队系谱图</li>
		        <li>会员推荐图</li>
		        <li>推荐列表</li>
		      </ul>
		      <h3 class="am-icon-volume-up"><em></em><a href="#"> 信息通知</a></h3>
		      <ul>
		        <li>站内消息 /留言 </li>
		        <li>短信</li>
		        <li>邮件</li>
		        <li>微信</li>
		        <li>客服</li>
		      </ul>
		      <h3 class="am-icon-gears"><em></em><a href="#"> 系统设置</a></h3>
		      <ul>
		        <li>数据备份</li>
		        <li>邮件/短信管理</li>
		        <li>上传/下载</li>
		        <li>权限</li>
		        <li>网站设置</li>
		        <li>第三方支付</li>
		        <li>提现 /转账 出入账汇率</li>
		        <li>平台设置</li>
		        <li>声音文件</li>
		      </ul>
		    </div>
		</div>
		<div class="admin-content">
			<!-- Content Start -->
			<ng-view></ng-view>
			<!-- Content End -->
		</div>
	</div>
	<script type="text/javascript">
		$(".sideMenu").slide({
			titCell:"h3", //鼠标触发对象
			targetCell:"ul", //与titCell一一对应，第n个titCell控制第n个targetCell的显示隐藏
			effect:"slideDown", //targetCell下拉效果
			delayTime:300 , //效果时间
			triggerTime:150, //鼠标延迟触发时间（默认150）
			defaultPlay:true,//默认是否执行效果（默认true）
			returnDefault:true //鼠标从.sideMen移走后返回默认状态（默认false）
		});
		$(".slideTxtBox").slide();
	</script>
</body>
</html>