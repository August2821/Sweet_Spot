package com.sweetspot.server.pin.image;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/pins/images")
public class PinImageController {
    private final PinImageService pinImageService;

    public PinImageController(PinImageService pinImageService) {
        this.pinImageService = pinImageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestPart("image") MultipartFile file,
            @RequestPart("info") PinImageDTO dto) {
        try {
            // 저장 디렉토리 (절대 경로 사용)
            String uploadDir = new File("uploads/pin-images/").getAbsolutePath() + File.separator;

            // 디렉토리 없으면 생성
            Files.createDirectories(Paths.get(uploadDir));

            // 확장자 추출
            String originalFilename = file.getOriginalFilename();
            String ext = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex != -1) {
                ext = originalFilename.substring(dotIndex);  // ".jpg", ".png" 등
            }

            // UUID로 파일명 생성
            String newFileName = UUID.randomUUID().toString() + ext;

            // 저장
            Path savePath = Paths.get(uploadDir + newFileName);
            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);

            // 접근 가능한 URL 생성
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/pin-images/")
                    .path(newFileName)
                    .toUriString();

            // DTO에 정보 설정
            dto.setImageUrl(imageUrl);
            dto.setfileName(newFileName);

            PinImageDTO saved = pinImageService.saveImage(dto);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "파일 저장 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}