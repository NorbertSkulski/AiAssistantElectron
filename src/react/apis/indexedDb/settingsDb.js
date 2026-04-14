import Dexie from "dexie";

const settingsDb = new Dexie("SettingsDb");

settingsDb.version(1).stores({
  settings: "++id, key, value",
});

export default settingsDb;