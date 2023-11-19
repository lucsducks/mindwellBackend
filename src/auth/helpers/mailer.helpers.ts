import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

// Carga las variables de entorno
import * as dotenv from 'dotenv';
dotenv.config();

// Crear un transporte para nodemailer
const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'eduardorosaslucas2@gmail.com', // Tu dirección de correo electrónico registrada en SendinBlue
        pass: process.env.SECRET_SENDIBLUE, // Tu clave SMTP de SendinBlue
    },
});

export default transporter;
