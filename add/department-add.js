// const inquirer = require('inquirer');
// const answers = require('../index');
// const promptuser = require('../index');


// addDepartment = () => {
//   inquirer.prompt([
//     {
//       message: "What is the name of the department?",
//       name: "addDepartment",
//       validate: addDept => {
//         if (addDept) {
//           return true;
//         } else {
//           console.log("Please enter a department.");
//           return false;
//         }
//       }
//     }
//   ]) .then(answers => {
//     const deptAdd = "INSERT INTO department (name) VALUES (?)";
//     connection.query(deptAdd, answers.deptAdd, (err, res) => {
//       if (err) throw err;
//       console.log('Department: ' + answers.deptAdd + "added to departments table!");
//       promptuser();
//     })
//   })
// }

// module.exports = { addDepartment };