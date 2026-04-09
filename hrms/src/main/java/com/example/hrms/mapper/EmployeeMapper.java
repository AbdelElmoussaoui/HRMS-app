package com.example.hrms.mapper;

import com.example.hrms.dto.EmployeeCreateRequest;
import com.example.hrms.dto.EmployeeResponse;
import com.example.hrms.dto.EmployeeUpdateRequest;
import com.example.hrms.entity.Department;
import com.example.hrms.entity.Employee;
import com.example.hrms.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(target = "department", source = "departmentId", qualifiedByName = "departmentFromId")
    @Mapping(target = "user", source = "userId", qualifiedByName = "userFromId")
    Employee toEntity(EmployeeCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "department", source = "departmentId", qualifiedByName = "departmentFromId")
    @Mapping(target = "user", source = "userId", qualifiedByName = "userFromId")
    void updateEntity(EmployeeUpdateRequest request, @MappingTarget Employee entity);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "userId", source = "user.id")
    EmployeeResponse toResponse(Employee entity);

    @Named("departmentFromId")
    default Department departmentFromId(Long id) {
        if (id == null) {
            return null;
        }
        Department department = new Department();
        department.setId(id);
        return department;
    }

    @Named("userFromId")
    default User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
