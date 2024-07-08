const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./clinic.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, medical_history TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS diagnoses (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER, diagnosis TEXT, FOREIGN KEY(patient_id) REFERENCES patients(id))");
});

app.post('/admin-login', (req, res) => {
    // Dummy admin login
    if (req.body.username === 'admin' && req.body.password === 'admin') {
        res.send('/admin-dashboard.html');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/patient-login', (req, res) => {
    // Dummy patient login (replace with real validation)
    if (req.body.username === 'patient' && req.body.password === 'patient') {
        res.send('/patient-dashboard.html'); // Assuming you have a patient dashboard
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/add-patient', (req, res) => {
    const { name, age, medical_history } = req.body;
    db.run("INSERT INTO patients (name, age, medical_history) VALUES (?, ?, ?)", [name, age, medical_history], function(err) {
        if (err) {
            res.status(500).send('Error adding patient');
        } else {
            res.status(200).send('Patient added successfully');
        }
    });
});

app.post('/remove-patient', (req, res) => {
    const { id } = req.body;
    db.run("DELETE FROM patients WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).send('Error removing patient');
        } else {
            res.status(200).send('Patient removed successfully');
        }
    });
});

app.get('/search-patient', (req, res) => {
    const { name } = req.query;
    db.all("SELECT * FROM patients WHERE name LIKE ?", [`%${name}%`], (err, rows) => {
        if (err) {
            res.status(500).send('Error searching patients');
        } else {
            res.json(rows);
        }
    });
});

app.post('/diagnose-patient', (req, res) => {
    const { patient_id, diagnosis } = req.body;
    db.run("INSERT INTO diagnoses (patient_id, diagnosis) VALUES (?, ?)", [patient_id, diagnosis], function(err) {
        if (err) {
            res.status(500).send('Error adding diagnosis');
        } else {
            res.status(200).send('Diagnosis added successfully');
        }
    });
});

app.get('/view-patients', (req, res) => {
    db.all("SELECT * FROM patients", (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching patients');
        } else {
            res.json(rows);
        }
    });
});

app.get('/view-diagnoses', (req, res) => {
    db.all("SELECT patients.name, diagnoses.diagnosis FROM diagnoses JOIN patients ON diagnoses.patient_id = patients.id", (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching diagnoses');
        } else {
            res.json(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
