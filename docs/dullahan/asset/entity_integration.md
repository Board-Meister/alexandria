---
sidebar_position: 4
sidebar_label: 'Entity integration'
---

# Entity integration

Asset Bundle has a build way to define asset fields inside entities managed by
[Entity Bundle](/docs/dullahan/entity/README.md). It works by annotating field with `Asset` attribute.

Here is our example entity from [creating your first entity](/docs/dullahan/entity/first_object.md), let's add a hero
image to our post:
```php
use Dullahan\Asset\Domain\Attribute\Asset;
use Dullahan\Asset\Domain\Entity\AssetPointer;

#[ORM\Entity(repositoryClass: PostRepository::class)]
#[Dullahan\Entity(PostConstraint::class)]
class Post implements OwnerlessManageableInterface
{
    // ...

    #[Asset]
    #[Dullahan\Field]
    #[ORM\Column(length: 255)]
    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?AssetPointer $hero = null;

    // ...
```

And let's extend our [validation class](/docs//dullahan/entity/first_object.md#validation) to accommodate that change:

```php
class PostConstraint implements EntityValidateConstraintInterface
{
    // ...

    protected static function getConstraint(): array
    {
        return [
            // ...
            'hero' => new Assert\Optional([
                new Assert\Positive([
                    'message' => 'Hero image must be an integer',
                ]),
            ]),
        ];
    }
}
```

Now we can create or update our post with chosen asset:

```http
POST http://dullahan.localhost/_/user/entity/create/main/Post
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json

{
  "dataSet": {
    "id": 1,
    "hero": 1
  },
  "entity": {
    "hero": 1
  }
}
```

This request will automatically generate new `AssetPointer` creating relation between our entity and chosen asset (ID of 1).

The same principal applies when using Entity Manage Interfaces to programmatically set the image:

```php
use Dullahan\Entity\Port\Application\EntityPersistManagerInterface;

class SetHeroImage {
    public function __construct(
        private EntityPersistManagerInterface $entityPersistManager,
    ) {
    }

    public function setHeroImageOnPost(Post $post, Asset $asset): void
    {
        $post = $this->entityPersistManager->update($post::class, $post->getId(), [
            "hero" => $asset->getId(),
        ]);

        echo $post->getHero()::class; // Dullahan\Asset\Domain\Entity\AssetPointer
        var_dump($post->getHero()->getAsset() === $asset) // bool(true)
    }
}
```
This will also generate new `AssetPointer` during the flow.

## Asset attribute parameters

The `Asset` attribute has few useful parameters that can help you with managing your entities.

### conjoined

When asset is marked as `conjoined` it will be removed together with assigned entity. It is useful when entity has
a unique image assigned to them and is not used anywhere else - por example user avatar.

```php
class Post implements OwnerlessManageableInterface
{
    #[Asset(conjoined: true)]
    private ?AssetPointer $hero = null;
```

:::tip Not Asset Pointer
`AssetPointer` is removed anytime one of the parts of the relation is removed (be it Asset or Entity) but conjoined
actually removes the `Asset` entity from database when Entity is deleted but when `Asset` is remove the related Entity
will stay.
:::

:::tip Multiple entities on conjoined image
It is possible to have multiple entities point to the same conjoined `Asset`. But when at least one of those Entities
is removed, the `Asset` (and its other relations) will also be deleted leaving the rest of Entities with empty fields.
:::

### private

:::danger Deprecated
:::