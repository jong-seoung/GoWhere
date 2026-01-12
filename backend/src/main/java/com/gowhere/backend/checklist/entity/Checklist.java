package com.gowhere.backend.checklist.entity;


import com.gowhere.backend.trip.entity.Trip;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Checklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String item;
    private boolean complete;

    @Enumerated(EnumType.STRING)
    private ChecklistType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;
}