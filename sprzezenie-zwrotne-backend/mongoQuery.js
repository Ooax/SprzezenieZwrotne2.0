const MongoClient = require('mongodb').MongoClient;

//Query do bazy MongoDB - poszukiwanie obiektow
const findQuery = async (client, conInfo,collectionName,findObject, options) => {
    const db = client.db(conInfo.dbName);
    const collection = db.collection(collectionName);
    let returnObj = null;

    await collection.find(findObject, options).toArray()
    .then((res)=>{
        returnObj = res;
    })
    .catch((err) => {
        console.error(err);
    });
    return returnObj;
}

//Query do bazy MongoDB - aggregate
const aggregateQuery = async (client, conInfo,collectionName,pipeline) => {
    const db = client.db(conInfo.dbName);
    const collection = db.collection(collectionName);
    let returnObj = null;

    await collection.aggregate(pipeline).toArray()
    .then((res)=>{
        returnObj = res;
    })
    .catch((err) => {
        console.error(err);
    });
    return returnObj;
}

//Query do bazy MongoDB - wstawianie obiektow - mozna wstawiac wiele
const insertQuery = async (client, conInfo, collectionName, data) => {
    let returnObject={
        inserted: null,
        message: null
    }
    const db = client.db(conInfo.dbName);
    const collection = db.collection(collectionName);

    if(Array.isArray(data)){
        await collection.insertMany(data)
        .then((res)=>{
            if(res.result.n == data.length){
                returnObject.inserted = res.ops;
                returnObject.message = "OK";
            }
            else{
                returnObject.inserted = res.ops;
                returnObject.message = res.result.n+" out of "+data.length+" objects inserted";
            }    
        })
        .catch((err) => {
            console.error(err);
            returnObject.message = "Error";
        });
    }
    else{
        await collection.insertMany([data])
        .then((res)=>{
            if(res.result.n == [data].length){
                returnObject.inserted = res.ops;
                returnObject.message = "OK";
            }
            else{
                returnObject.inserted = res.ops;
                returnObject.message = res.result.n+" out of "+[data].length+" objects inserted";
            } 
        })
        .catch((err) => {
            console.error(err);
            returnObject.message = "Error";
        });
    }
    
    return returnObject;
}

//Query do bazy MongoDB - aktualizacja obiektow
const updateQuery = async (client, conInfo, collectionName, target, data) => {
    let returnObject={
        message: null
    }
    const db = client.db(conInfo.dbName);
    const collection = db.collection(collectionName);


    await collection.updateOne(target, {$set: data})
        .then((res) => {
            if (res.result.n == 1){
                returnObject.message = "OK";
            } 
            else{
                returnObject.message = "Error, couldn't update the targeted document";
            }
        })
        .catch((err) => {
            console.error(err);
            returnObject.message = "Error";
        });


    return returnObject;
}

//Query do bazy MongoDB - aktualizacja obiektu lub wstawianie jesli jeszcze nie istnieje w bazie
const upsertQuery = async (client, conInfo, collectionName, target, data) => {
    let returnObject={
        message: null
    }
    const db = client.db(conInfo.dbName);
    const collection = db.collection(collectionName);


    await collection.updateOne(target, {$set: data}, {upsert: true})
        .then((res) => {
            if (res.result.n == 1){
                returnObject.message = "OK";
            }
            else{
                returnObject.message = "Error, couldn't upsert the targeted document";
            }
        })
        .catch((err) => {
            console.error(err);
            returnObject.message = "Error";
        });


    return returnObject;
}


module.exports = {
    findQuery: findQuery,
    aggregateQuery: aggregateQuery,
    insertQuery: insertQuery,
    updateQuery: updateQuery,
    upsertQuery: upsertQuery
}