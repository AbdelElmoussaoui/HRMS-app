package com.example.hrms.service.impl;

import com.example.hrms.dto.DocumentResponse;
import com.example.hrms.entity.Document;
import com.example.hrms.entity.Employee;
import com.example.hrms.exception.ResourceNotFoundException;
import com.example.hrms.repository.DocumentRepository;
import com.example.hrms.repository.EmployeeRepository;
import com.example.hrms.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;

    @Value("${storage.location}")
    private String storageLocation;

    @Override
    public DocumentResponse upload(Long employeeId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        String originalName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String sanitizedName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedName = UUID.randomUUID() + "_" + sanitizedName;

        Path employeeDir = Path.of(storageLocation, String.valueOf(employeeId));
        try {
            Files.createDirectories(employeeDir);
            Path target = employeeDir.resolve(storedName).normalize();
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            Document document = Document.builder()
                    .fileName(originalName)
                    .fileType(file.getContentType() == null ? "application/octet-stream" : file.getContentType())
                    .uploadDate(Instant.now())
                    .filePath(target.toString())
                    .employee(employee)
                    .build();

            return toResponse(documentRepository.save(document));
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store file");
        }
    }

    @Override
    public DocumentResponse updateMetadata(Long id, String fileName, String fileType, Long employeeId) {
        Document existing = getDocument(id);

        if (fileName != null) {
            existing.setFileName(fileName);
        }
        if (fileType != null) {
            existing.setFileType(fileType);
        }
        if (employeeId != null) {
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            existing.setEmployee(employee);
        }

        return toResponse(documentRepository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getById(Long id) {
        return toResponse(getDocument(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getByEmployee(Long employeeId) {
        return documentRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getAll() {
        return documentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] download(Long id) {
        Document document = getDocument(id);
        Path filePath = Path.of(document.getFilePath());
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("File not found on disk");
        }
        try {
            return Files.readAllBytes(filePath);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to read file");
        }
    }

    @Override
    public void delete(Long id) {
        Document document = getDocument(id);
        Path filePath = Path.of(document.getFilePath());
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to delete file");
        }
        documentRepository.delete(document);
    }

    private Document getDocument(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private DocumentResponse toResponse(Document document) {
        Long employeeId = document.getEmployee() != null ? document.getEmployee().getId() : null;
        return DocumentResponse.builder()
                .id(document.getId())
                .fileName(document.getFileName())
                .fileType(document.getFileType())
                .uploadDate(document.getUploadDate())
                .employeeId(employeeId)
                .build();
    }
}
