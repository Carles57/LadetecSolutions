// utils/auth.js
import { createHmac } from 'crypto';

const SECRET = process.env.TOKEN_SECRET || 'abc54321hhdbxcggtsdttw553'; // Usa una clave segura

export const verifyToken = (token) => {
  try {
    // Dividir el token en partes (formato: payload.hash)
    const [payloadBase64, hashRecibido] = token.split('.');

    // Verificar integridad del token
    const hmac = createHmac('sha256', SECRET);
    const hashValido = hmac.update(payloadBase64).digest('hex');

    if (hashRecibido !== hashValido) {
      throw new Error('Token inválido');
    }

    // Decodificar payload
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));

    // Verificar expiración (si existe)
    if (payload.exp && Date.now() > payload.exp) {
      throw new Error('Token expirado');
    }

    return payload;
  } catch (error) {
    console.error('Error verificando token:', error);
    throw new Error('Acceso denegado');
  }
};