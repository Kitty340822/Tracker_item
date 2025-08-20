-- ตารางผู้ใช้งาน
CREATE TABLE "users" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    email_verified TIMESTAMP WITH TIME ZONE,
    phone VARCHAR(20) UNIQUE,
    role_permission VARCHAR(50) NOT NULL
);

-- Display name (1 user มี display name เดียว)
CREATE TABLE displayName (
    phone VARCHAR(20) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    name VARCHAR(100),
    role_permission VARCHAR(50)
);

-- Customer
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Category (spare part type)
CREATE TABLE category (
    code_spare_part SERIAL PRIMARY KEY,
    type_machine VARCHAR(100) NOT NULL,
    name_spare_part VARCHAR(100) NOT NULL
);

-- Supplier
CREATE TABLE supplier (
    code SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT
);

-- Spare Part
CREATE TABLE sparePart (
    code SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES Supplier(code) ON DELETE SET NULL,
    type VARCHAR(100),
    name VARCHAR(100),
    brand VARCHAR(100),
    quantity INT DEFAULT 0,
    create_by INT REFERENCES "User"(user_id),
    update_by INT REFERENCES "User"(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Service Task
CREATE TABLE serviceTask (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Customer(customer_id) ON DELETE CASCADE,
    phone VARCHAR(20) REFERENCES DisplayName(phone),
    user_id INT REFERENCES "User"(user_id),
    status VARCHAR(50),
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    created_by INT REFERENCES "User"(user_id),
    updated_by INT REFERENCES "User"(user_id),
    note TEXT,
    pic VARCHAR(100)
);

-- Order
CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    plan_receive_date DATE,
    act_receive_date DATE,
    order_update DATE,
    order_at DATE,
    order_part TEXT
);

-- Service Spare Part (เชื่อมระหว่าง Service Task + Spare Part + Order)
CREATE TABLE serviceSparePart (
    spare_part_id INT REFERENCES SparePart(code) ON DELETE CASCADE,
    service_task_id INT REFERENCES ServiceTask(id) ON DELETE CASCADE,
    order_id INT REFERENCES "Order"(order_id) ON DELETE CASCADE,
    status VARCHAR(50),
    PRIMARY KEY (spare_part_id, service_task_id, order_id)
);

-- Mapping ระหว่าง SparePart และ Category (m:m)
CREATE TABLE sparePartCategory (
    spare_part_id INT REFERENCES SparePart(code) ON DELETE CASCADE,
    category_id INT REFERENCES Category(code_spare_part) ON DELETE CASCADE,
    PRIMARY KEY (spare_part_id, category_id)
);
  