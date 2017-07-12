////////////////////////////////////////////////////////////////////////////////
//
//  AppsQuick.ly
//  Copyright 2017 AppsQuick.ly
//  All Rights Reserved.
//
//  NOTICE: Use is subject to license terms.
//
////////////////////////////////////////////////////////////////////////////////

const Mapper = require('./Mapper');

class BoltAdapter {

    constructor(driver) {
        this.driver = driver;
        this.mapper = new Mapper()
    }

    cypherQueryAsync(query, params) {

        let self = this;
        return new Promise(function (resolve, reject) {

            let session = self.driver.session();
            session.readTransaction(transaction => {

                transaction.run(query, params).then(result => {
                    session.close();
                    resolve(self.mapper.mapToNative(result.records))
                }).catch(err => {
                    session.close();
                    reject(err)
                })
            })
        })
    }

    writeQueryAsync(query, params) {

        let self = this;
        return new Promise(function (resolve, reject) {

            let session = self.driver.session();
            session.writeTransaction(transaction => {

                transaction.run(query, params).then(result => {
                    session.close();
                    resolve(self.mapper.mapToNative(result.records))
                }).catch(err => {
                    session.close();
                    reject(err)
                })
            })
        })
    }

    close() {
        this.driver.close()
    }
}

module.exports = BoltAdapter;

