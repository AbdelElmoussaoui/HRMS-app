package com.example.hrms.service.impl;

import com.example.hrms.dto.LeaveRequestCreateRequest;
import com.example.hrms.dto.LeaveRequestResponse;
import com.example.hrms.dto.LeaveRequestUpdateRequest;
import com.example.hrms.entity.Employee;
import com.example.hrms.entity.LeaveRequest;
import com.example.hrms.entity.enums.EmployeeStatus;
import com.example.hrms.entity.enums.LeaveStatus;
import com.example.hrms.exception.ConflictException;
import com.example.hrms.exception.ResourceNotFoundException;
import com.example.hrms.mapper.LeaveRequestMapper;
import com.example.hrms.repository.EmployeeRepository;
import com.example.hrms.repository.LeaveRequestRepository;
import com.example.hrms.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveRequestMapper leaveRequestMapper;

    @Override
    public LeaveRequestResponse submit(LeaveRequestCreateRequest request) {
        validateDates(request.getStartDate(), request.getEndDate());

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (employee.getStatus() != EmployeeStatus.ACTIVE) {
            throw new ConflictException("Only active employees can submit leave requests");
        }

        LeaveRequest leaveRequest = leaveRequestMapper.toEntity(request);
        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus(LeaveStatus.PENDING);

        return leaveRequestMapper.toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Override
    public LeaveRequestResponse update(Long id, LeaveRequestUpdateRequest request) {
        if (request.getStatus() != null) {
            throw new IllegalArgumentException("Use approve/reject to change status");
        }

        LeaveRequest leaveRequest = getLeaveRequest(id);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new ConflictException("Only pending leave requests can be updated");
        }

        LocalDate start = request.getStartDate() != null ? request.getStartDate() : leaveRequest.getStartDate();
        LocalDate end = request.getEndDate() != null ? request.getEndDate() : leaveRequest.getEndDate();
        validateDates(start, end);

        leaveRequestMapper.updateEntity(request, leaveRequest);
        return leaveRequestMapper.toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Override
    public LeaveRequestResponse approve(Long id) {
        LeaveRequest leaveRequest = getLeaveRequest(id);
        ensurePending(leaveRequest);
        leaveRequest.setStatus(LeaveStatus.APPROVED);
        return leaveRequestMapper.toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Override
    public LeaveRequestResponse reject(Long id) {
        LeaveRequest leaveRequest = getLeaveRequest(id);
        ensurePending(leaveRequest);
        leaveRequest.setStatus(LeaveStatus.REJECTED);
        return leaveRequestMapper.toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveRequestResponse getById(Long id) {
        return leaveRequestMapper.toResponse(getLeaveRequest(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getAll() {
        return leaveRequestRepository.findAll()
                .stream()
                .map(leaveRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId)
                .stream()
                .map(leaveRequestMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        LeaveRequest leaveRequest = getLeaveRequest(id);
        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new ConflictException("Only pending leave requests can be deleted");
        }
        leaveRequestRepository.delete(leaveRequest);
    }

    private LeaveRequest getLeaveRequest(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
    }

    private void ensurePending(LeaveRequest leaveRequest) {
        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new ConflictException("Leave request already processed");
        }
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }
    }
}
