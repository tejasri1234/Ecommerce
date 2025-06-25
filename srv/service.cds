
using { ecommerce as e } from '../db/dataModel';

service CatalogService {
  entity Customer as projection on e.Customer;
  entity Category as projection on e.Category;
  entity Product as projection on e.Product;
  entity Order as projection on e.Order;
  entity OrderItem as projection on e.OrderItem;
 

}
