import express from 'express';
import sqlite3 from 'sqlite3';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Q14 use session to store login info
app.use(session({
    secret: 'festiVaultSecret',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('./'));

const db = new sqlite3.Database('festivault.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to database.');
    }
});

// Q4 search festival route
app.post('/searchFestival', (req, res) => {
    const { title, organiser } = req.body;

    const sql = `SELECT * FROM festivals WHERE title LIKE ? AND organiser LIKE ?`;

    db.all(sql, [`%${title}%`, `%${organiser}%`], (err, rows) => {
        if (err) {
            res.sendStatus(500);
        } else {
            // Q5 return event data
            res.json(rows);
        }
    });
});

// Q7 reserve festival route
app.post('/reserveFestival', (req, res) => {
    // Q15 check login
    if (!req.session.username) return res.sendStatus(403);

    const { eventID } = req.body;
    const username = req.session.username;

    const sql = `INSERT INTO reservations (username, eventID) VALUES (?, ?)`;

    db.run(sql, [username, eventID], (err) => {
        if (err) {
            res.sendStatus(500);
        } else {
            // Q17 mark event as unavailable
            db.run(`UPDATE festivals SET available = 0 WHERE ID = ?`, [eventID], () => {
                res.sendStatus(200);
            });
        }
    });
});

// Q10 add festival route
app.post('/addFestival', (req, res) => {
    // Q15/Q16 check login and admin
    if (!req.session.username || !req.session.admin) return res.sendStatus(403);

    const { title, organiser, category, available } = req.body;

    // Q11 validate inputs
    if (!title || !organiser || !category) {
        return res.sendStatus(400);
    }

    const sql = `INSERT INTO festivals (title, organiser, category, available) VALUES (?, ?, ?, ?)`;

    db.run(sql, [title, organiser, category, available ? 1 : 0], (err) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Q14 login route
app.post('/login', (req, res) => {
    const { uname, pword } = req.body;

    const sql = `SELECT * FROM users WHERE uname = ? AND pword = ?`;

    db.get(sql, [uname, pword], (err, row) => {
        if (err || !row) {
            res.sendStatus(403);
        } else {
            req.session.username = row.uname;
            req.session.admin = row.admin === 1;
            res.sendStatus(200);
        }
    });
});

// Q17 reservation history
app.get('/myReservations', (req, res) => {
    if (!req.session.username) return res.sendStatus(403);

    const sql = `SELECT festivals.title, festivals.organiser, festivals.category
                 FROM reservations
                 JOIN festivals ON reservations.eventID = festivals.ID
                 WHERE reservations.username = ?`;

    db.all(sql, [req.session.username], (err, rows) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(rows);
        }
    });
});

app.listen(3000, () => {
    console.log('Server is online.');
});
