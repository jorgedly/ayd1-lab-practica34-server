const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const conn = require('./conexion');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/getUsers', (req, res) => {
    let sql = `SELECT * FROM usuario`;
    let query = conn.query(sql, (err, results) => {
        if (err) {
            res.send([]);
        } else {
            res.send(results);
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    let sql = `SELECT 1 FROM Usuario WHERE email='${email}' AND password='${password}'`;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length === 1) {
            res.send({ auth: true });
        } else {
            res.send({ auth: false });
        }
    });
});

app.post('/register', (req, res) => {
    const { nombres, apellidos, dpi, no_cuenta, saldo, email, password } = req.body;
    let sql = `INSERT INTO Usuario (nombres, apellidos, dpi, no_cuenta, saldo, email, password) VALUES 
    ('${nombres}','${apellidos}','${dpi}','${no_cuenta}','${saldo}','${email}','${password}')`;
    let query = conn.query(sql, (err, results) => {
        if (err) {
            res.send({ 'success': false });
        } else {
            res.send({ 'success': true });
        }
    });
});

app.listen(port, () => console.log(`Escuchando en puerto ${port}...`))