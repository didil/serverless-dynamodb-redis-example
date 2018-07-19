const jsonResponse = require("../lib/jsonResponse");
const noteService = require("../lib/noteService");

module.exports.handler = async function handler(event, context) {
  const data = JSON.parse(event.body);

  try {
    let result = await noteService.createNote(data);
    return jsonResponse.ok(result);
  } catch (e) {
    return jsonResponse.error({ message: "Note Creation Failed: " + e.message});
  }
};