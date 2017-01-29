'use strict';

const assert = require('chai').assert;
const model = require('../index.js').model;
const Policy = model.Policy;

/**
 * Policy model
 * Save test
 */
describe('policy-model:get', () => {
  before((done) => {
    done();
    });

  let policyId = '588e1fb92e3c1e6ce8d7cf31';

  it('getting test policy', (done) => {
     model.findPolicy(policyId).then((result) => {
      console.log(result);
      assert(result, result);

      done();
    }).catch((err) => {
      assert(err === null, "Failure did not occur");
      done();
       });
    });



  after(() => {

  });
});
