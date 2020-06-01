"use strict";

// Export functions for server.js
export {log_db, load_stories}

// Set up global variables
let sqlite = require("sqlite");
let data_db = "./data_db.sqlite";
let contact_db = "./contact_db.sqlite"
let stories_db = "./stories_db.sqlite"

// Run code in db
async function log_db() {
    try {
        db = await sqlite.open(stories_db);
        // await db.run("SOME SQL");
        var as = await db.all("select * from stories");
        console.log(as);
    } catch (e) { console.log(e); }
}


// Load stories_list from stories_db
// Returns a list of stories or empty list if failed
async function load_stories() {
  stories = [];
  try {
      db = await sqlite.open(stories_db);
      var as = await db.all("select name from stories");
      stories = as.map(as => as.name);
  } catch (e) { console.log(e); }
  return stories;
}
