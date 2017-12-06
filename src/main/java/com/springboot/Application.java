package com.springboot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;

@SpringBootApplication
@MapperScan("com.springboot.*.dao")
@EnableCaching
public class Application extends SpringBootServletInitializer implements CommandLineRunner{

	@Autowired
    private Environment env;
	
	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }
	
	@Bean
	public EmbeddedServletContainerCustomizer containerCustomizer() {

	   return (container -> {
	        ErrorPage error401Page = new ErrorPage(HttpStatus.UNAUTHORIZED, "/401.html");
	        ErrorPage error404Page = new ErrorPage(HttpStatus.NOT_FOUND, "/404.html");
	        ErrorPage error500Page = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/500.html");
	        container.addErrorPages(error401Page, error404Page, error500Page);
	   });
	}
	
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

	@Override
	public void run(String... args) throws Exception {
		System.out.println("-------------加载Spring-Boot项目-------------");
	}
}
