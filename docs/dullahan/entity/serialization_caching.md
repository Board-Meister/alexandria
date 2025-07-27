---
sidebar_position: 4
sidebar_label: 'Serialization & Caching'
---

# Serialization & Caching

It is important to have adequate serialization technics when sending data across the wire. All API End Points use the
same serialization mechanisms to return you data in JSON format without asking you to define serialization for each
of your entities.

And together with caching we can achieve quite the performance when it comes to retrieving data. But caching becomes
difficult when we take into account updates on specific entities which might have relations to other objects and
therefore are cached together with them. To accommodate this update we would have to clear any cache with relation to
this entity which is suboptimal.

With that in mind we have implemented three step process for serialization & caching:
- serialize scalar data
- cache serialized data
- hydrate data with relations on cache retrieval

We only save simple types in one key-value par with annotation about entity relations. This way
we can easily replace old result without worrying about the relationships and still retrieve the updated entity without
having to change anything in other key-value pairs.

## Manage serialization handles

If your data type requires custom serialization methods it is possible to register your own method or serialization via
`RegisterEntityNormalizer` event:

```php
class EntitySerializerListener {
     public function onRegisterEntityNormalizer(RegisterEntityNormalizer $event): void
    {
        $event->register($customNormalizerLast);                // Registers as the last normalizer
        $event->register($customNormalizerSpecific, 10);        // Registers at the specific order
        $event->register($customNormalizerSpecificFloat, 10.1); // Registration method also accepts floats
    }
}
```

Registered normalizers are called upon in ascending order (1 => 2 => 3) and each value goes through each normalizer.
Which means that order is important if your value can handle multiple serializers.

For this reason there is an option to remove already registered normalizer with `unregister`:

```php
class EntitySerializerListener {
     public function onRegisterEntityNormalizer(RegisterEntityNormalizer $event): void
    {
        // ...
        $event->unregister(NormalizerToReplace::class);
    }
}
```
This will result in script finding this normalizer and removing it from registration making it very easily to
supplement your own methods for serialization.

### Create custom normalizer

To create custom normalizer you have to implement `NormalizerInterface` and register it at `RegisterEntityNormalizer`
event as mentioned before:

```php
use Dullahan\Entity\Port\Domain\NormalizerInterface;

class CustomNormalizer implements NormalizerInterface
{
    public function normalize(
        string $fieldName,
        mixed $value,
        array $definition,
        object $entity,
        Context $context,
    ): mixed {
        return $this->normalizeCustomValue($value);
    }

    public function canNormalize(
        string $fieldName,
        mixed $value,
        array $definition,
        object $entity,
        Context $context,
    ): bool {
        return 'custom' === $definition['type'];
    }
}
```

## Handling entity caching

Entity related information are cached during `CacheEntity` event which accepts the cache key, cache value and expire time.
If you want to change caching duration or under what key they are cached, register your listener
before this event and change those options. You could event decide expiry time per entity, or make cache depended on
the logged user if you wished for:

```php
class EntityCacheListener {
     public function onCacheEntity(CacheEntity $event): void
    {
        $event->expiry = DateInterval::createFromDateString('1 day');
        $event->expiry = 60 * 60 * 24;
        $event->expiry = null; // If should never expire if there is not default expiry time set

        $event->key .= $this->getUser()->getId(); // Mark each key with current user ID

        if ($event->entity instanceof Foo) {
            $event->expiry = 60;
        }
    }
}
```

:::warning Not only serialization
During `CacheEntity` we are not only caching serialized entities but also any Entity related information like
definitions. `CacheEntity` event has property which defines the purpose of the current dispatch under the name `case`.
All default cases of entity serialization are defined in `EntityCacheCaseEnum`.
:::

```php
use Dullahan\Entity\Domain\Enum\EntityCacheCaseEnum;

class EntityCacheListener {
     public function onCacheEntity(CacheEntity $event): void
    {
        if ($event->case === EntityCacheCaseEnum::DEFINITION->value) {
            echo "We are caching entity definition!"
        } else if ($event->case === EntityCacheCaseEnum::SERIALIZATION->value) {
            echo "We are caching serialized entity!"
        }
    }
}
```

## Retrieving cached entity

Cached entity retrieval happens on the `GetEntityCache`. The only notable information about this process is the `cast`
property which defines in what format found data will be returned.

Default implementation handles all format available in the `EntityCacheCastEnum` enum. If you wish to expand this list
you will need to setup <u>after</u> the event, when the cache is retrieved and you could try to cast it to requited
format.

## Cache hydration

After serialized entity was retrieved it goes through a process of hydrating it which essentially resolves to
loading relation if requested in Data Set. No additional entities are loaded if they were not mentioned in Data Set
parameter.

This process happens during `StripSerializedEntity` event, which removes not requested/loads not present fields
(mostly relations).

:::warning Not extendable at the moment
Currently this process is not easily extendable. The only option you have to set your script after it was called and
managed data present in `serialized` property.
:::

## Advanced topis - relation annotation structure

Here is an example of cached entity with two different relation annotations:

```json

{
    "id": 1,
    "name": "Main",
    "barCollection": {
        "__cached": {
            "fieldAttr": {
                "relation": "Doctrine\\ORM\\Mapping\\ManyToMany",
                "important": [],
                "order": null,
                "limit": null,
                "type": null,
                "auto": null,
                "plural": null,
                "enum": null,
                "hint": "App\\Entity\\Bar"
            },
            "field": "barCollection",
            "entity": "App\\Entity\\Foo",
            "id": 1
        }
    },
    "userData": {
        "__cached": "main:class:Dullahan-User-Domain-Entity-UserData:1:1"
    }
}
```

### Cache key

If in the `__cached` property we have simple string it means that this is OneToOne or ManyToOne relation and the string
is just a cache key to retrieve serialized entity.

### Cache object

If in the `__cached` property we find object it represents ManyToMany ot OneToMany relation where we will be retrieving
a collection of related entities.

The `fieldAttr` property is just a representation of `Dullahan\Field` attribute that each property managable by Dullahan
has defined in the JSON form.