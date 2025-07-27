---
sidebar_position: 4
sidebar_label: 'Database Schema'
---

# Database Schema

User bundles is made of two tables: `user` (User entity) and `user_data` (UserData entity). Each row in `user` table
has equivalent in the `user_data` table on OneToOne relation.

## `user` table

The `user` table is private dataset of the User. It consists of all user private data that should never be exposed to
the public like activity/forgotten password/change email tokens, password, login, roles etc.

## `user_data` table

The `user_data` table is made of public data like name, public ID and additions from other modules. If you are expanding
on the user functionality and require place to store additional information about the user `user_data` is a first place
you should think of.