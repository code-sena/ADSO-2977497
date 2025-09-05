-- ==========================================================
-- PANYPAN – Core Schema (MySQL 8.0+)
-- Notes:
-- - Singular names, PK = id
-- - FK columns named <entity>_id
-- - `user` se escapa con backticks por ser palabra reservada
-- - Timestamps con CURRENT_TIMESTAMP
-- ==========================================================

-- =========================
--  UBICATION / LOCATION
-- =========================
CREATE TABLE company (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  legal_name    VARCHAR(150)    NOT NULL,
  trade_name    VARCHAR(150),
  tax_id        VARCHAR(32)     NOT NULL,
  email         VARCHAR(120),
  phone         VARCHAR(40),
  address       VARCHAR(200),
  city          VARCHAR(100),
  state         VARCHAR(100),
  country       VARCHAR(100),
  postal_code   VARCHAR(20),
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_company_tax_id (tax_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE headquarter (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id    BIGINT UNSIGNED NOT NULL,
  code          VARCHAR(20)     NOT NULL,
  name          VARCHAR(120)    NOT NULL,
  email         VARCHAR(120),
  phone         VARCHAR(40),
  address       VARCHAR(200),
  city          VARCHAR(100),
  state         VARCHAR(100),
  country       VARCHAR(100),
  postal_code   VARCHAR(20),
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_headquarter_company_code (company_id, code),
  UNIQUE KEY uq_headquarter_company_name (company_id, name),
  CONSTRAINT fk_headquarter_company
    FOREIGN KEY (company_id) REFERENCES company(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
--  PARAMETER
-- =========================
CREATE TABLE person (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  document_type     VARCHAR(20)     NOT NULL,  -- CC, CE, NIT
  document_number   VARCHAR(40)     NOT NULL,
  first_name        VARCHAR(100)    NOT NULL,
  last_name         VARCHAR(100)    NOT NULL,
  email             VARCHAR(120),
  phone             VARCHAR(40),
  address           VARCHAR(200),
  city              VARCHAR(100),
  is_active         TINYINT(1)      NOT NULL DEFAULT 1,
  created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_person_document (document_type, document_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE role (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(60)     NOT NULL,
  description   VARCHAR(200),
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_role_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user` (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  person_id       BIGINT UNSIGNED NOT NULL,
  role_id         BIGINT UNSIGNED NOT NULL,
  username        VARCHAR(60)     NOT NULL,
  password_hash   VARCHAR(255)    NOT NULL,
  email           VARCHAR(120)    NOT NULL,
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  last_login_at   DATETIME        NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_username (username),
  UNIQUE KEY uq_user_email (email),
  CONSTRAINT fk_user_person
    FOREIGN KEY (person_id) REFERENCES person(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_user_role
    FOREIGN KEY (role_id) REFERENCES role(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
--  SUPPLY CHAIN
-- =========================
CREATE TABLE supplier (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_name  VARCHAR(150)    NOT NULL,
  tax_id        VARCHAR(32)     NOT NULL,
  contact_name  VARCHAR(120),
  email         VARCHAR(120),
  phone         VARCHAR(40),
  address       VARCHAR(200),
  city          VARCHAR(100),
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_supplier_tax_id (tax_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
--  BUSINESS CORE
-- =========================
CREATE TABLE category (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_category_id    BIGINT UNSIGNED NULL,
  code                  VARCHAR(30)     NOT NULL,
  name                  VARCHAR(120)    NOT NULL,
  description           VARCHAR(200),
  is_active             TINYINT(1)      NOT NULL DEFAULT 1,
  created_at            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_category_code (code),
  CONSTRAINT fk_category_parent
    FOREIGN KEY (parent_category_id) REFERENCES category(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE product (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id   BIGINT UNSIGNED NOT NULL,
  supplier_id   BIGINT UNSIGNED NULL,
  sku           VARCHAR(40)     NOT NULL,
  barcode       VARCHAR(64)     NULL,
  name          VARCHAR(150)    NOT NULL,
  description   VARCHAR(300),
  cost_price    DECIMAL(12,2)   NOT NULL DEFAULT 0,
  unit_price    DECIMAL(12,2)   NOT NULL DEFAULT 0,
  tax_rate      DECIMAL(5,2)    NOT NULL DEFAULT 0,  -- percent
  image_url     VARCHAR(300),
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_sku (sku),
  UNIQUE KEY uq_product_barcode (barcode),
  CONSTRAINT fk_product_category
    FOREIGN KEY (category_id) REFERENCES category(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_product_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE inventory (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id       BIGINT UNSIGNED NOT NULL,
  headquarter_id   BIGINT UNSIGNED NOT NULL,
  quantity         DECIMAL(14,3)   NOT NULL DEFAULT 0,
  reorder_point    DECIMAL(14,3)   NOT NULL DEFAULT 0,
  min_stock        DECIMAL(14,3)   NOT NULL DEFAULT 0,
  max_stock        DECIMAL(14,3)   NULL,
  last_movement_at DATETIME        NULL,
  created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inventory_product_headquarter (product_id, headquarter_id),
  CONSTRAINT fk_inventory_product
    FOREIGN KEY (product_id) REFERENCES product(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_inventory_headquarter
    FOREIGN KEY (headquarter_id) REFERENCES headquarter(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE payment_method (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(60)     NOT NULL,  -- Cash, Card, Transfer, Mixed
  description   VARCHAR(200),
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payment_method_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE billing (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id        BIGINT UNSIGNED NOT NULL,
  headquarter_id    BIGINT UNSIGNED NOT NULL,
  person_id         BIGINT UNSIGNED NOT NULL,  -- customer
  user_id           BIGINT UNSIGNED NOT NULL,  -- cashier/seller
  payment_method_id BIGINT UNSIGNED NOT NULL,
  number            VARCHAR(40)     NOT NULL,
  issue_date        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date          DATETIME        NULL,
  subtotal          DECIMAL(14,2)   NOT NULL DEFAULT 0,
  discount_total    DECIMAL(14,2)   NOT NULL DEFAULT 0,
  tax_total         DECIMAL(14,2)   NOT NULL DEFAULT 0,
  total             DECIMAL(14,2)   NOT NULL DEFAULT 0,
  status            ENUM('DRAFT','ISSUED','PAID','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  note              VARCHAR(300),
  created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_billing_headquarter_number (headquarter_id, number),
  CONSTRAINT fk_billing_company
    FOREIGN KEY (company_id) REFERENCES company(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_billing_headquarter
    FOREIGN KEY (headquarter_id) REFERENCES headquarter(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_billing_person
    FOREIGN KEY (person_id) REFERENCES person(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_billing_user
    FOREIGN KEY (user_id) REFERENCES `user`(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_billing_payment_method
    FOREIGN KEY (payment_method_id) REFERENCES payment_method(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE billing_detail (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  billing_id      BIGINT UNSIGNED NOT NULL,
  product_id      BIGINT UNSIGNED NOT NULL,
  quantity        DECIMAL(14,3)   NOT NULL,
  unit_price      DECIMAL(12,2)   NOT NULL,
  discount_percent DECIMAL(5,2)   NOT NULL DEFAULT 0,  -- percent
  tax_rate        DECIMAL(5,2)    NOT NULL DEFAULT 0,  -- percent
  line_subtotal   DECIMAL(14,2)   NOT NULL DEFAULT 0,
  line_total      DECIMAL(14,2)   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_billing_detail_billing
    FOREIGN KEY (billing_id) REFERENCES billing(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_billing_detail_product
    FOREIGN KEY (product_id) REFERENCES product(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
