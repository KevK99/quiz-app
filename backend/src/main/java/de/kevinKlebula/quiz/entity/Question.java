package de.kevinKlebula.quiz.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    private String option1;
    private String option2;
    private String option3;
    private String option4;

    private int correctIndex;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
