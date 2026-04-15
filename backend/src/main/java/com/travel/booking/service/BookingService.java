package com.travel.booking.service;

import com.travel.booking.dto.BookingRequestDTO;
import com.travel.booking.dto.BookingResponseDTO;
import com.travel.booking.entity.Booking;
import com.travel.booking.entity.BookingStatus;
import com.travel.booking.entity.BookingType;
import com.travel.booking.entity.User;
import com.travel.booking.exception.InvalidRequestException;
import com.travel.booking.exception.ResourceNotFoundException;
import com.travel.booking.exception.UnauthorizedException;
import com.travel.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final RoomService roomService;
    private final FlightService flightService;
    private final PaymentService paymentService;

    private static final Set<String> ALLOWED_PAYMENT_METHODS = Set.of("CARD", "UPI");
    private static final Pattern TRAVELER_NAME_PATTERN = Pattern.compile("^[A-Za-z ]+$");

    public BookingService(
            BookingRepository bookingRepository,
            UserService userService,
            RoomService roomService,
            FlightService flightService,
            PaymentService paymentService
    ) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.roomService = roomService;
        this.flightService = flightService;
        this.paymentService = paymentService;
    }

    @Transactional
    public BookingResponseDTO createBooking(Long userId, BookingRequestDTO request) {
        User user = userService.getById(userId);

        validateBookableItem(request.getType(), request.getItemId());
        validateBookingRequest(request);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setType(request.getType());
        booking.setItemId(request.getItemId());
        booking.setStatus(BookingStatus.BOOKED);
        booking.setTravelerName(request.getTravelerName().trim());
        booking.setTravelerNotes(request.getTravelerNotes() == null ? null : request.getTravelerNotes().trim());
        booking.setTravelDate(request.getTravelDate());
        booking.setGuestCount(request.getGuestCount());
        booking.setPaymentMethod(request.getPaymentMethod().trim().toUpperCase());
        booking.setPaymentReference(request.getPaymentReference().trim());
        booking.setCardLast4(request.getCardLast4() == null ? null : request.getCardLast4().trim());
        booking.setUpiId(request.getUpiId() == null ? null : request.getUpiId().trim());
        booking.setBaseAmount(request.getBaseAmount());
        booking.setTaxAmount(request.getTaxAmount());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setCurrency(request.getCurrency().trim().toUpperCase());

        Booking saved = bookingRepository.save(booking);
        paymentService.capturePaymentForBooking(saved);
        return toResponse(saved);
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

    private void validateBookingRequest(BookingRequestDTO request) {
        String travelerName = request.getTravelerName() == null ? "" : request.getTravelerName().trim();
        if (!TRAVELER_NAME_PATTERN.matcher(travelerName).matches()) {
            throw new InvalidRequestException("Traveler name must contain alphabets and spaces only");
        }

        if (request.getTravelDate().isBefore(LocalDate.now())) {
            throw new InvalidRequestException("Past dates are not allowed for booking");
        }

        String paymentMethod = request.getPaymentMethod() == null ? "" : request.getPaymentMethod().trim().toUpperCase();
        if (!ALLOWED_PAYMENT_METHODS.contains(paymentMethod)) {
            throw new InvalidRequestException("Payment method must be CARD or UPI");
        }

        String cardLast4 = request.getCardLast4() == null ? "" : request.getCardLast4().trim();
        String upiId = request.getUpiId() == null ? "" : request.getUpiId().trim();
        if ("CARD".equals(paymentMethod) && !cardLast4.matches("^[0-9]{4}$")) {
            throw new InvalidRequestException("CARD payment requires valid card last 4 digits");
        }
        if ("UPI".equals(paymentMethod) && !upiId.matches("^[A-Za-z0-9._-]+@[A-Za-z]+$")) {
            throw new InvalidRequestException("UPI payment requires a valid UPI ID");
        }

        if (request.getGuestCount() == null || request.getGuestCount() < 1) {
            throw new InvalidRequestException("Guest count must be a positive integer");
        }
    }

    private BookingResponseDTO toResponse(Booking booking) {
        return new BookingResponseDTO(
                booking.getId(),
                booking.getUser().getId(),
                booking.getUser().getEmail(),
                booking.getType().name(),
                booking.getItemId(),
                booking.getStatus().name(),
                booking.getTravelerName(),
                booking.getTravelerNotes(),
                booking.getTravelDate().toString(),
                booking.getGuestCount(),
                booking.getPaymentMethod(),
                booking.getPaymentReference(),
                booking.getCardLast4(),
                booking.getUpiId(),
                booking.getBaseAmount().toPlainString(),
                booking.getTaxAmount().toPlainString(),
                booking.getTotalAmount().toPlainString(),
                booking.getCurrency()
        );
    }
}
