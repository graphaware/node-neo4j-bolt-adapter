////////////////////////////////////////////////////////////////////////////////
//
//  AppsQuick.ly
//  Copyright 2017 AppsQuick.ly
//  All Rights Reserved.
//
//  NOTICE: Use is subject to license terms.
//
////////////////////////////////////////////////////////////////////////////////

const neo4j = require('neo4j-driver');

class Mapper {

    constructor() {
    }


    mapToNative(records) {

        return {
            columns: this.mapColumns(records),
            data: this.mapData(records)
        }
    }

    mapColumns(records) {
        let columns = [];
        if (records.length) {
            records[0].keys.forEach(key => {
                columns.push(key)
            })
        }
        return columns
    }

    mapData(records) {

        let data = new Array(records.length);
        for (let i = 0; i < records.length; i++) {
            let record = records[i];

            let item;
            if (record.keys.length === 1) {
                item = toNative(record.get(0))
            }
            else {
                item = new Array(records.keys.length);
                for (let j = 0; j < record.keys.length; j++) {
                    item[j] = toNative(record.get(j))
                }
            }
            data[i] = item
        }
        return data
    }

}

const toNative = function (val) {
    if (val === null) return val;
    if (val instanceof neo4j.v1.types.Node) return toNative(val.properties);
    if (val instanceof neo4j.v1.types.Relationship) return toNative(val.properties);
    if (neo4j.v1.isInt(val)) return val.toNumber();
    if (Array.isArray(val)) return val.map(a => toNative(a));
    if (isRecord(val)) return toNative(recordToNative(val));
    if (typeof val === 'object') return mapObj(toNative, val);
    return val
};

const recordToNative = function (rec) {
    var out = {};
    rec.keys.forEach(function (key, index) {
        out[key] = rec._fields[index]
    });
    return out
};

const isRecord = function (obj) {
    if (typeof obj._fields !== 'undefined' && typeof obj.keys !== 'undefined') {
        return true
    }
    return false
};

const mapObj = function (fn, obj) {
    var out = {};
    Object.keys(obj).forEach(function (key) {
        out[key] = fn(obj[key])
    });
    return out
};


module.exports = Mapper;