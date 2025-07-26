---
sidebar_position: 2
sidebar_label: 'Entity API'
---

# Entity API

API for managing Entities is flexible enough to accommodate for most CRUD calls. The idea is to not create separate
functionality and have one flexible set of End Points for the Front End needs. Thanks to this we are avoiding
API CRUD EP hell of creating separate action points for every action on our entities.

:::tip Standard response
Make sure that you are familiar with [standard Dullahan response](/docs/dullahan/api.md#standardized-response).
:::

We have:

- <span style={{width:'200px', display: 'inline-block'}}>Entity list retrieval</span> `GET /_/entity/list/{mapping}/{path}`
- <span style={{width:'200px', display: 'inline-block'}}>Single entity retrieval</span> `GET /_/entity/get/{mapping}/{path}/{id}`
- <span style={{width:'200px', display: 'inline-block'}}>Entity creation</span> `POST /_/user/entity/create/{mapping}/{path}`
- <span style={{width:'200px', display: 'inline-block'}}>Entity update</span> `PUT /_/user/entity/update/{mapping}/{path}/{id}`
- <span style={{width:'200px', display: 'inline-block'}}>Entity removal</span> `DELETE /_/user/entity/delete/{mapping}/{path}/{id}`
- <span style={{width:'200px', display: 'inline-block'}}>Bulk retrieval</span> `GET /_/entity/bulk/{mapping}`

## Common parameters

To not repeat to many times the same information we have few common parameters available in most of our routes:
- `mapping` - Path parameter, defines which mapping service should use to resolve requested entity
- `path` - Path parameter, an actual path to the entity. Make sure that you don't accidentally add parts of the path defined in the mapping.
For example if we have an entity `App\Entity\Nested\Foo` with defined mapping `main` to `App\Entity` then we would have to create
route like this `/_/entity/list/main/Nested\Foo` to list this resource
- `id` - Path parameter, a ID of object we want to access
- [Data Set](./crud#dataset) - Query parameter, similar to GraphQL, defines what fields service should return
- [Pagination](./crud#pagination) - Query parameter, defines a little more than pagination: filters, joins, sorting and pagination


## Retrieve list of entities

To retrieve multiple entities from database we use `/_/entity/list/{mapping}/{path}` EP. It accepts two arguments in the
 path and another two in the query.

```http
GET http://dullahan.localhost/_/entity/list/main/Foo
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json

{
  "dataSet": {
    "id": 1,
    "name": 1
  },
  "pagination": {
    "limit": 10,
    "offset": 0
  }
}
```

Will result in:

```json
{
  "message": "Entities retrieved successfully",
  "success": true,
  "status": 200,
  "data": {
    "entities": [
      {
        "id": 1,
        "name": "John"
      },
      {
        "id": 2,
        "name": "Andrew"
      },
      {
        "id": 3,
        "name": null
      }
    ]
  },
  "limit": 10,
  "offset": 0,
  "total": 3,
  "errors": []
}
```

## Retrieve one entity

To retrieve single entity from database we use `/_/entity/list/{mapping}/{path}/{id}` EP. It accepts three arguments in
the path and one in the query.

```http
GET http://dullahan.localhost/_/entity/list/main/Foo/1
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json

{
  "dataSet": {
    "id": 1,
    "name": 1
  }
}
```

Will result in:

```json
{
  "message": "Entity retrieved successfully",
  "success": true,
  "status": 200,
  "data": {
    "entity": {
      "id": 1,
      "name": "Andrew"
    }
  },
  "limit": null,
  "offset": null,
  "total": null,
  "errors": []
}
```

## Create entity

To create an entity we use `/_/user/entity/create/{mapping}/{path}` EP. It accepts two arguments in
the path and another two in the body.

```http
POST http://dullahan.localhost/_/user/entity/create/main/Foo
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json

{
  "dataSet": {
    "id": 1,
    "name": 1
  },
  "entity": {
    "name": "John"
  }
}
```

Will result in:

```json
{
  "message": "Entity successfully created",
  "success": true,
  "status": 200,
  "data": {
    "entity": {
        "id": 1,
        "name": "John"
    }
  },
  "limit": null,
  "offset": null,
  "total": null,
  "errors": []
}
```

## Update entity

To update an entity we use `/_/user/entity/update/{mapping}/{path}/{id}` EP. It accepts three arguments in
the path and two in the body.

```http
PUT http://dullahan.localhost/_/user/entity/create/main/Foo/1
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json

{
  "dataSet": {
    "id": 1,
    "name": 1
  },
  "entity": {
    "name": "New John"
  }
}
```

Will result in:

```json
{
  "message": "Entity successfully updated",
  "success": true,
  "status": 200,
  "data": {
    "entity": {
        "id": 1,
        "name": "New John"
    }
  },
  "limit": null,
  "offset": null,
  "total": null,
  "errors": []
}
```

## Delete entity

To delete an entity we use `/_/user/entity/update/{mapping}/{path}/{id}` EP. It accepts three arguments in
the path.

```http
DELETE http://dullahan.localhost/_/user/entity/create/main/Foo/1
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json
```

Will result in:

```json
{
  "message": "Entity successfully deleted",
  "success": true,
  "status": 200,
  "data": [],
  "limit": null,
  "offset": null,
  "total": null,
  "errors": []
}
```

## Retrieve bulk list of entities

To retrieve multiple different entities at once from database we use `/_/entity/bulk/{mapping}` EP. It accepts one argument in the
 path and another one in the query.

### Bulk query parameter

Bulk parameter is basically a nested set of Entity list retrievals. Its
a object with custom name as key (under which the results will appear),
and value is an object made of three parameters: path, dataSet and pagination (path is required).

```http
GET http://dullahan.localhost/_/entity/bulk/main
Content-Type: application/json
Authorization: ...
X-CSRF-Token: ...
Accept: application/json

{
    "bulk": {
        "FooList": {
            "path": "Foo",
            "dataSet": {
                "name": 1
            },
            "pagination": {
                "limit": 10,
                "offset": 0
            }
        },
        "BarList": {
            "path": "Bar",
            "dataSet": {
                "author": 1
            },
            "pagination": {
                "limit": 10,
                "offset": 0
            }
        }
    }
}
```

Will result in:

```json
{
  "message": "Entities retrieved successfully",
  "success": true,
  "status": 200,
  "data": {
    "bulk": {
      "FooList": {
        "entities": [
          {
            "name": "John"
          }
        ],
        "limit": 10,
        "offset": 0,
        "total": 1
      },
      "BarList": {
        "entities": [
          {
            "author": "James Louise"
          }
        ],
        "limit": 10,
        "offset": 0,
        "total": 1
      }
    }
  },
  "limit": null,
  "offset": null,
  "total": null,
  "errors": []
}
```


## Data Set

Data Set is a JSON defining what fields should be included in the response. It works as a map with fields as keys and
some truthy value as values:

```json
{
    "author": 1,
    "books": {
        "id": 1,
        "title": 1
    }
}
```

With that you will be able to receive exactly what you need:

```json
[
    {
        "author": "John William",
        "books": [
            {
                "id": 231,
                "title": "The wind"
            },

            {
                "id": 345,
                "title": "Great flood"
            }
        ]
    },
    {
        "author": "Paweł Szkiełko",
        "books": []
    }
]
```
### Meta fields

DataSet accepts meta fields which are special fields starting with double floor `__`:

#### `__max`

Available only in collections, makes it so not entire collection is retrieved but only up to the maximum:

```json
{
    "books": {
        "__max": 1,
        "id": 1,
    }
}
```

Output:
```json
[
    {
        "books": [
            {
                "id": 231,
            },
        ]
    },
    {
        "books": []
    }
]
```

#### `__criteria`

Available only in collections, sets additional simple filtering parameters that will narrow down the collection results:

```json
{
    "books": {
        "__criteria": {
            "eq": ["year", 1920]
        },
        "id": 1,
        "year": 1
    }
}
```

Output:
```json
[
    {
        "books": [
            {
                "id": 345,
                "year": 1920
            },
        ]
    }
]
```

Available criteria:
- Is equal: `"eq": ["year", 1920]`
- Greater then:  `"gt": ["year", 1920]`
- Lesser then: `"lt": ["year", 1920]`
- Greater or Equal: `"gte": ["year", 1920]`
- Lesser or Equal:  `"lte": ["year", 1920]`
- Not Equal:  `"neq": ["year", 1920]`
- Is Null: `"isNull": ["year"]`
- Is in:  `"in": ["year", [1920]]`
- Is not in: `"notIn": ["year", [1920]]`
- And: `"andX": [{"gt": ["year", 1920]}, {"neq": ["year", 1925]}]`
- Or: `"orX": [{"isNull": ["year"]}, {"neq": ["year", 1925]}]`

## Pagination

Although it is referred as a Pagination DTO it is a little more then just setting up page size and page number.
Of course it defines the amount of results, but it also defines how output is sorted, additional
filters, column grouping, and even joins with other tables used for filtering.

```json
{
  "limit": 10,
  "offset": 0,
  "sort": [
    {
      "column": "id",
      "direction": "ASC"
    }
  ],
  "filter": [
    ["column", "=", "value"],
    "AND",
    ["alias.column2", "!=", "value2"]
  ],
  "join": [
    ["column", "alias"]
  ],
  "group": ["column"]
}
```

:::tip All fields optional
All fields in Pagination DTO are optional
:::

All of those options are bundled inside one object due to having impact on the amount and order or data we retrieve.

### limit

An integer defining how many records to return at once.

### offset

An integer defining from where to start counting records to return.

### sort

An array of Sort DTO object defining the order of the results.

Sort DTO is made of two properties:
- column - name of the column to sort by on
- direction - the direction of the sorting, it accepts two values `ASC` which stands for ascending and `DESC` which
stands for descending

```json
{
    "sort": [
        {
            "column": "id",
            "direction": "ASC"
        },
        {
            "column": "column",
            "direction": "DESC"
        }
    ]
}
```

### join

An array allowing for setting up joins to another tables, the join must be defined in the Entity definition otherwise it will
return an error. It is possible to define chained joins from already joined table to another and use those tables in the
filter property.

```json
{
    "join": [
        ["column", "alias"],
        ["alias.column2", "alias2"]
    ]
}
```

### filter

An array containing semi-SQL variation of strings and arrays. There are essentially 7 different types of possible values:

#### Connector

Connector is a string that joins previous values or manages scope. We have 4 different types of connectors:
- `AND` - joins left and right side of query where both sides have to be true
- `OR` - joins left and right side of query where at least one side has to be true
- `(` - opens a scope useful when trying to combine `AND` and `OR` connectors
- `)` - closes the scope

#### Compare

Compares define operations on the columns (e.g. is equal, is null etc.) which we have 3 types:

##### Simple compare

Simple compare is an array made of three segments. First is the column name (can be prefixed with alias if join is
defined), second is the operator and third is the value (either string or numeric).

```json
{
  "filter": [
    ["column", "=", "value"]
  ]
}
```

We have 10 different operators available:
- `!=` - Is not equal
- `=` - Is equal
- `IS` - Is something (useful when checking if column is NULL)
- `IS NOT` - Is not something (useful when checking if column is not NULL)
- `<` - Is lesser
- `>` - Is greater
- `<>` - Is not the same
- `>=` - Is lesser or equal
- `<=` - Is greater or equal
- `LIKE` - Like operator, is similar


##### Array compare

Array compare is structurally very similar to Simple compare.
The only difference is that is accepts an array of values third parameter and requires the second parameter (operator)
to be `IN` or `NOT IN`:

```json
{
  "filter": [
    ["column", "NOT IN", [1,2,3]]
  ]
}
```

##### Between compare

Between compare is special because it has 5 segments. First is column name, second must be `BETWEEN`, third first value,
fourth must be `AND` and last one is the second value. Each value must be a string.

```json
{
  "filter": [
    ["column", "BETWEEN", "2020-01-01", "AND", "2021-01-01"]
  ]
}
```

With this we can build quite the query and cover most of the common cases.

```json
{
  "filter": [
    "(", ["column", "!=", "value"], "AND", ["column2", ">=", "value2"], ")",
    "OR", ["column3", "BETWEEN", "2020-01-01", "AND", "2021-01-01"]
  ]
}
```