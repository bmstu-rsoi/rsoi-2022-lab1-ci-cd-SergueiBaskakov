
'use strict';
const express = require('express');
const { Pool, Client } = require('pg');

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';
// App
const app = express();

const client = new Client({
  user: 'jtjortuwbxrfga',//'program',
  host: 'ec2-3-219-135-162.compute-1.amazonaws.com',//'postgres',
  database: 'd4paqjd7gmgq2',//'persons',
  password: '8fd63bb9ee3bdf2cfa764a0e77c707157d4ca37f597ec46bf43a2703e5eec9e2',//'test',
  port: 5432,
  ssl: { rejectUnauthorized: false }
  //ssl: true
});

client.connect();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.listen(PORT);

console.log(`Running on http://${HOST}:${PORT}`);

app.get('/', (req, res) => {
  res.send('Hello World App');
});

app.get('/api/v1/persons/:personId', (req, res) => {
  let querySQL = `
  SELECT * FROM personsdata WHERE id = $1
`
  let values = [req.params.personId]

  client.query(querySQL, values, (err, result)=>{
    if(!err){
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('description', 'Person for ID')
      res.statusCode = 200
      res.send(JSON.stringify(result.rows[0]));
    }
    else {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('description', 'Not found Person for ID')
      res.statusCode = 404
      res.end(JSON.stringify({ message: err.message}));
    }
  });
});

app.get('/api/v1/persons', (req, res) => {
  let querySQL = `
  SELECT * FROM personsdata
`
  client.query(querySQL, (err, result)=>{
    if(!err){
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('description', 'All Persons')
      res.statusCode = 200
      res.send(JSON.stringify(result.rows));
    }
    else {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 400
      res.end(JSON.stringify({ message: err.message}));
    }
  });
});


app.post('/api/v1/persons', (req, res) => {
  
  let querySQL = `
  INSERT INTO personsdata (name, age, address, work)
  VALUES ($1, $2, $3, $4)
  RETURNING name, age, address, work, id
`
  let values = [req.body.name, req.body.age, req.body.address, req.body.work]
  client.query(querySQL, values, (err, result)=>{
    if(!err){
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('description', 'Created new Person')
      res.setHeader('style', 'simple')
      res.location('/api/v1/persons/' + result.rows[0].id)
      res.statusCode = 201
      res.send(JSON.stringify());
    }
    else {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('description', 'Invalid data')
      res.statusCode = 400
      res.end(JSON.stringify({ message: err.message}));
    }
  });
});

app.patch('/api/v1/persons/:personId', (req, res) => {
  var attributesToChange = ""
  var values = [req.params.personId]
  var counter = 2
  Object.keys(req.body).forEach(function(key) {
    console.log('Key : ' + key + ', Value : ' + req.body[key])
    attributesToChange = ` ${attributesToChange}${key} = $${counter},`
    values.push(req.body[key])
    counter = counter + 1
  })
  
  let querySQL = `
  UPDATE personsdata
  SET${attributesToChange.slice(0,-1)}
  WHERE id = $1
  RETURNING name, age, address, work, id
`
console.log(querySQL)
console.log(values)
  client.query(querySQL, values, (err, result)=>{
    if(!err){
      if (result.rowCount > 0) {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('description', 'Person for ID was updated')
        res.statusCode = 200
        res.send(JSON.stringify(result.rows[0]));
      }
      else {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('description', 'Not found Person for ID')
        res.statusCode = 404
        res.end(JSON.stringify({ message: 'Not found Person for ID'}));
      }
      
      
    }
    else {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('description', 'Invalid data')
      res.statusCode = 400
      
      res.end(JSON.stringify({ message: err.message, errors: err}));
    }
  });
});

app.delete('/api/v1/persons/:personId', (req, res) => {
  let querySQL = `
  DELETE FROM personsdata WHERE id = $1
`
  let values = [req.params.personId]

  client.query(querySQL, values, (err, result)=>{
    if(!err){
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('description', 'Person for ID was removed')
      res.statusCode = 204
      res.send();
    }
    else {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('description', 'Not found Person for ID')
      res.statusCode = 404
      
      res.end(JSON.stringify({ message: err.message}));
    }
  });
});
