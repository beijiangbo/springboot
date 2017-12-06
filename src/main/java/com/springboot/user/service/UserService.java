package com.springboot.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.user.dao.UserDao;
import com.springboot.user.entity.User;

@Service
public class UserService {

	@Autowired
	private UserDao userDao;
	
	public List<User> list(User user) {
		
		return userDao.list(user);
	}
}
