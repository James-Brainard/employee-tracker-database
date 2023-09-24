const inquirer = require('inquirer');
const fs = require('fs');

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

// CREATE A FUNCTION for each option

function promptUser() {
  inquirer.prompt([
    {
      type: "list", 
      message: "What would you like to do?",
      choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
      name: "menu"
    }
  ])
}

promptUser();