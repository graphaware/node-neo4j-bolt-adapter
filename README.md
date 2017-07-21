An adapter to allow the official <a href="https://github.com/neo4j/neo4j-javascript-driver">Neo4j bolt driver</a> 
to be used as a drop in replacement for the <a href="https://github.com/thingdom/node-neo4j">node-neo4j</a> community 
driver. 

# Usage

Given the node-neo4j community driver declared as follows: 

```javascript 1.6
const Promise = require('bluebird')
const neo4j = require('node-neo4j')
const dev = require('./dev')
const db = Promise.promisifyAll(new neo4j(
  `http://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_HOST}:7474`))

module.exports = db;

```

And used like:
 
 ```javascript 1.6

const db = require('db')

db.cypherQueryAsync(`MATCH (u:User) WHERE u.applicationToken = {applicationToken} RETURN U`, 
    {applicationToken: 1234})
    .then(result => {
        //result.columns describes format
        //When a single record is return result.data contains an object, otherwise an array of objects.  
    });
```

We can define an adapter for the official bolt driver: 

```javascript 1.6
const neo = require('neo4j-driver').v1;
const authToken = neo.auth.basic(userName, password);
const db = new BoltAdapter(neo.driver(`bolt://localhost`, authToken));
```

And use it as an API compatible drop-in replacement:

## For a read transaction:

```javascript 1.6
db.cypherQueryAsync(`MATCH (u:User) WHERE u.applicationToken = {applicationToken} RETURN U`, 
    {applicationToken: 1234})
    .then(result => {
        //result.columns describes format
        //When a single record is return result.data contains an object, otherwise an array of objects.  
    });
```    

A session will be opened and a transaction initiated, with auto commit or rollback if an error is thrown. On completion the session will be closed. 

## For a write transaction

```javascript 1.6
//For write transactions 
db.writeQueryAsync(`CREATE (u:User {name: 'Fred'}) return u`)
    .then(result => {
        //result.columns describes format
        //When a single record is return result.data contains an object, otherwise an array of objects.  
    });

```

Similar to a read transaction, a session will be opened and a transaction initiated. The session is closed on completion.
 
## Closing
 
```javascript 1.6
//We can keep a reference, or alternatively, to close the underlying bolt driver
db.close() 
```

## Note

Currently access mode and read/write transaction functions in the official driver are mostly hints. They are not yet translated to access mode on the server - only used by routing driver to decide where to point the request. Until that behavior changes, it is possible to write in a read transaction. 



