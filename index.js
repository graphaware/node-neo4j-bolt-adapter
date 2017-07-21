////////////////////////////////////////////////////////////////////////////////
//
//  AppsQuick.ly
//  Copyright 2017 AppsQuick.ly
//  All Rights Reserved.
//
//  NOTICE: Use is subject to license terms.
//
////////////////////////////////////////////////////////////////////////////////

const neo = require('neo4j-driver').v1;
const Mapper = require('./Mapper');

class BoltAdapter {

    constructor(url, user, pass) {
        this.url = url;
        this.user = user;
        this.pass = pass;
        this.mapper = new Mapper();
    }

    cypherQueryAsync(query, params) {

        const self = this;
        return new Promise(function (resolve, reject) {

            const driver = neo.driver(self.url, neo.auth.basic(self.user, self.pass));
            const session = driver.session();
            session.readTransaction(transaction => {

                transaction.run(query, params).then(result => {
                    session.close();
                    driver.close();
                    resolve(self.mapper.mapToNative(result.records))
                }).catch(err => {
                    session.close();
                    driver.close();
                    reject(err)
                })
            })
        })
    }

    writeQueryAsync(query, params) {

        let self = this;
        return new Promise(function (resolve, reject) {

            const driver = neo.driver(self.url, neo.auth.basic(self.user, self.pass));
            const session = driver.session();

            session.writeTransaction(transaction => {

                transaction.run(query, params).then(result => {
                    session.close();
                    driver.close();
                    resolve(self.mapper.mapToNative(result.records))
                }).catch(err => {
                    session.close();
                    driver.close();
                    reject(err)
                })
            })
        })
    }

}

module.exports = BoltAdapter;

