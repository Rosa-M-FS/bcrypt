const express = require('express');
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');
const users = require('../data/users');
const router = express.Router();

router.get('/', (req, res) => {
    if(req.session.token){
        return res.send(`        
            <h1> Enhorabuena ya has hecho el login</h1>
            <a href="/dashboard">Dashboard</a><br>
            <form action="/logout" method="post">
            <button type="submit">Cerrar sesión</button>
            </form>
            `)

    }
    const loginForm = `
    <form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br>

        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required><br>

        <button type="submit">Iniciar sesión</button>
        <a href="/dashboard">dashboard</a>
        </form>
        

    `;

    res.send(loginForm);
});
router.post('/login', (req, res) => {
    const { username, password } = req.body; //destructuring
    const user = users.find(
        (user) => user.username === username && user.password === password
    );

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' }); //significa que no estas autorizado
    }
});

router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((user) => user.id === userId);
    if (user) {
        res.send(`
        <h1>Bienvenido, ${user.name}</h1>
        <p> ID:${user.id}</p>
        <p> userName:${user.username}</p>
        <a href="/">HOME</a>
        <form action="/logout" method="post">
            <button type="submit">Cerrar sesión</button>
        </form>
        
        `);
    } else {
        res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports=router;