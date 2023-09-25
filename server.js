// Import and require mysql 2
const mysql = require('mysql2');

// Create connection to db
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the courses_db database.`)
);

// Create Connection to mysql
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Mysql connected');
// });

module.exports = db;