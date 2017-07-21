process.env.NODE_ENV = 'test';

const chai = require('chai');
const neo = require('neo4j-driver').v1;
const Utils = require('../Utils');
const should = chai.should();


describe('Utils', () => {


    it('should provide a method to convert an object to params', () => {
        let utils = new Utils();
        const userObj = {};

        userObj.gender = "UNSPECIFIED";
        userObj.roles = ['ROLE_AUTO_LIKE'];

        const props = utils.toProps(userObj);
        props.should.not.be.null;
        props.should.have.length(2);
        props[0].gender.should.equal('UNSPECIFIED');
        props[1].roles.should.deep.equal(['ROLE_AUTO_LIKE']);

    });


});


