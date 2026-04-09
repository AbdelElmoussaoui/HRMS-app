package com.example.hrms.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentUpdateRequest {

    @Size(max = 255)
    private String fileName;

    @Size(max = 100)
    private String fileType;

    private Long employeeId;
}
