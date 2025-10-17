---
sidebar_position: 1
sidebar_label: 'Asset API'
---

# Asset API

Asset Bundle comes packaged with REST API for managing your assets. Core idea is to produce a tools that will allow
for creating hierarchical structure with abstract files and folders. All of that topped on Jackrabbit service if you
would require to extend even further your file management or needed access via
 [WebDAV](https://en.wikipedia.org/wiki/WebDAV) to your files.

## Upload new asset

To upload new asset we use `/_/user/asset/upload/image` with POST method, it accepts three parameters: name under we want
to upload our file, path where we want to locate it and the actual image:
```http
POST http://dullahan.localhost/_/user/asset/upload/image
Content-Type: multipart/form-data
Authorization: ...
X-CSRF-Token: ...
Accept: application/json
name=example.png
path=/test/path/
image=@example.png;type=image/png
```

:::info
End point requires the usage of `multipart/form-data` and is only available to logged users
:::

This request will result in:

```json
{
  "message": "Image uploaded successfully",
  "status": 200,
  "success": true,
  "data": {
    "image": {
      "id": 1,
      "name": "example",
      "extension": "png",
      "src": "http://dullahan.localhost/_/asset/1/jackrabbit?v=1753721780",
      "weight": 21049,
      "mime_type": "image/png",
      "weight_readable": "21.05 KB",
      "pointers_amount": 0,
      "path": "/test/path/example.png"
    }
  },
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```
:::tip
Response comes with the public path to the image (the actual URL can differ based on used file system abstraction).
Notice that those are not pretty URL and they contain the id and version of the image. This is, so you can easily
and without care move and rename the asset without having to worry that URL will become obsolete or point to wrong
asset. Version is just used for cache bursting, it doesn't actually retrieve image with that version.
:::

:::warning
You cannot create asset in directory that doesn't exist.
:::

## Retrieve uploaded image

To retrieve information about uploaded image we use `/_/asset/{id}` which accepts one path parameter: id of the image.

```http
GET http://dullahan.localhost/_/asset/1
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json
```
This will result in:

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
      "src": "http://dullahan.localhost/_/asset/1/jackrabbit?v=1753721780",
      "weight": 21049,
      "mime_type": "image/png",
      "weight_readable": "21.05 KB",
      "thumbnails": [],
      "pointers_amount": 0,
      "path": "/test/path/example.png"
    }
  },
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```

## Retrieve list of image

To retrieve information about uploaded images we use `/_/asset/list` which accepts one query parameter pagination
([here](/docs/dullahan/entity/crud.md#pagination) you can read more about pagination object)

```http
GET http://dullahan.localhost/_/asset/list
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json

{
  pagination: {
    offset: 0,
    limit: 100,
    filter: [["directory", "=", "/test/"]]
  }
}
```

:::warning
Not specifying the directory `filter` will result in assets from every directory
:::

And out result:

```json
{
  "message": "Images retrieved successfully",
  "status": 200,
  "success": true,
  "data": {
    "images": [
      {
        "id": 1,
        "name": "example",
        "extension": "png",
        "src": "http://dullahan.localhost/_/asset/11/jackrabbit?v=1753721780",
        "weight": 21049,
        "mime_type": "image/png",
        "weight_readable": "21.05 KB",
        "thumbnails": [],
        "pointers_amount": 0,
        "path": "/test/path/example.png"
      }
    ]
  },
  "offset": 0,
  "limit": 10,
  "total": 1,
  "errors": []
}
```

## Reupload image

When you want to replace already existing asset with different content you can use `/_/user/asset/upload/image/{id}`
which accepts one parameter in the path: `id` of the asset and one parameter in the body: the asset to replace with.

```http
POST http://dullahan.localhost/_/user/asset/upload/image/1
Content-Type: multipart/form-data
Authorization: ...
X-CSRF-Token: ...
Accept: application/json
image=@new_example.jpg;type=image/jpg
```

This will result in similar response when you upload the image:

```json
{
  "message": "Image updated successfully",
  "status": 200,
  "success": true,
  "data": {
    "image": {
      "id": 1,
      "name": "example",
      "extension": "jpg",
      "src": "http://dullahan.localhost/_/asset/1/jackrabbit?v=1753722902",
      "weight": 146761,
      "mime_type": "image/jpeg",
      "weight_readable": "146.76 KB",
      "thumbnails": [],
      "pointers_amount": 0,
      "path": "/test/path/example.jpg"
    }
  },
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```

:::info Automatic extension change
Notice that system detected that extensions don't match and updated it automatically.
:::

## Create folder

To create folder we use `/_/user/asset/upload/folder` which accepts in the body two parameters: `parent` which is the
path to the parent folder and `name` of new folder:

```http
POST http://dullahan.localhost/_/user/asset/upload/image/1
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json
{
  "parent": "/",
  "name": "exampleFolder"
}
```

This will result in:

```json
{
  "message": "Folder created successfully",
  "status": 200,
  "success": true,
  "data": {
    "folder": {
      "id": 2,
      "name": "exampleFolder",
      "extension": "",
      "src": "http://dullahan.localhost/_/asset/2/jackrabbit?v=1753723343",
      "weight": 4000,
      "mime_type": "",
      "weight_readable": "4.00 KB",
      "thumbnails": [],
      "pointers_amount": 0,
      "path": "/exampleFolder"
    }
  },
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```

## Move/rename the asset

To move an asset we use `/_/user/asset/move`, you can also rename it with the same endpoint. It accepts two parameters
in the body: `from` and `to`:

```http
POST http://dullahan.localhost/_/user/asset/move
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json
{
  "from": "/test/path/example.jpg",
  "name": "/exampleFolder/move_example.jpg"
}
```

And the response:

```json
{
  "message": "Asset moved successfully",
  "status": 200,
  "success": true,
  "data": {
    "asset": {
      "id": 1,
      "name": "move_example",
      "extension": "jpg",
      "src": "http://dullahan.localhost/_/asset/1/jackrabbit?v=1753723819",
      "weight": 146761,
      "mime_type": "image/jpeg",
      "weight_readable": "146.76 KB",
      "thumbnails": [],
      "pointers_amount": 0,
      "path": "/exampleFolder/move_example.jpg"
    }
  },
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```

:::info
Notice that URL to the asset stayed the same
:::


## Remove the asset

To remove the asset we use `/_/user/asset/{id}/remove` which accepts one parameter in the path: the id of the asset.

```
DELETE http://dullahan.localhost/_/user/asset/1/remove
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json
```

Which will result in:

```json
{
  "message": "Asset successfully deleted",
  "status": 200,
  "success": true,
  "data": [],
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```

:::tip
You can remove folders using the same End Point.
:::

## Retrieve the assets contents

There is an endpoint responsible for streaming the asset back `/_/asset/{id}/jackrabbit`. It is available only if you
 are using Jackrabbit file system implementation.

:::tip Cache the response
It is wise to filter movement to that End Point with big expiry time on the caching response, as those responses with
the assets contents are taken straight from database. So, if your are using NGINX or Varnish for request caching
fill obligated to set late expiry time on that endpoint.
:::