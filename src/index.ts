import express from 'express';

const app = express();
const port = 3000;

// Create user route point
app.post('/user/create', (req, res) => {
    res.send('Express working!');
});


// Login route point
app.get('/user/login', (req, res) => {

});


// Logout route point
app.get('/user/logout', (req, res) => {

});

// Start server listening on given port
app.listen(port, () => console.log(`Express server listening on port ${port}...`));