/**
 * Waning : this empties the database.
 */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const neo = require('neo4j-driver').v1;
const BoltAdapter = require('../index');
const fs = require('fs');
const readFile = require('fs-readfile-promise');
const should = chai.should();


describe('Bolt driver converter', () => {

    let boltAdapter;

    before(() => {
        boltAdapter = new BoltAdapter("bolt://localhost", "neo4j", "h4ckM3");
    });


    it('should convert write and read txn responses to the format that node-neo4j community driver uses', (done) => {

        boltAdapter.writeQueryAsync('MATCH (n) DETACH DELETE n')
            .then(result => {
                console.log(result);
                return readFile(__dirname + '/movies.cypher');
            })
            .then(buffer => {
                let query = buffer.toString();
                console.log(query);
                return boltAdapter.writeQueryAsync(query)
            })
            .then(result => {
                result.columns.should.deep.equal(['a', 'm', 'd']);
                return boltAdapter.cypherQueryAsync('MATCH (p:Person) WHERE p.born = {born} RETURN p ORDER BY p.name',
                    {born: 1960})
            })
            .then(result => {
                result.columns.should.deep.equal(['p']);
                result.data.length.should.equal(4);
                result.data[0].born.should.equal(1960);
                result.data[0].name.should.equal('Annabella Sciorra');
                done()
            })

    });

    // /**
    //  * This will fail until the underlying bolt driver supports read/write transactions.
    //  */
    // it('should not be able to perform writes in a read txn', (done) => {
    //     boltAdapter.cypherQueryAsync('CREATE (p:Person {name: "Jasper Blues", born: 1976}) RETURN p')
    //         .then(result => {
    //             done(new Error("Write in a read txn should have rejected"));
    //         })
    //         .catch(err => {
    //             //Expected
    //             done()
    //         });
    //
    // });

    it('should fail gracefully', (done) => {
        boltAdapter.writeQueryAsync("INVALID CYPHER", {}).then(res => {
            //Nothing here
        }).catch(err => {
            err.message.should.equal('Invalid input \'I\': expected <init> (line 1, column 1 (offset: 0))\n"INVALID CYPHER"\n ^');
            done()
        })
    })

});


