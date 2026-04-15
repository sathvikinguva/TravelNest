package com.travel.booking.controller;

import com.travel.booking.dto.RoomRatingRequestDTO;
import com.travel.booking.dto.RoomRatingResponseDTO;
import com.travel.booking.dto.RoomRatingSummaryDTO;
import com.travel.booking.security.AuthenticatedUser;
import com.travel.booking.service.RoomRatingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomRatingController {

    private final RoomRatingService roomRatingService;

    public RoomRatingController(RoomRatingService roomRatingService) {
        this.roomRatingService = roomRatingService;
    }

    @PostMapping("/{id}/ratings")
    @ResponseStatus(HttpStatus.CREATED)
    public RoomRatingResponseDTO addRating(
            @PathVariable Long id,
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody RoomRatingRequestDTO request
    ) {
        return roomRatingService.addRating(id, user.getUserId(), request);
    }

    @GetMapping("/ratings")
    public List<RoomRatingSummaryDTO> getRoomRatingSummary() {
        return roomRatingService.getRatingSummary();
    }
}
