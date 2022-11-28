#!/usr/bin/env node
import path from 'path';
import dotenv from 'dotenv-flow';
dotenv.config({
  node_env: process.env.NODE_ENV || 'development',
});

global.__API_PREFIX = process.env.API_PREFIX || '';
global.__dirname = path.resolve('../.');
global.__BASEDIR = path.resolve(__dirname, '../..');
global.__DATABASEREADPREFERENCE = process.env.DATABASEREADPREFERENCE || 'primary';
