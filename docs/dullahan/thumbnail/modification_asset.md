---
sidebar_position: 1
sidebar_label: 'Asset Bundle extension'
---

# Asset Bundle extension

Thumbnails go straight into Asset Bundle life cycle - extending REST API responses or generating relations to the
Asset entities like AssetPointer.

## Extended responses

With thumbnails bundle you get information about asset thumbnails straight in the response. For example when accessing
`/_/asset/1` you will receive:

```json
{
  "message": "Image retrieved successfully",
  "status": 200,
  "success": true,
  "data": {
    "image": {
      "id": 1,
      "name": "example",
      "extension": "png",
      "src": "http://cms.local/_/asset/15/jackrabbit?v=1753791831",
      "weight": 5406,
      "mime_type": "image/png",
      "weight_readable": "5.41 KB",
      "thumbnails": [
        {
          "id": 1,
          "src": "http://cms.local/_/asset/thumbnail/25/jackrabbit",
          "name": "488e0a32b19093d932caea81058ed6a8",
          "weight": 5406,
          "weight_readable": "5.41 KB",
          "pointers": {
            "small": {
              "id": 5
            }
          },
          "dimensions": {
            "width": 100,
            "height": 100
          }
        },
        {
          "id": 2,
          "src": "http://cms.local/_/asset/thumbnail/26/jackrabbit",
          "name": "5e8f3b25146d6e22a01a74dc2ed3f41a",
          "weight": 7463,
          "weight_readable": "7.46 KB",
          "pointers": {
            "medium": {
              "id": 5
            }
          },
          "dimensions": {
            "width": 300,
            "height": 300
          }
        }
      ],
      "pointers_amount": 1,
      "path": "/example.png"
    }
  },
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```

As you can see information about generated thumbnails was added to the response:

```json
{
    "id": 1,
    "src": "http://cms.local/_/asset/thumbnail/25/jackrabbit",
    "name": "488e0a32b19093d932caea81058ed6a8",
    "weight": 5406,
    "weight_readable": "5.41 KB",
    "pointers": {
    "small": {
        "id": 5
    }
    },
    "dimensions": {
        "width": 100,
        "height": 100
    }
}
```

## Asset joined life cycle

Generated thumbnails will automatically get removed when related `Asset` gets removed. The same goes for
`AssetPointers` - when relation between Entity and Assets ceases to exist it will automatically be detected and
related thumbnails will be removed.

