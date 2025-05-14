package com.sweetspot.server.user;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sweetspot.server.user.DTO.UserRegisterDTO;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;

    //@Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 사용자 등록
    @Transactional
    public UserEntity registerUser(UserRegisterDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()) != null) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }

        if (userRepository.findByPhoneNumber(userDTO.getPhoneNumber()) != null) {
            throw new IllegalArgumentException("이미 등록된 전화번호입니다.");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userEntity.setNickname(userDTO.getNickname());
        userEntity.setPhoneNumber(userDTO.getPhoneNumber());
        userEntity.setPhoneVerified(userDTO.isPhoneVerified());
        userEntity.setCreatedAt(userDTO.getCreatedAt());
        userEntity.setProfileImageUrl(userDTO.getProfileImageUrl());
        userEntity.setProfileImageName(userDTO.getProfileImageName());

        return userRepository.save(userEntity);
    }

    // 이메일로 사용자 찾기
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 전화번호로 사용자 찾기
    public UserEntity getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    //이메일 중복 확인
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    //전화번호 중복 확인
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    //사용자 프로필 이미지 교체
    public void saveUserProfileImageUrl(Long userId, String fileUrl, String fileName, String uploadDir) throws IOException {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        /// 기존 이미지 파일이 있다면 삭제
        if (user.getProfileImageName() != null) {
            Path existingPath = Paths.get(uploadDir + user.getProfileImageName());
            Files.deleteIfExists(existingPath);
        }

        user.setProfileImageUrl(fileUrl); // 새 이미지 URL 저장
        user.setProfileImageName(fileName); //이미지 파일 이름 저장
        userRepository.save(user);
    }

    //사용자 프로필 이미지 삭제
    @Transactional
    public void deleteUserProfileImage(Long userId, String uploadDir) throws IOException {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProfileImageUrl() != null && user.getProfileImageName() != null) {
            Path imagePath = Paths.get(uploadDir + user.getProfileImageName());
            Files.deleteIfExists(imagePath); // 로컬 파일 삭제
        }

        // DB에서 URL과 파일 이름 제거
        user.setProfileImageUrl(null);
        user.setProfileImageName(null);
        userRepository.save(user);
    }

    //사용자 닉네임 업데이트
    @Transactional
    public UserEntity updateNickname(Long userId, String newNickname) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setNickname(newNickname);
        return userRepository.save(user);
    }

    public boolean checkPassword(Long userId, String rawPassword) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    @Transactional
    public void updatePassword(Long userId, String newPassword) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    // 사용자 정보 업데이트
    // @Transactional
    // public UserEntity updateUser(Long userId, UserRegisterDTO userDTO) {
    //     UserEntity userEntity = userRepository.findById(userId)
    //             .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
    //     userEntity.setEmail(userDTO.getEmail());
    //     userEntity.setPassword(passwordEncoder.encode(userDTO.getPassword()));
    //     userEntity.setNickname(userDTO.getNickname());
    //     userEntity.setPhoneNumber(userDTO.getPhoneNumber());
    //     userEntity.setPhoneVerified(userDTO.isPhoneVerified());
    //     userEntity.setCreatedAt(userDTO.getCreatedAt());

    //     return userRepository.save(userEntity);
    // }
}
