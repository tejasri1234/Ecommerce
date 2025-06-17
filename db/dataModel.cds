namespace db;

using { cuid, managed, Currency } from '@sap/cds/common';

type GUID : String(32);

entity Customers : managed {
  key CustomerID : GUID;
  Name           : String;
  Email          : String(100);
  Password       : String(8);
  Phone          : String(15);
  Address        : String;
}

entity Categories : managed {
  key CategoryID : GUID;
  Name           : String;
  Description    : String;
}

entity Products : managed {
  key ProductID  : GUID;
  Name           : String;
  Description    : String;
  Price          : Decimal(15,2);
  StockQuantity  : Integer;
  ImageURL       : String;
  Category       : Association to Categories;
}

entity Orders : managed {
  key OrderID     : GUID;
  Customer       : Association to Customers;
  OrderDate      : DateTime;
  Status         : String;
  TotalAmount    : Decimal(15,2);
  ShippingAddress: String;
}

entity OrderItems : managed {
  key OrderItemID : GUID;
  Order           : Association to Orders;
  Product         : Association to Products;
  Quantity        : Integer;
  Price           : Decimal(15,2);
}

entity Payments : managed {
  key PaymentID   : GUID;
  Order           : Association to Orders;
  Amount          : Decimal(15,2);
  Status          : String;
  PaymentDate     : DateTime;
  PaymentMethod   : String;
}

entity Shipments : managed {
  key ShipmentID  : GUID;
  Order           : Association to Orders;
  Carrier         : String;
  TrackingNumber  : String;
  EstimatedDate   : DateTime;
  Status          : String;
}
