'use strict';

const assert = require('chai').assert;
const model = require('../index.js').model;
const Policy = model.Policy;

/**
 * Policy model
 * Save test
 */
describe('policy-model:save', () => {
  before((done) => {
    done();
    });

  let policy = {
    policyNumber: 'zxyct56789',
    status: 'created',
    address : '3119 sw 140 ave miramar, fl-33027',
    lenderId: '12345678',
    agentId: 'yutr67321',
    buyerId: 'nhgt908908',
    sellerId: 'ytrewiuy1'
  };

  it('Saving test policy', (done) => {
    var policyModel = new Policy(policy);
     model.savePolicy(policyModel).then((result) => {
      console.log(result);
      assert(result, "Policy was saved");
      done();
    }).catch((err) => {
      console.log(err);
      assert(err === null, "Failure did not occur");
      done();
       });
    });
    after(() => {
    });
});
