package com.springboot.user.dao;

import java.util.List;

import com.springboot.user.entity.User;

/**
 * @author jiangbo.bei
 */
public interface UserDao {

	public List<User> list(User user);
}
