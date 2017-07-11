////////////////////////////////////////////////////////////////////////////////
//
//  AppsQuick.ly
//  Copyright 2017 AppsQuick.ly
//  All Rights Reserved.
//
//  NOTICE: Use is subject to license terms.
//
////////////////////////////////////////////////////////////////////////////////

let dbHost = process.env.DB_HOST
let dbUser = process.env.DB_USER
let dbPw = process.env.DB_PW

const neo = require('neo4j-driver').v1;
const bolt = neo.driver(`bolt://${dbHost}`, neo.auth.basic(`${dbUser}`, `${dbPw}`));

bolt.onCompleted = () => {

};

bolt.onError = error => {
    console.log('Driver instantiation failed', error);
    throw error
};

module.exports = bolt;