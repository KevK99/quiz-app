INSERT INTO category (id, name) VALUES (1, 'Java');
INSERT INTO category (id, name) VALUES (2, 'Allgemeinwissen');

INSERT INTO question (id, text, option1, option2, option3, option4, correct_index, category_id)
VALUES
    (1, 'Was ist JVM?', 'Java Virtual Machine', 'JavaScript VM', 'Visual Studio', 'Compiler', 1, 1),
    (2, 'Was ist Spring Boot?', 'Framework', 'Datenbank', 'IDE', 'Server', 1, 1),
    (3, 'Hauptstadt von Frankreich?', 'Berlin', 'Madrid', 'Paris', 'Rom', 3, 2),
    (4, '2 + 2 = ?', '3', '4', '5', '6', 2, 2);