namespace ecommerce;

entity Customer {
    key id         : UUID;
    name           : String(100);
    email          : String(100);
    phone          : String(20);
    password       : String;
    address        : String(255);
    createdAt      : DateTime;
}

entity Category {
    key id         : UUID;
    name           : String(100);
    description    : String(255);
}

entity Product {
    key id         : UUID;
    name           : String(100);
    description    : String(255);
    price          : Integer;
    stock          : Integer;
    unit           : String(20);
    category       : Association to Category;
}

entity Order {
    key id         : UUID;
    customer       : Association to Customer;
    orderDate      : DateTime;
    status         : String(50);
    totalAmount    : Integer;
    items          : Composition of many OrderItem on items.order = $self;
}

entity OrderItem {
    key id         : UUID;
    order          : Association to Order;
    product        : Association to Product;
    quantity       : Integer;
    price          : Integer;
}
