// 引入mongodb模块的client对象
const MongoClient = require('mongodb').MongoClient
MongoClient.options = {useNewUrlParser: true}
// 添加mongodb的服务器地址
const url = 'mongodb://localhost:27017';
// 设置数据库的名称 （可以是不存在的数据库，它会自动创建）
const dbName = 'app'
/**
 * insert
 * @param {String} collectionName 集合名称
 * @param {Object} data  数据
 * @param {Function} callback 回调 
 * @param {String} type 类型 参数为many 多行插入
 * @author ranyunlong<54@qq.com>
 */
function insert(collectionName,data,callback,type){
    MongoClient.connect(url,(err,client)=>{
        if(err) throw err;
        client
                .db(dbName)
                .collection(collectionName)
                .createIndex({"phone":1})
        if(type == 'many'){
            client
                .db(dbName)
                .collection(collectionName)
                .insertMany(data,callback)
        }else{
            client
                .db(dbName)
                .collection(collectionName)
                .insert(data,callback)
        }
        client.close()
    })
}
/**
 * find
 * @param {String} collectionName 
 * @param {Object} data 
 * @param {Function} callback 
 * @param {Object} params
 * @author ranyunlong<54@qq.com>
 */
function find(collectionName,query,callback,params){
    MongoClient.connect(url,(err,client)=>{
        if(err) throw err;
        if(Object.keys(params).length == 0){
            client
            .db(dbName)
            .collection(collectionName)
            .find(query)
            .toArray(callback)
        }else{ 
            let dbObj = client
                .db(dbName)
                .collection(collectionName)
                .find(query);
                Object.keys(params).forEach(k=>{
                    dbObj = dbObj[k](params[k])
                })
            
                dbObj.toArray(callback)
        }
        
        client.close()
    })
}

/**
 * update
 * @param {String} collectionName 
 * @param {Object} query 
 * @param {Object} update 
 * @param {Function} callback 
 * @param {String} type 
 * @author ranyunlong<54@qq.com>
 */
function update(collectionName,query,data,callback,type){
    MongoClient.connect(url,(err,client)=>{
        if(err) throw err;
        if(type == 'many'){
            client
                .db(dbName)
                .collection(collectionName)
                .updateMany(query,data,callback)
        }else{
            client
                .db(dbName)
                .collection(collectionName)
                .update(query,data,callback)
        }

        client.close()
    })
}

/**
 * remove
 * @param {String} collectionName 
 * @param {Object} query 
 * @param {Function} callback 
 * @author ranyunlong<54@qq.com>
 */
function remove(collectionName,query,callback){
    MongoClient.connect(url,(err,client)=>{
        if(err) throw err;
        client
            .db(dbName)
            .collection(collectionName)
            .remove(query,callback)
        
        client.close()
    })
}

module.exports = {
    collection(collectionName){
        let params = {}
        return {
            /**
             * insert
             * @param {Object} doc 
             * @param {Function} callback 
             */
            insert(doc,callback){
                insert(collectionName,doc,callback)
            },

            /**
             * find
             * @param {Object} query 
             * @param {Function} callback 
             */
            find(query,callback){
                // 判断是否只有一个参数（只有回调）
                //console.log(arguments.length)
                if(arguments.length == 1){
                    if(typeof query == 'function'){
                        callback = query
                        query = {}
                        // 直接查询然后返回结果
                        find(collectionName,query,callback,params)
                    }
                }else if(arguments.length == 2){
                    find(collectionName,query,callback,params)
                }
            },
            /**
             * limit
             * @param {Number} number 
             */
            limit(number){
                params['limit'] = number
                return this;
            },

            /**
             * skip
             * @param {Number} number 
             */
            skip(number){
                params['skip'] = number
                return this;
            },

            /**
             * sort
             * @param {Object} options 
             */
            sort(options){
                params['sort'] = options
                return this;
            },

            /**
             * @param {Array} docs 
             * @param {Function} callback 
             */
            insertMany(docs,callback){
                insert(collectionName,docs,callback,`many`)
            },

            /**
             * @param {Object} query 
             * @param {Object} update 
             * @param {Function} callback 
             */
            update(query,data,callback){
                update(collectionName,query,data,callback)
            },
            
            /**
             * @param {Object} query 
             * @param {Object} data 
             * @param {Function} callback 
             */
            updateMany(query,data,callback){
                update(collectionName,query,data,callback,`many`)
            },

            /**
             * @param {Object} query 
             * @param {Function} callback 
             */
            remove(query,callback){
                remove(collectionName,query,callback)
            }
        }
    }
}

