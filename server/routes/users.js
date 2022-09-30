const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const params = [];
    const query = `SELECT SUM(work_orders.amount) AS total, type, current_bottle_used, bottle_count, first_name, last_name, companies.name  
    FROM employees 
    JOIN work_orders ON employee_id = employees.id 
    JOIN work_order_refrigerant ON work_order_id = work_orders.id 
    JOIN refrigerants ON refrigerant_id = refrigerants.id
    JOIN companies ON company_id = companies.id 
    WHERE employees.id = 1 
    GROUP BY refrigerants.id, employees.first_name, employees.last_name, companies.name;`;
    db.query(query)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/login", (req, res) => {
    const {company, email, password} = req.body
    const params = [company, email, password]
    const query1 = `SELECT companies.name, email, employees.password, employees.id FROM employees
    JOIN companies ON company_id = companies.id 
    WHERE company_id = $1 AND email = $2 AND employees.password = $3;`
    const query2 = `SELECT SUM(work_orders.amount) AS total, type, current_bottle_used, bottle_count, first_name, last_name, companies.name  
    FROM employees 
    JOIN work_orders ON employee_id = employees.id 
    JOIN work_order_refrigerant ON work_order_id = work_orders.id 
    JOIN refrigerants ON refrigerant_id = refrigerants.id
    JOIN companies ON company_id = companies.id 
    WHERE employees.id = $1 
    GROUP BY refrigerants.id, employees.first_name, employees.last_name, companies.name;`;
    db.query(query1, params)
      .then((data1) => {
        const users = data1.rows;
        if(!users.length) return res.json({ error: "Please enter a valid email and password" });
        db.query(query2, [users[0].id])
        .then((data2) => {
          const userInfo = data2.rows;
          res.json({ userInfo });
        })
        
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/addbottle", (req, res) => {
    const {company, id, type} = req.body
    const params = [company, id, type];
    const query1 = `UPDATE refrigerants SET bottle_count = bottle_count + 1, current_bottle_used = 0
    From employee_refrigerant, employees ,companies
    WHERE employees.id = $1 AND companies.id = $2 AND type = $3;`;
    db.query(query1, params)
      .then((data) => {
        const users = data.rows
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/workorder", (req, res) => {
    const {company, id, type} = req.body
    const params = [company, id, type];
    const query1 = `SELECT MAX(work_orders.id) FROM work_orders`
    // `INSERT INTO work_orders (amount, date, employee_id)
    // VALUES (2, CURRENT_DATE, 1);`;
    db.query(query1)
      .then((data) => {
        const users = data.rows
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

// `UPDATE refrigerants SET bottle_count = bottle_count + 1 JOIN employee_refrigerant ON refrigerant_id = refrigerants.id
// JOIN employees ON employee_id = employees.id
// JOIN companies ON company_id = companies.id
// WHERE employees.id = 1 AND companies.id = 1 AND type = 'R22'`

// `SELECT bottle_count
//     FROM refrigerants 
//     JOIN employee_refrigerant ON refrigerant_id = refrigerants.id
//     JOIN employees ON employee_id = employees.id
//     JOIN companies ON company_id = companies.id
//     WHERE employees.id = 1 AND companies.id = 1 AND type = 'R22'`;

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