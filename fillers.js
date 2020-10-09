//Libraries
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const fs = require('fs')
const methodOverride = require('method-override');
const session = require('express-session');


let fillers = [ //Filler words which should not affect the search
  '', 'the', 'how', 'why', 'you', 'and','for','its','can','that', 'not', 'this', 'with','from', 'stop', 'while',  'ever', 'even', 'should', 'bird', 'fowl',
  'never', 'which', 'should','cannot', 'unless', 'forever', 'whenever', 'whichever', 'complete', 'incomplete', 'absolute', 'total'
]

module.exports = app;
