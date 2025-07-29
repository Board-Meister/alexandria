---
sidebar_position: 2
sidebar_label: 'Entity Bundle integration'
---

# Entity Bundle integration

Integration with Entity Bundle is achieved by `Thumbnail` attribute. Field marked with `Asset` attribute can be
additionally described using `Thumbnail` attributes:

```php
// ...
use Dullahan\Thumbnail\Domain\Attribute\Thumbnail;

// ...
class Post implements OwnerlessManageableInterface
{
    // ...

    #[Dullahan\Field]
    #[Asset]
    #[Thumbnail('small', width: 100, autoResize: true, crop: [100, 100])]
    #[Thumbnail('medium', width: 300, autoResize: true, crop: [300, 300])]
    #[Thumbnail('big', width: 600, autoResize: true, crop: [600, 600])]
    private ?AssetPointer $hero = null;

    // ...
```

At the example above we've added 3 different thumbnail definitions:
- small - The small thumbnail will have the width of 100px, the height will be automatically resized with max size of
the image being 100px x 100px
- medium - The small thumbnail will have the width of 300px, the height will be automatically resized with max size of
the image being 300px x 300px
- big - The small thumbnail will have the width of 600px, the height will be automatically resized with max size of
the image being 600px x 600px

This thumbnail setting will be resolved each time an `Asset` is assigned to the Entity. During update or creation of
the Entity, Thumbnail Bundle, will automatically generate unique thumbnails as per definition.

:::tip Duplicated thumbnails
If the assigned image has already thumbnail with the same settings, the already generated `Thumbnail` entity will be
reused with new `AssetThumbnailPointer`. Thanks to this there will we always reuse already existing thumbnail.
:::

Later when requesting the Entity from the service via REST API you will receive links to the generated thumbnails:

```json
{
  "message": "Entity retrieved successfully",
  "success": true,
  "status": 200,
  "data": {
    "entity": {
      "id": 1,
      "image": {
        "id": 1,
        "src": "http://cms.local/_/asset/15/jackrabbit?v=1753791831",
        "name": "example",
        "weight": 5406,
        "weight_readable": "5.41 KB",
        "extension": "png",
        "thumbnails": {
          "small": "http://cms.local/_/asset/thumbnail/1/jackrabbit",
          "medium": "http://cms.local/_/asset/thumbnail/2/jackrabbit",
          "big": "http://cms.local/_/asset/thumbnail/3/jackrabbit"
        }
      }
    }
  },
  "limit": null,
  "offset": null,
  "total": null,
  "errors": []
}
```

## Thumbnail attribute

The `Thumbnail` attribute has few attributes to allow defining a matching resized image:

### code

The key/id of the thumbnail by which you can later access it.

### width/height

`Thumbnail` requires for you to provide `height` or `width`, or both for the image resize.

### autoResize

The `autoResize` defines if the image should be automatically scaled down with the same width/height ratio. If not set
to true, script will resize image only to defined dimensions.

### crop

The `crop` parameter defines the maximal boundaries of the image. It works well with `autoResize` parameter, lets take
for an example definition like this:

```php
    #[Thumbnail('small', width: 100, autoResize: true, crop: [100, 100])]
```
Without the `crop` if given a image of width 100px and height 1000px, script won't change given image at all. But with
the `crop` it will be cut to the maximal size. By the default the cropping starts from the top left corner but it can be
 changed.

The `crop` is an array that accepts 5 arguments:

0. The width of the crop
1. The height of the crop
2. The transformation on the X axis in pixels
3. The transformation on the Y axis in pixels
4. The one of possible starting points. It is made of two two letter (first one is for X axis, second for Y),
each letter has 3 possible values:
    - S - stands for the Start which is left for the X, and top for Y
    - M - stands for the Middle
    - E - stands for the End which is right for the X, and bottom for Y

    You can set values like `MM` for the middle of the image or `SE`, so the cut starts at the bottom left.