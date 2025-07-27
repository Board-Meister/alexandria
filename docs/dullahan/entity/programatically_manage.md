---
sidebar_position: 6
sidebar_label: 'Manage interfaces'
---

# Manage interfaces

For programmatic use of the Entity Bundle we have set few interfaces:

- EntityCacheManagerInterface
- EntityDefinitionManagerInterface
- EntityPersistManagerInterface
- EntityRetrievalManagerInterface
- EntitySerializerInterface

The actual implementation is a Facade for dispatching required events to achieve specific action.

Here are few guides:

## Retrieve and serialize Entity

```php
class RetrieveAndSerializeExample {
    public function __construct(
        private EntityRetrievalManagerInterface $entityRetrievalManager,
        private EntitySerializerInterface $entitySerializer,
    ) {
    }

    public function retrieveAndSerializeFoo(int $id): array
    {
        $entity = $this->entityRetrievalManager->get(Foo::class, $id);
        if (!$entity) {
            throw new \Exception('Foo not found', 404);
        }

        return $this->entitySerializer->serialize($entity, dataSet: [
            "id" => 1,
            "name" => 1,
        ]);
    }
}
```

:::info Verification
Implementation of manage interfaces always implement whole flow, including user access verification. So, if you are
looking for admin like entity retrieval consider adding verification pass to the flow allowing just that or use events
explicitly like `EntityGet`
:::

## Get entity definition without entity

```php
class GetEntityDefinitionWithoutEntityExample {
    public function __construct(
        private EntityDefinitionManagerInterface $entityDefinitionManager,
    ) {
    }

    public function getFooDefinition(): ?array
    {
        $entity = new Foo(); // Just create the entity if possible
        // Or create new instance without constructor via reflection
        $reflection = new \ReflectionClass(Foo::class);
        $entity = $reflection->newInstanceWithoutConstructor();

        return $this->entityDefinitionManager->getEntityDefinition(entity);
    }
}
```

## Create new entity and then update it


```php
class CreateEntityExample {
    public function __construct(
        private EntityPersistManagerInterface $entityPersistManager,
    ) {
    }

    public function createNewFoo(): Foo
    {
        return $this->entityPersistManager->create(Foo::class, [
            "name" => "Example",
        ]);
    }

    public function updateFoo(int $id): Foo
    {
        return $this->entityPersistManager->create(Foo::class, $id, [
            "name" => "Updated Example",
        ]);
    }
}
```