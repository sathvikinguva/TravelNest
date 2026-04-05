package com.travel.booking.controller;

import com.travel.booking.dto.BookingRequestDTO;
import com.travel.booking.dto.BookingResponseDTO;
import com.travel.booking.security.AuthenticatedUser;
import com.travel.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponseDTO createBooking(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody BookingRequestDTO request
    ) {
        return bookingService.createBooking(user.getUserId(), request);
    }

    @GetMapping("/my")
    public List<BookingResponseDTO> getMyBookings(@AuthenticationPrincipal AuthenticatedUser user) {
        return bookingService.getMyBookings(user.getUserId());
    }

    @PutMapping("/{id}/cancel")
    public BookingResponseDTO cancelMyBooking(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) {
        return bookingService.cancelMyBooking(user.getUserId(), id);
    }
}
