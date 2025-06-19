---
sidebar_position: 2
sidebar_label: 'Authentication'
---

# Authentication

Authentication relies on generating JWT token with `/_/login` endpoint, sending it in `Authorization` as `Bearer`
(together with CSRF token) and refreshing with `/_/user/token/refresh`.

```http title="login.http"
POST /_/login
Host: dullahan.local
Content-Type: application/json

{
  username: 'user@dullahan.local',
  password: 'password'
}
```

```json title="output"
{
  "message": "User authenticated",
  "status": 200,
  "success": true,
  "data": {
    "auth": "eyJhbGciOiJ....JNPiBOlR-3yHun-HGK6KePJLjfg",
    "csrf": "755a17106f1....s21cc9ebbdde8fa8c7b0d1b27b5",
    "user": {
      "details": {...},
      "roles": [
        "ROLE_USER"
      ]
    }
  },
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```

In the example above we have send a login request and received successful response with user identity (`user`), user
signed CSRF token (`csrf`) and authentication JWT token (`auth`).

## Stateless

Dullahan authentication is by default stateless. Stateless authentication is a method where the server doesn't store
user session information. Thanks to this Dullahan authentication is easy to integrate and can be used as SSO between
multiple domains. To achieve this in secure way we are using [JWT](https://jwt.io/introduction)
and [Signed Double-Submit Cookie](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#alternative-using-a-double-submit-cookie-pattern)
as defined by [OWASP](https://owasp.org/).

Default implementation defines that auth token should be included in the `Authorization` header following Bearer Scheme
together with CSRF token the custom header `X-CSRF-Token`.

```http title="user_details.http"
GET /_/user/manage/get
Host: dullahan.local
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJ....JNPiBOlR-3yHun-HGK6KePJLjfg
X-CSRF-Token: 755a17106f1....s21cc9ebbdde8fa8c7b0d1b27b5
```

:::tip Custom CSRF handler
If you wish to implement custom CSRF token handling check out [this guide](./customization.mdx#custom-csrf-token-retrieval).
:::

:::warning CORS
When using default implementation of CSRF handling make sure that your [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Allow-Headers) allows for custom header `X-CSRF-Token`
:::

## CSRF Token

As mentioned above the CSRF token is a [Signed Double-Submit Cookie](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#alternative-using-a-double-submit-cookie-pattern) although send via custom header (`X-CSRF-Token`).

Each CSRF token is assigned to JWT and is valid through the whole session (no need to replace it per request).
Although, you will have to replace it when your session expiries (as defined in JWT) with newly generated token you will
receive when prologing the session.

CSRF token and JWT are linked by `session` [UUIDv7](https://uuid7.com/) identifier which is used to generate CSRF token
and can be found in the JWT payload:
```json
{

  "user": "user@dullahan.localhost",                  // User identifier
  "user_id": 1,                                       // User ID
  "session": "0197875f-590e-739d-b386-4d4b18f5ebfa"   // Session identifier
}
```

This value is regenerated each time new token is issued which makes CSRF token valid through whole JWT session.

## Prologing current session

Each JWT token has its own expiry time as defined in `exp` header alongside other attributes:

```json
{
  "alg": "PS256",                 // Algorithm used
  "jti": "api_62101u660f45d19e",  // The unique identifier
  "iss": "Dullahan",              // The issuer
  "aud": "Users",                 // The recipients
  "iat": 1750318646,              // The time at which the JWT was issued (timestamp)
  "nbf": 1750318646,              // The time before which the JWT MUST NOT be accepted for processing (timestamp)
  "exp": 1750405046               // The expiration time on or after which the JWT MUST NOT be accepted for processing (timestamp)
}
```

Depending on this parameter and other conditions service can decline the user access to requested resources.
To prevent that from happening you should request new token before the old one expiries using `/_/user/token/refresh`
route.

```http title="refresh.http"
PUT /_/user/token/refresh
Host: dullahan.local
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJ....JNPiBOlR-3yHun-HGK6KePJLjfg
X-CSRF-Token: 755a17106f1....s21cc9ebbdde8fa8c7b0d1b27b5
```

```json title="response"
{
  "message": "Token refreshed",
  "status": 200,
  "success": true,
  "data": {
    "auth": "eyJhbGciOiJQUzI1NiI....zGo6Q",
    "csrf": "93a449b6196e68d0a65....2668d"
  },
  "offset": null,
  "limit": null,
  "total": null,
  "errors": []
}
```

:::tip Custom expiry time
The default expiry time is set to be an hour in production (`prod`) and whole day in development (`dev`) environment.
If you wish to change the expiry time of JWT or vary it depending on the user, check out
[this section](./customization.mdx#custom-jwt-expiry-time).
:::

:::warning Multiple tokens for the same user
One user can generate multiple auth tokens at the same time without them colliding or expiring each other.
If you need to have one session per user check out [this guide](./customization.mdx#one-session-per-user).
:::


## How to: Swagger authentication

When using [NelmioApiDoc Bundle](https://symfony.com/bundles/NelmioApiDocBundle/current/index.html) you can define how
to authenticate yourself in their package config file:

```yaml title="config/packages/nelmio_api_doc.yaml"
nelmio_api_doc:
    areas:
        path_patterns:
            - ^/_
        name_patterns:
            - ^api\_
    documentation:
        info:
            title: Dullahan
            description:
            version: 1.0.0
        security:
            - Bearer: []
            - CSRF: []
        components:
            securitySchemes:
                Bearer:
                    type: http
                    scheme: bearer
                    bearerFormat: JWT
                CSRF:
                    type: apiKey
                    in: header
                    name: X-CSRF-Token
                    description: CSRF token
```
Now, you can use `/_/login` route to generate tokens and then `Authorize` button at the top od the page (or lock icon
visible at each route) to save them for the next requests. You can read a little more about it
[here](/docs/dullahan/api#automatic-openapi-documentation).

