import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { create_user, login, logout } from './user';

// Initializes express router
const app = express();

// Sets json body parser middleware
app.use(json());

// Sets cors middleware to allow for cross origin resource sharing
app.use(cors());

// Defines port number
const port: Number = 3000;

// Create user route point
app.post('/user/create', (req: Request, res: Response) => {
    const { username, password } = req.body;
    create_user(username, password)
        .then(ret => {
            if (ret)
                res.json({ status: 'ok', username: username });
            else
                res.json({ status: 'err', msg: 'Failed to create user...' });
        })
        .catch(err => {
            res.json({ status: 'err', msg: err });
        });
});


// Login route point
app.post('/user/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    login(username, password)
        .then(ret => {
            if (ret !== "")
                res.json({ status: 'ok', username: username, sid: ret });
            else
                res.json({ status: 'err', msg: 'Username or password is incorrect' });
        })
        .catch(err => {
            res.json({ status: 'err', msg: err });
        });
});


// Logout route point
app.post('/user/logout', (req: Request, res: Response) => {
    const sid = req.body.sid
    logout(sid)
        .then(ret => {
            if (ret)
                res.json({ status: 'ok' });
            else
                res.send({ status: 'err', msg: 'Failed to logout...' });

        })
        .catch(err => {
            res.send({ status: 'err', msg: err });
        });
});

// Start server listening on given port
app.listen(port, () => console.log(`Express server listening on port ${port}...`));