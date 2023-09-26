const inquirer = require('inquirer');
const db = require('./server');


// Prompt user to make a choice
promptUser = () => {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add a Role", "View All Departments", "Add Department"],
      name: "menuChoice"
    }
  ])

    .then((answers) => {
      const { menuChoice } = answers;
      if (menuChoice === "View All Departments") {
        // Query into the selected choice View All Departments
        db.query(`SELECT * FROM department`, (err, res) => {
          if (err) throw err;
          console.log("Viewing all departments: ");
          console.table(res);
          promptUser();
        })
      // If not the above, and user chose View All Roles
      } else if (menuChoice === "View All Roles") {
        // Selecting roles id, title, name and salary from roles table, and joining department from roles where department id is = to roles.department_id.
        const viewRoles = `SELECT 
        roles.id, 
        title, 
        name, 
        salary 
        FROM roles 
        JOIN department 
        ON department.id = roles.department_id`
        // Query into View All Roles
        db.query(viewRoles, (err, res) => {
          if (err) throw err;
          console.log("View all roles: ");
          console.table(res);
          promptUser();
        })

      } else if (menuChoice === "View All Employees") {
        // Left Join is making a manager table for the manager(s).
        // Concat is taking the manager first/last name displaying the column as manager_name in the view all employees table in the terminal. 
        const viewEmployee = `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        roles.title AS job_title, 
        roles.salary AS Salary, 
        department.name, 
        CONCAT(manager.first_name, " ", manager.last_name) AS Manager_name
        FROM employee
        JOIN roles ON roles.id = employee.role_id
        JOIN department ON department.id = roles.department_id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`
        // query into view all employees table
        db.query(viewEmployee, (err, res) => {
          if (err) throw err;
          console.log("Viewing all employees: ");
          console.table(res);
          promptUser();
        })

      } else if (menuChoice === "Add Employee") {
        // get list of roles
        db.query("SELECT * FROM roles", (err, res) => {
          if (err) {
            throw err;
          } else {
            const roleArr = res.map(role => role.title)
            // Get list of employees
            db.query("SELECT * FROM employee", (err, eres) => {
              if (err) {
                throw err;
              } else {
                
                const manArr = eres.map(manager => manager.first_name);

                inquirer.prompt([
                  {
                    message: "What is the employees first name?",
                    name: "firstName",
                    validate: firstName => {
                      if (firstName) {
                        return true;
                      } else {
                        console.log("Please enter a first name.");
                        return false;
                      }
                    }
                  },
                  {
                    message: "What is the employees last name?",
                    name: "lastName",
                    validate: lastName => {
                      if (lastName) {
                        return true;
                      } else {
                        console.log("Please enter a last name.");
                        return false;
                      }
                    }
                  },
                  {
                    type: "list",
                    message: "What is the employees role?",
                    name: "employeeRole",
                    // roleArr will display the list of roles
                    choices: roleArr
                  },
                  {
                    type: "list",
                    message: "What is the employees manager?",
                    name: "employeeManager",
                    // choices will display the list of employees
                    choices: manArr
                  }
                ])
                  .then((answers) => {
                    for (let i = 0; i < res.length; i++) {
                      if (res[i].title === answers.employeeRole) {
                        console.log(res[i]);
                        var employeeRole = res[i];
                      }
                    }
                    let { firstName, lastName, employeeManager } = answers;
                    // Inserting the new employees values of first & last name, role id and manager id into the employee table.
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstName, lastName, employeeRole.id, employeeManager.id], (err, res) => {
                      if (err) throw err;
                      console.log(`Added ${firstName} ${lastName} to the database.`)
                      
                      promptUser();
                    })
                  })
              }
            })
          }
        });

      } else if (menuChoice === "Add a Role") {
        // get list of departments
        db.query(`SELECT * FROM department`, (err, res) => {
          if (err) throw err;
          inquirer.prompt([
            {
              message: "What role would you like to add?",
              name: "newRole",
              validate: newRoleInput => {
                if (newRoleInput) {
                  return true;
                } else {
                  console.log("Please enter a name for the role.");
                  return false;
                }
              }
            },
            {
              message: "What is the salary for this role?",
              name: "salary",
              validate: salaryInput => {
                if (salaryInput) {
                  return true;
                } else {
                  console.log("Please input a salary for this role.");
                  return false;
                }
              }
            },
            {
              type: "list",
              message: "What department does this role belong to?",
              name: "department",
              choices: () => {
                let deptArr = [];
                for (let i = 0; i < res.length; i++) {
                  deptArr.push(res[i].name);
                }
                return deptArr;
              }
            },
          ])
            .then((answers) => {
              for (let i = 0; i < res.length; i++) {
                if (res[i].name === answers.department) {
                  console.log(res[i]);
                  var department = res[i];
                }
              }
              // Inserting new role values into roles table taking in title, salary and departments id.
              db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [answers.newRole, answers.salary, department.id], (err, res) => {
                if (err) throw err;
                console.log(`Added ${answers.newRole} to the database.`);
                promptUser();
              })
            })
        });
      } else if (menuChoice === "Add Department") {
        inquirer.prompt([
          {
            message: "What is the name of the department?",
            name: "newDepartment",
            validate: newDepartmentInput => {
              if (newDepartmentInput) {
                return true;
              } else {
                console.log("Please enter a department.");
                return false;
              }
            }
          }
        ]).then((answers) => {
          db.query(`INSERT INTO department (name) VALUES (?)`, [answers.newDepartment], (err, res) => {
            if (err) throw err;
            console.log(`Added ${answers.newDepartment} to the database.`);
            promptUser();
          })
        })
      } else if (menuChoice === "Update Employee Role") {
        const concatQuery = `SELECT
        CONCAT(employee.first_name, " ", employee.last_name) AS employee_name FROM employee`;
        db.query(concatQuery, (err, res) => {
          if (err) {
            throw err;
            // throw err;
          } else {
            // building the list of employees to display in employeeList
            const employeeArr = res.map(employee => employee.employee_name);
            db.query(`SELECT * FROM roles`, (err, eres) => {
              if (err) {
                throw err;
              } else {
                // Building the list of roles to display in newRole
                const rolesArr = eres.map(roles => roles.title)
                inquirer.prompt([
                  {
                    type: "list",
                    message: "Which employees role would you like to update?",
                    name: "employeeList",
                    choices: employeeArr
                  },
                  {
                    type: "list",
                    message: "What is the employees new role?",
                    name: "newRole",
                    choices: rolesArr
                  }
                ]).then((answers) => {
                  const { employeeList, newRole } = answers;

                  const emValues = [newRole, employeeList];

                  const updateEm = `UPDATE employee SET role_id = (SELECT id FROM roles WHERE title =?) WHERE CONCAT(first_name, " ", last_name) = ?`
                  // We are updating the employees role by selecting the id from the roles table where the title is = to user choice along with first/last name.
                  db.query(updateEm, emValues, (err, res) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log(`Role of ${employeeList} has been updated`);
                      promptUser();
                    }
                  })
                })
              }
            })
          }
        })
      }
    })
    }
promptUser();