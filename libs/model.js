'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to DB -- Need Config
mongoose.connect('localhost', 'diligent');

const PolicySchema = new Schema({
  poicyNumber: {
    type: String,
    required: true
  },
  status: {
    type: [String],
    required: true,
    enum: ['created','title_check', 'pending_liens', 'pending_liens_cleared', 'approved', 'denied']
  },
  lenderId: {
    type: String,
    required: true
  },
  agentId: {
    type: String,
    required: true
  },
  sellerId: {
    type: String,
    required: true
  },
  buyerId: {
    type: String,
    required: true
  }

}};

const MessageCatalogSchema = new Schema({
  key: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  stateTransitionTrigger: {
    type: String,
    enum: [
      'created',
      'created:title_check',
      'title_check:denied',
      'title_check:pending_liens',
      'pending_liens:pending_liens_cleared',
      'pending_liens:denied',
      'pending_liens_cleared:denied',
      'pending_liens_cleared:approved'],
    required: true
  }
});


const InterestedPartySchema = new Schema({
  type: {
    type: String,   // tag 'lender', 'buyer', 'seller'
    enum: ['agent', 'lender', 'buyer', 'seller']
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});


const Policy = mongoose.model('Policy', PolicySchema);
const InterestedParty = mongoose.model('InterestedParty', InterestedPartySchema);
const MessageCatalogEntry = mongoose.model('MessageCatalogEntry', MessageCatalogSchema);


// Public
exports.Policy = Policy;
exports.InterestedParty = InterestedParty;
exports.MessageCatalogEntry = MessageCatalogEntry;
