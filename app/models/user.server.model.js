'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	jobtitle: {
	    type:String,
	    trim: true
	},
	emrUserId:{
		type: Number,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},
	userDOB: {
		type: Date
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
    userCI: {
	    tipo : {type: String, trim: true},
	    value: {type: String, trim: true}
	 },

    userTelefono: {
    	type: String,
		trim: true	
    },

    userEmail: {
    	type: String,
		trim: true	
    },
    userEC:{
 	 type: Schema.ObjectId,
	  ref: 'Maintain'
    },
    userSexo: {
      type: String,
	  trim: true	
    },
    
    userEContact: {
    tipoRelacion :  {type: Schema.ObjectId,
                     ref: 'Maintain'},
    contactFirstName: {type: String, trim: true},
    contactLastName: {type: String, trim: true},
    contactCelular : {type: String, trim: true},
    contactCasa: {type: String, trim: true},
    contactTrabajo: {type: String, trim: true}
    },

    isActive:{
       type:Boolean,
       trim:true
    },

    userPhonesResult : {
    	casa : {type: String, trim: true},
  	    celular : {type: String, trim: true} 
        
     },
    userDireccion: {
    	type: String,
		trim: true	
    },
    department: {
 	   type: Schema.ObjectId,
	   ref: 'Maintain'
    },

    especialidad: {
       type: Schema.ObjectId,
	   ref: 'Maintain'
    },

    locationId:{
		type: Schema.ObjectId,
		ref: 'locations'
	},

    pais: {
		type: Schema.ObjectId,
		ref: 'Pais'
	},
	ciudad: {
		type: Schema.ObjectId,
		ref: 'Ciudad'
	},
	sector: {
		type: Schema.ObjectId,
		ref: 'Sector'
	},
	createDate: {
		type: Date,
		default: Date.now
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
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);