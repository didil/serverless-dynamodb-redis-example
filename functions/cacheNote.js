const noteService = require("../lib/noteService");

module.exports.handler = async function handler(event, context) {
  console.log(`Received event: ${JSON.stringify(event)}`);

  try {
    let result = await noteService.cacheNote(event);
    return result;
  } catch (e) {
    throw new Error(`Note Caching Failed: ${e.message}`);
  }
};