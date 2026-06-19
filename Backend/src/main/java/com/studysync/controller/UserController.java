package com.studysync.controller;

import com.studysync.dto.ApiResponse;
import com.studysync.dto.ProfileUpdateRequest;
import com.studysync.model.User;
import com.studysync.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found"));
        }
        // Send a clean representation to frontend without password
        User cleanUser = new User(user.getName(), user.getEmail(), null, user.getRole(), user.getDepartment(), user.getYear());
        cleanUser.setId(user.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile loaded successfully", cleanUser));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            Principal principal,
            @RequestBody ProfileUpdateRequest request
    ) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized"));
        }
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found"));
        }

        user.setName(request.getName());
        user.setDepartment(request.getDepartment());
        user.setYear(request.getYear());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        User cleanUser = new User(user.getName(), user.getEmail(), null, user.getRole(), user.getDepartment(), user.getYear());
        cleanUser.setId(user.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully!", cleanUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User not found"));
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully"));
    }
}
