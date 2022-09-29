const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const params = [];
    const query = `SELECT SUM(amount) AS total, type, current_bottle_used, bottle_count  
    FROM employees 
    JOIN work_orders ON employee_id = employees.id 
    JOIN work_order_refrigerant ON work_order_id = work_orders.id 
    JOIN refrigerants ON refrigerant_id = refrigerants.id 
    WHERE first_name = 'Jeff' AND last_name = 'Bridges'  
    GROUP BY refrigerants.id;`;
    db.query(query)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};

// const query = `SELECT SUM(amount) AS total FROM employees JOIN work_orders ON employee_id = employees.id WHERE first_name = 'Jeff' AND last_name = 'Bridges' AND number = 1;`;



//User Overview



//All Overview with company
// `SELECT distinct type, current_bottle_used, bottle_count, first_name, last_name, employee_id, SUM(amount) AS total  
//     FROM employees 
//     JOIN work_orders ON employee_id = employees.id 
//     JOIN work_order_refrigerant ON work_order_id = work_orders.id 
//     JOIN refrigerants ON refrigerant_id = refrigerants.id 
//     JOIN companies ON company_id = companies.id
//     WHERE company_id = 1
//     GROUP By refrigerants.type, refrigerants.current_bottle_used,refrigerants.bottle_count, employees.first_name, employees.last_name, work_orders.employee_id
//     ORDER BY employee_id
//     ;`;