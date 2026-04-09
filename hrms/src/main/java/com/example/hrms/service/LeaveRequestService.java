package com.example.hrms.service;

import com.example.hrms.dto.LeaveRequestCreateRequest;
import com.example.hrms.dto.LeaveRequestResponse;
import com.example.hrms.dto.LeaveRequestUpdateRequest;

import java.util.List;

public interface LeaveRequestService {
    LeaveRequestResponse submit(LeaveRequestCreateRequest request);

    LeaveRequestResponse update(Long id, LeaveRequestUpdateRequest request);

    LeaveRequestResponse approve(Long id);

    LeaveRequestResponse reject(Long id);

    LeaveRequestResponse getById(Long id);

    List<LeaveRequestResponse> getAll();

    List<LeaveRequestResponse> getByEmployee(Long employeeId);

    void delete(Long id);
}
