package com.studysync.dto;

import com.studysync.model.Role;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String department;
    private int year;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, Role role, String department, int year) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.year = year;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
}
