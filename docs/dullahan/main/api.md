---
sidebar_position: 1
sidebar_label: 'REST API'
---

# REST API

For the REST API we can find quite a few classes and functionality:

## Response

The `Response` class is a implementation of the standard response described in [REST API](/docs/dullahan/api.md)
documentation. Use when defining Saga events or when creating responses for the controller actions.

## Swagger\Open API

For the `Swagger` or `Open API` auto documentation we have few helpers classes:
- ResponseAbstractDTO
- FailureDTO
- SuccessDTO

You can use the like, so:

```php
class AdminRegisteredDTO extends SuccessDTO
{
    #[SWG\Property(example: 'Admin registered', description: 'Description of the successful request')]
    public string $message;
}
```

```php
#[SWG\Response(
    description: 'Admin registered',
    content: new Model(type: AdminRegisteredDTO::class),
    response: 200
)]
```

## HTTP Util

:::danger DEPRECATED
:::

## Error Collector

The Error collector class is responsible for saving all errors that happened during execution and returning them tu
user. When converting exception to the proper JSON response, services automatically attaches all error saved with
Error Collector.

```php
use Dullahan\Main\Contract\ErrorCollectorInterface;

class SaveErrorExample {
    public function __construct(
        protected ErrorCollectorInterface $errorCollector,
    ) {
    }

    public function addError(): void
    {
        $this->errorCollector->addError('Error for nested form field', ['user', 'name']);
        // This will error that will be resolved to ['user' => ['name' => ['Error for nested form field']]]
    }
}
```

## RequestInterface && Request

Dullahan has its own implementation of the `RequestInterface` but feel free to define your own. `Request` class is used
to hold all required data about the request and the original request.

## Request factory

To convert one type of request to the universal implementing `RequestInterface` we use RequestFactory:

```php
use Dullahan\Main\Service\RequestFactory;
use Symfony\Component\HttpFoundation\Request;

class ConvertSymfonyRequestExample {
    public function __construct(
        protected RequestFactory $requestFactory,
    ) {
    }

    public function convertRequest(Request $symfonyRequest): void
    {
        $dullahanRequest = $this->requestFactory->symfonyToDullahanRequest($symfonyRequest);
    }
}
```
