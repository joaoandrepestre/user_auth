import express, { Request, Response } from 'express';
import {create_user, login, logout} from './user';

const app = express();
const port: Number = 3000;

// Create user route point
app.post('/user/create', (req: Request, res: Response) => {
    const username: String = req.params["username"];
    const password: String = req.params["password"];
    if (create_user(username, password))
        res.send(`User created: ${username}`);
    else
        res.send('Failed to create user...');
});


// Login route point
app.get('/user/login', (req: Request, res: Response) => {
    console.log(req.body);
    const username: String = req.params["username"];
    const password: String = req.params["password"];
    if (login(username, password))
        res.send(`User logged in: ${username}`);
    else
        res.send('Failed to login...');
});


// Logout route point
app.get('/user/logout', (req: Request, res: Response) => {
    if (logout())
        res.send(`User logged out`);
    else
        res.send('Failed to logout...');
});

// Start server listening on given port
app.listen(port, () => console.log(`Express server listening on port ${port}...`));