## @schnellert/gcp-firestore

Install with:

```
npm install @schnellert/nest-gcp-firestore-orm @google-cloud/firestore
```

Example document:

```ts
import { Document } from "@schnellert/gcp-firestore";

@Document("accounts")
export class ExampleDocument {
  displayName: string;
}
```

Example repository:

```ts
import { FirestoreRepositoryBase } from "@schnellert/gcp-firestore";
import { AccountDocument } from "./account.document";
import { Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";

@Injectable()
export class ExampleRepository extends FirestoreRepositoryBase<AccountDocument> {
  constructor() {
    super(firestore, AccountDocument);
  }
}
```
