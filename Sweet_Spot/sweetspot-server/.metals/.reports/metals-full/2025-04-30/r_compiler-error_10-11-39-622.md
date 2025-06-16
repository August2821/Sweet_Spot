file://<WORKSPACE>/src/main/java/com/sweetspot/server/config/SecurityConfig.java
### java.lang.OutOfMemoryError: Java heap space

occurred in the presentation compiler.

presentation compiler configuration:


action parameters:
uri: file://<WORKSPACE>/src/main/java/com/sweetspot/server/config/SecurityConfig.java
text:
```scala
package com.sweetspot.server.config;

// import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    //     http
    //         .csrf().disable() // 개발 중에는 CSRF 비활성화
    //         .authorizeHttpRequests((authz) -> authz
    //             .requestMatchers("/**").permitAll() // 전체 요청 허용
    //         )
    //         .formLogin().disable(); // 기본 로그인 페이지 비활성화

    //     return http.build();
    // }
}

```



#### Error stacktrace:

```

```
#### Short summary: 

java.lang.OutOfMemoryError: Java heap space