package com.sweetspot.server.user;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sweetspot.server.user.DTO.UserLoginRequestDTO;
import com.sweetspot.server.user.DTO.UserLoginResponseDTO;
import com.sweetspot.server.user.DTO.UserRegisterDTO;
import com.sweetspot.server.user.DTO.UserRegisterPhoneNumberCheckRequestDTO;
import com.sweetspot.server.user.DTO.check.UserPasswordCheckRequestDTO;
import com.sweetspot.server.user.DTO.check.UserPasswordCheckResponseDTO;
import com.sweetspot.server.user.DTO.check.UserRegisterEmailCheckRequestDTO;
import com.sweetspot.server.user.DTO.update.UserImageUpdateDTO;
import com.sweetspot.server.user.DTO.update.UserNicknameUpdateDTO;
import com.sweetspot.server.user.DTO.update.UserPasswordUpdateRequestDTO;
import com.sweetspot.server.user.DTO.update.UserPasswordUpdateResponseDTO;

import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

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

    //회원가입
    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> registerUser(
            @RequestPart("user") UserRegisterDTO userDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        try {
            String uploadDir = "uploads/profile-images/";
            String fileUrl = null;
            String newFileName = null;

            if (file != null && !file.isEmpty()) {
                String originalFilename = file.getOriginalFilename();
                String ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
                newFileName = UUID.randomUUID().toString() + ext;
                Path savePath = Paths.get(uploadDir + newFileName);

                Files.createDirectories(savePath.getParent());
                Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
                fileUrl = "http://localhost:8080/images/profile-images/" + newFileName;

                userDTO.setProfileImageUrl(fileUrl);
                userDTO.setProfileImageName(newFileName);
            }

            UserEntity savedUser = userService.registerUser(userDTO);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>("파일 업로드 실패", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //회원가입, 이메일 중복 확인
    @PostMapping("/register/check/email")
    public ResponseEntity<?> checkEmailDuplicate(@RequestBody UserRegisterEmailCheckRequestDTO emailDTO) {
        Map<String, String> response = new HashMap<>();
        
        boolean exists = userService.existsByEmail(emailDTO.getEmail());
        if (exists) {
            response.put("message", "이미 사용 중인 이메일입니다.");
            response.put("available", "false");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        response.put("message", "사용 가능한 이메일입니다.");
        response.put("available", "true");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //회원가입, 전화번호 중복 확인
    @PostMapping("/register/check/phone")
    public ResponseEntity<?> checkPhoneDuplicate(@RequestBody UserRegisterPhoneNumberCheckRequestDTO phoneDTO) {
        Map<String, String> response = new HashMap<>();

        boolean exists = userService.existsByPhoneNumber(phoneDTO.getPhoneNumber());
        if (exists) {
            response.put("message", "이미 사용 중인 전화번호입니다.");
            response.put("available", "false");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        response.put("message", "사용 가능한 전화번호입니다.");
        response.put("available", "true");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequestDTO loginRequest, HttpSession session) {
        UserEntity user = userService.getUserByEmail(loginRequest.getEmail());

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "이메일 또는 비밀번호가 잘못되었습니다.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        session.setAttribute("user", user.getUserId());

        UserLoginResponseDTO responseDTO = new UserLoginResponseDTO(
            user.getUserId(),
            user.getEmail(),
            user.getNickname(),
            user.getPhoneNumber(),
            user.isPhoneVerified(),
            user.getCreatedAt(),
            user.getProfileImageUrl() // 프로필 이미지 포함
        );

        return ResponseEntity.ok(responseDTO);
    }

    //로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpSession session) {
        Map<String, String> response = new HashMap<>();

        if (session.getAttribute("user") != null) {
            session.invalidate(); // 세션 무효화 (로그아웃)
            response.put("message", "로그아웃 성공");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "이미 로그아웃된 상태입니다.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
    
    //사용자 프로필 이미지 교체
    @PostMapping(value = "/update/image", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestPart("user") UserImageUpdateDTO userData,
            @RequestPart("file") MultipartFile file) {

        try {
            String uploadDir = "uploads/profile-images/";
            String originalFilename = file.getOriginalFilename();

            // 확장자 추출 (예: .png, .jpg 등)
            String ext = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex != -1) {
                ext = originalFilename.substring(dotIndex);  // 포함된 점(.)부터 끝까지
            }

            // UUID + 확장자로 새 파일 이름 생성
            String newFileName = UUID.randomUUID().toString() + ext;
            Path savePath = Paths.get(uploadDir + newFileName);

            Files.createDirectories(savePath.getParent());
            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "http://localhost:8080/images/profile-images/" + newFileName;

            userService.saveUserProfileImageUrl(userData.getUserId(), fileUrl, newFileName, uploadDir);

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("userId", String.valueOf(userData.getUserId()));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 사용자 프로필 이미지 삭제
    @PostMapping("/image/delete")
    public ResponseEntity<Map<String, String>> deleteProfileImage(@RequestBody UserImageUpdateDTO userData) {
        try {
            String uploadDir = "uploads/profile-images/";
            userService.deleteUserProfileImage(userData.getUserId(), uploadDir);

            Map<String, String> response = new HashMap<>();
            response.put("message", "프로필 이미지가 성공적으로 삭제되었습니다.");
            response.put("userId", String.valueOf(userData.getUserId()));

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //사용자 닉네임 변경/업데이트
    @PutMapping("/update/nickname")
    public ResponseEntity<?> updateNickname(@RequestBody UserNicknameUpdateDTO dto) {
        try {
            UserEntity updatedUser = userService.updateNickname(dto.getUserId(), dto.getNewNickname());

            Map<String, String> response = new HashMap<>();
            response.put("message", "닉네임이 성공적으로 변경되었습니다.");
            response.put("userId", String.valueOf(updatedUser.getUserId()));
            response.put("nickname", updatedUser.getNickname());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    //비밀번호 확인
    @PostMapping("/check/password")
    public ResponseEntity<UserPasswordCheckResponseDTO> checkPassword(@RequestBody UserPasswordCheckRequestDTO request) {
        try {
            boolean isMatch = userService.checkPassword(request.getUserId(), request.getPassword());

            if (isMatch) {
                return ResponseEntity.ok(new UserPasswordCheckResponseDTO(true, "비밀번호가 일치합니다."));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new UserPasswordCheckResponseDTO(false, "비밀번호가 일치하지 않습니다."));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new UserPasswordCheckResponseDTO(false, e.getMessage()));
        }
    }

    @PostMapping("/update/password")
    public ResponseEntity<UserPasswordUpdateResponseDTO> updatePassword(
            @RequestBody UserPasswordUpdateRequestDTO request) {

        try {
            userService.updatePassword(request.getUserId(), request.getNewPassword());
            return ResponseEntity.ok(new UserPasswordUpdateResponseDTO(true, "비밀번호가 성공적으로 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new UserPasswordUpdateResponseDTO(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UserPasswordUpdateResponseDTO(false, "비밀번호 변경 중 오류가 발생했습니다."));
        }
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
