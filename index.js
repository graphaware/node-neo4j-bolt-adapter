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
const Utils = require('./Utils');

class BoltAdapter {

    constructor(driver) {
        this.driver = driver;
        this.mapper = new Mapper();
        this.utils = new Utils();
    }

    cypherQueryAsync(query, params) {

        const self = this;
        return new Promise(function (resolve, reject) {

            const session = self.driver.session();
            const readPromise = session.readTransaction(transaction => transaction.run(query, params));

            readPromise.then(result => {
                session.close();
                resolve(self.mapper.mapToNative(result.records))
            }).catch(err => {
                session.close();
                reject(err)
            })
        })
    }

    writeQueryAsync(query, params) {

        const self = this;
        return new Promise((resolve, reject) => {

            const session = self.driver.session();
            const writePromise = session.writeTransaction(transaction => transaction.run(query, params));

            writePromise.then(result => {
                session.close();
                resolve(self.mapper.mapToNative(result.records))
            }).catch(err => {
                session.close();
                reject(err)
            })
        })
    }

    close() {
        this.driver.close()
    }
}

module.exports = BoltAdapter;