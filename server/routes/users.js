const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    bcrypt.hash('qqqqqqqq', saltRounds, (err, hash) =>{
   console.log(hash);
    })
    const {  email, password } = req.body;
    const params = [ email ];
    const query1 = `SELECT companies.name as company, first_name,last_name, email, employees.id, employees.password 
    FROM employees
    JOIN companies ON company_id = companies.id 
    WHERE email = $1;`;
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
        if (!users.length){
          return res.json({ error: "Email does not exist" });
        }
        bcrypt.compare(password, users[0].password, (error, result) => {
          console.log(password, users[0].password )
          if (result) {
            
            db.query(query2, [users[0].id])
            .then((data2) => {
              const userInfo = data2.rows;
              delete users[0].password
              req.session.user = users
              console.log(req.session.user);
              res.json({ userInfo, users });
            });
          } else {
            return res.json({ error: "Incorrect email or password" });
          }
        })
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/login", (req,res) => {
    console.log("session",req.session)
    if (req.session.user) {
      req.sessionID({ loggedIn: true, user: req.session.user});
    } else {
      res.send({ loggedIn: false});
    }
  })

//Resets current bottle amount and adds 1 to bottle used
  router.post("/addbottle", (req, res) => {
    const { company, id, type } = req.body;
    const params = [company, id, type];
    const query1 = `UPDATE refrigerants SET bottle_count = bottle_count + 1, current_bottle_used = 0
    From employee_refrigerant, employees ,companies
    WHERE employees.id = $1 AND companies.id = $2 AND type = $3;`;
    db.query(query1, params)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
//Create Work order and add used amount to employee bottle amount
  router.post("/workorder", (req, res) => {
    const { employeeId, type, amount } = req.body;
    console.log(req.body);
    const query1 = `SELECT MAX(number) FROM work_orders`;
    const query2 = `INSERT INTO work_orders (amount, number, date, employee_id)
    VALUES ($1, $2, CURRENT_DATE, $3) RETURNING id;`;
    const query3 = `UPDATE refrigerants SET current_bottle_used = current_bottle_used + $2 
    FROM employee_refrigerant, employees
    WHERE type = $1 AND employees.id = $3 AND employee_id = employees.id AND refrigerant_id = refrigerants.id
    RETURNING refrigerants.id;`;
    const query4 = `INSERT INTO work_order_refrigerant (work_order_id, refrigerant_id)
    VALUES ($1, $2) RETURNING *;`;
    const query5 = `SELECT * FROM work_orders 
    JOIN employees ON employee_id = employees.id
    JOIN work_order_refrigerant ON work_order_id = work_orders.id
    JOIN refrigerants ON refrigerant_id = refrigerants.id
    WHERE work_orders.number = (SELECT MAX(number) FROM work_orders);
    `;
    db.query(query1)
      .then((data1) => {
        let number = data1.rows[0].max;
        number++;
        req.body.map((item) => {
          const { employeeId, type, amount } = item;
          const params2 = [amount, number, employeeId];
          db.query(query2, params2).then((data2) => {
            const params3 = [type, amount, employeeId];
            db.query(query3, params3).then((data3) => {
              const refrigerantId = data3.rows[0].id;
              const workOrderId = data2.rows[0].id;
              const params4 = [workOrderId, refrigerantId];
              db.query(query4, params4);
            });
          });
        });
        db.query(query5).then((data5) => {
          const info = data5.rows;
          res.json({ info });
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
//List of employee work orders
  router.get("/:employeeId/workorder/list/:offset", (req, res) => {
    const { offset, employeeId } = req.params;
    console.log(offset);
    const query1 = `SELECT distinct work_orders.number, first_name, last_name, date FROM work_orders 
                  JOIN employees ON employee_id = employees.id
                  WHERE employees.id = $2
                  ORDER BY date DESC, work_orders.number
                  LIMIT 10 OFFSET $1;`;
    db.query(query1, [offset, employeeId])
      .then((data1) => {
        const info = data1.rows;
        res.json({ info });
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
