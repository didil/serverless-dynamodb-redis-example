const { promisify } = require('util');
const redis = require('redis');


function getClient() {
  const client = redis.createClient(process.env.REDIS_ENDPOINT, { password: process.env.REDIS_PASSWORD });
  return client;
}

async function get(key) {
  let client = this.getClient();
  const getAsync = promisify(client.get).bind(client);
  return await getAsync(key);
}

async function set(key, value) {
  let client = this.getClient();
  const setAsync = promisify(client.set).bind(client);
  return await setAsync(key, value);
}

module.exports = {
  getClient,
  get,
  set
};