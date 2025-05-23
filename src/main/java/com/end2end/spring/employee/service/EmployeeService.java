package com.end2end.spring.employee.service;

import com.end2end.spring.employee.dto.*;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface EmployeeService {
    EmployeeDTO selectById(String id);
    List<EmployeeDTO> selectAll();
    EmployeeDetailDTO selectDetailById(String id);
    EmployeeDTO login(LoginDTO dto);
    void insert(EmployeeDetailDTO dto, MultipartFile file);
    void roleUpdate(String id);
    void update(EmployeeDetailDTO dto, MultipartFile file);
    void deleteById(String id);
    boolean pwVali(String currentPw);
    boolean idVali(String loginId);
    List<EmployeeDTO> selectByDepartmentId(int departmentId);
    List<DepartmentDTO> selectAllDepartment();
    List<JobDTO> selectAllJob();
    List<EmployeeDTO> selectContactList();
    boolean isNoAuthExist();
    List<EmployeeDTO> selectByThisMonthBirthday();
    void changePw(String newPw,String id);
    void isResigned(String id);
    List<Map<String, Object>> employeeAll();
    Map<String, List<Integer>> getMonthlyLineData();
    String findByLoginId(String id);
    List<Map<String, Object>> getVacationStats();
    List<Map<String, Object>> getAttendanceStats();
    List<EmployeeDTO> selectAll(int page);
    List<EmployeeDTO> searchContactList(String searchOption, String keyword);
    List<EmployeeDTO> searchContactList(String searchOption, String keyword, int page);
    List<EmployeeDTO> searchEmployeeList(String searchOption, String keyword);

    List<DepartmentDTO> selectByDepartmentList();

    void saveAll(List<DepartmentDTO> dtos);

    void deleteByDepartmentId(int id);

    List<RoleListDTO> loadSettingList();

    void updateRole(String employeeId, String role);
}
