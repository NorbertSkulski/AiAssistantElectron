import Dexie from "dexie";

const chatsDb = new Dexie("chatsDb");

chatsDb.version(1).stores({
  chats: "uuid, model, name, contents",
});

export default chatsDb;