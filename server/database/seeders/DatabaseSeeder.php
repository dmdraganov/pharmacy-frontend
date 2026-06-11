<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    private string $adminId = '10000000-0000-4000-8000-000000000001';

    private string $managerId = '10000000-0000-4000-8000-000000000002';

    private string $customerId = '10000000-0000-4000-8000-000000000003';

    public function run(): void
    {
        DB::transaction(function () {
            $now = Carbon::now();

            $this->seedLookups();
            $this->seedUsers($now);
            $sections = $this->seedSections($now);
            $categories = $this->seedCategories($sections, $now);
            $brands = $this->seedBrands($now);
            $manufacturers = $this->seedManufacturers($now);
            $products = $this->seedProducts($categories, $brands, $manufacturers, $now);
            $pharmacies = $this->seedPharmacies($now);
            $this->seedProductImages($products, $now);
            $this->seedProductAttributes($products);
            $this->seedInventory($pharmacies, $products, $now);
            $this->seedCustomerData($products, $now);
            $this->seedOrders($pharmacies, $products, $now);
        });
    }

    private function seedLookups(): void
    {
        foreach (['USER', 'MANAGER', 'ADMIN'] as $role) {
            DB::table('roles')->updateOrInsert(['name' => $role], ['name' => $role]);
        }

        foreach ([
            ['code' => 'new', 'name' => 'Новый'],
            ['code' => 'processing', 'name' => 'В обработке'],
            ['code' => 'shipping', 'name' => 'Доставляется'],
            ['code' => 'delivered', 'name' => 'Доставлен'],
            ['code' => 'completed', 'name' => 'Завершен'],
            ['code' => 'cancelled', 'name' => 'Отменен'],
        ] as $status) {
            DB::table('order_statuses')->updateOrInsert(['code' => $status['code']], $status);
        }

        foreach ([
            ['code' => 'pickup', 'name' => 'Самовывоз'],
            ['code' => 'delivery', 'name' => 'Доставка'],
        ] as $method) {
            DB::table('delivery_methods')->updateOrInsert(['code' => $method['code']], $method);
        }

        foreach ([
            ['code' => 'online', 'name' => 'Онлайн'],
            ['code' => 'on_receipt', 'name' => 'При получении'],
        ] as $method) {
            DB::table('payment_methods')->updateOrInsert(['code' => $method['code']], $method);
        }
    }

    private function seedUsers(Carbon $now): void
    {
        $password = Hash::make('password');

        foreach ([
            [
                'id' => $this->adminId,
                'first_name' => 'Анна',
                'last_name' => 'Администратор',
                'email' => 'admin@pharmacy.test',
                'phone' => '+7 900 100-10-10',
                'password' => $password,
            ],
            [
                'id' => $this->managerId,
                'first_name' => 'Максим',
                'last_name' => 'Менеджер',
                'email' => 'manager@pharmacy.test',
                'phone' => '+7 900 200-20-20',
                'password' => $password,
            ],
            [
                'id' => $this->customerId,
                'first_name' => 'Ирина',
                'last_name' => 'Покупатель',
                'email' => 'customer@pharmacy.test',
                'phone' => '+7 900 300-30-30',
                'password' => $password,
            ],
        ] as $user) {
            DB::table('users')->updateOrInsert(
                ['id' => $user['id']],
                array_merge($user, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        $roleIds = DB::table('roles')->pluck('id', 'name');

        foreach ([
            [$this->adminId, $roleIds['ADMIN']],
            [$this->managerId, $roleIds['MANAGER']],
            [$this->customerId, $roleIds['USER']],
        ] as [$userId, $roleId]) {
            DB::table('user_roles')->insertOrIgnore([
                'user_id' => $userId,
                'role_id' => $roleId,
            ]);
        }
    }

    private function seedSections(Carbon $now): array
    {
        $sections = [
            'medicines' => ['name' => 'Лекарственные средства', 'description' => 'Препараты для лечения, профилактики и домашней аптечки.'],
            'supplements' => ['name' => 'Витамины и БАД', 'description' => 'Витаминные комплексы, минералы и добавки для ежедневной поддержки.'],
            'medical-devices' => ['name' => 'Медицинские изделия и техника', 'description' => 'Тонометры, термометры, перевязочные материалы и средства первой помощи.'],
            'personal-care' => ['name' => 'Гигиена и уход', 'description' => 'Средства для ежедневной гигиены и ухода за телом.'],
            'mother-baby' => ['name' => 'Мама и ребёнок', 'description' => 'Товары для беременности, кормления и ухода за детьми.'],
            'beauty' => ['name' => 'Красота и косметика', 'description' => 'Косметика и уходовые средства популярных аптечных брендов.'],
            'optics' => ['name' => 'Оптика', 'description' => 'Контактные линзы, растворы и товары для ухода за глазами.'],
        ];

        foreach ($sections as $key => $section) {
            DB::table('sections')->updateOrInsert(
                ['name' => $section['name']],
                array_merge($section, [
                    'created_by' => $this->adminId,
                    'updated_by' => $this->adminId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
            );
        }

        return $this->idsByName('sections', array_column($sections, 'name'), array_keys($sections));
    }

    private function seedCategories(array $sections, Carbon $now): array
    {
        $categories = [
            'pain-relief' => ['name' => 'Обезболивающие', 'section' => 'medicines'],
            'cold-flu' => ['name' => 'Простуда и грипп', 'section' => 'medicines'],
            'cardio-gastro' => ['name' => 'Сердце, сосуды и ЖКТ', 'section' => 'medicines'],
            'vitamins' => ['name' => 'Витамины и минералы', 'section' => 'supplements'],
            'diagnostics-bp' => ['name' => 'Диагностика и давление', 'section' => 'medical-devices'],
            'disinfection-first-aid' => ['name' => 'Антисептики и аптечки', 'section' => 'medical-devices'],
            'oral-body' => ['name' => 'Полость рта и тело', 'section' => 'personal-care'],
            'baby-food-health' => ['name' => 'Питание и здоровье ребёнка', 'section' => 'mother-baby'],
            'face-hair-body' => ['name' => 'Уход за лицом, волосами и телом', 'section' => 'beauty'],
            'lenses-glasses' => ['name' => 'Линзы и очки', 'section' => 'optics'],
        ];

        foreach ($categories as $key => $category) {
            DB::table('categories')->updateOrInsert(
                ['name' => $category['name']],
                [
                    'name' => $category['name'],
                    'description' => null,
                    'section_id' => $sections[$category['section']],
                    'created_by' => $this->adminId,
                    'updated_by' => $this->adminId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        return $this->idsByName('categories', array_column($categories, 'name'), array_keys($categories));
    }

    private function seedBrands(Carbon $now): array
    {
        $brands = ['Nurofen', 'Фармстандарт', 'Gaviscon', 'Отисифарм', 'Omron', 'Hartmann', 'Nivea', 'Garnier', 'Johnson & Johnson'];

        foreach ($brands as $brand) {
            DB::table('brands')->updateOrInsert(
                ['name' => $brand],
                [
                    'name' => $brand,
                    'created_by' => $this->adminId,
                    'updated_by' => $this->adminId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        return $this->idsByName('brands', $brands);
    }

    private function seedManufacturers(Carbon $now): array
    {
        $manufacturers = [
            'Reckitt Benckiser' => 'Великобритания',
            'Фармстандарт' => 'Россия',
            'GlaxoSmithKline' => 'Великобритания',
            'Отисифарм' => 'Россия',
            'Omron Healthcare' => 'Япония',
            'Paul Hartmann' => 'Германия',
            'Beiersdorf AG' => 'Германия',
            'L’Oreal S.A.' => 'Франция',
            'Johnson & Johnson Vision Care' => 'США',
        ];

        foreach ($manufacturers as $name => $country) {
            DB::table('manufacturers')->updateOrInsert(
                ['name' => $name],
                [
                    'name' => $name,
                    'country' => $country,
                    'created_by' => $this->adminId,
                    'updated_by' => $this->adminId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        return $this->idsByName('manufacturers', array_keys($manufacturers));
    }

    private function seedProducts(array $categories, array $brands, array $manufacturers, Carbon $now): array
    {
        $products = [
            'nurofen-200' => [
                'id' => '20000000-0000-4000-8000-000000000001',
                'name' => 'Нурофен таблетки 200 мг, 20 шт.',
                'category' => 'pain-relief',
                'brand' => 'Nurofen',
                'manufacturer' => 'Reckitt Benckiser',
                'price' => 210,
                'old_price' => 249,
                'is_popular' => true,
                'is_prescription' => false,
                'description' => 'Обезболивающее и жаропонижающее средство для домашней аптечки.',
                'image' => 'nurofen-200.jpg',
                'info' => [
                    'composition' => ['Ибупрофен 200 мг.'],
                    'indications' => ['Головная боль', 'Зубная боль', 'Повышенная температура'],
                    'usage' => ['Принимать внутрь после еды согласно инструкции.'],
                    'warnings' => ['Есть противопоказания. Перед применением ознакомьтесь с инструкцией.'],
                    'storage' => ['Хранить при температуре не выше 25 °C.'],
                ],
            ],
            'paracetamol-500' => [
                'id' => '20000000-0000-4000-8000-000000000002',
                'name' => 'Парацетамол таблетки 500 мг, 20 шт.',
                'category' => 'cold-flu',
                'brand' => 'Фармстандарт',
                'manufacturer' => 'Фармстандарт',
                'price' => 85,
                'old_price' => null,
                'is_popular' => true,
                'is_prescription' => false,
                'description' => 'Жаропонижающее средство при симптомах простуды и гриппа.',
                'image' => 'paracetamol-500.webp',
                'info' => [
                    'composition' => ['Парацетамол 500 мг.'],
                    'indications' => ['Лихорадка', 'Болевой синдром слабой и умеренной интенсивности'],
                    'usage' => ['Принимать по инструкции, соблюдая максимальную суточную дозу.'],
                    'warnings' => ['Не сочетать с другими препаратами, содержащими парацетамол.'],
                    'storage' => ['Хранить в сухом месте.'],
                ],
            ],
            'gaviscon-lemon' => [
                'id' => '20000000-0000-4000-8000-000000000003',
                'name' => 'Гевискон суспензия лимонная, 150 мл',
                'category' => 'cardio-gastro',
                'brand' => 'Gaviscon',
                'manufacturer' => 'GlaxoSmithKline',
                'price' => 390,
                'old_price' => 430,
                'is_popular' => false,
                'is_prescription' => false,
                'description' => 'Средство от изжоги и дискомфорта после еды.',
                'image' => 'gaviscon-lemon.webp',
                'info' => [
                    'composition' => ['Натрия альгинат, натрия гидрокарбонат, кальция карбонат.'],
                    'indications' => ['Изжога', 'Кислая отрыжка', 'Диспепсия'],
                    'usage' => ['Принимать после еды и перед сном согласно инструкции.'],
                    'warnings' => ['При длительных симптомах обратитесь к врачу.'],
                    'storage' => ['Хранить при комнатной температуре.'],
                ],
            ],
            'complivit-mama' => [
                'id' => '20000000-0000-4000-8000-000000000004',
                'name' => 'Компливит Мама таблетки, 30 шт.',
                'category' => 'vitamins',
                'brand' => 'Отисифарм',
                'manufacturer' => 'Отисифарм',
                'price' => 350,
                'old_price' => null,
                'is_popular' => false,
                'is_prescription' => false,
                'description' => 'Витаминно-минеральный комплекс для беременных и кормящих женщин.',
                'image' => 'supplements.avif',
                'info' => [
                    'composition' => ['Комплекс витаминов и минералов.'],
                    'indications' => ['Профилактика дефицита витаминов и минералов.'],
                    'usage' => ['Принимать во время еды согласно инструкции.'],
                    'warnings' => ['Перед применением рекомендуется консультация специалиста.'],
                    'storage' => ['Хранить в сухом месте.'],
                ],
            ],
            'omron-m2-basic' => [
                'id' => '20000000-0000-4000-8000-000000000005',
                'name' => 'Тонометр автоматический Omron M2 Basic',
                'category' => 'diagnostics-bp',
                'brand' => 'Omron',
                'manufacturer' => 'Omron Healthcare',
                'price' => 3500,
                'old_price' => 3890,
                'is_popular' => true,
                'is_prescription' => false,
                'description' => 'Автоматический тонометр для измерения давления на плече.',
                'image' => 'medical-devices.jpeg',
                'info' => [
                    'composition' => ['Электронный блок, манжета, элементы питания, инструкция.'],
                    'indications' => ['Домашний контроль артериального давления.'],
                    'usage' => ['Использовать согласно руководству по эксплуатации.'],
                    'warnings' => ['Не заменяет консультацию врача.'],
                    'storage' => ['Хранить в сухом месте.'],
                ],
            ],
            'hartmann-bandage' => [
                'id' => '20000000-0000-4000-8000-000000000006',
                'name' => 'Бинт стерильный Hartmann 7 м x 14 см',
                'category' => 'disinfection-first-aid',
                'brand' => 'Hartmann',
                'manufacturer' => 'Paul Hartmann',
                'price' => 95,
                'old_price' => null,
                'is_popular' => false,
                'is_prescription' => false,
                'description' => 'Стерильный марлевый бинт для перевязок и первой помощи.',
                'image' => 'medical-devices.jpeg',
                'info' => [
                    'composition' => ['Хлопковая марля.'],
                    'indications' => ['Фиксация повязок', 'Первая помощь'],
                    'usage' => ['Использовать стерильно, упаковку вскрывать перед применением.'],
                    'warnings' => ['Не использовать при поврежденной упаковке.'],
                    'storage' => ['Хранить в сухом месте.'],
                ],
            ],
            'nivea-soft' => [
                'id' => '20000000-0000-4000-8000-000000000007',
                'name' => 'Увлажняющий крем Nivea Soft, 200 мл',
                'category' => 'face-hair-body',
                'brand' => 'Nivea',
                'manufacturer' => 'Beiersdorf AG',
                'price' => 300,
                'old_price' => null,
                'is_popular' => false,
                'is_prescription' => false,
                'description' => 'Универсальный крем для лица, рук и тела.',
                'image' => 'garnier-micellar-water.jpg',
                'info' => [
                    'composition' => ['Масло жожоба, витамин E, увлажняющие компоненты.'],
                    'indications' => ['Ежедневное увлажнение кожи.'],
                    'usage' => ['Наносить на чистую кожу.'],
                    'warnings' => ['Только для наружного применения.'],
                    'storage' => ['Хранить при комнатной температуре.'],
                ],
            ],
            'garnier-micellar-water' => [
                'id' => '20000000-0000-4000-8000-000000000008',
                'name' => 'Мицеллярная вода Garnier Skin Naturals, 400 мл',
                'category' => 'face-hair-body',
                'brand' => 'Garnier',
                'manufacturer' => 'L’Oreal S.A.',
                'price' => 380,
                'old_price' => 420,
                'is_popular' => true,
                'is_prescription' => false,
                'description' => 'Средство для снятия макияжа и бережного очищения кожи.',
                'image' => 'garnier-micellar-water.jpg',
                'info' => [
                    'composition' => ['Мицеллы, глицерин, очищающие компоненты.'],
                    'indications' => ['Демакияж', 'Очищение кожи лица'],
                    'usage' => ['Нанести на ватный диск и протереть кожу.'],
                    'warnings' => ['Избегать попадания в глаза.'],
                    'storage' => ['Хранить при комнатной температуре.'],
                ],
            ],
            'johnson-baby-shampoo' => [
                'id' => '20000000-0000-4000-8000-000000000009',
                'name' => 'Детский шампунь Johnson’s Baby, 300 мл',
                'category' => 'baby-food-health',
                'brand' => 'Johnson & Johnson',
                'manufacturer' => 'Johnson & Johnson Vision Care',
                'price' => 260,
                'old_price' => null,
                'is_popular' => false,
                'is_prescription' => false,
                'description' => 'Мягкий шампунь для ежедневного ухода за волосами ребенка.',
                'image' => 'mother-baby.jpg',
                'info' => [
                    'composition' => ['Мягкие очищающие компоненты.'],
                    'indications' => ['Уход за волосами ребенка.'],
                    'usage' => ['Нанести на влажные волосы, вспенить и смыть.'],
                    'warnings' => ['Только для наружного применения.'],
                    'storage' => ['Хранить при комнатной температуре.'],
                ],
            ],
            'acuvue-oasys' => [
                'id' => '20000000-0000-4000-8000-000000000010',
                'name' => 'Контактные линзы Acuvue Oasys, 6 шт.',
                'category' => 'lenses-glasses',
                'brand' => 'Johnson & Johnson',
                'manufacturer' => 'Johnson & Johnson Vision Care',
                'price' => 1490,
                'old_price' => 1690,
                'is_popular' => true,
                'is_prescription' => true,
                'description' => 'Двухнедельные контактные линзы с высоким уровнем комфорта.',
                'image' => 'acuvue-oasys.webp',
                'info' => [
                    'composition' => ['Силикон-гидрогелевый материал.'],
                    'indications' => ['Коррекция зрения по назначению специалиста.'],
                    'usage' => ['Использовать по рекомендации офтальмолога.'],
                    'warnings' => ['Требуется подбор специалистом.'],
                    'storage' => ['Хранить в оригинальной упаковке.'],
                ],
            ],
        ];

        foreach ($products as $slug => $product) {
            DB::table('products')->updateOrInsert(
                ['id' => $product['id']],
                [
                    'id' => $product['id'],
                    'category_id' => $categories[$product['category']],
                    'brand_id' => $brands[$product['brand']],
                    'manufacturer_id' => $manufacturers[$product['manufacturer']],
                    'slug' => $slug,
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'old_price' => $product['old_price'],
                    'description' => $product['description'],
                    'is_popular' => $product['is_popular'],
                    'is_prescription' => $product['is_prescription'],
                    'info' => json_encode($product['info'], JSON_UNESCAPED_UNICODE),
                    'created_by' => $this->adminId,
                    'updated_by' => $this->adminId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        return $products;
    }

    private function seedPharmacies(Carbon $now): array
    {
        $pharmacies = [
            1 => ['name' => 'Аптека №1 "Здоровье"', 'address' => 'г. Москва, ул. Ленина, д. 10', 'working_hours' => '08:00 - 22:00', 'phone' => '+7 495 111-10-10', 'email' => 'health-1@pharmacy.test'],
            2 => ['name' => 'Фарма-сеть "Пульс"', 'address' => 'г. Москва, ул. Центральная, д. 45', 'working_hours' => '09:00 - 21:00', 'phone' => '+7 495 222-20-20', 'email' => 'pulse@pharmacy.test'],
            3 => ['name' => 'Городская аптека №12', 'address' => 'г. Москва, пр. Мира, д. 112', 'working_hours' => '24/7', 'phone' => '+7 495 333-30-30', 'email' => 'city-12@pharmacy.test'],
        ];

        foreach ($pharmacies as $id => $pharmacy) {
            DB::table('pharmacies')->updateOrInsert(
                ['id' => $id],
                array_merge($pharmacy, [
                    'created_by' => $this->adminId,
                    'updated_by' => $this->adminId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
            );
        }

        return array_keys($pharmacies);
    }

    private function seedProductImages(array $products, Carbon $now): void
    {
        foreach ($products as $slug => $product) {
            DB::table('product_images')->updateOrInsert(
                ['id' => str_replace('20000000', '30000000', $product['id'])],
                [
                    'id' => str_replace('20000000', '30000000', $product['id']),
                    'product_id' => $product['id'],
                    'image_url' => '/assets/images/products/'.$product['image'],
                    'alt_text' => $product['name'],
                    'sort_order' => 0,
                    'is_main' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }

    private function seedProductAttributes(array $products): void
    {
        foreach (['Производитель', 'Страна производитель', 'Отпуск из аптек'] as $name) {
            DB::table('attributes')->updateOrInsert(['name' => $name], ['name' => $name]);
        }

        $attributeIds = DB::table('attributes')->pluck('id', 'name');

        foreach ($products as $product) {
            foreach ([
                'Производитель' => $product['manufacturer'],
                'Страна производитель' => $this->manufacturerCountry($product['manufacturer']),
                'Отпуск из аптек' => $product['is_prescription'] ? 'С проверкой в аптеке' : 'Без проверки',
            ] as $name => $value) {
                DB::table('product_attributes')->updateOrInsert(
                    ['product_id' => $product['id'], 'attribute_id' => $attributeIds[$name]],
                    ['product_id' => $product['id'], 'attribute_id' => $attributeIds[$name], 'value' => $value]
                );
            }
        }
    }

    private function seedInventory(array $pharmacies, array $products, Carbon $now): void
    {
        $index = 0;

        foreach ($pharmacies as $pharmacyId) {
            foreach ($products as $product) {
                $stock = 8 + (($index + $pharmacyId) % 20);
                $reserved = ($index + $pharmacyId) % 4;

                DB::table('inventory')->updateOrInsert(
                    ['pharmacy_id' => $pharmacyId, 'product_id' => $product['id']],
                    [
                        'pharmacy_id' => $pharmacyId,
                        'product_id' => $product['id'],
                        'stock_quantity' => $stock,
                        'reserved_quantity' => min($reserved, $stock),
                        'updated_at' => $now,
                    ]
                );

                $index++;
            }
        }
    }

    private function seedCustomerData(array $products, Carbon $now): void
    {
        foreach (['nurofen-200', 'garnier-micellar-water', 'acuvue-oasys'] as $slug) {
            DB::table('user_favorites')->insertOrIgnore([
                'user_id' => $this->customerId,
                'product_id' => $products[$slug]['id'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        foreach ([
            ['slug' => 'paracetamol-500', 'quantity' => 2],
            ['slug' => 'gaviscon-lemon', 'quantity' => 1],
        ] as $cartItem) {
            DB::table('cart_items')->updateOrInsert(
                ['user_id' => $this->customerId, 'product_id' => $products[$cartItem['slug']]['id']],
                [
                    'user_id' => $this->customerId,
                    'product_id' => $products[$cartItem['slug']]['id'],
                    'quantity' => $cartItem['quantity'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }

    private function seedOrders(array $pharmacies, array $products, Carbon $now): void
    {
        $statusIds = DB::table('order_statuses')->pluck('id', 'code');
        $deliveryMethodIds = DB::table('delivery_methods')->pluck('id', 'code');
        $paymentMethodIds = DB::table('payment_methods')->pluck('id', 'code');

        $orders = [
            [
                'id' => '40000000-0000-4000-8000-000000000001',
                'status_id' => $statusIds['completed'],
                'delivery_method_id' => $deliveryMethodIds['pickup'],
                'payment_method_id' => $paymentMethodIds['on_receipt'],
                'pharmacy_id' => $pharmacies[0],
                'address' => [],
                'items' => [
                    ['slug' => 'nurofen-200', 'quantity' => 1],
                    ['slug' => 'paracetamol-500', 'quantity' => 2],
                ],
                'created_at' => $now->copy()->subDays(14),
            ],
            [
                'id' => '40000000-0000-4000-8000-000000000002',
                'status_id' => $statusIds['processing'],
                'delivery_method_id' => $deliveryMethodIds['delivery'],
                'payment_method_id' => $paymentMethodIds['online'],
                'pharmacy_id' => null,
                'address' => [
                    'delivery_country' => 'Россия',
                    'delivery_city' => 'Москва',
                    'delivery_street' => 'Тверская',
                    'delivery_house' => '15',
                    'delivery_apartment' => '42',
                    'delivery_postal_code' => '125009',
                ],
                'items' => [
                    ['slug' => 'gaviscon-lemon', 'quantity' => 1],
                    ['slug' => 'garnier-micellar-water', 'quantity' => 1],
                ],
                'created_at' => $now->copy()->subDays(2),
            ],
        ];

        foreach ($orders as $order) {
            $total = collect($order['items'])->sum(
                fn (array $item) => $products[$item['slug']]['price'] * $item['quantity']
            );

            DB::table('orders')->updateOrInsert(
                ['id' => $order['id']],
                array_merge([
                    'id' => $order['id'],
                    'user_id' => $this->customerId,
                    'pharmacy_id' => $order['pharmacy_id'],
                    'order_date' => $order['created_at'],
                    'status_id' => $order['status_id'],
                    'delivery_method_id' => $order['delivery_method_id'],
                    'payment_method_id' => $order['payment_method_id'],
                    'total_amount' => $total,
                    'delivery_country' => null,
                    'delivery_city' => null,
                    'delivery_street' => null,
                    'delivery_house' => null,
                    'delivery_apartment' => null,
                    'delivery_postal_code' => null,
                    'created_at' => $order['created_at'],
                    'updated_at' => $now,
                ], $order['address'])
            );

            foreach ($order['items'] as $item) {
                DB::table('order_items')->updateOrInsert(
                    ['order_id' => $order['id'], 'product_id' => $products[$item['slug']]['id']],
                    [
                        'order_id' => $order['id'],
                        'product_id' => $products[$item['slug']]['id'],
                        'quantity' => $item['quantity'],
                        'price_at_order' => $products[$item['slug']]['price'],
                    ]
                );
            }
        }
    }

    private function idsByName(string $table, array $names, ?array $keys = null): array
    {
        $ids = DB::table($table)->whereIn('name', $names)->pluck('id', 'name');
        $result = [];

        foreach ($names as $index => $name) {
            $result[$keys[$index] ?? $name] = $ids[$name];
        }

        return $result;
    }

    private function manufacturerCountry(string $manufacturer): string
    {
        return [
            'Reckitt Benckiser' => 'Великобритания',
            'Фармстандарт' => 'Россия',
            'GlaxoSmithKline' => 'Великобритания',
            'Отисифарм' => 'Россия',
            'Omron Healthcare' => 'Япония',
            'Paul Hartmann' => 'Германия',
            'Beiersdorf AG' => 'Германия',
            'L’Oreal S.A.' => 'Франция',
            'Johnson & Johnson Vision Care' => 'США',
        ][$manufacturer];
    }
}
