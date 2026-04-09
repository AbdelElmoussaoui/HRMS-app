package com.example.hrms.service.impl;

import com.example.hrms.dto.EmployeeCreateRequest;
import com.example.hrms.dto.EmployeeResponse;
import com.example.hrms.dto.EmployeeUpdateRequest;
import com.example.hrms.entity.Department;
import com.example.hrms.entity.Employee;
import com.example.hrms.entity.User;
import com.example.hrms.exception.ConflictException;
import com.example.hrms.exception.ResourceNotFoundException;
import com.example.hrms.mapper.EmployeeMapper;
import com.example.hrms.repository.DepartmentRepository;
import com.example.hrms.repository.EmployeeRepository;
import com.example.hrms.repository.UserRepository;
import com.example.hrms.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    public EmployeeResponse create(EmployeeCreateRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Employee email already exists");
        }

        Employee employee = employeeMapper.toEntity(request);

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            ensureUserNotAssigned(user.getId());
            employee.setUser(user);
        }

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            employee.setDepartment(department);
        }

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse update(Long id, EmployeeUpdateRequest request) {
        Employee employee = getEmployee(id);

        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(employee.getEmail())) {
            if (employeeRepository.existsByEmail(request.getEmail())) {
                throw new ConflictException("Employee email already exists");
            }
        }

        employeeMapper.updateEntity(request, employee);

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            ensureUserNotAssignedToAnotherEmployee(user.getId(), employee.getId());
            employee.setUser(user);
        }

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            employee.setDepartment(department);
        }

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {
        return employeeMapper.toResponse(getEmployee(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAll()
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        Employee employee = getEmployee(id);
        employeeRepository.delete(employee);
    }

    private Employee getEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    private void ensureUserNotAssigned(Long userId) {
        employeeRepository.findByUserId(userId).ifPresent(e -> {
            throw new ConflictException("User already linked to another employee");
        });
    }

    private void ensureUserNotAssignedToAnotherEmployee(Long userId, Long employeeId) {
        employeeRepository.findByUserId(userId).ifPresent(e -> {
            if (!e.getId().equals(employeeId)) {
                throw new ConflictException("User already linked to another employee");
            }
        });
    }
}
