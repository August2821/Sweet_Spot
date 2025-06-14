package com.sweetspot.server.pin;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sweetspot.server.category.CategoryEntity;
import com.sweetspot.server.category.CategoryRepository;
import com.sweetspot.server.pin.DTO.PinDTO;
import com.sweetspot.server.pin.DTO.PinDeleteDTO;
import com.sweetspot.server.pin.DTO.PinResponseDTO;
import com.sweetspot.server.pin.image.PinImageDTO;
import com.sweetspot.server.pin.image.PinImageService;

@RestController
@RequestMapping("/api/pins")
public class PinController {
    private final PinService pinService;
    private final CategoryRepository categoryRepository;
    private final PinImageService pinImageService;

    public PinController(PinService pinService, CategoryRepository categoryRepository, PinImageService pinImageService) {
        this.pinService = pinService;
        this.categoryRepository = categoryRepository;
        this.pinImageService = pinImageService;
    }

    //핀 생성
    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<?> createPinWithImage(
            @RequestPart("pin") PinDTO pinRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        // 1. 카테고리 소유권 확인
        Optional<CategoryEntity> categoryOpt = categoryRepository.findById(pinRequest.getCategoryId());
        if (categoryOpt.isEmpty() || !categoryOpt.get().getUserId().equals(pinRequest.getUserId())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "해당 카테고리는 사용자에게 속해 있지 않습니다.");
            return ResponseEntity.badRequest().body(error);
        }

        // 2. 핀 저장
        PinDTO dto = new PinDTO();
        dto.setUserId(pinRequest.getUserId());
        dto.setCategoryId(pinRequest.getCategoryId());
        dto.setLatitude(pinRequest.getLatitude());
        dto.setLongitude(pinRequest.getLongitude());
        dto.setTitle(pinRequest.getTitle());
        dto.setDescription(pinRequest.getDescription());

        PinDTO savedPin = pinService.savePin(dto);

        // 3. 이미지가 있다면 저장
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String uploadDir = new File("uploads/pin-images/").getAbsolutePath() + File.separator;
                Files.createDirectories(Paths.get(uploadDir));

                String originalFilename = imageFile.getOriginalFilename();
                String ext = "";
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex != -1) {
                    ext = originalFilename.substring(dotIndex);
                }

                String newFileName = UUID.randomUUID().toString() + ext;
                Path savePath = Paths.get(uploadDir + newFileName);
                Files.copy(imageFile.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);

                String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/images/pin-images/")
                        .path(newFileName)
                        .toUriString();

                PinImageDTO imageDTO = new PinImageDTO();
                imageDTO.setPinId(savedPin.getPinId());
                imageDTO.setImageUrl(imageUrl);
                imageDTO.setfileName(newFileName);

                pinImageService.saveImage(imageDTO);

            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "이미지 저장 실패: " + e.getMessage()));
            }
        }

        return ResponseEntity.ok(savedPin);
    }

    // 핀 삭제
    @PostMapping("/delete")
    public ResponseEntity<?> deletePin(@RequestBody PinDeleteDTO dto) {
        boolean deleted = pinService.deletePin(dto.getPinId(), dto.getUserId());

        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "핀 삭제 완료");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "핀을 찾을 수 없거나 사용자 ID가 일치하지 않습니다.");
            return ResponseEntity.badRequest().body(error);
        }
    }

    //카테고리 id로 핀 리스트/정보 조회
    @PostMapping("/list")
    public ResponseEntity<?> getPinsByCategory(@RequestBody Map<String, Long> request) {
        Long categoryId = request.get("categoryId");
        if (categoryId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "categoryId가 필요합니다."));
        }

        List<PinResponseDTO> pins = pinService.getPinsByCategoryId(categoryId);
        return ResponseEntity.ok(pins);
    }

    //핀id로 핀 정보 조회
    @PostMapping("/info")
    public ResponseEntity<?> getPinById(@RequestBody Map<String, Long> request) {
        Long pinId = request.get("pinId");
        if (pinId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "pinId가 필요합니다."));
        }

        Optional<PinResponseDTO> pinOpt = pinService.getPinById(pinId);
        if (pinOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "해당 핀을 찾을 수 없습니다."));
        }

        return ResponseEntity.ok(pinOpt.get());
    }
}   