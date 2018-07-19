const AWS = require("aws-sdk");

function getClient() {
  let opts = {};

  if (process.env.IS_OFFLINE) {
    opts.region = 'localhost';
    opts.endpoint = 'http://localhost:8000';
  }

  const client = new AWS.DynamoDB.DocumentClient(opts);
  return client;
}

async function put(tableName, item){
  let client = this.getClient();

  const params = {
    TableName: tableName,
    Item: item
  };

  return await client["put"](params).promise();
}

async function get(tableName, keyObj){
  let client = this.getClient();

  const params = {
    TableName: tableName,
    Key: keyObj
  };

  return await client["get"](params).promise();
}

module.exports = {
  getClient,
  put,
  get
};