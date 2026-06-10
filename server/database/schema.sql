
DROP TYPE IF EXISTS order_status_enum CASCADE;
DROP TYPE IF EXISTS delivery_method_enum CASCADE;
DROP TYPE IF EXISTS payment_method_enum CASCADE;


CREATE TABLE order_statuses (
    id SMALLSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

INSERT INTO order_statuses (code, name) VALUES
('new', 'Новый'),
('processing', 'В обработке'),
('shipping', 'Доставляется'),
('delivered', 'Доставлен'),
('completed', 'Завершен'),
('cancelled', 'Отменен');


CREATE TABLE delivery_methods (
    id SMALLSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

INSERT INTO delivery_methods (code, name) VALUES
('pickup', 'Самовывоз'),
('delivery', 'Доставка');


CREATE TABLE payment_methods (
    id SMALLSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

INSERT INTO payment_methods (code, name) VALUES
('online', 'Онлайн'),
('on_receipt', 'При получении');


-- =========================================================
-- 9. ПРОИЗВОДИТЕЛИ
-- =========================================================

CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


ALTER TABLE products
ADD COLUMN manufacturer_id INT REFERENCES manufacturers(id) ON DELETE SET NULL;


CREATE INDEX idx_products_manufacturer_id
ON products(manufacturer_id);


-- =========================================================
-- 8. НЕСКОЛЬКО ИЗОБРАЖЕНИЙ ТОВАРОВ
-- =========================================================

ALTER TABLE products
DROP COLUMN image_url;


CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    image_url TEXT NOT NULL,

    alt_text VARCHAR(255),

    sort_order INT NOT NULL DEFAULT 0,

    is_main BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX idx_product_images_product_id
ON product_images(product_id);


-- =========================================================
-- 1. СКЛАДСКОЙ УЧЕТ / INVENTORY
-- =========================================================

CREATE TABLE inventory (
    pharmacy_id INT NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,

    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),

    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (pharmacy_id, product_id),

    CHECK (reserved_quantity <= stock_quantity)
);


CREATE INDEX idx_inventory_product_id
ON inventory(product_id);


-- =========================================================
-- 10. РЕЦЕПТЫ
-- =========================================================

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    uploaded_file_url TEXT NOT NULL,

    doctor_name VARCHAR(255),

    issued_at DATE,

    expires_at DATE,

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,

    verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX idx_prescriptions_user_id
ON prescriptions(user_id);


-- Связь рецепта с заказом

CREATE TABLE order_prescriptions (
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,

    PRIMARY KEY (order_id, prescription_id)
);


-- =========================================================
-- 11. НОРМАЛИЗОВАННЫЙ АДРЕС ДОСТАВКИ
-- =========================================================

ALTER TABLE orders
DROP COLUMN delivery_address;


ALTER TABLE orders
ADD COLUMN delivery_country VARCHAR(255),
ADD COLUMN delivery_city VARCHAR(255),
ADD COLUMN delivery_street VARCHAR(255),
ADD COLUMN delivery_house VARCHAR(50),
ADD COLUMN delivery_apartment VARCHAR(50),
ADD COLUMN delivery_postal_code VARCHAR(50);


-- Обновленный CHECK

ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_check;


ALTER TABLE orders
ADD CONSTRAINT orders_delivery_check
CHECK (
    (
        delivery_method_id = (
            SELECT id FROM delivery_methods WHERE code = 'delivery'
        )
        AND delivery_city IS NOT NULL
        AND delivery_street IS NOT NULL
        AND pharmacy_id IS NULL
    )
    OR
    (
        delivery_method_id = (
            SELECT id FROM delivery_methods WHERE code = 'pickup'
        )
        AND pharmacy_id IS NOT NULL
    )
);


-- =========================================================
-- ОБНОВЛЕНИЕ ORDERS ПОД СПРАВОЧНИКИ
-- =========================================================

ALTER TABLE orders
DROP COLUMN status,
DROP COLUMN delivery_method,
DROP COLUMN payment_method;


ALTER TABLE orders
ADD COLUMN status_id SMALLINT NOT NULL
REFERENCES order_statuses(id),

ADD COLUMN delivery_method_id SMALLINT NOT NULL
REFERENCES delivery_methods(id),

ADD COLUMN payment_method_id SMALLINT NOT NULL
REFERENCES payment_methods(id);


CREATE INDEX idx_orders_status_id
ON orders(status_id);


-- =========================================================
-- 12. created_by / updated_by
-- =========================================================

ALTER TABLE products
ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN updated_by UUID REFERENCES users(id) ON DELETE SET NULL;


ALTER TABLE categories
ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN updated_by UUID REFERENCES users(id) ON DELETE SET NULL;


ALTER TABLE sections
ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN updated_by UUID REFERENCES users(id) ON DELETE SET NULL;


ALTER TABLE brands
ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN updated_by UUID REFERENCES users(id) ON DELETE SET NULL;


ALTER TABLE pharmacies
ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN updated_by UUID REFERENCES users(id) ON DELETE SET NULL;


-- =========================================================
-- ДОПОЛНИТЕЛЬНЫЕ ПОЛЕЗНЫЕ ИНДЕКСЫ
-- =========================================================

CREATE INDEX idx_orders_created_at
ON orders(order_date DESC);


CREATE INDEX idx_products_is_prescription
ON products(is_prescription);


CREATE INDEX idx_inventory_stock_quantity
ON inventory(stock_quantity);


CREATE INDEX idx_product_images_main
ON product_images(product_id, is_main);


-- =========================================================
-- РЕКОМЕНДУЕМЫЕ CONSTRAINTS
-- =========================================================

ALTER TABLE product_images
ADD CONSTRAINT unique_main_image_per_product
UNIQUE NULLS NOT DISTINCT (product_id, is_main);


ALTER TABLE inventory
ADD CONSTRAINT inventory_non_negative
CHECK (
    stock_quantity >= 0
    AND reserved_quantity >= 0
);
