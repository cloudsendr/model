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
    type: String,
    required: true,
    enum: ['created','title_check', 'pending_liens', 'pending_liens_cleared', 'approved', 'denied']
  },
  address: {
    type: String,
    required: true
  },
  lender: {
    type: String,
    required: true,
    ref: 'InterestedParty'
  },
  agent: {
    type: String,
    required: true,
    ref: 'InterestedParty'
  },
  seller: {
    type: String,
    required: true,
    ref: 'InterestedParty'
  },
  buyer: {
    type: String,
    required: true,
    ref: 'InterestedParty'
  },
  timestamp: {
    type: Date,
    required: true
  }
},
  {
  toObject: {
    transform: function (doc, ret) {
      delete ret.__v;
    }
  },
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }

});


const InterestedPartySchema = new Schema({
  type: {
    type: String,   // tag 'lender', 'buyer', 'seller'
    enum: ['agent', 'lender', 'buyer', 'seller']
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
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
 },
  {
  toObject: {
    transform: function (doc, ret) {
      ret._id = ret.id;
      delete ret.__v;
    }
  },
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }

});

PolicySchema.index({'$**': 'text'});
InterestedPartySchema.index({'$**': 'text'});

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
  console.log(policy);
  let p = new Promise((resolve, reject) => {
    let policyModel = new Policy(policy);
    Policy.findByIdAndUpdate(policy.id, {$set: {status: policy.status} }, {new : true})
          .populate('lender').populate('buyer').populate('agent').populate('seller').exec( (err, policy) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(policy);
      }
    });
  });
  return p;
}


const findPolicies = (search, page, size, sort) => {
  let p = new Promise((resolve, reject) => {
    let query = {};
    if (search ){
      query = {$text: {$search: search}};
    }
      Policy.find(query).limit(size).skip(page*size).sort({
        name: sort
      }).populate('lender').populate('buyer').populate('agent').populate('seller').exec((err, policies) => {
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
    Policy.findById(mongoose.Types.ObjectId(id)).populate('lender').populate('buyer').populate('agent').populate('seller').exec((err, doc) => {
      if(err) {
        console.log(err);
        reject(err);
      }
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
      if(err) {
        console.log(err);
        reject(err);
      }
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
    InterestedParty.findOneAndUpdate({_id: party.id}, party, (err, updatedParty) => {
      if(err) {
        console.log(err);
        reject(err);
      }
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

const findInterestedParties = (search, page, size, sort) => {
  let p = new Promise((resolve, reject) => {
    let query = {};
    if (search ){
      query = {$text: {$search: search}};
    }
    InterestedParty.find(query).limit(size).skip(page*size).sort({
        name: sort
      }).exec((err, ips) => {
      InterestedParty.count().exec((err, count) => {
        if(err) {
          reject(err);
        } else {
          resolve({
            elements: ips,
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
// Public
exports.Policy = Policy;
exports.InterestedParty = InterestedParty;
exports.updatePolicy = updatePolicy;
exports.savePolicy = savePolicy;
exports.findPolicy = findPolicy;
exports.findPolicies = findPolicies;
exports.saveInterestedParty = saveInterestedParty;
exports.updateInterestedParty = updateInterestedParty;
exports.findInterestedParty = findInterestedParty;
exports.findInterestedParties = findInterestedParties;
