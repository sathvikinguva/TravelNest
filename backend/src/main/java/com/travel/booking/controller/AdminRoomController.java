package com.travel.booking.controller;

import com.travel.booking.dto.RoomRequestDTO;
import com.travel.booking.dto.RoomResponseDTO;
import com.travel.booking.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/rooms")
public class AdminRoomController {

    private final RoomService roomService;

    public AdminRoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoomResponseDTO createRoom(@Valid @RequestBody RoomRequestDTO request) {
        return roomService.createRoom(request);
    }

    @PutMapping("/{id}")
    public RoomResponseDTO updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequestDTO request) {
        return roomService.updateRoom(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }
}
