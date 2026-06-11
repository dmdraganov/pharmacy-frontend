# План интеграции frontend с Laravel backend

## Исходная задача

Связать React frontend из `client` с Laravel backend из `server`.

Текущий frontend использует моковые данные и локальные fake-фичи. Нужно заменить их реальными запросами к backend API, описанному в `server/docs/api.md` и соседних документах `server/docs`.

Основные требования:

- Загружать серверные данные через TanStack Query.
- Убрать или минимизировать использование моков для пользовательских бизнес-сценариев.
- Переделать fake-фичи: auth, каталог, поиск, избранное, корзина, оформление и просмотр заказов.
- Доработать UI под более проработанный backend: фильтры, пагинация, статусы, админские операции, inventory, формы CRUD и состояния ошибок.
- Сохранить существующую Feature-Sliced структуру frontend.

## Что уже выполнено

Работа была остановлена пользователем до полной проверки сборки, поэтому список ниже отражает уже внесённые изменения, а не финальное завершённое состояние.

### API слой

- Добавлен общий API client: `client/src/shared/api/apiClient.ts`.
- Поддержаны:
  - base URL из `VITE_API_URL` с fallback на `/api`;
  - Laravel response envelope `{ data, meta, message }`;
  - `204 No Content`;
  - Bearer token для Sanctum;
  - единый `ApiError`.
- Auth переведен на cookie-session без frontend token storage.

### TanStack Query

- В `client/src/app/main.tsx` подключён `QueryClientProvider`.
- Для queries задан базовый `staleTime` и retry.

### Catalog API

- `productsApi.ts` переведён с моков на backend:
  - `GET /products`;
  - `GET /products/{id}`;
  - `GET /products/popular`;
  - `GET /search/products`.
- Добавлен маппинг backend `snake_case` полей в frontend `camelCase` модель `Product`.
- `sectionsApi.ts` переведён на:
  - `GET /sections`;
  - `GET /categories`.
- Так как backend отдаёт sections и categories отдельными endpoint-ами, frontend собирает структуру `Section -> categories` на клиенте.
- `pharmaciesApi.ts` переведён на `GET /pharmacies`.

### Auth

- `authApi.ts` переведён с моковых пользователей на backend:
  - `POST /auth/login`;
  - `POST /auth/register`;
  - `POST /auth/logout`;
  - `GET /auth/me`;
  - `PATCH /users/profile`.
- `features/auth/model/store.ts` теперь:
  - сохраняет token отдельно;
  - проверяет текущего пользователя через `/auth/me`;
  - обновляет профиль через backend.

### Корзина

- Добавлен `cartApi.ts`:
  - `GET /cart`;
  - `POST /cart`;
  - `PATCH /cart/{cartItemId}`;
  - `DELETE /cart/{cartItemId}`;
  - `DELETE /cart`.
- В `CartItem` добавлен `cartItemId`, потому что backend обновляет и удаляет строку корзины по id cart item, а UI раньше работал только с product id.
- `features/cart/model/store.ts` частично переведён на backend:
  - добавлен `syncCart`;
  - `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart` вызывают backend и затем синхронизируют состояние.
- Так как `CartItemResource` backend сейчас отдаёт только `id`, `product_id`, `quantity`, frontend догружает товар через `GET /products/{id}`.

### Избранное

- Добавлен `favoritesApi.ts`:
  - `GET /favorites`;
  - `POST /favorites`;
  - `DELETE /favorites/{productId}`.
- `features/favorites/model/store.ts` частично переведён на backend:
  - добавлен `syncFavorites`;
  - `toggleFavorite` вызывает add/remove endpoint и затем синхронизирует список.
- Страница `FavoritesPage` переведена на Query-загрузку продуктов и favorite ids.

### Заказы

- Добавлен `ordersApi.ts`:
  - `GET /orders`;
  - `POST /orders`;
  - `POST /orders/{id}/cancel`.
- Добавлен маппинг backend `status_id`, `delivery_method_id`, `payment_method_id` в существующие frontend enum/string значения.
- `CheckoutPage` частично переведён с fake `setTimeout + local order store` на `POST /orders`.
- При успешном создании заказа:
  - очищается корзина;
  - инвалидируется query `orders`;
  - пользователь переводится к заказам.
- `AccountOrdersPage` переведена с локального order store на `GET /orders`.
- `OrderList` отменяет заказ через backend и инвалидирует `orders`.

### Страницы и widgets, уже переведённые на Query

