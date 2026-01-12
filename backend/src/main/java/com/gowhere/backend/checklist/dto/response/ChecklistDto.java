package com.gowhere.backend.checklist.dto.response;

import com.gowhere.backend.checklist.entity.ChecklistType;
import lombok.Data;

@Data
public class ChecklistDto {
    private String item;
    private boolean complete;
    private ChecklistType type;
    private Long tripId;
}