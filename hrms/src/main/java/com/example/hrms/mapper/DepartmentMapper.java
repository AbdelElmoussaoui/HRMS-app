package com.example.hrms.mapper;

import com.example.hrms.dto.DepartmentCreateRequest;
import com.example.hrms.dto.DepartmentResponse;
import com.example.hrms.dto.DepartmentUpdateRequest;
import com.example.hrms.entity.Department;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    Department toEntity(DepartmentCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(DepartmentUpdateRequest request, @MappingTarget Department entity);

    DepartmentResponse toResponse(Department entity);
}
