package com.end2end.spring.board.service;

import com.end2end.spring.board.dto.ReplyDTO;

import java.util.List;

public interface ReplyService {
    List<ReplyDTO> selectByBoardId(int id);
    void insert(ReplyDTO dto);
    void update(ReplyDTO dto);
    void deleteById(int id);
}
