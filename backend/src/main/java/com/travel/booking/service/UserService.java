package com.travel.booking.service;

import com.travel.booking.dto.AdminUserResponseDTO;
import com.travel.booking.entity.Role;
import com.travel.booking.entity.User;
import com.travel.booking.exception.ResourceNotFoundException;
import com.travel.booking.exception.UnauthorizedException;
import com.travel.booking.repository.BookingRepository;
import com.travel.booking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public UserService(UserRepository userRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public User findOrCreateOAuthUser(String name, String email) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = new User();
                    user.setName(name);
                    user.setEmail(email);
                    user.setRole(Role.USER);
                    return userRepository.save(user);
                });
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<AdminUserResponseDTO> getAllUsersForAdmin() {
        return userRepository.findAll().stream()
                .map(user -> new AdminUserResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ))
                .toList();
    }

    @Transactional
    public void deleteUserByAdmin(Long userId) {
        User user = getById(userId);
        if (user.getRole() == Role.ADMIN) {
            throw new UnauthorizedException("Admin users cannot be deleted");
        }

        bookingRepository.deleteByUserId(userId);
        userRepository.delete(user);
    }
}
