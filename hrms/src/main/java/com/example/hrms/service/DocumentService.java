package com.example.hrms.service;

import com.example.hrms.dto.DocumentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    DocumentResponse upload(Long employeeId, MultipartFile file);

    DocumentResponse updateMetadata(Long id, String fileName, String fileType, Long employeeId);

    DocumentResponse getById(Long id);

    List<DocumentResponse> getByEmployee(Long employeeId);

    List<DocumentResponse> getAll();

    byte[] download(Long id);

    void delete(Long id);
}
