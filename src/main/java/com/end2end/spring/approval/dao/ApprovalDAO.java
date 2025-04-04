package com.end2end.spring.approval.dao;

import com.end2end.spring.approval.dto.ApprovalDTO;
import com.end2end.spring.employee.dto.EmployeeDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ApprovalDAO {

    @Autowired
    private SqlSession mybatis;

    public List<ApprovalDTO> toList(String state){

        return mybatis.selectList("approval.toList",state);
    }

    public void insert(ApprovalDTO dto){
        mybatis.insert("approval.insert", dto);

    }

    public List<ApprovalDTO> selectByStateAndEmployeeId(String state, String employeeId) {
        Map<String,Object> map = new HashMap<>();
        map.put("state",state);
        map.put("employeeId",employeeId);

        return  mybatis.selectList("approval.selectByStateAndEmployeeId", map);
    }

    public ApprovalDTO selectById(String id) {
        return mybatis.selectOne("approval.selectById", id);
    }


}
