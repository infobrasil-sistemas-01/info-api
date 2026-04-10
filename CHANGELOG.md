# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.0.0](https://github.com/infobrasil-sistemas/InfoVendasApi/compare/v0.0.2...v1.0.0) (2026-04-10)

## 0.0.2 (2026-04-10)


### Features

* `GET /products/:id` && `GET /products/ean/:ean` ([79795da](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/79795da1afb76745cde965d87b5e825d48e4dd0f))
* add `minStock` query param on `GET /products` ([4fb33fa](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/4fb33fad18f785cc42ac18bd7917a7d27514ca20))
* add `search` to `GET /products` ([a70d797](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/a70d797da447e56b2926fb4f1eca6de06ab3da40))
* add `store_id` on user ([9dda722](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/9dda722ef99d63e8027f8567a316fa403ede1132))
* add permission guard ([b75f164](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/b75f1648c32055e00f6ed02d6e37d3ad005bcdac))
* add permission guard on existing controllers ([7c8b504](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/7c8b504c13128c95a311abbd6201bbe6d7b57ce6))
* add stock from products ([36e47cb](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/36e47cb917ce5c64ddf9def17aebdd8602c977bd))
* crypto bd passwords ([474c404](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/474c4048ee2fd18358ebb5a8ca97cb5905a81635))
* dynamic store_id by JWT ([b8ca9a7](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/b8ca9a73421d99f6ed9b966632600392bbcf5410))
* endpoint `post /auth/login` ([f63961b](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/f63961b2103a6e1f538abd692b44c8cdf9a051bf))
* endpoint `POST /orders` - without financial ([0a65444](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/0a654444fe395c84a6221d58046c39d4f2e30c2a))
* filter products by brand && group ([7986fac](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/7986fac14cb1b04ea3ca5806537fc581fb7b3019))
* generate receipt on `POST /orders` ([262ccbe](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/262ccbe3c37f001e20ad1146f22a966f2b78d1c4))
* implements `api/v1/products` ([0687a9a](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/0687a9aabf022861fbba64539565896dbb4c6a54))
* implements `GET /orders/:id` ([d74228c](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/d74228cc6bc004c5cc5860aa1d6a00e569b9054f))
* implements `GET /orders` ([48735df](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/48735df2f096b13cc57189ae2a5048fb3d4d2d32))
* implements `GET /payment-methods` ([6be540d](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/6be540d419237ae0762fc56223d80b556ea8d616))
* implements `GET /products/brands` ([1b7da72](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/1b7da72bb06372c0b5bf9ae454722fafb4168d3e))
* implements `GET /products/groups` ([59719cc](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/59719cc4d395c85bc00a2ff82146e5be5477df7b))
* implements `POST /orders/:id/receipt` ([ae3d921](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/ae3d921a2955be6c1a373b7c610663479a35ba05))
* implements `tenant connection module` ([29f7241](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/29f72416df8f96ca9a036a4175bfec5837be67b1))
* implements endpoint `auth/refresh` ([3263be7](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/3263be7e057a92610c00c9d5342e5ef1921e9875))
* improve `GET /products` by query params and specify columns ([9cd22fa](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/9cd22faa559546fa9f23bf28e8350d5940b8d29f))


### Bug Fixes

* add `storeId` on all functions ([e5c3147](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/e5c3147d4ec443f6287a862d630faf84ef2ab1b7))
* adjust `POST /orders` body dto ([763834d](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/763834dad00ac6f047167d9498694131eee3e5e3))
* adjust total value ([bee65dd](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/bee65dd9c82f9ef606c9d36e35d9c3773b7602ff))
* code to assert all unit tests ([4b8ab89](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/4b8ab89a365c3ac1bf1286755b3a4b17ab9d9e24))
* product group adjusts to assert tests ([481ce51](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/481ce51d72c1a6a8156d75803f4218a58f2fc7d4))
* product params ([955a2c9](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/955a2c996de9ee5ccadfe83f2fff64c8307700c3))
* swagger server definition ([1c62988](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/1c62988681e9e84702d95356e74b24f1269ba47d))
* verify user status on login ([87dd22d](https://github.com/infobrasil-sistemas/InfoVendasApi/commit/87dd22dae7f62d7af5d579983de7a50f106754dd))
