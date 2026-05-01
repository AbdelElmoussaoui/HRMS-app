package com.example.hrms.config;

import com.example.hrms.entity.Department;
import com.example.hrms.entity.Employee;
import com.example.hrms.entity.LeaveRequest;
import com.example.hrms.entity.User;
import com.example.hrms.entity.enums.EmployeeStatus;
import com.example.hrms.entity.enums.LeaveStatus;
import com.example.hrms.entity.enums.LeaveType;
import com.example.hrms.entity.enums.UserRole;
import com.example.hrms.repository.DepartmentRepository;
import com.example.hrms.repository.EmployeeRepository;
import com.example.hrms.repository.LeaveRequestRepository;
import com.example.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository         userRepository;
    private final PasswordEncoder        passwordEncoder;
    private final DepartmentRepository   departmentRepository;
    private final EmployeeRepository     employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(UserRole.ADMIN)
                    .enabled(true)
                    .build());
        }

        if (!departmentRepository.existsByNameIgnoreCase("Engineering")) {
            seedDemoData();
        }
    }

    private void seedDemoData() {
        Department engineering = save("Engineering",  "Software development and infrastructure");
        Department hr          = save("Human Resources", "Talent acquisition and employee relations");
        Department sales       = save("Sales",        "Revenue generation and client relations");
        Department marketing   = save("Marketing",    "Brand strategy and growth");
        Department finance     = save("Finance",      "Financial planning and accounting");

        List<Employee> employees = employeeRepository.saveAll(List.of(
                emp("Alice",    "Martin",    "alice.martin@hrms.io",     "2023-03-15", 85000, engineering),
                emp("Youssef",  "El Amrani", "youssef.elamrani@hrms.io", "2023-06-01", 92000, engineering),
                emp("Chen",     "Wei",       "chen.wei@hrms.io",         "2022-11-10", 78000, engineering),
                emp("Sofia",    "Patel",     "sofia.patel@hrms.io",      "2024-01-08", 72000, engineering),
                emp("Nora",     "Dupont",    "nora.dupont@hrms.io",      "2022-04-20", 58000, hr),
                emp("Lucas",    "Bernard",   "lucas.bernard@hrms.io",    "2023-09-01", 54000, hr),
                emp("Fatima",   "Zahra",     "fatima.zahra@hrms.io",     "2023-01-15", 65000, sales),
                emp("Mehdi",    "Bouazza",   "mehdi.bouazza@hrms.io",    "2022-07-01", 69000, sales),
                emp("Léa",      "Fontaine",  "lea.fontaine@hrms.io",     "2023-11-20", 61000, marketing),
                emp("Marco",    "Ricci",     "marco.ricci@hrms.io",      "2024-02-05", 63000, marketing),
                emp("Sara",     "Okafor",    "sara.okafor@hrms.io",      "2022-09-15", 74000, finance),
                emp("Antoine",  "Moreau",    "antoine.moreau@hrms.io",   "2023-04-10", 71000, finance)
        ));

        LocalDate today = LocalDate.now();

        leaveRequestRepository.saveAll(List.of(
                // APPROVED — spread over last 5 months
                leave(employees.get(0),  LeaveType.ANNUAL, today.minusMonths(5).withDayOfMonth(10), today.minusMonths(5).withDayOfMonth(14), LeaveStatus.APPROVED, "Summer break"),
                leave(employees.get(2),  LeaveType.SICK,   today.minusMonths(4).withDayOfMonth(5),  today.minusMonths(4).withDayOfMonth(6),  LeaveStatus.APPROVED, "Medical appointment"),
                leave(employees.get(4),  LeaveType.ANNUAL, today.minusMonths(3).withDayOfMonth(20), today.minusMonths(3).withDayOfMonth(25), LeaveStatus.APPROVED, "Family vacation"),
                leave(employees.get(6),  LeaveType.ANNUAL, today.minusMonths(2).withDayOfMonth(3),  today.minusMonths(2).withDayOfMonth(7),  LeaveStatus.APPROVED, "Personal holiday"),
                leave(employees.get(8),  LeaveType.SICK,   today.minusMonths(2).withDayOfMonth(15), today.minusMonths(2).withDayOfMonth(16), LeaveStatus.APPROVED, "Flu recovery"),
                leave(employees.get(10), LeaveType.UNPAID, today.minusMonths(1).withDayOfMonth(8),  today.minusMonths(1).withDayOfMonth(12), LeaveStatus.APPROVED, "Extended personal leave"),
                // REJECTED
                leave(employees.get(1),  LeaveType.ANNUAL, today.minusMonths(4).withDayOfMonth(1),  today.minusMonths(4).withDayOfMonth(15), LeaveStatus.REJECTED, "Extended vacation — deadline conflict"),
                leave(employees.get(5),  LeaveType.UNPAID, today.minusMonths(3).withDayOfMonth(10), today.minusMonths(3).withDayOfMonth(20), LeaveStatus.REJECTED, "Unpaid leave — team understaffed"),
                leave(employees.get(7),  LeaveType.ANNUAL, today.minusMonths(1).withDayOfMonth(1),  today.minusMonths(1).withDayOfMonth(10), LeaveStatus.REJECTED, "Annual leave — sprint period"),
                // PENDING — most recent
                leave(employees.get(3),  LeaveType.ANNUAL, today.plusDays(5),  today.plusDays(9),  LeaveStatus.PENDING, "Short vacation"),
                leave(employees.get(9),  LeaveType.SICK,   today.plusDays(1),  today.plusDays(2),  LeaveStatus.PENDING, "Medical leave"),
                leave(employees.get(11), LeaveType.ANNUAL, today.plusDays(14), today.plusDays(18), LeaveStatus.PENDING, "Family event"),
                leave(employees.get(0),  LeaveType.SICK,   today.minusDays(4), today.minusDays(3), LeaveStatus.PENDING, "Doctor visit"),
                leave(employees.get(4),  LeaveType.ANNUAL, today.plusDays(21), today.plusDays(25), LeaveStatus.PENDING, "Summer holiday"),
                leave(employees.get(6),  LeaveType.UNPAID, today.minusDays(2), today.minusDays(1), LeaveStatus.PENDING, "Personal matter")
        ));
    }

    private Department save(String name, String description) {
        return departmentRepository.save(
                Department.builder().name(name).description(description).build());
    }

    private Employee emp(String first, String last, String email,
                         String hireDate, double salary, Department dept) {
        return Employee.builder()
                .firstName(first).lastName(last).email(email)
                .hireDate(LocalDate.parse(hireDate))
                .status(EmployeeStatus.ACTIVE)
                .salary(BigDecimal.valueOf(salary))
                .department(dept)
                .build();
    }

    private LeaveRequest leave(Employee employee, LeaveType type,
                               LocalDate start, LocalDate end,
                               LeaveStatus status, String reason) {
        return LeaveRequest.builder()
                .employee(employee).type(type)
                .startDate(start).endDate(end)
                .status(status).reason(reason)
                .build();
    }
}