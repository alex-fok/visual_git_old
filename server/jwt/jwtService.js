import fs from 'fs';
import jwt from 'jsonwebtoken';
import jwtOptionsJSON from './jwtOptions.json';

const privateKEY =fs.readFileSync('./jwt/private.key');
const publicKEY =fs.readFileSync('./jwt/public.key');

const jwtOptions = {
  audience: jwtOptionsJSON.audience,
  expiresIn: jwtOptionsJSON.expiresIn,
  algorithm: jwtOptionsJSON.algorithm
}

module.exports = {
  sign: (payload, callback) => {
    jwt.sign(payload, privateKEY, jwtOptions, (err, token) => callback(err, token));
  },

  verify: (token, optionsVerifier) => {
    return jwt.verify(token, privateKEY, jwtOptions, (err, decoded) => {
      if(err) {
        console.log(jwtOptions.audience);
        console.log(jwtOptions.expiresIn);
        console.log(jwtOptions.algorithm);
        console.log("Error: " + err.message);
      } else {
        optionsVerifier(decoded);
      }
    })
  },

  decode: (token) => {
    return jwt.decode(token, {complete: true});
  }
}