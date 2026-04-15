package com.travel.booking.controller;

import com.travel.booking.dto.RoomRatingResponseDTO;
import com.travel.booking.service.RoomRatingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/room-ratings")
public class AdminRoomRatingController {

    private final RoomRatingService roomRatingService;

    public AdminRoomRatingController(RoomRatingService roomRatingService) {
        this.roomRatingService = roomRatingService;
    }

    @GetMapping
    public List<RoomRatingResponseDTO> getAllRatings() {
        return roomRatingService.getAllRatings();
    }
}
