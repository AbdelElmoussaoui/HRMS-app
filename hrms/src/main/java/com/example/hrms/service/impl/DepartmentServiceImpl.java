package com.example.hrms.service.impl;

import com.example.hrms.dto.DepartmentCreateRequest;
import com.example.hrms.dto.DepartmentResponse;
import com.example.hrms.dto.DepartmentUpdateRequest;
import com.example.hrms.entity.Department;
import com.example.hrms.exception.ConflictException;
import com.example.hrms.exception.ResourceNotFoundException;
import com.example.hrms.mapper.DepartmentMapper;
import com.example.hrms.repository.DepartmentRepository;
import com.example.hrms.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    public DepartmentResponse create(DepartmentCreateRequest request) {
        if (departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new ConflictException("Department name already exists");
        }
        Department department = departmentMapper.toEntity(request);
        return departmentMapper.toResponse(departmentRepository.save(department));
    }

    @Override
    public DepartmentResponse update(Long id, DepartmentUpdateRequest request) {
        Department department = getDepartment(id);
        if (request.getName() != null && departmentRepository.existsByNameIgnoreCase(request.getName())) {
            if (!request.getName().equalsIgnoreCase(department.getName())) {
                throw new ConflictException("Department name already exists");
            }
        }
        departmentMapper.updateEntity(request, department);
        return departmentMapper.toResponse(departmentRepository.save(department));
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getById(Long id) {
        return departmentMapper.toResponse(getDepartment(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        Department department = getDepartment(id);
        departmentRepository.delete(department);
    }

    private Department getDepartment(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }
}
