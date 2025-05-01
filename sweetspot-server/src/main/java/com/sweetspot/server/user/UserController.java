package com.sweetspot.server.user;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.sweetspot.server.user.DTO.UserLoginRequestDTO;
import com.sweetspot.server.user.DTO.UserSignUpDTO;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    //@Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // 사용자 등록 API
    @PostMapping("/register")
    public ResponseEntity<UserEntity> registerUser(@RequestBody UserSignUpDTO userDTO) {
        try {
            UserEntity userEntity = userService.registerUser(userDTO);
            return new ResponseEntity<>(userEntity, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequestDTO loginRequest, HttpSession session) {
        UserEntity user = userService.getUserByEmail(loginRequest.getEmail());
        
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return new ResponseEntity<>("이메일 또는 비밀번호가 잘못되었습니다.", HttpStatus.UNAUTHORIZED);
        }

        session.setAttribute("user", user.getUserId()); // 세션에 사용자 ID 저장
        return ResponseEntity.ok("로그인 성공");
    }


    /*
    // 이메일로 사용자 조회 API
    @GetMapping("/email/{email}")
    public ResponseEntity<UserEntity> getUserByEmail(@PathVariable String email) {
        UserEntity userEntity = userService.getUserByEmail(email);
        if (userEntity != null) {
            return new ResponseEntity<>(userEntity, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // 전화번호로 사용자 조회 API
    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<UserEntity> getUserByPhoneNumber(@PathVariable String phoneNumber) {
        UserEntity userEntity = userService.getUserByPhoneNumber(phoneNumber);
        if (userEntity != null) {
            return new ResponseEntity<>(userEntity, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // 사용자 정보 업데이트 API
    @PutMapping("/{userId}")
    public ResponseEntity<UserEntity> updateUser(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        try {
            UserEntity updatedUser = userService.updateUser(userId, userDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
     */
}
