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
    const { nombres, apellidos, dpi, no_cuenta, email, password } = req.body;
    let sql = `INSERT INTO Usuario (nombres, apellidos, dpi, no_cuenta, saldo, email, password) VALUES 
    ('${nombres}','${apellidos}','${dpi}','${no_cuenta}',0,'${email}','${password}')`;
    let query = conn.query(sql, (err, results) => {
        if (err) {
            res.send({ 'success': false });
        } else {
            res.send({ 'success': true });
        }
    });
});

app.post('/getMovimientos', (req, res) => {
    const { no_cuenta } = req.body;
    let sql = `SELECT * FROM Usuario WHERE no_cuenta='${no_cuenta}'`;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length === 1) {
            res.send({ auth: true });
        } else {
            res.send({ auth: false });
        }
    });
});

app.post('/getSaldo', (req, res) => {
    const { noCuenta } = req.body;
    let sql = `SELECT * FROM Usuario WHERE cuenta_origen='${noCuenta}' OR cuenta_origen='${noCuenta}'`;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length === 1) {
            res.send({ auth: true });
        } else {
            res.send({ auth: false });
        }
    });
});

app.post('/transferMoney',(req, res) => {
    const {cuenta1, cuenta2, monto} = req.body;
    let sql = `INSERT INTO transaccion (cuenta_origen, cuenta_destino, monto) VALUES (${cuenta1},${cuenta2},${monto})`
    let query = conn.query(sql, (err, results) => {
        if (err) 
            res.send({ 'success': false });
        else {
            console.log(results);
            let sql2 = `UPDATE Usuario SET saldo = saldo - ${monto} WHERE no_cuenta = ${cuenta1}`;
            let query2 = conn.query(sql2, (err, results) => {
                if (err) 
                    res.send({ 'success': false });
                else{
                    let sql3 = `UPDATE usuario SET saldo = saldo + ${monto} WHERE no_cuenta = ${cuenta2}`;
                    let query3 = conn.query(sql3, (err, results) => {
                        if (err){
                            console.log(err)
                            res.send({'success': false})
                        }
                        else{
                            console.log(results);
                            res.send({'success':true})
                        }
                    });
                } 
            });
        }
    });
})

app.listen(port, () => console.log(`Escuchando en puerto ${port}...`))