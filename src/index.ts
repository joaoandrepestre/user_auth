import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { create_user, login, logout, check_session_id } from './user';

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
    // gets parameters from the request body
    const { username, password } = req.body;
    
    // creates user in the database
    create_user(username, password)
        .then((ret: Boolean) => {
            if (ret) // if request is successful, sends success response
                res.json({ status: 'ok', username: username });
            else // if not, sends error response
                res.json({ status: 'err', msg: 'Failed to create user...' });
        })
        .catch(err => {
            // if error on database request, sends error response
            res.json({ status: 'err', msg: err });
        });
});


// Login route point
app.post('/user/login', (req: Request, res: Response) => {
    // gets parameters from request body
    const { username, password } = req.body;

    // logs user in in the database
    login(username, password)
        .then((ret: String) => {
            if (ret !== "") // if session id returned is not empty, sends success response
                res.json({ status: 'ok', username: username, sid: ret });
            else // if not, sends error response
                res.json({ status: 'err', msg: 'Username or password is incorrect' });
        })
        .catch(err => {
            // if error on database request, sends error response
            res.json({ status: 'err', msg: err });
        });
});

// Check session id route point
app.post('/user/session', (req: Request, res: Response) => {
    // gets parameter from request body
    const sid: String = req.body.sid;

    // checks session id
    check_session_id(sid)
        .then((ret: Boolean) => {
            if (ret) // if request is successful, sends success response
                res.json({ status: 'ok', sid: sid });
            else // if not, sends error response
                res.json({ status: 'err', msg: 'Session id is not valid' });
        })
        .catch(err => {
            // if error on database request, sends error response
            res.json({ status: 'err', msg: err });
        });
});


// Logout route point
app.post('/user/logout', (req: Request, res: Response) => {
    // gets parameter from request body
    const sid: String = req.body.sid

    // logs user out in the database
    logout(sid)
        .then((ret: Boolean) => {
            if (ret) // if request is successful, sends success response
                res.json({ status: 'ok' });
            else // if not, sends error response
                res.json({ status: 'err', msg: 'Failed to logout...' });

        })
        .catch(err => {
            // if error on database request, sends error response
            res.json({ status: 'err', msg: err });
        });
});

// Start server listening on given port
app.listen(port, () => console.log(`User authentication server listening on port ${port}...`));