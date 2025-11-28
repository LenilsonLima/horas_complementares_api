require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();

// Rotas
const usuarioRoutes = require('./src/routes/usuario.routes.js');
const pdfRoutes = require('./src/routes/pdf.routes.js');
const cursosRoutes = require('./src/routes/curso.routes.js');
const turmasRoutes = require('./src/routes/turma.routes.js');

// Logs
app.use(morgan('dev'));

// Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cookies
app.use(cookieParser());

const allowedOrigins = [
    "https://horas-complementares-front.onrender.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
];

// CORS CORRETO
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origem não permitida pelo CORS"));
    },
    credentials: true
}));

// 🔥 Linha obrigatória para cookies funcionarem
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Rotas
app.use('/usuario', usuarioRoutes);
app.use('/pdf', pdfRoutes);
app.use('/cursos', cursosRoutes);
app.use('/turmas', turmasRoutes);

// 404
app.use((req, res, next) => {
    const error = new Error("Url não encontrada, tente novamente");
    error.status = 404;
    next(error);
});

// Erros gerais
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;