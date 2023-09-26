INSERT INTO department (name)
VALUES
      ("Sales"),
      ("Customer Service"),
      ("Finance"),
      ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES
      ("Sales Lead", 115000, 1),
      ("Inside-Sales", 45000, 1),
      ("Lead Service", 55000, 2),
      ("Customer Service Manager", 65000, 2),
      ("Account Manager", 75000, 1),
      ("Accountant", 85000, 3),
      ("Legal Team Lead", 105000, 4),
      ("Lawyer", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
      ("James", "Brainard", 7, NULL),
      ("Josh", "Triggs", 4, NULL),
      ("Michael", "Villa", 5, NULL),
      ("Joshua", "Morrison", 6, NULL),
      ("Joel", "Hunter", 8, NULL),
      ("Kyle", "Kilmer", 7, 1);