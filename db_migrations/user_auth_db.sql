DROP DATABASE user_auth;

CREATE DATABASE user_auth;

\c user_auth

CREATE EXTENSION pgcrypto;

CREATE TABLE "user" (
    idUser SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    sid TEXT
);