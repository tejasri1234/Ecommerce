sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/Text",
  "sap/m/VBox",
  "sap/m/MessageBox"

], (Controller, Fragment) => {
  "use strict";

  return Controller.extend("project.controller.View1", {
    onInit() {
      
      this.oModel = this.getOwnerComponent().getModel();
      this.getView().setModel(new sap.ui.model.json.JSONModel({ results: [] }), "searchModel");

    },
    onMenuPress: function (oEvent) {
      if (!this._oMenuSheet) {
          this._oMenuSheet = new sap.m.ActionSheet({
              buttons: [
                  new sap.m.Button({
                      text: "My Orders",
                      icon: "sap-icon://order-status",
                      press: () => {
                        sap.m.MessageToast.show("Account pressed");
                          
                      }
                  }),
                  new sap.m.Button({
                      text: "Account",
                      icon: "sap-icon://account",
                      press: () => {
                          sap.m.MessageToast.show("Account pressed");
                          // Add navigation logic here
                      }
                  })
              ],
              placement: sap.m.PlacementType.Bottom
          });
          this.getView().addDependent(this._oMenuSheet);
      }
      this._oMenuSheet.openBy(oEvent.getSource());
  },
    onSearch: function (oEvent) {
      var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
      var oModel = this.getView().getModel(); // ODataModel
      var that = this;
  
      if (sQuery && sQuery.length > 0) {
          oModel.read("/Product", {
              filters: [
                  new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery)
              ],
              success: function (oData) {
                  that.getView().getModel("searchModel").setProperty("/results", oData.results);
              }
          });
      } else {
          that.getView().getModel("searchModel").setProperty("/results", []);
      }
  },
    onProfilePress: function () {
      var oUserModel = this.getOwnerComponent().getModel("userModel");
      var userId = oUserModel && oUserModel.getProperty("/userId");
  
      if (userId) {
          // User is logged in, show logout option
          sap.m.MessageBox.confirm(
            "You are logged in as " + oUserModel.getProperty("/name") +
            " (" + oUserModel.getProperty("/email") + ").\n\nDo you want to log out?",
            {
                title: "Logout",
                icon: sap.m.MessageBox.Icon.QUESTION,
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                emphasizedAction: sap.m.MessageBox.Action.YES,
                details: "Logging out will end your current session.",
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                        this.getOwnerComponent().setModel(null, "userModel");
                        sap.m.MessageToast.show("Logged out successfully.");
                    }
                }.bind(this)
            }
        );
      } else {
          // Not logged in, show login/register dialog
          var oDialog = this.byId("loginRegisterDialog");
          if (oDialog) {
              oDialog.open();
          } else {
              sap.m.MessageBox.error("Login/Register dialog not found in the view.");
          }
      }
  },

    onToggleForm: function () {
      // Access the login and register forms by their IDs in the view
      var oLoginForm = this.byId("loginForm");
      var oRegisterForm = this.byId("registerForm");

      if (!oLoginForm || !oRegisterForm) {
        sap.m.MessageBox.error("Form controls not found.");
        return;
      }

      var bLoginVisible = oLoginForm.getVisible();
      oLoginForm.setVisible(!bLoginVisible);
      oRegisterForm.setVisible(bLoginVisible);
    },

    onLoginPress: function () {
      var oView = this.getView();
      var oDialog = oView.byId("loginRegisterDialog");
      if (!oDialog) {
          sap.m.MessageBox.error("Dialog not open.");
          return;
      }
  
      var oEmailInput = oView.byId("emailInput");
      var oPasswordInput = oView.byId("passwordInput");
  
      if (!oEmailInput || !oPasswordInput) {
          sap.m.MessageBox.error("Login controls not found. Please try again.");
          return;
      }
  
      var email = oEmailInput.getValue();
      var password = oPasswordInput.getValue();
  
      if (!email || !password) {
          sap.m.MessageBox.warning("Please enter both email and password.");
          return;
      }
  
      this.oModel.read("/Customer", {
          filters: [
              new sap.ui.model.Filter("email", sap.ui.model.FilterOperator.EQ, email),
              new sap.ui.model.Filter("password", sap.ui.model.FilterOperator.EQ, password)
          ],
          success: function (oData) {
      if (oData.results && oData.results.length > 0) {
          var user = oData.results[0];
          // Store user details (including UUID) in a global userModel
          var oUserModel = new sap.ui.model.json.JSONModel({
              userId: user.id,         // UUID from HANA
              name: user.name,
              email: user.email
          });

          this.getOwnerComponent().setModel(oUserModel, "userModel");
        
  
          sap.m.MessageToast.show("Login successful!");
          oDialog.close();
      } else {
          sap.m.MessageBox.error("Invalid email or password.");
      }
  }.bind(this),
          error: function () {
              sap.m.MessageBox.error("Login failed. Please try again.");
          }
      });
  },
    onRegister: function () {
      var oView = this.getView();

      var fullName = oView.byId("fullName").getValue();
      var email = oView.byId("registerEmail").getValue();
      var mobile = oView.byId("mobileNumber").getValue();
      var password = oView.byId("registerPassword").getValue();
      var confirmPassword = oView.byId("confirmPassword").getValue();
      var termsAccepted = oView.byId("terms").getSelected();
      var address = oView.byId("address") ? oView.byId("address").getValue() : "";

      if (!fullName || !email || !mobile || !password || !confirmPassword) {
        sap.m.MessageBox.warning("Please fill in all required fields.");
        return;
      }
      if (password !== confirmPassword) {
        sap.m.MessageBox.error("Passwords do not match.");
        return;
      }
      if (!termsAccepted) {
        sap.m.MessageBox.warning("You must agree to the Terms & Conditions.");
        return;
      }

      // Check if email already exists
      this.oModel.read("/Customer", {
        filters: [
          new sap.ui.model.Filter("email", sap.ui.model.FilterOperator.EQ, email)
        ],
        success: function (oData) {
          if (oData.results && oData.results.length > 0) {
            sap.m.MessageBox.error("User already exists with this email.");
            return;
          }

          // If not exists, proceed to create
          var oDataToCreate = {
            name: fullName,
            email: email,
            phone: mobile,
            password: password,
            address: address,
            createdAt: new Date().toISOString()
          };

          this.oModel.create("/Customer", oDataToCreate, {
            success: function () {
              sap.m.MessageBox.success("Registration successful!");
              this.onToggleForm();
              var oDialog = oView.byId("loginRegisterDialog");
              if (oDialog) {
                oDialog.close();
              }

              // Clear all input fields
              oView.byId("fullName").setValue("");
              oView.byId("registerEmail").setValue("");
              oView.byId("mobileNumber").setValue("");
              oView.byId("registerPassword").setValue("");
              oView.byId("confirmPassword").setValue("");
              oView.byId("terms").setSelected(false);
              if (oView.byId("address")) oView.byId("address").setValue("");

              var oUserModel = new sap.ui.model.json.JSONModel({ userId: email });
              oView.getController().getOwnerComponent().setModel(oUserModel, "userModel");
            }.bind(this),
            error: function () {
              sap.m.MessageBox.error("Registration failed. Please try again.");
            }
          });
        }.bind(this),
        error: function () {
          sap.m.MessageBox.error("Could not check for existing user. Please try again.");
        }
      });
    },

    onForgotPasswordPress: function () {
      sap.m.MessageBox.information("Password reset functionality is not implemented in this demo.");
    },

    onToggleLoginPasswordVisibility: function () {
      var oInput = this.byId("passwordInput");
      if (oInput) {
        oInput.setType(oInput.getType() === "Password" ? "Text" : "Password");
      }
    },

    onToggleRegisterPasswordVisibility: function () {
      var oInput = this.byId("registerPassword");
      if (oInput) {
        oInput.setType(oInput.getType() === "Password" ? "Text" : "Password");
      }
    },

    onToggleConfirmPasswordVisibility: function () {
      var oInput = this.byId("confirmPassword");
      if (oInput) {
        oInput.setType(oInput.getType() === "Password" ? "Text" : "Password");
      }
    },

    onCloseLoginDialog: function () {
      var oDialog = this.byId("loginRegisterDialog");
      if (oDialog) {
        oDialog.close();
      }
    },


    onImagePress1: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("fruitVegetable"); // 'fruitVegetable' is the route name
    },
    onImagePress2: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("attarice"); // 'fruitVegetable' is the route name
    },
    onImagePress3: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("sweet"); // 'fruitVegetable' is the route name
    },
    onImagePress4: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("dairy"); // 'fruitVegetable' is the route name
    },
    onImagePress5: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("packed"); // 'fruitVegetable' is the route name
    },
    onImagePress6: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("cooldrinks"); // 'fruitVegetable' is the route name
    },
    onImagePress7: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("teacoffe"); // 'fruitVegetable' is the route name
    },
    updateCartDisplay: function () {
      var view = this.getView();
      var cartItemsContainer = view.byId("cartItemsContainer");
      var totalPriceText = view.byId("totalPriceText");
      var placeOrderButton = view.byId("placeOrderButton"); // Make sure your Place Order button has this ID

      cartItemsContainer.removeAllItems();

      var cartModel = this.getOwnerComponent().getModel("cartModel");
      var cartData = cartModel.getData();

      let total = 0;

      if (!cartData.items || cartData.items.length === 0) {
        // Cart is empty
        cartItemsContainer.addItem(
          new sap.m.Text({
            text: "Your cart is empty. Browse products to add items!",
            textAlign: "Center"
          }).addStyleClass("cartEmptyText")
        );
        totalPriceText.setText("");
        if (placeOrderButton) {
          placeOrderButton.setVisible(false);
        }
        return;
      }

      cartData.items.forEach((item, index) => {
        total += item.price * item.quantity;

        var quantityBox = new sap.m.HBox({
          items: [
            new sap.m.Button({
              icon: "sap-icon://less",
              type: "Transparent",
              press: () => {
                if (item.quantity > 1) {
                  item.quantity -= 1;
                } else {
                  cartData.items.splice(index, 1);
                }
                cartModel.setProperty("/items", cartData.items);
                this.updateCartDisplay();
              }
            }),
            new sap.m.Text({ text: item.quantity.toString() }).addStyleClass("cartItemQuantity"),
            new sap.m.Button({
              icon: "sap-icon://add",
              type: "Transparent",
              press: () => {
                if (item.quantity < item.stock) {
                  item.quantity += 1;
                  cartModel.setProperty("/items", cartData.items);
                  this.updateCartDisplay();
                } else {
                  sap.m.MessageToast.show("Maximum stock reached for " + item.name + "!");
                }
              }
            })
          ],
          alignItems: "Center",
          justifyContent: "Center"
        }).addStyleClass("quantityControlBox");

        var itemBox = new sap.m.VBox({
          items: [
            new sap.m.Text({ text: item.name }).addStyleClass("cartItemName"),
            quantityBox,
            new sap.m.Text({ text: "Price: ₹" + item.price }).addStyleClass("cartItemPrice")
          ]
        }).addStyleClass("cartItemBox");

        cartItemsContainer.addItem(itemBox);
      });

      totalPriceText.setText("Total: ₹" + total.toFixed(2));
      if (placeOrderButton) {
        placeOrderButton.setVisible(true);
      }
    },

    onCartPress: function () {
      var view = this.getView();
      var cartPanel = view.byId("cartPanel");

      cartPanel.setVisible(!cartPanel.getVisible());
      this.updateCartDisplay();
    },

    onCloseCart: function () {
      var cartPanel = this.getView().byId("cartPanel");
      if (cartPanel) {
        cartPanel.setVisible(false);
      }
    },
    onPlaceOrder: function () {
      var oView = this.getView();
      var cartModel = this.getOwnerComponent().getModel("cartModel");
      var cartData = cartModel.getData();
      var oUserModel = this.getOwnerComponent().getModel("userModel");
      var oModel = oView.getModel(); // ODataModel
  
      // Get customer ID from userModel
      var customerId = oUserModel && oUserModel.getProperty("/userId");
      if (!customerId) {
          sap.m.MessageBox.error("You must be logged in to place an order.");
          return;
      }
  
      if (!cartData.items || cartData.items.length === 0) {
          sap.m.MessageBox.warning("Your cart is empty.");
          return;
      }
  
      // Use totalAmount from cartModel if available, else calculate
      var totalAmount = cartData.totalAmount;
      if (typeof totalAmount !== "number") {
          totalAmount = cartData.items.reduce(function(sum, item) {
              return sum + (item.price * item.quantity);
          }, 0);
      }
  
      // Build order items payload
      var orderItems = cartData.items.map(function(item) {
          return {
              product_id: item.id, // Association to Product (check your OData $metadata for the correct property name)
              unit: item.quantity,
              price: item.price
          };
      });
  
      // Build order payload
      var oOrderData = {
        customer_id: customerId, // Association to Customer (check your OData $metadata for the correct property name)
          orderDate: new Date().toISOString(),
          status: "Placed",
          totalAmount: totalAmount,
          items: orderItems
      };
  
      oModel.create("/Order", oOrderData, {
          success: function () {
            cartData.items.forEach(function(item) {
              var newStock = item.stock - item.quantity;
              if (newStock < 0) newStock = 0;
              oModel.update("/Product('" + item.id + "')", { stock: newStock }, {
                  success: function () {
                      // Optionally refresh product model or show a toast
                  },
                  error: function () {
                      sap.m.MessageToast.show("Failed to update stock for " + item.name);
                  }
              });
          });
              sap.m.MessageBox.success(
                  "Order placed successfully! Your order will be delivered in 10 minutes.",
                  { title: "Order Successful" }
              );
              cartModel.setProperty("/items", []);
              cartModel.setProperty("/totalAmount", 0);
              this.onCloseCart();
              this.updateCartDisplay();
          }.bind(this),
          error: function () {
              sap.m.MessageBox.error("Order placement failed. Please try again.");
          }
      });
  }
  });
});