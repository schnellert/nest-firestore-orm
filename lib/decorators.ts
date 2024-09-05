import "reflect-metadata";
import { FIRESTORE_COLLECTION_NAME_KEY } from "./constants";

/**
 * Decorator for defining the firestore collection name on a class.
 *
 * @param {string} collectionName - The name of the firestore collection.
 *
 * @returns {Function} - The decorator function.
 */
export function FirestoreDocument(collectionName: string) {
  return function (constructor: Function) {
    Reflect.defineMetadata(
      FIRESTORE_COLLECTION_NAME_KEY,
      collectionName,
      constructor
    );
  };
}

export function FirestoreReference(referenceName: string) {}