- `HomePage`
- `CatalogPage`
- `ProductListPage`
- `ProductPage`
- `SearchPage` через `useSearch`
- `FavoritesPage`
- `AccountOrdersPage`
- `AdminProductsPage` для чтения товаров/секций
- `AdminCategoriesPage` для чтения категорий
- `CheckoutDelivery` для списка аптек

## Важные замечания по текущему состоянию

- Работа была остановлена до запуска `npm run build` и `npm run lint`.
- В текущем состоянии могут быть TypeScript/ESLint ошибки, которые нужно исправить перед продолжением.
- Последняя попытка изменить `FavoriteButton` не была применена: нужно отдельно добавить invalidation Query cache после toggle favorite.
- В рабочем дереве до начала интеграции уже были чужие изменения:
  - `client/package.json`;
  - `client/package-lock.json`;
  - `docker-compose.yml`;
  - новый `client/AGENTS.md`.
- Эти изменения не откатывались.

## Что нужно доделать дальше

### 1. Стабилизировать уже внесённую интеграцию

- `npm run build` запущен повторно после возобновления работы; найдены TypeScript ошибки в auth store, HomePage queryFn, products params, CheckoutDelivery props и Spinner props.
- Исправлены найденные TypeScript ошибки первого прохода:
  - `checkAuth` больше не вызывает `/auth/me` без token;
  - `getProducts` вызывается в Query через `() => getProducts()`;
  - `ProductsParams` совместим с `apiRequest.params`;
  - `CheckoutDelivery` принимает `errors`;
  - `OrderList` больше не передаёт неподдерживаемый `size` в `Spinner`.
- Добавлена Query invalidation для `FavoriteButton` после toggle favorite.
- Повторный `npm run build` после исправлений прошёл успешно.
- `npm run lint` прошёл успешно без предупреждений после исправлений checkout и ProductListPage.
- Финальный на этом этапе `npm run build` прошёл успешно.
- После добавления fallback-полей brand/manufacturer повторный `npm run build` также прошёл успешно.
- Исправить TypeScript ошибки после перевода store actions на async.
- Проверить места, где callbacks ожидают sync-функции, но теперь получают Promise.
- Корзина/избранное не используют браузерное хранилище; источник данных — backend.

### 2. Убрать оставшиеся пользовательские моки

- Удалён `entities/order/model/store.ts`, который содержал mock orders и mock products.
- `AdminOrdersPage` переведён с `useOrderStore` и `mockUsers` на `/admin/orders` и `/admin/orders/{id}/status`.
- `AdminDashboardPage` переведён с local order seed и fake metrics на `/admin/orders`.
- `AdminProductsPage` больше не генерирует fake stock; остатки берутся из `/admin/inventory` для первой аптеки из `/pharmacies`.
- Проверить все импорты из `shared/api/mocks`.
- Решить, удалять ли старые mock-файлы или оставить как dev fixtures, но не использовать в runtime.

### 3. Доработать каталог под backend

- `ProductListPage` переведён на `getProductsPage` и backend pagination `meta`.
- Для `/products` уже передаются:
  - `category_id`;
  - `brand_id`;
  - `manufacturer_id`;
  - `min_price`;
  - `max_price`;
  - `is_prescription`;
  - `sort`;
- Пагинация каталога подключена через общий `Pagination`.
- `brand_id`, `manufacturer_id` и `sort` теперь передаются в `/products` и `/search/products`.
- Добавлены справочники `/brands` и `/manufacturers`, sidebar каталога/поиска использует server-side id вместо фильтрации бренда по названию текущей страницы.
- При изменении фильтров сбрасывается URL-параметр `page`, чтобы не оставаться на несуществующей странице после сужения выдачи.
- Доработать UI фильтров под backend справочники:
  - categories;
  - brands — базово подключено;
  - manufacturers — базово подключено;
  - prescription flag — базово подключено;
  - price range — базово подключено;
  - sort — базово подключено.
- Сейчас `sectionId` у `Product` не приходит напрямую, а backend `/products` не принимает `section_id`; фильтрация section строится через category -> section на клиенте. Для полноценной серверной пагинации разделов нужен backend параметр `section_id` или поддержка массива `category_id`.

### 4. Доработать карточку и страницу товара

- Backend `ProductResource` сейчас не отдаёт brand name, manufacturer name, images и attributes.
- Во frontend `Product` добавлены `brandId`, `manufacturerId`, `manufacturer`.
- Пока backend не отдаёт вложенные brand/manufacturer, UI показывает fallback вида `Бренд #id` и `Производитель #id`, чтобы поле не было пустым.
- Нужно выбрать подход:
  - доработать backend resource, чтобы отдавать вложенные данные;
  - или догружать справочники на frontend и маппить `brand_id`, `manufacturer_id`.
