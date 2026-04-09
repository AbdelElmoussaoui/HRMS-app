package com.example.hrms.dto;

import com.example.hrms.entity.enums.LeaveStatus;
import com.example.hrms.entity.enums.LeaveType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequestUpdateRequest {

    private LeaveType type;

    private LocalDate startDate;

    private LocalDate endDate;

    private LeaveStatus status;

    @Size(max = 500)
    private String reason;
}
