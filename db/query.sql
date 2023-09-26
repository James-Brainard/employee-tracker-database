-- Manager first 
-- SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title, roles.salary AS Salary, department.name, CONCAT(manager.first_name, " ",manager.last_name) AS Manager_name
-- FROM employee
-- JOIN role ON role.id = employee.role_id
-- JOIN department ON department.id = roles.department_id
-- LEFT JOIN employee AS manager 
-- ON employee.manager_id = manager.id;

-- SELECT roles.id, title, name, salary FROM roles JOIN department ON department.id = roles.department_id;

-- LEFT JOIN employee AS manager ON employee.manager_id = manager.id