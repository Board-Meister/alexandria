---
sidebar_position: 3
sidebar_label: 'Field Attribute'
---

# Field Attribute

The `Field` attribute is a little more then just a marker. It gives ability to attach few static properties to the
fields.

### `auto`

Allows you to define a static closure (`forward_static_call`) that will return a value for this field.

```php
class Foo {
    #[Dullahan\Field(auto: [[LoadService:class, 'load'], 'data.json'])]
    private string $staticallySetProperty;
}
```

### `enum`

Sets this field enum, to which script will try to convert.

:::warning
Has to be accompanied with `type` set to `FieldTypeEnum::ENUM`.
:::

### `important`

:::danger Deprecated
:::

### `limit`

This collection when retrieved will be always cut to the specified size in the `limit`.

:::info Data Set `__max`
The Data Set attribute `__max` overwrites the `Field` limit.
:::

### `order`

Allows to set the default direction in which this entity will be retrieved when accessed as a collection.

:::info ID
Order is set by the ID property
:::

### `plural`

Allows you to define the plural form of the field. Script automatically creates plural getter for the collections
and this attribute allows you to define your custom one.

### `relation`

Relation parameter allows you to define relation type this field has. Accepts string and the possible values are:

- Doctrine\ORM\Mapping\ManyToMany
- Doctrine\ORM\Mapping\OneToMany

:::warning Required
It is required for any collection type field type
:::

:::danger Value deprecated
The values are currently relating to doctrine classes which support will be removed in favour of internal relation
definitions
:::

### `type`

Defines the custom type of the field.