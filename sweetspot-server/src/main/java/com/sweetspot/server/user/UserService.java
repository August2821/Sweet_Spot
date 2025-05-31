package com.sweetspot.server.user;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sweetspot.server.comment.CommentEntity;
import com.sweetspot.server.comment.CommentRepository;
import com.sweetspot.server.comment.like.CommentLikeEntity;
import com.sweetspot.server.comment.like.CommentLikeRepository;
import com.sweetspot.server.post.MapPostEntity;
import com.sweetspot.server.post.MapPostRepository;
import com.sweetspot.server.post.like.PostLikeEntity;
import com.sweetspot.server.post.like.PostLikeRepository;
import com.sweetspot.server.user.DTO.UserCommentDTO;
import com.sweetspot.server.user.DTO.UserInfoResponseDTO;
import com.sweetspot.server.user.DTO.UserLikedCommentDTO;
import com.sweetspot.server.user.DTO.UserLikedPostDTO;
import com.sweetspot.server.user.DTO.UserPostSummaryDTO;
import com.sweetspot.server.user.DTO.UserRegisterDTO;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MapPostRepository mapPostRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentLikeRepository commentLikeRepository;

    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
        MapPostRepository mapPostRepository, CommentRepository commentRepository,
        PostLikeRepository postLikeRepository, CommentLikeRepository commentLikeRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapPostRepository = mapPostRepository;
        this.commentRepository = commentRepository;
        this.postLikeRepository = postLikeRepository;
        this.commentLikeRepository = commentLikeRepository;
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

    //비밀번호 확인
    public boolean checkPassword(Long userId, String rawPassword) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    //비밀번호 업데이트
    @Transactional
    public void updatePassword(Long userId, String newPassword) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    //사용자 정보 조회
    public UserInfoResponseDTO getUserInfoWithPosts(Long userId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        //작성한 게시글
        List<MapPostEntity> posts = mapPostRepository.findByUserId(userId);
        List<UserPostSummaryDTO> postDTOs = posts.stream()
            .map(post -> new UserPostSummaryDTO(
                post.getPostId(),
                post.getTitle(),
                post.getUpdatedAt(),
                post.getLikes()))
            .toList();
        
        //작성한 댓글
        List<UserCommentDTO> comments = commentRepository.findByUserId(userId).stream()
        .map(comment -> new UserCommentDTO(
            comment.getCommentId(), 
            comment.getPostId(),
            comment.getContent(), 
            comment.getUpdatedAt(), 
            comment.getLikes()))
        .collect(Collectors.toList());

        // 좋아요 누른 게시글 목록
        List<PostLikeEntity> likedEntities = postLikeRepository.findByUserId(userId);

        List<UserLikedPostDTO> likedPostDTOs = likedEntities.stream()
            .map(like -> {
                MapPostEntity post = mapPostRepository.findById(like.getPostId())
                        .orElse(null);
                if (post == null) return null;

                UserEntity author = userRepository.findById(post.getUserId())
                        .orElse(null);
                if (author == null) return null;

                return new UserLikedPostDTO(
                        post.getPostId(),
                        post.getTitle(),
                        post.getUpdatedAt(),
                        post.getLikes(),
                        author.getUserId(),
                        author.getNickname()
                );
            })
            .filter(dto -> dto != null)
            .collect(Collectors.toList());

        //좋아요 누른 댓글 목록
        List<CommentLikeEntity> likedCommentEntities = commentLikeRepository.findByUserId(userId);

        List<UserLikedCommentDTO> likedCommentDTOs = likedCommentEntities.stream()
            .map(like -> {
                CommentEntity comment = commentRepository.findById(like.getCommentId()).orElse(null);
                if (comment == null) return null;

                UserEntity author = userRepository.findById(comment.getUserId()).orElse(null);
                if (author == null) return null;

                return new UserLikedCommentDTO(
                    comment.getCommentId(),
                    comment.getPostId(),
                    comment.getContent(),
                    comment.getUpdatedAt(),
                    comment.getLikes(),
                    author.getUserId(),
                    author.getNickname()
                );
            })
            .filter(dto -> dto != null)
            .collect(Collectors.toList());

        return new UserInfoResponseDTO(
            user.getEmail(),
            user.getPhoneNumber(),
            user.getNickname(),
            user.isPhoneVerified(),
            user.getProfileImageUrl(),
            user.getCreatedAt(),
            postDTOs,
            comments,
            likedPostDTOs,
            likedCommentDTOs
        );
    }
}
