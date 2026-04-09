package com.example.hrms.mapper;

import com.example.hrms.dto.LeaveRequestCreateRequest;
import com.example.hrms.dto.LeaveRequestResponse;
import com.example.hrms.dto.LeaveRequestUpdateRequest;
import com.example.hrms.entity.Employee;
import com.example.hrms.entity.LeaveRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface LeaveRequestMapper {

    @Mapping(target = "employee", source = "employeeId", qualifiedByName = "employeeFromId")
    LeaveRequest toEntity(LeaveRequestCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "employee", ignore = true)
    void updateEntity(LeaveRequestUpdateRequest request, @MappingTarget LeaveRequest entity);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee", qualifiedByName = "employeeName")
    LeaveRequestResponse toResponse(LeaveRequest entity);

    @Named("employeeFromId")
    default Employee employeeFromId(Long id) {
        if (id == null) {
            return null;
        }
        Employee employee = new Employee();
        employee.setId(id);
        return employee;
    }

    @Named("employeeName")
    default String employeeName(Employee employee) {
        if (employee == null) {
            return null;
        }
        String first = employee.getFirstName() == null ? "" : employee.getFirstName();
        String last = employee.getLastName() == null ? "" : employee.getLastName();
        String name = (first + " " + last).trim();
        return name.isEmpty() ? null : name;
    }
}
