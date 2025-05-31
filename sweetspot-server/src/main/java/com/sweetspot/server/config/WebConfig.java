package com.sweetspot.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/profile-images/**") // 요청 경로
                .addResourceLocations("file:uploads/profile-images/"); // 실제 파일 경로
        
        registry.addResourceHandler("/images/pin-images/**")
                .addResourceLocations("file:uploads/pin-images/");
        
        registry.addResourceHandler("/images/post-images/**")
                .addResourceLocations("file:uploads/post-images/");    
    }
}

