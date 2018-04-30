'use strict';

var should = require('chai').should();
var ravencore = require('../');

describe('Library', function() {
  it('should export primatives', function() {
    should.exist(ravencore.crypto);
    should.exist(ravencore.encoding);
    should.exist(ravencore.util);
    should.exist(ravencore.errors);
    should.exist(ravencore.Address);
    should.exist(ravencore.Block);
    should.exist(ravencore.MerkleBlock);
    should.exist(ravencore.BlockHeader);
    should.exist(ravencore.HDPrivateKey);
    should.exist(ravencore.HDPublicKey);
    should.exist(ravencore.Networks);
    should.exist(ravencore.Opcode);
    should.exist(ravencore.PrivateKey);
    should.exist(ravencore.PublicKey);
    should.exist(ravencore.Script);
    should.exist(ravencore.Transaction);
    should.exist(ravencore.URI);
    should.exist(ravencore.Unit);
  });
});
