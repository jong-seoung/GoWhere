package com.gowhere.backend.dto;

import com.gowhere.backend.entity.ChecklistType;
import lombok.Data;

@Data
public class ChecklistDto {
    private String item;
    private boolean complete;
    private com.gowhere.backend.entity.ChecklistType type;
    private Long tripId;
}