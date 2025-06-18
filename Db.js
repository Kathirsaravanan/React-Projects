// db.js — A simple wrapper for IndexedDB using idb
import { openDB } from 'idb';

const DB_NAME = 'HtmlChunksDB';
const STORE_NAME = 'chunks';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    }
  });
}

export async function saveChunkToDB(index, data) {
  const db = await initDB();
  await db.put(STORE_NAME, data, index);
}

export async function getChunkFromDB(index) {
  const db = await initDB();
  return await db.get(STORE_NAME, index);
}

export async function deleteOtherChunks(keepIndices) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  for await (const cursor of store) {
    if (!keepIndices.includes(cursor.key)) {
      await store.delete(cursor.key);
    }
  }

  await tx.done;
}
