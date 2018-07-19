const AWS = require("aws-sdk");

function getClient(opts = { region: process.env.AWS_REGION || "us-east-1" }) {
  return new AWS.Lambda(opts);
}

async function invokeAsync(functionName, payload) {
  let client = this.getClient();

  let result = await client.invoke({
    InvocationType: 'Event',
    FunctionName: functionName,
    Payload: payload
  }).promise();

  return result;
}


module.exports = {
  getClient,
  invokeAsync
};