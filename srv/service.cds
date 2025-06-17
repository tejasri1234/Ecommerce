
using { db } from '../db/dataModel';

service CatalogService @(path: '/catalog') {
  entity Customers   as projection on db.Customers;
  entity Categories  as projection on db.Categories;
  entity Products    as projection on db.Products;
  entity Orders      as projection on db.Orders;
  entity OrderItems  as projection on db.OrderItems;
  entity Payments    as projection on db.Payments;
  entity Shipments   as projection on db.Shipments;
}
