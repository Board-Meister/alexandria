---
sidebar_position: 1
sidebar_label: 'Configuration'
---

# Configuration

For authorization Dullahan uses [Symfony Security bundle](https://symfony.com/doc/7.0/security.html)
with ready to use stateless handlers dependent on [JWT](https://jwt.io/).

In this configuration we are defining user provider (`Entity\User`), user authenticator
(`Security\ApiKeyAuthenticator`) and binding them together:

```yaml title="config/security.yaml"
security:
    providers:
        user:
            entity:
                # Dullahan user entity
                class: Dullahan\User\Domain\Entity\User
                property: email
    firewalls:
        # Example of stateless authorization using Dullahan's ApiKeyAuthenticator custom authenticator
        main:
            stateless: true
            lazy: true

            # Reference to the providers from above
            provider: user

            # The minimal amount of paths that authenticator has to cover
            # (/_/user* and /_/login*)
            pattern: ^/(_\/(user|login))
            custom_authenticators:
                - Dullahan\User\Adapter\Symfony\Presentation\Http\Security\ApiKeyAuthenticator

            # Define login path - must be covered by the firewall
            json_login:
                check_path: api_user_login

            # Name of the logout path provided by Dullahan User bundle (/_/user/logout)
            logout:
                path: api_user_logout
```

:::tip Full example
Check out the full example available in
[Dullahan Project](https://github.com/Mortimer333/dullahan-project/blob/1.2.1/config/packages/security.yaml).
:::