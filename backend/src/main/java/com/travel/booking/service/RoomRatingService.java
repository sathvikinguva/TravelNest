package com.travel.booking.service;

import com.travel.booking.dto.RoomRatingRequestDTO;
import com.travel.booking.dto.RoomRatingResponseDTO;
import com.travel.booking.dto.RoomRatingSummaryDTO;
import com.travel.booking.entity.RoomRating;
import com.travel.booking.entity.User;
import com.travel.booking.repository.RoomRatingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomRatingService {

    private final RoomRatingRepository roomRatingRepository;
    private final RoomService roomService;
    private final UserService userService;

    public RoomRatingService(RoomRatingRepository roomRatingRepository, RoomService roomService, UserService userService) {
        this.roomRatingRepository = roomRatingRepository;
        this.roomService = roomService;
        this.userService = userService;
    }

    @Transactional
    public RoomRatingResponseDTO addRating(Long roomId, Long userId, RoomRatingRequestDTO request) {
        roomService.validateRoomExists(roomId);
        User user = userService.getById(userId);

        RoomRating rating = new RoomRating();
        rating.setRoomId(roomId);
        rating.setUserId(user.getId());
        rating.setUserEmail(user.getEmail());
        rating.setRating(request.getRating());
        rating.setReview(request.getReview() == null ? null : request.getReview().trim());

        RoomRating saved = roomRatingRepository.save(rating);
        return toResponse(saved);
    }

    public List<RoomRatingResponseDTO> getAllRatings() {
        return roomRatingRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public List<RoomRatingSummaryDTO> getRatingSummary() {
        return roomRatingRepository.findRoomRatingSummary().stream()
                .map(row -> new RoomRatingSummaryDTO(
                        (Long) row[0],
                        ((Number) row[1]).doubleValue(),
                        ((Number) row[2]).longValue()
                ))
                .toList();
    }

    private RoomRatingResponseDTO toResponse(RoomRating rating) {
        return new RoomRatingResponseDTO(
                rating.getId(),
                rating.getRoomId(),
                rating.getUserId(),
                rating.getUserEmail(),
                rating.getRating(),
                rating.getReview(),
                rating.getCreatedAt().toString()
        );
    }
}
