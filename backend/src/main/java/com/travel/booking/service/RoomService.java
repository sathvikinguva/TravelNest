package com.travel.booking.service;

import com.travel.booking.dto.RoomRequestDTO;
import com.travel.booking.dto.RoomResponseDTO;
import com.travel.booking.entity.Room;
import com.travel.booking.exception.ResourceNotFoundException;
import com.travel.booking.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomResponseDTO> getAllRooms() {
        return roomRepository.findAll().stream().map(this::toResponse).toList();
    }

    public RoomResponseDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return toResponse(room);
    }

    public RoomResponseDTO createRoom(RoomRequestDTO request) {
        Room room = new Room();
        mapRequestToEntity(request, room);
        return toResponse(roomRepository.save(room));
    }

    public RoomResponseDTO updateRoom(Long id, RoomRequestDTO request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        mapRequestToEntity(request, room);
        return toResponse(roomRepository.save(room));
    }

    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    public void validateRoomExists(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
    }

    private void mapRequestToEntity(RoomRequestDTO request, Room room) {
        room.setName(request.getName());
        room.setLocation(request.getLocation());
        room.setPrice(request.getPrice());
        room.setAvailable(request.getAvailable());
    }

    private RoomResponseDTO toResponse(Room room) {
        return new RoomResponseDTO(
                room.getId(),
                room.getName(),
                room.getLocation(),
                room.getPrice(),
                room.getAvailable()
        );
    }
}
