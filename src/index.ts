import fs from 'fs';
import http from 'http';
import https from 'https';
import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { create_user, login, logout } from './user';

const private_key = fs.readFileSync('certs/selfsigned.key');
const certificate = fs.readFileSync('certs/selfsigned.crt');

const credentials = {key: private_key, cert: certificate};

const app = express();
app.use(json());
app.use(cors({credentials: true}));

const httpPort: Number = 3000;
const httpsPort: Number = 3030;

// Create user route point
app.post('/user/create', (req: Request, res: Response) => {
    const username: String = req.body.username;
    const password: String = req.body.password;
    create_user(username, password)
        .then(ret => {
            if (ret)
                res.json({ status: 'ok', username: username });
            else
                res.json({ status: 'err', msg: 'Failed to create user...'});
        })
        .catch(err => {
            res.json({ status: 'err', msg: err });
        });
});


// Login route point
app.get('/user/login', (req: Request, res: Response) => {
    const username: String = String(req.query.username);
    const password: String = String(req.query.password);
    login(username, password)
        .then(ret => {
            if (ret)
                res.json({ status: 'ok', username: username });
            else
                res.json({ status: 'err', msg: 'Username or password is incorrect' });
        })
        .catch(err => {
            res.json({ status: 'err', msg: err });
        });
});


// Logout route point
app.get('/user/logout', (req: Request, res: Response) => {
    if (logout())
        res.json({ status: 'ok' });
    else
        res.send({ status: 'err', msg: 'Failed to logout...' });
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(httpPort);
httpsServer.listen(httpsPort, () => {
    console.log(`Express server listening on port ${httpsPort}...`)
});
// Start server listening on given port
//app.listen(port, () => console.log(`Express server listening on port ${port}...`));