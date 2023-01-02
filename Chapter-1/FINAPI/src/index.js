const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];


function verifyIfExistsAccountCPF(req, res, next) {

  const { cpf } = req.headers;
  const customer = customers.find(customer => customer.cpf == cpf);

  if (!customer) {
    return res.status(400).json({ error: "Customer not found" });
  }

  req.customer = customer;

  return next();

};

app.post("/account", (req, res) => {

  const { cpf, name } = req.body;

  const customersAlreadyExists = customers.some((customer) => customer.cpf === cpf);

  if (customersAlreadyExists) {
    return res.status(400).json({ "error": "Customer Already Exists, try another one" });
  };

  customers.push({
    id: uuidv4(),
    cpf,
    name,
    statement: []
  });

  return res.status(201).send();

});

// app.use(verifyIfExistsAccountCPF);

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {

  const { customer } = req;

  return res.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    create_at: new Date(),
    type: "credit"
  };

  customer.statement.push(statementOperation);

  return res.status(201).send();
});

app.listen(3333);
