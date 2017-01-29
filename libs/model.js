'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to DB -- Need Config
const URL = 'mongodb://admin:Super@ds117819.mlab.com:17819/cloudsendr';
mongoose.connect(URL);

const PolicySchema = new Schema({
  policyNumber: {
    type: String,
    required: true
  },
  status: {
    type: [String],
    required: true,
    enum: ['created','title_check', 'pending_liens', 'pending_liens_cleared', 'approved', 'denied']
  },
  address: {
    type: String,
    required: true
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
  },
  timestamp: {
    type: Date,
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
  },
  timestamp: {
    type: Date,
    required: true
  }
});

PolicySchema.index({'$**': 'text'});

const Policy = mongoose.model('Policy', PolicySchema);
const InterestedParty = mongoose.model('InterestedParty', InterestedPartySchema);

//- Policy Operations
const savePolicy = (policy) => {
  policy.timestamp = new Date();
  let p = new Promise((resolve, reject) => {
    let policyModel = new Policy(policy);
    policyModel.save((err, policy) => {
      if(err) reject(err);
      else {
        resolve(policy);
      }
    });
  });

  return p;
}

const updatePolicy = (policy) => {
  let p = new Promise((resolve, reject) => {
    let policyModel = new Policy(policy);
    policyModel.save((err, policy) => {
      if(err) reject(err);
      else {
        resolve(policy);
      }
    });
  });

  return p;
}


const findPolicies = (search, page, size, sort) => {
  let p = new Promise((resolve, reject) => {
    Policy.find({$text: {$search: search}}).limit(size).skip(page*size).sort({
      name: sort
    }).exec((err, policies) => {
      Policy.count().exec((err, count) => {
        if(err) {
          reject(err);
        } else {
          resolve({
            elements: policies,
            page: {
              page: page,
              size: size,
              total: count
            }
          });
        }
      });
    });
  });

  return p;
}

const findPolicy = (id) => {
  let p = new Promise((resolve, reject) => {
    Policy.findById(mongoose.Types.ObjectId(id), (err, doc) => {
      if(err) reject(err);
      else {
        resolve(doc);
      }
    });
  });
  return p;
}

//- InterestedParty Operations

const saveInterestedParty = (party) => {
  party.timestamp = new Date();
  let p = new Promise((resolve, reject) => {
    let ipModel = new InterestedParty(party);
    ipModel.save((err, party) => {
      if(err) reject(err);
      else {
        resolve(party);
      }
    });
  });
  return p;
}

const updateInterestedParty = (party) => {
  let p = new Promise((resolve, reject) => {
    let ipModel = new InterestedParty(party);
    ipModel.save((err, party) => {
      if(err) reject(err);
      else {
        resolve(party);
      }
    });
  });
  return p;
}

const findInterestedParty = (id) => {
  let p = new Promise((resolve, reject) => {
    InterestedParty.findById(mongoose.Types.ObjectId(id), (err, doc) => {
      if(err) reject(err);
      else {
        resolve(doc);
      }
    });
  });
  return p;
}

// Public
exports.Policy = Policy;
exports.InterestedParty = InterestedParty;
exports.MessageCatalogEntry = MessageCatalogEntry;
exports.updatePolicy = updatePolicy;
exports.savePolicy = savePolicy;
exports.findPolicy = findPolicy;
exports.findPolicies = findPolicies;
exports.updateInterestedParty = updateInterestedParty;
exports.findInterestedParty = findInterestedParty;
