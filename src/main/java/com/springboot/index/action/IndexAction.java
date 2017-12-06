package com.springboot.index.action;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.springboot.common.MyBatisConfig;
import com.springboot.common.RedisUtils;
import com.springboot.user.entity.User;
import com.springboot.user.service.UserService;

@Controller
@RequestMapping(value = "")
public class IndexAction {

	private static final Logger logger = LoggerFactory.getLogger(MyBatisConfig.class);
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private RedisUtils redisUtils;
	
	@RequestMapping(value = "/home")
	public String index(ModelMap model) {
		List<User> userList = userService.list(null);
		logger.info("-------redis缓存测试开始---------");
		redisUtils.set("test", "redis缓存测试内容！");
		logger.info("-------"+redisUtils.get("test")+"---------");
		logger.info("-------redis缓存测试结束---------");
		model.addAttribute("userList", userList);
		return "/index";
	} 
}
