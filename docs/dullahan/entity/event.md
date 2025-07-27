---
sidebar_position: 5
sidebar_label: 'Events'
---

# Events

This bundle follows [Event Core](/docs/dullahan/architecture.md#event-core) principals which means that all actions
are event based.

In our Event Driven Architecture we have defined 6 different Sagas:
- ListEntitiesSaga
- ViewEntitySaga
- CreateEntitySaga
- UpdateEntitySaga
- RemoveEntitySaga
- BulkListEntitiesSaga

As you could deduce after reading [Entity API](./crud.md) each Saga is corresponding to an End Point. But it doesn't
means that each EP only runs single Saga. For example to create new entity we are firstly running `CreateEntitySaga` then
`ViewEntitySaga` to retrieve it. Although we never should call Saga inside another Saga it is allowed to call them one
after another. And with the previous example we have shown how we've achieved separation of concerns mentioned by CQRS
(write/read).

Aside Sagas we have 22 Events responsible for smaller steps/chapters of the story:
- CacheEntity
- CacheRemoveEntityId
- CacheRemoveEntity
- CacheRemoveRelated
- CreateEntity
- !!! EXPERIMENTAL !!! FillInheritanceAwareEntity
- GetEntityCache
- GetEntityDefinition
- GetEntity
- GetEntityRepository
- GetEntityTrueClass
- PersistCreatedEntity
- PersistUpdatedEntity
- RegisterEntityNormalizer
- RemoveEntity
- SerializeEntity
- StripSerializedEntity
- UpdateEntity
- ValidateCreateEntity
- ValidateUpdateEntity
- VerifyEntityAccess
- VerifyEntityOwnership

As you can see from reading them, they are not mere notification of action that will/has already happened but the actual
actions handling the specific need. Any of those events can be prevented as mentioned in
[Preventable Event](/docs/dullahan/events.md#preventable) and replaced with your implementation.

:::tip Before or After the event
If you need to do something before or after the event, then make sure to use Event Managers functionality to order
events and set it to required value keeping in mind that default event handling happens at priority 0.
:::