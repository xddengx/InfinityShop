/* Model: User Account
The product schema: name of product, price, description, image, owner
*/
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let UserProductsModel = {};
let BoughtProductModel = {};

// mongoose.Types.ObjectID converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = name => _.escape(name).trim();

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  price: {
    type: Number,
    min: 1,
    required: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  productImage: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

const BoughtProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  price: {
    type: Number,
    min: 1,
    required: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  productImage: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.statics.toAPI = doc => ({
  name: doc.name,
  price: doc.price,
  description: doc.description,
  image: doc.productImage,
});

ProductSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return UserProductsModel.find(search).select('name price description productImage').exec(callback);
};

ProductSchema.statics.DeleteProductId = (productId, callback) => {
  const search = {
    _id: convertId(productId),
  };

  return UserProductsModel.deleteOne(search).exec(callback);
};

// use for updating product find product via product id .
ProductSchema.statics.FindProductById = (productId, callback) => {
  const search = {
    _id: convertId(productId),
  };

  return UserProductsModel.findOne(search).exec(callback);
};

BoughtProductSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return BoughtProductModel.find(search).select('name price description productImage').exec(callback);
};


ProductSchema.statics.findProducts = callback => UserProductsModel.find(callback);

UserProductsModel = mongoose.model('Products', ProductSchema);
BoughtProductModel = mongoose.model('Bought', BoughtProductSchema);

module.exports.UserProductsModel = UserProductsModel;
module.exports.ProductSchema = ProductSchema;
module.exports.BoughtProductModel = BoughtProductModel;
module.exports.BoughtProductSchema = BoughtProductSchema;
