package com.sweetspot.server.user;

import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sweetspot.server.user.DTO.UserSignUpDTO;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //@Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 사용자 등록
    @Transactional
    public UserEntity registerUser(UserSignUpDTO userDTO) {
        // 이메일 중복 확인
        if (userRepository.findByEmail(userDTO.getEmail()) != null) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }

        // 전화번호 중복 확인
        if (userRepository.findByPhoneNumber(userDTO.getPhoneNumber()) != null) {
            throw new IllegalArgumentException("이미 등록된 전화번호입니다.");
        }

        // UserEntity 생성 후 저장
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setPassword(passwordEncoder.encode(userDTO.getPassword()));        userEntity.setNickname(userDTO.getNickname());
        userEntity.setPhoneNumber(userDTO.getPhoneNumber());
        userEntity.setPhoneVerified(userDTO.isPhoneVerified());
        userEntity.setCreatedAt(userDTO.getCreatedAt());
        
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

    // 사용자 정보 업데이트
    @Transactional
    public UserEntity updateUser(Long userId, UserSignUpDTO userDTO) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userEntity.setNickname(userDTO.getNickname());
        userEntity.setPhoneNumber(userDTO.getPhoneNumber());
        userEntity.setPhoneVerified(userDTO.isPhoneVerified());
        userEntity.setCreatedAt(userDTO.getCreatedAt());

        return userRepository.save(userEntity);
    }
}
