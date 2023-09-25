const inquirer = require('inquirer');
const db = require('./server');

// Require all ADD, VIEW and UPDATE files where needed.

// I think this is the right way... Not sure how we can just DISPLAY EACH TABLE to view 
// Prompt Inquirer to prompt User "What would you like to do?"
// View all Departments
// View all Roles
// View all Employees

// Add a Department
// Ask for name 
// Add Role and input ROLE name
// Which department does said role belong to?

// Add a Role
// Add an employee
// Ask for First and Last name
// Role?
// Manager?
// Add static salary for each role.

// Update an employee Role when chosen display - Which employees role do you want to update? which will display all employees.
// Ask Which role do you want to assign - display ROLES
// back to main WHAT WOULD YOU LIKE TO DO?

// When user selects option to VIEW - Display that table
// User still has control of PROMPT


// Require the files that call each ADD function depending on user input.

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
        // Query into the selected choice.
        db.query(`SELECT * FROM department`, (err, res) => {
          if (err) throw err;
          console.log("Viewing all departments: ");
          console.table(res);
          promptUser();
        })

      } else if (menuChoice === "View All Roles") {
        // Query into All Roles
        db.query('SELECT * FROM roles', (err, res) => {
          if (err) throw err;
          console.log("View all roles: ");
          console.table(res);
          promptUser();
        })

      } else if (menuChoice === "View All Employees") {
        // query into all employees table
        db.query('SELECT * FROM employee', (err, res) => {
          if (err) throw err;
          console.log("Viewing all employees: ");
          console.table(res);
          promptUser();
        })

      } else if (menuChoice === "Add Employee") {
        // Make if (err) a two liner with an else. 
        // After the else define 
        db.query("SELECT * FROM roles", (err, res) => {
          if (err) {
            throw err;
          } else {
            const roleArr = res.map(role => role.title)
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
                    choices: roleArr
                    // () => {
                    // let roleArr = [];
                    // for (let i = 0; i < res.length; i++) {
                    //   roleArr.push(res[i].name);
                    // }
                    // return roleArr;
                    // }
                  },
                  {
                    type: "list",
                    message: "What is the employees manager?",
                    name: "employeeManager",
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
        updateEmployeeRole();
      }
    })
}


promptUser();