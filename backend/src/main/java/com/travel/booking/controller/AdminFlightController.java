package com.travel.booking.controller;

import com.travel.booking.dto.FlightRequestDTO;
import com.travel.booking.dto.FlightResponseDTO;
import com.travel.booking.service.FlightService;
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
@RequestMapping("/api/admin/flights")
public class AdminFlightController {

    private final FlightService flightService;

    public AdminFlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FlightResponseDTO createFlight(@Valid @RequestBody FlightRequestDTO request) {
        return flightService.createFlight(request);
    }

    @PutMapping("/{id}")
    public FlightResponseDTO updateFlight(@PathVariable Long id, @Valid @RequestBody FlightRequestDTO request) {
        return flightService.updateFlight(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
    }
}
