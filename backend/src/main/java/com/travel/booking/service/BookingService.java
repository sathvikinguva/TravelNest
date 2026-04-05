package com.travel.booking.service;

import com.travel.booking.dto.BookingRequestDTO;
import com.travel.booking.dto.BookingResponseDTO;
import com.travel.booking.entity.Booking;
import com.travel.booking.entity.BookingStatus;
import com.travel.booking.entity.BookingType;
import com.travel.booking.entity.User;
import com.travel.booking.exception.ResourceNotFoundException;
import com.travel.booking.exception.UnauthorizedException;
import com.travel.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final RoomService roomService;
    private final FlightService flightService;

    public BookingService(
            BookingRepository bookingRepository,
            UserService userService,
            RoomService roomService,
            FlightService flightService
    ) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.roomService = roomService;
        this.flightService = flightService;
    }

    @Transactional
    public BookingResponseDTO createBooking(Long userId, BookingRequestDTO request) {
        User user = userService.getById(userId);

        validateBookableItem(request.getType(), request.getItemId());

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setType(request.getType());
        booking.setItemId(request.getItemId());
        booking.setStatus(BookingStatus.BOOKED);

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getMyBookings(Long userId) {
        userService.getById(userId);
        return bookingRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public BookingResponseDTO cancelMyBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not allowed to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toResponse).toList();
    }

    private void validateBookableItem(BookingType type, Long itemId) {
        if (type == BookingType.ROOM) {
            roomService.validateRoomExists(itemId);
            return;
        }
        if (type == BookingType.FLIGHT) {
            flightService.validateFlightExists(itemId);
            return;
        }
        throw new ResourceNotFoundException("Unsupported booking type");
    }

    private BookingResponseDTO toResponse(Booking booking) {
        return new BookingResponseDTO(
                booking.getId(),
                booking.getUser().getId(),
                booking.getUser().getEmail(),
                booking.getType().name(),
                booking.getItemId(),
                booking.getStatus().name()
        );
    }
}
