---
sidebar_position: 2
sidebar_label: 'Utility'
---

# Utility

Main Bundle comes with few utility classes to give additional options to possible issues.

## Background process service

This service allows to spin a new process in the background.

```php
use Dullahan\Main\Service\BackgroundProcessService;

class BackgroundProcessExample {
    public function __construct(
        protected BackgroundProcessService $backgroundProcessService,
    ) {
        /** @var \Symfony\Component\Process\Process */
        $process = $backgroundProcessService->create('php bin/console app:long:process', ['arg' => 'one', 'argTwo' => 2]);
    }
}
```

## Runtime cache service

When you need to save something to later retrieve it but don't want it to persist between sessions Main Bundles
come with `Dullahan\Main\Service\RuntimeCachePoolService` which is an variation of
[PSR-6 CacheItemPoolInterface](https://www.php-fig.org/psr/psr-6/) (it is missing `saveDeferred` and `commit`, as
there is no "later").

## Event dispatcher

Bundle provides `EventDispatcherInterface` and implementation of it: `Dullahan\Main\Symfony\EventDispatcher`.

## Validation service

Bundle provides `ValidationServiceInterface` and implementation of it:
 `Dullahan\Main\Symfony\SymfonyConstraintValidationService`.

## Database interfaces

Bundle provides `DatabaseActionsInterface` and `DatabaseConnectionInterface` and implementation of it:
`DoctrineDatabaseActionsImpl`.