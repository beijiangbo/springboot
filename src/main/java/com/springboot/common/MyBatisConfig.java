package com.springboot.common;

import java.util.Properties;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.alibaba.druid.pool.DruidDataSource;
import com.github.pagehelper.PageHelper;

/**
  * springboot集成mybatis的基本入口
  * 1）创建数据源
  * 2）创建SqlSessionFactory
  */
@Configuration
@ComponentScan
public class MyBatisConfig {

	private static final Logger logger = LoggerFactory.getLogger(MyBatisConfig.class);

	@Autowired
    private Environment env;
	
	@Bean
    public DataSource getDataSource() {
		logger.info("-------加载数据库配置---------");
		DruidDataSource  dataSource = new DruidDataSource ();
        dataSource.setUrl(env.getProperty("jdbc.url"));
        dataSource.setUsername(env.getProperty("jdbc.username"));
        dataSource.setPassword(env.getProperty("jdbc.password"));
        dataSource.setDriverClassName(env.getProperty("jdbc.driverClassName"));
        return dataSource;
    }   
	
    @Bean
    public PageHelper pageHelper() {
        logger.info("-------加载分页插件PageHelper--------");
        PageHelper pageHelper = new PageHelper();
        Properties p = new Properties();
        p.setProperty("offsetAsPageNum", "true");
        p.setProperty("rowBoundsWithCount", "true");
        p.setProperty("reasonable", "true");
        pageHelper.setProperties(p);
        return pageHelper;
    }
    
}