- UI должен показывать:
  - бренд;
  - производителя;
  - рецепт/без рецепта;
  - старую цену;
  - характеристики/JSON `info`;
  - изображения из backend storage, когда backend начнёт их отдавать.

### 5. Доработать корзину

- Сейчас backend cart item не содержит product, поэтому frontend делает N+1 запросы к `/products/{id}`.
- Лучше доработать backend `CartItemResource`, чтобы он отдавал вложенный product или минимальный product snapshot.
- UI нужно дополнить:
  - loading state для операций add/update/remove;
  - rollback при ошибке;
  - сообщение об ошибке;
  - состояние для неавторизованного пользователя.

### 6. Доработать избранное

- Проверить реальный формат `GET /favorites`; текущий frontend ожидает `product_id`, `productId` или `id`.
- Лучше доработать backend resource для favorites, чтобы contract был явным.
- UI нужно дополнить:
  - loading/disabled state на кнопке сердца — добавлено;
  - error state — добавлено через title/error color;
  - Query invalidation — добавлено;
  - rollback при ошибке toggle — добавлен в favorite store;
  - поведение для неавторизованного пользователя — кнопка disabled и не отправляет backend request.

### 7. Доработать оформление заказа

- Сверить frontend ids delivery/payment methods с backend lookup tables.
- Сейчас frontend предполагает:
  - delivery `1 = delivery`, `2 = pickup`;
  - payment `1 = online`, `2 = on receipt`.
- Нужно подтвердить это по seed/data или добавить endpoint для lookup tables.
- Добавить отображение validation errors от backend.
- Business rule по рецептурным товарам учтён в UI: если в корзине есть prescription product, курьерская доставка отключается и автоматически выбирается pickup.
- Уточнить, нужен ли backend contact info/comment в заказе: текущий API create order не принимает contact/comment.

### 8. Доработать заказы

- `GET /orders` отдаёт item product_id, поэтому frontend сейчас догружает товары по одному.
- Лучше доработать backend `OrderItemResource`, чтобы он отдавал product snapshot.
- UI заказов должен поддерживать:
  - loading/error states;
  - отмену с backend;
  - повтор заказа с backend cart;
  - корректные статусы по backend flow.

### 9. Доработать admin UI

Backend поддерживает более широкий admin API, чем текущий UI.

Нужно добавить или переделать:

- CRUD товаров:
  - создание;
  - редактирование;
  - удаление;
  - загрузка изображений;
  - удаление изображений.
- CRUD sections/categories/brands/manufacturers/pharmacies.
- Inventory management:
  - список `/admin/inventory`;
  - фильтр по `pharmacy_id`;
  - update stock.
- Order management:
  - список `/admin/orders`;
  - изменение статуса `/admin/orders/{id}/status`;
  - UI allowed transitions.
- RBAC-aware UI:
  - ADMIN;
  - MANAGER;
  - USER.

### 10. Доработать UI в целом

Так как backend более проработан, текущий frontend UI нужно расширить:

- Пагинация в списках товаров, заказов, избранного, корзины.
- Табличные и мобильные состояния для admin screens.
- Формы с backend validation errors.
- Empty/loading/error states для каждого query и mutation.
- Disabled states на кнопках во время mutations.
- User feedback после успешных операций.
- Более точные фильтры и сортировка.
- Отображение server-side справочников вместо hardcoded/fake значений.

## Текущий результат проверки

- `npm run lint` проходит без ошибок и предупреждений.
- `npm run build` проходит успешно.
- Vite dev server запущен на `http://localhost:5173/`.
- Runtime-импортов из `shared/api/mocks` больше не найдено.
- До начала работы уже были изменены `client/package.json`, `client/package-lock.json`, `docker-compose.yml` и добавлен `client/AGENTS.md`; эти изменения не откатывались.

## Рекомендуемый порядок продолжения

1. Проверить приложение вручную вместе с запущенным backend и реальными данными.
2. Доработать backend responses для product/cart/favorites/order items, чтобы убрать N+1 догрузку товаров.
3. Добавить полноценные admin CRUD формы и inventory update UI.
4. Расширить catalog/search UI: `brand_id`, `manufacturer_id`, sort, полноценная section pagination.
5. В конце пройтись по UX states, responsive layout и regression build/lint.
