import {
  CollectionReference,
  Query,
  QuerySnapshot,
} from "@google-cloud/firestore";
import {
  DocumentWithId,
  DocumentWithIdOrUndefined,
  toDocumentWithId,
} from "./types";

/**
 * FirestoreQueryBuilder
 *
 * A builder class for constructing firestore queries in a fluent type-safe manner.
 *
 * @template T - The type of document in the firestore collection.
 */
export class FirestoreQueryBuilder<T> {
  private query: Query<T>;

  /**
   * Initializes a new instance of FirestoreQueryBuilder class.
   *
   * @param reference - The reference to the firestore collection to query.
   */
  constructor(private readonly reference: CollectionReference<T>) {
    this.query = this.reference;
  }

  /**
   * Adds a filter condition to the query.
   *
   * @param field - The field in the document to filter by.
   * @param operator - The comparison operator to use.
   * @param value - The value to compare against.
   *
   * @returns The updated query builder.
   */
  where(
    field: keyof T,
    operator: FirebaseFirestore.WhereFilterOp,
    value: unknown
  ) {
    this.query = this.query.where(<string>field, operator, value);
    return this;
  }

  /**
   * Specifies the order of the results.
   *
   * @param field - The field to order by.
   * @param direction - The direction to order by, either `asc` or `desc`.
   *
   * @returns The updated query builder.
   */
  orderBy(
    field: keyof T,
    direction: "asc" | "desc" = "asc"
  ): FirestoreQueryBuilder<T> {
    this.query = this.query.orderBy(<string>field, direction);
    return this;
  }

  /**
   * Skips the first `n` results.
   *
   * @param offset - The number of results to skip.
   *
   * @returns The updated query builder.
   */
  offset(offset: number): FirestoreQueryBuilder<T> {
    this.query = this.query.offset(offset);
    return this;
  }

  /**
   * Limits the number of results returned.
   *
   * @param limit - The maximum number of results to return.
   *
   * @returns The updated query builder.
   */
  limit(limit: number): FirestoreQueryBuilder<T> {
    this.query = this.query.limit(limit);
    return this;
  }

  /**
   * Starts the query results at the document defined by the given snapshot.
   * Useful for pagination.
   *
   * @param snapshot - The snapshot of the document to start at.
   *
   * @returns The updated query builder.
   */
  startAt(
    snapshot: FirebaseFirestore.DocumentSnapshot<T>
  ): FirestoreQueryBuilder<T> {
    this.query = this.query.startAt(snapshot);
    return this;
  }

  /**
   * Starts the query results after the document defined by the given snapshot.
   * Useful for pagination.
   *
   * @param snapshot - The snapshot of the document to start after.
   *
   * @returns The updated query builder.
   */
  startAfter(
    snapshot: FirebaseFirestore.DocumentSnapshot<T>
  ): FirestoreQueryBuilder<T> {
    this.query = this.query.startAfter(snapshot);
    return this;
  }

  /**
   * Ends the query results at the document defined by the given snapshot.
   *
   * @param snapshot - The snapshot of the document to end at.
   *
   * @returns The updated query builder.
   */
  endAt(
    snapshot: FirebaseFirestore.DocumentSnapshot<T>
  ): FirestoreQueryBuilder<T> {
    this.query = this.query.endAt(snapshot);
    return this;
  }

  /**
   * Ends the query results before the document defined by the given snapshot.
   *
   * @param snapshot - The snapshot of the document to end before.
   *
   * @returns The updated query builder.
   */
  endBefore(
    snapshot: FirebaseFirestore.DocumentSnapshot<T>
  ): FirestoreQueryBuilder<T> {
    this.query = this.query.endBefore(snapshot);
    return this;
  }

  /**
   * Resets the query to its initial state.
   *
   * @returns The updated query builder, reset to its initial state.
   */
  clear(): FirestoreQueryBuilder<T> {
    this.query = this.reference;
    return this;
  }

  /**
   * Listens to the query for real-time updates.
   *
   * @param onNext - A callback to handle the query snapshot when it changes.
   * @param onError - A optional callback to handle errors.
   *
   * @returns A function that can be called to unsubscribe from the listener.
   */
  onSnapshot(
    onNext: (snapshot: QuerySnapshot<T>) => void,
    onError?: (error: Error) => void
  ): () => void {
    return this.query.onSnapshot(onNext, onError);
  }

  async getOne(): Promise<DocumentWithIdOrUndefined<T>> {
    const documents: QuerySnapshot<T> = await this.query.limit(1).get();
    return !documents.empty
      ? toDocumentWithId<T>(documents.docs[0])
      : undefined;
  }

  async getMany(): Promise<DocumentWithId<T>[]> {
    const documents: QuerySnapshot<T> = await this.query.get();
    return documents.docs.map(toDocumentWithId<T>) ?? [];
  }

  async getManyAndCount(): Promise<{
    count: number;
    data: DocumentWithId<T>[];
  }> {
    const documents: QuerySnapshot<T> = await this.query.get();
    return {
      count: documents.size,
      data: documents.docs.map(toDocumentWithId<T>) ?? [],
    };
  }

  async count(): Promise<number> {
    const documents: QuerySnapshot<T> = await this.query.get();
    return documents.size ?? 0;
  }
}
