require('must');
var normalizeDeps = require('../');

describe('deps normalizer', function() {
    describe('simple', function() {
        it('should return array', function() {
            var deps = normalizeDeps({ block : 'b1' });
            deps.must.be.array();
            deps.must.not.be.empty();
        });

        it('should consume array of declarations', function() {
            var deps = normalizeDeps([{ block : 'b1' }, { block : 'b2' }]);
            deps.must.be.array();
            deps.must.have.length(2);
        });
    });

    describe('full declaration', function() {
        var inDeps = [
            { block : 'b' },
            { block : 'b', mod : 'm' },
            { block : 'b', mod : 'm', val : 'v' },
            { block : 'b', elem : 'e' },
            { block : 'b', elem : 'e', mod : 'm' },
            { block : 'b', elem : 'e', mod : 'm', val : 'v' },
            { block : 'b', tech : 't' },
            { block : 'b', elem : 'e', tech : 't' },
            { block : 'b', elem : 'e', mod : 'm', tech : 't' },
            { block : 'b', elem : 'e', mod : 'm', val : 'v', tech : 't' }
        ];

        it('should pass full declaration', function() {
            inDeps.forEach(function(idep) {
                normalizeDeps(idep).must.be.eql([idep]);
            });
        });
    });

    describe('single forms', function() {
        describe.skip('block', function() {
            it('should accept declare "block" with array', function() {
                normalizeDeps({ block : ['b1', 'b2'] })
                    .must.eql([
                        { block : 'b1' },
                        { block : 'b2' }
                    ]);

                normalizeDeps({ block : ['b1', 'b2'], elem : 'e' })
                    .must.eql([
                        { block : 'b1', elem : 'e' },
                        { block : 'b2', elem : 'e' }
                    ]);
            });
        });

        describe('elem', function() {
            it('should accept declare "elem" with array (bem/bem-tools#401)', function() {
                normalizeDeps({ block : 'b', elem : ['e1', 'e2'] })
                    .must.eql([
                        { block : 'b', elem : 'e1' },
                        { block : 'b', elem : 'e2' }
                    ]);
            });
        })
    });

    describe('plural forms', function() {
        describe('blocks', function() {
            it('should understand "blocks" declaration', function() {
                normalizeDeps({ blocks : 'b1' })
                    .must.eql([{ block : 'b1' }]);

                normalizeDeps({ blocks : ['b1'] })
                    .must.eql([{ block : 'b1' }]);

                normalizeDeps({ blocks : ['b1'], elem : 'e' })
                    .must.eql([{ block : 'b1' }, { block : 'b1', elem : 'e' }]);

                normalizeDeps({ blocks : ['b1', 'b2'] })
                    .must.eql([{ block : 'b1' }, { block : 'b2'}]);

                normalizeDeps({ blocks : ['b1', 'b2'], elem : 'e' })
                    .must.eql([
                        { block : 'b1' },
                        { block : 'b1', elem : 'e' },
                        { block : 'b2' },
                        { block : 'b2', elem : 'e' }
                    ]);
            });
        });

        describe('elems', function() {
            it('should understand "elems" declaration', function() {
                normalizeDeps({ block : 'b', elems : 'e1' })
                    .must.eql([
                        { block : 'b' },
                        { block : 'b', elem : 'e1' }
                    ]);

                normalizeDeps({ block : 'b', elems : ['e1', 'e2'] })
                    .must.eql([
                        { block : 'b' },
                        { block : 'b', elem : 'e1' },
                        { block : 'b', elem : 'e2' }
                    ]);
            });
        });

        describe('mods', function() {
            it('should understand "mods" declaration', function() {
                normalizeDeps({ block : 'b', mods : { m : 'v' } })
                    .must.eql([
                        { block : 'b' },
                        { block : 'b', mod : 'm' },
                        { block : 'b', mod : 'm', val : 'v' }
                    ]);

                normalizeDeps({ block : 'b', mods : [{ m1 : 'v' }, { m2 : 'v' }] })
                    .must.eql([
                        { block : 'b' },
                        { block : 'b', mod : 'm1' },
                        { block : 'b', mod : 'm1', val : 'v' },
                        { block : 'b', mod : 'm2' },
                        { block : 'b', mod : 'm2', val : 'v' }
                    ]);

                normalizeDeps({ block : 'b', mods : { m : ['v1', 'v2'] } })
                    .must.eql([
                        { block : 'b' },
                        { block : 'b', mod : 'm' },
                        { block : 'b', mod : 'm', val : 'v1' },
                        { block : 'b', mod : 'm', val : 'v2' }
                    ]);

                normalizeDeps({ block : 'b', mods : { m1 : 'v', m2 : 'v' } })
                    .must.eql([
                        { block : 'b' },
                        { block : 'b', mod : 'm1' },
                        { block : 'b', mod : 'm1', val : 'v' },
                        { block : 'b', mod : 'm2' },
                        { block : 'b', mod : 'm2', val : 'v' }
                    ]);
            });

            it.skip('should understand "mods-names" notations', function() {
                normalizeDeps({ block : 'b', mod : { names : ['m1', 'm2'] } })
                    .must.eql([
                        { block : 'b' },
                        { block : 'b', mod : 'm1' },
                        { block : 'b', mod : 'm2' }
                    ]);
            });
        });

        describe('blocks + elems', function() {
            it('should understand both "blocks" and "elems" declaration', function() {
                normalizeDeps({ blocks : 'b1', elems : 'e1' })
                    .must.eql([
                        { block : 'b1' },
                        { block : 'b1', elem : 'e1' }
                    ]);
            });
        });

        describe('uniqness', function() {
            it('should return uniq set of declaration', function() {
                normalizeDeps({ blocks : ['b', 'b', 'b'] })
                    .must.eql([{ block : 'b' }]);

                normalizeDeps({ block : 'b', elems : ['e', 'e', 'e'] })
                    .must.eql([
                        { block : 'b' },
                        { block : 'b', elem : 'e' }
                    ]);
            });
        });
    });
});
