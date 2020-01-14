
'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    //config = require('../../app/config/express.js'),
    autoIncrement = require('mongoose-auto-increment');
    autoIncrement.initialize(mongoose);
     //console.log(mongoose.connections);

var PatientSchema = new Schema({
  creado: {
    type: Date,
    default: Date.now
  },
  PatientCI: {
    tipo : {type: String, trim: true},
    value: {type: String, trim: true}
  },

  patientEContact: {
    tipoRelacion :  {type: Schema.ObjectId,
                     ref: 'Maintain'},
    contactFirstName: {type: String, trim: true},
    contactLastName: {type: String, trim: true},
    contactCelular : {type: String, trim: true},
    contactCasa: {type: String, trim: true},
    contactTrabajo: {type: String, trim: true}
  },

  patientFirstName: {
    type: String,
    trim: true,
    required: 'El nombre del paciente no puede estar en blanco'
  },

  patientLastName: {
    type: String,
    trim: true
  },
   patientDOB: {
    type: Date,
    trim: true
  },
   patientEdad: {
    type: Number,
    trim: true
  },

  patientSexo: {
     type: Schema.ObjectId,
      ref: 'Headermaster'
  },

  patientEC: {
      type: Schema.ObjectId,
      ref: 'Headermaster'
  },

  patientTipoSangre : {
       type: Schema.ObjectId,
       ref: 'Maintain'
  },

   patientSeguro : {
       type: Schema.ObjectId,
       ref: 'Clientes'
  },

  patientPhones : {
  	celular : {type: String, trim: true}, 
    casa : {type: String, trim: true}
  },

   patientReligion:{
   type: Schema.ObjectId,
   ref: 'Headermaster'
   },

   patientIdioma: {
   type: Schema.ObjectId,
   ref: 'Headermaster'
   },

   patientNacionalidad: {
   type: Schema.ObjectId,
   ref: 'Headermaster'
   },

   patientEmail : {type: String, trim: true},

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
  patientDireccion: {
    type: String,
    trim: true
  },
  creador: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updateUser:{},
  updateDate:{
    type: Date
  }
});
PatientSchema.plugin(autoIncrement.plugin, {
    model: 'Patients',
    field: 'patientId',
    startAt: 100,
    incrementBy: 1
}
);
mongoose.model('Patients', PatientSchema);