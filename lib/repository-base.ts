import "reflect-metadata";
import {
  CollectionReference,
  Firestore,
  Transaction,
} from "@google-cloud/firestore";
import { DocumentWithId, DocumentWithIdOrUndefined, toDocumentWithId } from ".";
import { FIRESTORE_COLLECTION_NAME_KEY } from "./constants";
import { FirestoreQueryBuilder } from ".";

/**
 * FirestoreRepositoryBase
 *
 * A base repository class for interacting with firestore collections.
 * Provides basic operations and the ability to create complex queries.
 *
 * @template T - The type representing the structure of the documents in the collection.
 */
export class FirestoreRepositoryBase<T> {
  private readonly collection: CollectionReference<T>;

  /**
   * Initializes a new instance of FirestoreRepositoryBase class.
   *
   * @param firestore - The firestore instance used to interact with the database.
   * @param entityType - A class constructor representing the type of the documents in the collection.
   */
  constructor(private readonly firestore: Firestore, entityType: new () => T) {
    const collectionName: string = Reflect.getMetadata(
      FIRESTORE_COLLECTION_NAME_KEY,
      entityType
    );
    this.collection = <CollectionReference<T>>(
      this.firestore.collection(collectionName)
    );
  }

  /**
   * Creates a query builder instance for this collection.
   *
   * @returns A new instance of FirestoreQueryBuilder.
   */
  createQueryBuilder(): FirestoreQueryBuilder<T> {
    return new FirestoreQueryBuilder<T>(this.collection);
  }

  /**
   * Creates a new document in the firestore collection and returns it with its unique identifier.
   *
   * @param data - The data to be saved in the new document. This should match the structure defined by the generic type `T`.
   * @param documentId - (Optional) The id of the document. If not provided, a random uuid will be generated.
   *
   * @returns A promise that resolves with the newly created document, including its unique `documentId` field.
   */
  async create(data: T, documentId?: string): Promise<DocumentWithId<T>> {
    documentId = documentId || crypto.randomUUID();

    const reference = this.collection.doc(documentId);
    await reference.set(data);

    const document = await reference.get();
    return toDocumentWithId(document);
  }

  /**
   * Updates an existing document in the firestore collection and returns it with its unique identifier.
   *
   * @param documentId - The id of the document to be updated.
   * @param data - The partial data to update the document with. This can include one or more fields from the document structure `T`.
   *
   * @returns A promise that resolves with the updated document, including its unique `documentId` field.
   */
  async update(
    documentId: string,
    data: Partial<T>
  ): Promise<DocumentWithId<T>> {
    const reference = this.collection.doc(documentId);
    await reference.update(data);

    const document = await reference.get();
    return toDocumentWithId(document);
  }

  async findOneById(documentId: string): Promise<DocumentWithIdOrUndefined<T>> {
    const document = await this.collection.doc(documentId).get();
    return document.exists ? toDocumentWithId<T>(document) : undefined;
  }

  async deleteById(documentId: string): Promise<void> {
    await this.collection.doc(documentId).delete();
  }

  /**
   * Checks if a document exists in the collection by its id.
   *
   * @param documentId - The id of the document to check.
   *
   * @returns A promise resolves to true if the document exists, or false otherwise.
   */
  async existsById(documentId: string): Promise<boolean> {
    const document = await this.collection.doc(documentId).get();
    return document.exists;
  }

  /**
   * Executes a series of read and write operations within a transaction.
   *
   * @param execute - A function containing the operations to execute within the transaction.
   *
   * @returns A promise that resolves with the result of the transaction or rejects if the transaction fails.
   */
  async runTransaction<R>(
    execute: (transaction: Transaction) => Promise<R>
  ): Promise<R> {
    return this.firestore.runTransaction(async (transaction: Transaction) => {
      return await execute(transaction);
    });
  }
}
