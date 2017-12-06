package com.springboot.user.action;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.user.entity.User;
import com.springboot.user.service.UserService;

@RestController
@RequestMapping(value = "/user")
public class UserAction {

	@Autowired
	private UserService userService;
	
	@RequestMapping(value = "/list")
    public List<User> user(){
        return userService.list(null);
    }

}
