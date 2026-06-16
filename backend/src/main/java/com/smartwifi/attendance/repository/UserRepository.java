package com.smartwifi.attendance.repository;

import com.smartwifi.attendance.entity.Role;
import com.smartwifi.attendance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    long countByDepartment(String department);
}
