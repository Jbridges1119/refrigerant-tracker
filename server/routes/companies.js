const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:companyId", (req, res) => {
    const company_id = req.params.id
    const params = [company_id];
    const query = `SELECT distinct type, current_bottle_used, bottle_count, first_name, last_name, employee_id, SUM(amount) AS total  
    FROM employees 
    JOIN work_orders ON employee_id = employees.id 
    JOIN work_order_refrigerant ON work_order_id = work_orders.id 
    JOIN refrigerants ON refrigerant_id = refrigerants.id 
    JOIN companies ON company_id = companies.id
    WHERE company_id = $1
    GROUP By refrigerants.type, refrigerants.current_bottle_used,refrigerants.bottle_count, employees.first_name, employees.last_name, work_orders.employee_id
    ORDER BY employee_id
    ;`;
    db.query(query, params)
      .then((data) => {
        const info = data.rows;
        res.json({ info });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:companyId/employee/:employeeId", (req, res) => {
    const company_id = req.params.companyId
    const employee_id = req.params.employeeId
    console.log(req.params)
    const params = [company_id, employee_id];
    const query = 
    `SELECT distinct type, current_bottle_used, bottle_count, first_name, last_name, employee_id, SUM(amount) AS total  
    FROM employees 
    JOIN work_orders ON employee_id = employees.id 
    JOIN work_order_refrigerant ON work_order_id = work_orders.id 
    JOIN refrigerants ON refrigerant_id = refrigerants.id 
    JOIN companies ON company_id = companies.id
    WHERE company_id = $1 AND employee_id = $2
    GROUP By refrigerants.type, refrigerants.current_bottle_used,refrigerants.bottle_count, employees.first_name, employees.last_name, work_orders.employee_id
    ORDER BY employee_id
    ;`;
    db.query(query, params)
      .then((data) => {
        const info = data.rows;
        res.json({ info });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:companyId/employee/:employeeId", (req, res) => {
    const company_id = req.params.companyId
    const employee_id = req.params.employeeId
    console.log(req.params)
    const params = [company_id, employee_id];
    const query = 
    `SELECT distinct type, current_bottle_used, bottle_count, first_name, last_name, employee_id, SUM(amount) AS total  
    FROM employees 
    JOIN work_orders ON employee_id = employees.id 
    JOIN work_order_refrigerant ON work_order_id = work_orders.id 
    JOIN refrigerants ON refrigerant_id = refrigerants.id 
    JOIN companies ON company_id = companies.id
    WHERE company_id = $1 AND employee_id = $2
    GROUP By refrigerants.type, refrigerants.current_bottle_used,refrigerants.bottle_count, employees.first_name, employees.last_name, work_orders.employee_id
    ORDER BY employee_id
    ;`;
    db.query(query, params)
      .then((data) => {
        const info = data.rows;
        res.json({ info });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });


  return router;
};
