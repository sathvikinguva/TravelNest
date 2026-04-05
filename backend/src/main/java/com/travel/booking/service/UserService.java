package com.travel.booking.service;

import com.travel.booking.entity.Role;
import com.travel.booking.entity.User;
import com.travel.booking.exception.ResourceNotFoundException;
import com.travel.booking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
