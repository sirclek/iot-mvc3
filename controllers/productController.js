const { body, validationResult } = require("express-validator");

const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");

exports.search_get = asyncHandler(async function(req, res, next) {
  const query = req.query.query;
  const products = await Product.find({ $text: { $search: query } });
  res.render("product/search_results", { title: "Search Results", query: query, products: products });
});

//create

exports.create_get = asyncHandler(async function(req, res, next) {
  res.render("product/create", { title: "Create Product"});
});

exports.create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please enter a product name."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please enter a product description."),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0."),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0."),

  asyncHandler(async function(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {

      const prev = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        price: req.body.price,
      };
      res.render("product/create", { title: "Create Product", prev: prev, errors: errors.array() });
      return;
    }

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        price: req.body.price,
    });

    await product.save();

    res.redirect("/");
    return;
  }),
];

//continue shopping or view cart page
exports.added_get = asyncHandler(async function(req, res, next) {
  res.render("product/added", { title: "Added Product", user: req.session.user});
});


//view all

exports.view_get = asyncHandler(async function(req, res, next) {
  const products = await Product.find();
  res.render("product/view", { title: "All Products", products: products, user: req.session.user, activePage: 'product'});
});

//view one

exports.view_detail_get = asyncHandler(async function(req, res, next) {

  let product = undefined;

  try {
    product = await Product.findById(req.params.id);
  } catch (error) {
    product = undefined;
  }

  res.render("product/view_detail", { title: "View Product", product: product, user: req.session.user});
});

//add to cart

exports.view_detail_post = [
  body("purchase_quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0.")
    .custom((value, { req }) => {
      if (parseInt(value) > req.quantity) {
          throw new Error('Purchase quantity exceeds available quantity');
      }
      return true;
  }),

  asyncHandler(async function(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {

      let product = undefined;

      try {
        product = await Product.findById(req.params.id);
      } catch (error) {
        product = undefined;
      }

      res.render("product/view_detail", { title: "View Product", product: product, errors: errors.array() });
      return;
    }

    let cart = undefined;

    if (!req.session.cart) {
      const newCart = new Cart();
      cart = await newCart.save();
    }
    else {
      console.log(req.session.cart)
      cart = await Cart.findById(req.session.cart._id);
    }

    const cartItem = await CartItem.findOne({ cart_id: cart._id, product_id: req.params.id });

    if (cartItem) {
      cartItem.quantity += parseInt(req.body.purchase_quantity);
      await cartItem.save();
    }
    else {
      const newCartItem = new CartItem({
        cart_id: cart._id,
        product_id: req.params.id,
        quantity: req.body.purchase_quantity,
      });
      await newCartItem.save();
    }

    req.session.cart = cart;

    res.redirect("/product/added"); 
    return;
  }),
];


//update

exports.update_get = asyncHandler(async function(req, res, next) {

  let product = undefined;

  try {
    product = await Product.findById(req.params.id);
  } catch (error) {
    product = undefined;
  }

  res.render("product/update", { title: "Update Product", product: product });
});

exports.update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please enter a product name."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please enter a product description."),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0."),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0."),

  asyncHandler(async function(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {

      const prev = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        price: req.body.price,
      };
      res.render("product/update", { title: "Update Product", product: prev, errors: errors.array() });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      quantity: req.body.quantity,
      price: req.body.price,
    })

    res.redirect("/");
    return;
  }),
];