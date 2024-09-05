import { DocumentSnapshot } from "@google-cloud/firestore";

/**
 * A type that extends a given type `T` by adding a `documentId` property.
 *
 * @template T - The type that will be extended.
 *
 * @property {string} documentId - The unique identifier for the document.
 */
export type DocumentWithId<T> = T & { documentId: string };

/**
 * A type that can either be a `DocumentWithId<T>` or `undefined`.
 *
 * @template T - The type that will be extended.
 */
export type DocumentWithIdOrUndefined<T> = DocumentWithId<T> | undefined;

/**
 * Converts a `DocumentSnapshot` to an object that includes the document's data
 * along with its unique identifier (`documentId`).
 *
 * @template T - The type of data contained in the document.
 *
 * @param {DocumentSnapshot} document - The firestore `DocumentSnapshot` from which to extract the data and id.
 *
 * @returns {DocumentWithId<any>} An object containing the document's data along with a 'documentId' property.
 */
export const toDocumentWithId = <T>(
  document: DocumentSnapshot
): DocumentWithId<any> => {
  return {
    documentId: document.id,
    ...document.data(),
  };
};
