const express=require('express');
const app = express();
const userRoutes = require('./routes/users');
const session = require('express-session');
const { hashedSecret } = require('./crypto/config');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: hashedSecret,
      resave: false, //solo se guardan los cambios si hay un cambio en el inicio de sesion
      saveUninitialized: true,
      cookie: { secure: false },
    })
);

app.use('/',userRoutes)

const PORT=3300;
app.listen(PORT,()=>{
    console.log(`Express escuchando en el puerto http://localhost:${PORT}`)
})
