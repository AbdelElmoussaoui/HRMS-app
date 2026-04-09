package com.example.hrms.service;

import com.example.hrms.dto.EmployeeCreateRequest;
import com.example.hrms.dto.EmployeeResponse;
import com.example.hrms.dto.EmployeeUpdateRequest;

import java.util.List;

public interface EmployeeService {
    EmployeeResponse create(EmployeeCreateRequest request);

    EmployeeResponse update(Long id, EmployeeUpdateRequest request);

    EmployeeResponse getById(Long id);

    List<EmployeeResponse> getAll();

    void delete(Long id);
}
