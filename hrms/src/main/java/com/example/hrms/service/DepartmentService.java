package com.example.hrms.service;

import com.example.hrms.dto.DepartmentCreateRequest;
import com.example.hrms.dto.DepartmentResponse;
import com.example.hrms.dto.DepartmentUpdateRequest;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse create(DepartmentCreateRequest request);

    DepartmentResponse update(Long id, DepartmentUpdateRequest request);

    DepartmentResponse getById(Long id);

    List<DepartmentResponse> getAll();

    void delete(Long id);
}
