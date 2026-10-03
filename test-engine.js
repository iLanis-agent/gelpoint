var G = require('./engine.js'), pass = 0, fail = 0;
function eq(n, a, b, t) { if (a !== null && Math.abs(a - b) <= (t || 0.01)) pass++; else { fail++; console.log('FAIL', n, a, b); } }
function ok(n, c) { if (c) pass++; else { fail++; console.log('FAIL', n); } }
// NCHFP Table 1
[[0, 220], [1000, 218], [2000, 216], [3000, 214], [4000, 212], [5000, 211], [6000, 209], [7000, 207], [8000, 205]].forEach(function (p) { eq('table ' + p[0], G.gelFromAltitude(p[0]), p[1]); });
eq('interp 500', G.gelFromAltitude(500), 219); eq('interp 4500', G.gelFromAltitude(4500), 211.5); eq('interp 7500', G.gelFromAltitude(7500), 206);
ok('negative', G.gelFromAltitude(-1) === null); ok('too high', G.gelFromAltitude(8001) === null); ok('NaN', G.gelFromAltitude(NaN) === null);
// UC ANR: sea level 212 + 8 = 220
eq('boil 212', G.gelFromBoil(212), 220); eq('boil 208', G.gelFromBoil(208), 216); ok('boil junk', G.gelFromBoil(150) === null && G.gelFromBoil(230) === null);
// table agrees with the 2 F per 1000 ft rule within 1 F
for (var ft = 0; ft <= 8000; ft += 1000) ok('rule ' + ft, Math.abs(G.gelFromAltitude(ft) - (220 - 2 * ft / 1000)) <= 1);
// process times
ok('0 ft', G.processMinutes(0) === 5); ok('1000 ft', G.processMinutes(1000) === 5); ok('1001 ft', G.processMinutes(1001) === 10); ok('6000 ft', G.processMinutes(6000) === 10); ok('6001 ft', G.processMinutes(6001) === 15); ok('8000', G.processMinutes(8000) === 15);
// units
eq('220F in C', G.f2c(220), 104.44); eq('100C in F', G.c2f(100), 212); eq('round trip', G.f2c(G.c2f(37)), 37);
var a = G.analyze('alt', 1000, 'ft', null); eq('alt 1000 gel', a.gelF, 218); eq('alt 1000 C', a.gelC, 103.33); ok('alt 1000 min', a.minutes === 5);
var m = G.analyze('alt', 1000, 'm', null); eq('1000 m ft', m.ft, 3280.84, 0.01); eq('1000 m gel', m.gelF, 214 - 2 * 0.28084, 0.01); ok('1000 m minutes', m.minutes === 10);
var b = G.analyze('boil', 100, 'C', null); eq('boil 100C gel F', b.gelF, 220); eq('boil 100C gel C', b.gelC, 104.44); ok('boil has no minutes', b.minutes === null);
var c = G.analyze('boil', 98, 'C', null); eq('boil 98C gel', c.gelC, 102.44, 0.01);
var d = G.analyze('alt', 0, 'ft', 200); eq('to go F', d.toGoF, 20); eq('to go C', d.toGoC, 11.11);
var e = G.analyze('alt', 0, 'ft', 5, 'C'); ok('now too low ignored', e.toGoF === null);
var h = G.analyze('alt', 0, 'ft', 100, 'C'); eq('alt mode now in C', h.toGoF, 220 - 212);
var k = G.analyze('boil', 100, 'C', 100); eq('boil mode now in C', k.toGoF, 8);
var n = G.analyze('alt', 0, 'ft', 200, 'F'); eq('alt mode now in F', n.toGoF, 20);
ok('bad', G.analyze('alt', 9000, 'ft', null) === null && G.analyze('boil', 50, 'F', null) === null);
console.log(pass + '/' + (pass + fail) + ' pass'); process.exit(fail ? 1 : 0);
