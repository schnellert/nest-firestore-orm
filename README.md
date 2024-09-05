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

Example controller:

```ts
import { Controller, Get, Inject } from "@nestjs/common";
import { ExampleRepository } from "./example.repository";

@Controller("api/v1/example")
export class ExampleController {
  @Inject()
  private readonly repository: ExampleRepository;

  @Get()
  async findAll() {
    const documents = await this.repository
      .createQueryBuilder()
      .getManyAndCount();

    return documents;
  }
}
```

Example module:

```ts
import { Module } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { ExampleController } from "./example.controller";
import { ExampleRepository } from "./example.repository";

@Module({
  controllers: [ExampleController],
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
