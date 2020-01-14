'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;


    autoIncrement.initialize(mongoose);

/**
 * Document Schema
 */
var DocumentSchema = new Schema({
	

	docType: {
		type: String,
		default: '',
		trim: true
	},
	result:{},
	createdDate: {
		type: Date,
		default: Date.now
	},
    docpatient: {
		type: Schema.ObjectId,
    	ref: 'Patients'
    },

	createUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    updateUser:{
		type: Schema.ObjectId,
		ref: 'User'
	},
     updateDate:{
		type: Date,
		default: Date.now
	}
});

DocumentSchema.plugin(autoIncrement.plugin, {
    model: 'Document',
    field: 'documentId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Document', DocumentSchema);