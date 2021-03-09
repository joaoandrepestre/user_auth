import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { create_user, login, logout } from './user';

const app = express();
app.use(json());
app.use(cors());
const port: Number = 3000;

// Create user route point
app.post('/user/create', (req: Request, res: Response) => {
    const username: String = req.body.username;
    const password: String = req.body.password;
    if (create_user(username, password))
        res.json({ status: 'ok', username: username });
    else
        res.json({ status: 'err', msg: 'Failed to create user...' });
});


// Login route point
app.get('/user/login', (req: Request, res: Response) => {
    const username: String = String(req.query.username);
    const password: String = String(req.query.password);
    if (login(username, password))
        res.json({ status: 'ok', username: username });
    else
        res.json({ status: 'err', msg: 'Failed to login...' });
});


// Logout route point
app.get('/user/logout', (req: Request, res: Response) => {
    if (logout())
        res.json({ status: 'ok' });
    else
        res.send({ status: 'err', msg: 'Failed to logout...' });
});

// Start server listening on given port
app.listen(port, () => console.log(`Express server listening on port ${port}...`));