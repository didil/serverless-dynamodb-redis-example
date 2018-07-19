const uuid = require("uuid");

const cacheService = require("./cacheService");
const lambdaService = require("./lambdaService");
const dbService = require("./dbService");

async function createNote(data) {
  let noteParams = {
    category: data.category,
    noteId: uuid.v1(),
    content: data.content,
    createdAt: Date.now()
  };

  await dbService.put(process.env.notesTableName, noteParams);

  console.log("Created Note: " + JSON.stringify(noteParams));

  return noteParams;
}

async function getNote(category, noteId) {
  let note = await getNoteFromCache(category, noteId);

  if (note) {
    return { note, cacheHit: true };
  }

  note = await getNoteFromDB(category, noteId);

  await invokeCacheNote(note);

  return { note, cacheHit: false };
}

async function invokeCacheNote(note) {
  console.log("Invoking cacheNote lambda");
  let result = await lambdaService.invokeAsync(process.env.cacheNoteFunctionName, JSON.stringify(note));
  console.log("cacheNote lambda invoked: " + result);
}

async function getNoteFromCache(category, noteId) {
  console.log("Fetching Note From Cache: ", category, noteId);

  let cacheKey = getNoteCacheKey(category, noteId);
  let noteJson = await cacheService.get(cacheKey);

  if (!noteJson) {
    console.log(`Note not found in Cache: ${cacheKey}`);
    return null;
  }

  console.log(`Found Note in Cache: ${noteJson}`);
  return JSON.parse(noteJson);
}

async function cacheNote(note) {
  let cacheKey = getNoteCacheKey(note.category, note.noteId);
  let noteJson = JSON.stringify(note);

  await cacheService.set(cacheKey, noteJson);

  console.log(`Cached Note. key: ${cacheKey} value: ${noteJson}`);
}

function getNoteCacheKey(category, noteId) {
  return category + "-" + noteId;
}

async function getNoteFromDB(category, noteId) {
  console.log(`Fetching Note From DB: category: ${category} nodeId: ${noteId}`);
  let result = await dbService.get(process.env.notesTableName, { category, noteId });

  if (result.Item) {
    console.log(`Found Note in DB: ${JSON.stringify(result.Item)}`);
    return result.Item;
  }
  else {
    throw new Error("Note not found in DB");
  }
}

module.exports = {
  createNote,
  getNote,
  cacheNote
};