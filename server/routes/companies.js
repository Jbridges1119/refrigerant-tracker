const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //Company all employee data
  router.get("/:companyId", (req, res) => {
    const { companyId } = req.params;
    const params = [companyId];
    const query = `SELECT distinct type, current_bottle_used, bottle_count, first_name, last_name, employee_id, SUM(amount) AS total  
                  FROM employees 
                  JOIN work_orders ON employee_id = employees.id 
                  JOIN work_order_refrigerant ON work_order_id = work_orders.id 
                  JOIN refrigerants ON refrigerant_id = refrigerants.id 
                  JOIN companies ON company_id = companies.id
                  WHERE company_id = $1
                  GROUP By refrigerants.type, refrigerants.current_bottle_used,refrigerants.bottle_count, employees.first_name, employees.last_name, work_orders.employee_id
                  ORDER BY employee_id;`;
    db.query(query, params)
      .then((data) => {
        const info = data.rows;
        console.log(info);
        res.json({ info });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Work Order data
  router.get("/:companyId/workorder/:workOrderNumber", (req, res) => {
    const { workOrderNumber } = req.params;
    console.log(workOrderNumber);
    const query1 = `SELECT * FROM work_orders 
                  JOIN employees ON employee_id = employees.id
                  JOIN work_order_refrigerant ON work_order_id = work_orders.id
                  JOIN refrigerants ON refrigerant_id = refrigerants.id
                  WHERE work_orders.number = $1;`;
    db.query(query1, [workOrderNumber])
      .then((data1) => {
        const info = data1.rows;
        res.json({ info });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Deletes old w/o info and joining table column data
  //Removes refrigerant from employee current amount used
  //Creates work order under the same work order number as before
  //Adds data into it
  //creates new joining table column with data
  router.post("/:companyId/workorder/:workOrderNumber", (req, res) => {
    const { workOrderNumber } = req.params;

    const query1 = `SELECT amount, refrigerant_id  FROM refrigerants 
    JOIN work_order_refrigerant ON refrigerant_id = refrigerants.id
    JOIN work_orders ON work_order_id = work_orders.id 
    JOIN employees ON employee_id = employees.id
    WHERE work_orders.number = $1;
    `;
    const query2 = `UPDATE refrigerants SET current_bottle_used = current_bottle_used - $1 
    WHERE refrigerants.id = $2;`;
    const query3 = `SELECT work_order_refrigerant.id 
    FROM work_order_refrigerant
    JOIN work_orders ON work_order_id = work_orders.id 
    WHERE work_orders.number = $1;`;
    const query4 = `DELETE FROM work_order_refrigerant
    WHERE work_order_id = $1`;
    const query5 = `DELETE FROM work_orders
    WHERE work_orders.number = $1`;
    const query6 = `INSERT INTO work_orders (amount, number, date, employee_id)
    VALUES ($1, $2, CURRENT_DATE, $3) RETURNING id;`;
    const query7 = `UPDATE refrigerants SET current_bottle_used = current_bottle_used + $2 
    FROM employee_refrigerant, employees
    WHERE type = $1 AND employees.id = $3 AND employee_id = employees.id AND refrigerant_id = refrigerants.id
    RETURNING refrigerants.id;`;
    const query8 = `INSERT INTO work_order_refrigerant (work_order_id, refrigerant_id)
    VALUES ($1, $2);`;
    db.query(query1, [workOrderNumber])
      .then((data1) => {
        const info = data1.rows;

        info.map((item) => {
          const { amount, refrigerant_id } = item;
          db.query(query2, [Number(amount), refrigerant_id]);
        });
      })
      //All info for work order has been deleted at this point - now creating new work-order with same number and updated info
      .then(() => {
        db.query(query3, [workOrderNumber])
          .then((data3) => {
            const info3 = data3.rows;
            info3.map((item) => {
              db.query(query4, [item.id]);
            });
          })
          .then(() => {
            db.query(query5, [workOrderNumber])
            .then(() => {
              req.body.map((item) => {
                const { employeeId, type, amount } = item;
                const params2 = [amount, workOrderNumber, employeeId];
                db.query(query6, params6)
                .then((data6) => {
                  const params3 = [type, amount, employeeId];
                  db.query(query7, params7)
                  .then((data7) => {
                    const refrigerantId = data7.rows[0].id;
                    const workOrderId = data6.rows[0].id;
                    const params8 = [workOrderId, refrigerantId];
                    db.query(query8, params8);
                  });
                });
              });
            });
            res.json({ status: true });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      });
  });
//List of work orders by 10
  router.get("/:companyId/workorder/list/:offset", (req, res) => {
    const { offset } = req.params;
    console.log(offset);
    const query1 = `SELECT distinct work_orders.number, first_name, last_name, date 
      FROM work_orders 
      JOIN employees ON employee_id = employees.id
      ORDER BY date DESC, work_orders.number
      LIMIT 10 OFFSET $1;`;
    db.query(query1, [offset])
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
