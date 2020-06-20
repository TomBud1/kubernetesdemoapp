const express = require("express");
const redis = require("redis");
const url = require('url');
const keys = require('./keys');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const {v4: uuidv4} = require('uuid');
const appId = uuidv4();

app.use(cors());
app.use(bodyParser.json());

console.log(keys);

//Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    password: keys.pgPassword,
    port: 5432
})

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
	.query('CREATE TABLE IF NOT EXISTS ppk (salary DOUBLE PRECISION, employee DOUBLE PRECISION, employer DOUBLE PRECISION, result DOUBLE PRECISION)')
	.catch(error => console.log(error));

// Redis Client Setup
const redisClient = redis.createClient({
   host: keys.redisHost,
   port: keys.redisPort,
   retry_strategy: () => 1000
});

app.get("/", (req, res) => {
	res.send("Backend works! AppId: " + appId);
});

app.get("/calculatePPK", (req, res) => {
    const salary = req.query.salary;
    const employee = req.query.employee;
    const employer = req.query.employer;

if (!salary || !employee || !employer) {
    return res.send("Podaj wszystkie dane");
}

    const code = `${salary}_${employee}_${employer}`;

redisClient.exists(code, (err, exists) => {
    if (exists === 1) {
        redisClient.get(code, (err, result) => {
            res.send(`${result} (cache)`);
            return;
        });
    } else {
        const result = salary * employee/100 + salary * employer/100;
        redisClient.set(code, result);
        pgClient.connect()
        .then(() => console.log("Connected successfully"))
        .then(() => pgClient.query(`INSERT INTO ppk (salary, employee, employer, result) VALUES (${salary}, ${employee},${employer}, ${result})`, (err) => {console.log(err)}))
        .catch(e => console.log(e));    
        res.send(`${result}`);
    }
});
});

app.listen(5000, () =>{
    console.log("Lisening on port 5000...");
});
