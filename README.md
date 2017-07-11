An adapter to allow the official <a href="https://github.com/neo4j/neo4j-javascript-driver">Neo4j bolt driver</a> 
to be used as a drop in replacement for the <a href="https://github.com/thingdom/node-neo4j">node-neo4j</a> community 
driver. 

# Usage

Given the official driver declared as follows:

```javascript 1.6
const Promise = require('bluebird')
const neo4j = require('node-neo4j')
const dev = require('./dev')
const db = Promise.promisifyAll(new neo4j(`http://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_HOST}:7474`))

module.exports = db;

```

And used as follows:
 
 ```javascript 1.6

const db = require('db')

db.cypherQueryAsync(`MATCH (u:User) WHERE u.applicationToken = {applicationToken} RETURN U`, {applicationToken: 1234})
    .then(result => {
        //result.columns describes format
        //When a single record is return result.data contains an object, otherwise an array of objects.  
    });
```

Define the adapter as: 

```javascript 1.6
//Will use env.DB_HOST, env.DB_USER and env.DB_PW
const db = require('node-neo4j-bolt-adapter')
```

And use it as: 

```javascript 1.6

//For read transactions: 
db.cypherQueryAsync(`MATCH (u:User) WHERE u.applicationToken = {applicationToken} RETURN U`, {applicationToken: 1234})
    .then(result => {
        //result.columns describes format
        //When a single record is return result.data contains an object, otherwise an array of objects.  
    });


//For write transactions 
db.cypherQueryAsync(`CREATE (u:User {name: 'Fred'}) return u`)
    .then(result => {
        //result.columns describes format
        //When a single record is return result.data contains an object, otherwise an array of objects.  
    });

```



