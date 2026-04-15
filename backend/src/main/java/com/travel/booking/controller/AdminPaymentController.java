package com.travel.booking.controller;

import com.travel.booking.dto.FlightPaymentResponseDTO;
import com.travel.booking.dto.RoomPaymentResponseDTO;
import com.travel.booking.service.PaymentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
public class AdminPaymentController {

    private final PaymentService paymentService;

    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/rooms")
    public List<RoomPaymentResponseDTO> getRoomPayments() {
        return paymentService.getAllRoomPayments();
    }

    @GetMapping("/flights")
    public List<FlightPaymentResponseDTO> getFlightPayments() {
        return paymentService.getAllFlightPayments();
    }
}
