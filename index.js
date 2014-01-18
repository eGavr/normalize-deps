/*
{
  block : 'b1',
  elem : 'e1',
  mod : 'm1'
  val : 'v1'
  tech : 't1'
}
*/

var toString = Object.prototype.toString,
    isArray = Array.isArray,
    isObject = function(o) {
        return toString.call(o) === '[object Object]';
    };

module.exports = function depsormalize(deps) {
    if(isArray(deps)) return deps.map(normalize);
    return normalize(deps);
};

function normalize(deps) {
    if(!isObject(deps)) {
        throw new Error('invalid declaration ' + deps);
    }

    var result = [],
        cache = {};

    if(deps.blocks) {
        var blocks = deps.blocks;
        if(!isArray(blocks)) blocks = [blocks];

        pushBlocks(blocks);
    }

    var block = deps.block,
        elem = deps.elem,
        i, slen, decl;

    if(deps.elems) {
        var elems = deps.elems;

        if(!isArray(elems)) elems = [elems];

        i = 0;
        slen = result.length;

        do {
            decl = result[i] || {};

            if(decl.block) block = decl.block;
            pushElems(block, elems);
        } while(++i < slen);
    }

    if(deps.mods) {
        var mods = deps.mods;

        if(!isArray(mods)) mods = [mods];

        i = 0;
        slen = result.length;

        do {
            decl = result[i] || {};

            if(decl.block) block = decl.block;
            if(decl.elem) elem = decl.elem;

            pushMods(block, elem, mods);
        } while(++i < slen);
    }

    if(!result.length) {
        push(extendDecl({}, deps));
    }

    return result;

    function push(decl) {
        var key = identify(decl);

        if(cache[key]) return;
        cache[key] = true;

        result.push(decl);
    }

    function pushOne(block, elem) {
        if(block) {
            var d = {
                block : block
            };
            if(elem) d.elem = elem;
            push(d);
        }
    }

    function pushBlocks(blocks) {
        blocks.reduce(function(decls, block) {
            pushOne(block);
            push(extendDecl({ block : block }, deps));

            return decls;
        }, []);
    }

    function pushElems(block, elems) {
        pushOne(block);

        elems.forEach(function(elem) {
            var d = {};

            if(block) d.block = block;
            d.elem = elem;

            push(extendDecl(d, deps));
        });
    }

    function pushMods(block, elem, mods) {
        pushOne(block, elem);

        mods.forEach(function(mod) {
            Object.keys(mod).forEach(function(name) {
                var d = { mod :  name };
                if(block) {
                    d.block = block;
                    if(elem) d.elem = elem;
                }

                push(extendDecl({}, d));

                var vals = mod[name];
                if(!vals) {
                    return;
                }

                if(!isArray(vals)) vals = [vals];

                vals.forEach(function(val) {
                    push(extendDecl({ val : val }, d));
                });
            });
        });
    }
}

function extendDecl(dest, src) {
    extendBlock(dest ,src);
    extendElem(dest, src);
    extendMod(dest, src);
    extendVal(dest, src);
    extendTech(dest, src);
    return dest;
}

function extendBlock(d, s) {
    if(d.block) return d;
    if(s.block) d.block = s.block;
    return d;
}

function extendElem(d, s) {
    if(d.elem) return d;
    if(s.elem) d.elem = s.elem;
    return d;
}

function extendMod(d, s) {
    if(d.mod) return d;
    if(s.mod) d.mod = s.mod;
    return d;
}

function extendVal(d, s) {
    if(d.val) return d;
    if(s.val) d.val = s.val;
    return d;
}

function extendTech(d, s) {
    if(d.tech) return d;
    if(s.tech) d.tech = s.tech;
    return d;
}

function identify(decl) {
    return decl.block +
        (decl.elem? '__' + decl.elem : '') +
        (decl.mod? '_' + decl.mod + (decl.val? '_' + decl.val : '') : '');
}
