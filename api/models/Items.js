/**
 * Items.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
		},
    category: {
      type: 'string',
      required: true
		},
    description: {
      type: 'string',
      required: true
		},
    size: {
      type: 'string',
      required: true
		},
    dollars: {
      type: 'integer',
      required: true
		},
    cents: {
      type: 'integer',
      required: true
		},
    barcode: {
      type: 'integer',
      required: true
		},
    active: {
      type: 'boolean',
      required: true
		},
    taxable: {
      type: 'boolean',
      required: true
		}
  }
};

tablize(module.exports);
