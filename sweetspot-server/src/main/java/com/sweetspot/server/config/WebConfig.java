package com.sweetspot.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 정적 리소스 경로
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/profile-images/**")
                .addResourceLocations("file:uploads/profile-images/");
        registry.addResourceHandler("/images/pin-images/**")
                .addResourceLocations("file:uploads/pin-images/");
        registry.addResourceHandler("/images/post-images/**")
                .addResourceLocations("file:uploads/post-images/");
    }

    // ✅ CORS 설정 추가
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000") // React 서버 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // 인증 정보 포함 허용 (로그인 관련 시 필수)
    }
}
