## @schnellert/nest-firestore-orm

Install with:

```
npm install @schnellert/nest-firestore-orm @google-cloud/firestore
```

Example document:

```ts
import { Document } from "@schnellert/nest-firestore-orm";

@Document("accounts")
export class ExampleDocument {
  displayName: string;
}
```

Example repository:

```ts
import { FirestoreRepositoryBase } from "@schnellert/nest-firestore-orm";
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

Example module:

```ts
import { Module } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { ExampleRepository } from "./example.repository";

@Module({
  providers: [
    {
      provide: Firestore,
      useFactory: () => new Firestore(),
    },
    ExampleRepository,
  ],
})
export class ExampleModule {}
```
