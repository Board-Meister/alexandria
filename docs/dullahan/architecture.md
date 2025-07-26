---
sidebar_position: 4
sidebar_label: 'Architecture'
---

# Architecture

Dullahan modules are developed in Event-driven development following Event Core rules. Event Core is a term created to
help describe an approach for creating manageable modules in EDD. The name derives from Eric Evans DDD "Abstract Core",
as they share the same concept - to define a way/implementation details. The difference between Abstract and Event Core
is that Abstract Core imposes functionality to be implemented and Event Core defines behavior that has to handled.
Additionally, default handlers can be and/or prevented/replaced/extended, making it a great pattern for creating
frameworks.

## Event Core

Unlike Abstract Core being made of only interfaces, Event Core is not only made from possible events, processes and sagas. It is possible to define default behavior for each process making it easier to implement but still allowing for high level of customization.

1. Any and all actions must happen on the event call.
2. Each Saga and Event have separate calls.
3. Sagas and Events default action should be preventable.
4. Sagas are made of Events.
5. Getting and Setting must be a separate Event.
6. Sagas contain mutable Request and Response (in a I/O manner) which are accessible by the Events.
7. Top level Events are called Processes and should work as Unit of Work.

## Default behavior implementation

There are events that implement default behavior, one that can be replaced. Each of those event implement `PreventableEventInterface` which defines two methods:

```php title="preventDefault()"
/**
 * Sets event prevention flag to true
 *
 * Warning: settings this after default action does nothing!
 * Be sure to call it before the default!
 */
public function preventDefault(): void;
```

```php title="wasDefaultPrevented()"
/**
 * Returns logical value defining if default was prevented
 */
public function wasDefaultPrevented(): bool;
```

Each event implementing this interface should have default action provided by the module. Some events are not preventable due to not having default actions or being unpreventable.

## Framework-agnostic

One of the Dullahan principals is not to be framework specific and be more of behavior definition then actual implementation. Although, modules present ready to use implementation it's more of a body (functionality) without a head (business). Some of them even lack implementation of the interfaces they use (like `EventDispatcherInterface`) which must be defined after choosing which framework you want to use.

:::info
Currently all Dullahan modules natively support only Symfony framework
:::

Currently recommended way of creating framework-agnostic modules is to have at least 2 separate repositories: one with the module specific functionality and another working as a bridge between module and framework. With time you could create another bridges for another frameworks.

```
dullahan/
 - user/
 - user-bridge-symfony/
 - user-bridge-laravel/
 - user-bridge-codeigniter/
```

What architecture you choose inside the bridge package is up to the framework, you should follow the recommended architecture. But inside the main package it is recommended to use a variant of the Ports & Adapters architecture with DDD layers (where our adapters are in different package :D).

This means that you have your normal DDD layers:
```
dullahan/
 - user/
 - - Presentation/
 - - Application/
 - - Domain/
 - - Infrastructure/
```

And additionally add `Port` folder for placing interfaces you will be implementing in your bridges or your user will DI:

```
dullahan/
 - user/
 - - Presentation/
 - - Application/
 - - Domain/
 - - Infrastructure/
 - - Port/
 - - - Presentation/
 - - - Application/
 - - - Domain/
 - - - Infrastructure/
```

Interfaces in `Port` folder shouldn't be nested to avoid issues such as trying to recreate paths during implementation in the bridges which leads to breaking recommended architectures. It is easier for developer and user when there is no complex and highly nested path to the interface you want to implement.

## Events in layered architecture

Events listeners/subscribers similarly to Commands and Controllers go to the Presentation layer. Our implementation makes it an another way to interact with the app resources. But event implementation goes to the Domain layer and are actually handled by the Facades inside Application layer (although they have to be firstly caught be the Listeners).

```none title="Example of implementing Register user Saga in the User module"
dullahan/
 - user/
 - - Presentation/
 - - - Event/
 - - - - Transport/
           // All implement PreventableEventInterface
 - - - - - RegisterUserSaga.php
 - - - - - CreateUserProcess.php
 - - - - - ValidateRegistrationProcess.php
 - - - - Listener/
           // Uses UserManagerFacade by requesting UserPersistManagerInterface
 - - - - - RegisterUserListener.php
 - - Application/
       // implements UserPersistManagerInterface, UserRetrievalManagerInterface, UserSerializerInterface
 - - - UserManagerFacade.php
 - - Domain/
 - - - RegisteringUser.php
 - - - User.php
 - - - UserPersistManager.php
 - - - UserRetrievalManager.php
 - - - UserSerializer.php
 - - Infrastructure/
 - - - UserRepository.php
 - - Port/
 - - - Application/
 - - - - UserPersistManagerInterface.php
 - - - - UserRetrievalManagerInterface.php
 - - - - UserSerializerInterface.php
 ```

 With this implementation we give our users few options for customization and are following SOLID/Tactical Design rules. It allows for polymorphic DI or for setting your own listener for additional functionality like validation (like 2FA or reCaptcha). Additionally you could set listener before `CreateUserProcess` to change/add more details to registration payload before user is created or after if you want to do something with created user like send an activation email.

:::info
This example is not framework-agnostic, in that approach you would have your Listeners inside the bridge package and probably have additional abstraction for the repositories or just depend on the Domain services implementation and DI.
:::

## Functor

Functor is a Function object known under other names like invoker. It is basically a class that can be called and shouldn't implement other public methods then one use for invocation. Basically it makes is a Command for implementing Command Pattern. But we avoid using Command key world as it is already taken for the console command classes - hence the Functor.

This approach can result in a huge Facade class which DI tens of classes and is very heavy. To make it easier for our containers and ease the coupling between objects it a good idea to create specialized classes/commands/invokers only for one use case. Thanks to that you can easily separate responsibilities and make your module/package more behavior based.

```php title="Get entity repository functor example"
use Dullahan\Entity\Port\Interface\EntityRepositoryInterface;
use Dullahan\Entity\Presentation\Event\Transport\GetEntityRepository;
use Dullahan\Main\Contract\DatabaseActionsInterface;

/**
 * @template T of object
 */
class RetrieveEntityRepositoryFunctor
{
    public function __construct(
        protected DatabaseActionsInterface $databaseConnection,
    ) {
    }

    /**
     * @param GetEntityRepository<T> $event
     *
     * @return EntityRepositoryInterface<T>|null
     */
    public function __invoke(GetEntityRepository $event): ?EntityRepositoryInterface
    {
        $class = $event->class;
        if (!class_exists($class)) {
            return null;
        }

        return $this->databaseConnection->getRepository($class);
    }
}
```