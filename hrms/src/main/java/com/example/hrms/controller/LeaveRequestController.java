package com.example.hrms.controller;

import com.example.hrms.dto.LeaveRequestCreateRequest;
import com.example.hrms.dto.LeaveRequestResponse;
import com.example.hrms.dto.LeaveRequestUpdateRequest;
import com.example.hrms.service.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
@Validated
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public ResponseEntity<LeaveRequestResponse> submit(@Valid @RequestBody LeaveRequestCreateRequest request) {
        LeaveRequestResponse response = leaveRequestService.submit(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public ResponseEntity<LeaveRequestResponse> update(@PathVariable Long id,
                                                       @Valid @RequestBody LeaveRequestUpdateRequest request) {
        return ResponseEntity.ok(leaveRequestService.update(id, request));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    public ResponseEntity<LeaveRequestResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.approve(id));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    public ResponseEntity<LeaveRequestResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.reject(id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER','EMPLOYEE')")
    public ResponseEntity<LeaveRequestResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    public ResponseEntity<List<LeaveRequestResponse>> getAll(@RequestParam(name = "employeeId", required = false) Long employeeId) {
        if (employeeId != null) {
            return ResponseEntity.ok(leaveRequestService.getByEmployee(employeeId));
        }
        return ResponseEntity.ok(leaveRequestService.getAll());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leaveRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
