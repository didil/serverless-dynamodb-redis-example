const jsonResponse = require("../lib/jsonResponse");
const noteService = require("../lib/noteService");

module.exports.handler = async function handler(event, context) {
  let { category, noteId } = event.pathParameters;

  try {
    const results = await noteService.getNote(category, noteId);
    return jsonResponse.ok(results);
  } catch (e) {
    return jsonResponse.error({ message: "Note Fetch Failed: " + e.message });
  }
};