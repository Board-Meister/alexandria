---
sidebar_position: 1
sidebar_label: 'Intro'
---

# Intro

Dullahan is modular, headless, Product Information and Digital Asset Management system, developed for accelerating
development of centralized information management systems. Its main purpose is to give a strong foundation for managing
data and cut the development work to focus on business.

## Requirements

Dullahan is an [Symfony](https://symfony.com/) bundle which means any requirements of the Symfony are requirements of
Dullahan. You can easily check them [here](https://symfony.com/doc/7.0/setup.html#technical-requirements). Symfony
version for those docs is 7.x.

For a database Dullahan is using [Doctrine ORM](https://symfony.com/doc/7.0/doctrine.html), so any databases that
Doctrine has adapter for should work fine with Dullahan. The default is MySQL but other options include PostgreSQL or
Oracle.

For PHP extensions not mentioned by `Symfony` Dullahan may require `bcmath` for JWT token generation depending on what
encryption algorithm you will be using. Check pre-requisites
[here](https://web-token.spomky-labs.com/introduction/pre-requisite) for stateless JWT sessions.

Additionally, Dullahan is using [Apache Jackrabbit Standalone](https://jackrabbit.apache.org/jcr/standalone-server.html)
(not Oak) for virtualizing and querying the files. For managing the configuration and client it uses
[Doctrine PHPCR](https://www.doctrine-project.org/projects/phpcr-odm.html)
([Symfony integration](https://github.com/doctrine/DoctrinePHPCRBundle)) which, underneath, uses
[Jackalope](https://jackalope.github.io/) library. This can be switched to native local system at any time but it's not
as good. (for example you will be loosing WebDAV functionality)

## Quickstart

To setup example project there is a prepared composer project with a simple docker compose setup:

```bash
composer create-project mortimer333/dullahan-project my-project-name
```

After download, you have to either create your own `.env.local` file with required variables or rename `.env.example`
to `.env.local`.

```bash
mv .env.example .env.local
```

Now you have to decide what will be this projects domain name or just leave the default `dullahan.localhost`.
You can change it in `.docker/nginx.conf:9`.

Having this ready we can start the containers:

```bash
docker compose up -d
```

and after it all sets up, run the commands required to prepare database and jackrabbit definitions:

```bash
docker exec -it dullahan-php-fpm php bin/console d:m:m
docker exec -it dullahan-php-fpm php bin/console doctrine:phpcr:node-type:register ./vendor/mortimer333/dullahan/definitions/jackrabbit/ --allow-update
```

Now feel free to check the application out by accessing `http://dullahan.localhost/api/doc` and investigating the
endpoints definitions.

## Architecture

Dullahan strives for maximum modularity and extendability. For that reason it has taken the page from microservice
architecture in a more micro scale and delegated all modules communication and actions to events using
[Symfony Events](https://symfony.com/doc/7.0/event_dispatcher.html) bundle. Each module action is not only precedes by
an event but is actually happening on the event call. Thanks to that, all modules are completely
decoupled from each other and can be replaced or disabled. Also any action taken, can be caught and prevented or
replaced.