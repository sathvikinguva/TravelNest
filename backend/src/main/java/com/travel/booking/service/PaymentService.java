package com.travel.booking.service;

import com.travel.booking.dto.FlightPaymentResponseDTO;
import com.travel.booking.dto.RoomPaymentResponseDTO;
import com.travel.booking.entity.Booking;
import com.travel.booking.entity.BookingType;
import com.travel.booking.entity.FlightPayment;
import com.travel.booking.entity.RoomPayment;
import com.travel.booking.repository.FlightPaymentRepository;
import com.travel.booking.repository.RoomPaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    private final RoomPaymentRepository roomPaymentRepository;
    private final FlightPaymentRepository flightPaymentRepository;

    public PaymentService(RoomPaymentRepository roomPaymentRepository, FlightPaymentRepository flightPaymentRepository) {
        this.roomPaymentRepository = roomPaymentRepository;
        this.flightPaymentRepository = flightPaymentRepository;
    }

    @Transactional
    public void capturePaymentForBooking(Booking booking) {
        if (booking.getType() == BookingType.ROOM) {
            RoomPayment roomPayment = new RoomPayment();
            roomPayment.setBooking(booking);
            roomPayment.setUserId(booking.getUser().getId());
            roomPayment.setUserEmail(booking.getUser().getEmail());
            roomPayment.setRoomId(booking.getItemId());
            roomPayment.setTravelerName(booking.getTravelerName());
            roomPayment.setGuestCount(booking.getGuestCount());
            roomPayment.setPaymentMethod(booking.getPaymentMethod());
            roomPayment.setPaymentReference(booking.getPaymentReference());
            roomPayment.setCardLast4(booking.getCardLast4());
            roomPayment.setUpiId(booking.getUpiId());
            roomPayment.setTotalAmount(booking.getTotalAmount());
            roomPayment.setCurrency(booking.getCurrency());
            roomPaymentRepository.save(roomPayment);
            return;
        }

        FlightPayment flightPayment = new FlightPayment();
        flightPayment.setBooking(booking);
        flightPayment.setUserId(booking.getUser().getId());
        flightPayment.setUserEmail(booking.getUser().getEmail());
        flightPayment.setFlightId(booking.getItemId());
        flightPayment.setTravelerName(booking.getTravelerName());
        flightPayment.setGuestCount(booking.getGuestCount());
        flightPayment.setPaymentMethod(booking.getPaymentMethod());
        flightPayment.setPaymentReference(booking.getPaymentReference());
        flightPayment.setCardLast4(booking.getCardLast4());
        flightPayment.setUpiId(booking.getUpiId());
        flightPayment.setTotalAmount(booking.getTotalAmount());
        flightPayment.setCurrency(booking.getCurrency());
        flightPaymentRepository.save(flightPayment);
    }

    public List<RoomPaymentResponseDTO> getAllRoomPayments() {
        return roomPaymentRepository.findAllByOrderByPaidAtDesc().stream()
                .map(payment -> new RoomPaymentResponseDTO(
                        payment.getId(),
                        payment.getBooking().getId(),
                        payment.getUserId(),
                        payment.getUserEmail(),
                        payment.getRoomId(),
                        payment.getTravelerName(),
                        payment.getGuestCount(),
                        payment.getPaymentMethod(),
                        payment.getPaymentReference(),
                        payment.getCardLast4(),
                        payment.getUpiId(),
                        payment.getTotalAmount().toPlainString(),
                        payment.getCurrency(),
                        payment.getPaidAt().toString()
                ))
                .toList();
    }

    public List<FlightPaymentResponseDTO> getAllFlightPayments() {
        return flightPaymentRepository.findAllByOrderByPaidAtDesc().stream()
                .map(payment -> new FlightPaymentResponseDTO(
                        payment.getId(),
                        payment.getBooking().getId(),
                        payment.getUserId(),
                        payment.getUserEmail(),
                        payment.getFlightId(),
                        payment.getTravelerName(),
                        payment.getGuestCount(),
                        payment.getPaymentMethod(),
                        payment.getPaymentReference(),
                        payment.getCardLast4(),
                        payment.getUpiId(),
                        payment.getTotalAmount().toPlainString(),
                        payment.getCurrency(),
                        payment.getPaidAt().toString()
                ))
                .toList();
    }
}
