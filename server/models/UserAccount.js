const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let UserProductsModel = {};

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
});

ProductSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return UserProductsModel.find(search).select('name price description').exec(callback);
};

ProductSchema.statics.DeleteProductId = (productId, callback) => {
  const search = {
    _id: convertId(productId),
  };

  return UserProductsModel.deleteOne(search).exec(callback);
};

// use for updating product find product via product id 
ProductSchema.statics.UpdateProduct = (productId, callback) => {
  const search = {
    _id: convertId(productId)
  };

  return UserProductsModel.UpdateOne(search).exec(callback);
};

// find all products
ProductSchema.statics.findProducts = (productId, callback) => {
  const search = {
    _id: convertId(productId),
  };

  return UserProductsModel.find(search).select('name price description').exec(callback);
};

UserProductsModel = mongoose.model('Products', ProductSchema);

module.exports.UserProductsModel = UserProductsModel;
module.exports.ProductSchema = ProductSchema;
