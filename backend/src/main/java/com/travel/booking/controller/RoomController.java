package com.travel.booking.controller;

import com.travel.booking.dto.RoomResponseDTO;
import com.travel.booking.service.RoomService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public List<RoomResponseDTO> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public RoomResponseDTO getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }
}
