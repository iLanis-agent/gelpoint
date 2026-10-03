(function (root) {
  'use strict';
  // NCHFP (nchfp.uga.edu) Table 1 "Temperature Test" and Table 2 process times for jam without added pectin;
  // UC ANR 391137: gel point = boiling point of water + 8 F.
  var TABLE = [[0, 220], [1000, 218], [2000, 216], [3000, 214], [4000, 212], [5000, 211], [6000, 209], [7000, 207], [8000, 205]];
  var M_PER_FT = 0.3048;
  function f2c(f) { return (f - 32) * 5 / 9; }
  function c2f(c) { return c * 9 / 5 + 32; }
  function gelFromAltitude(ft) {
    if (!(ft >= 0 && ft <= 8000)) return null;
    for (var i = 1; i < TABLE.length; i++) {
      if (ft <= TABLE[i][0]) { var a = TABLE[i - 1], b = TABLE[i]; return a[1] + (b[1] - a[1]) * (ft - a[0]) / (b[0] - a[0]); }
    }
    return null;
  }
  function gelFromBoil(boilF) { return (boilF >= 180 && boilF <= 215) ? boilF + 8 : null; }
  function processMinutes(ft) { if (!(ft >= 0 && ft <= 8000)) return null; return ft <= 1000 ? 5 : ft <= 6000 ? 10 : 15; }
  function analyze(mode, value, unit, nowValue, tempUnit) {
    var gel, ft = null, boilF = null;
    if (mode === 'alt') {
      ft = unit === 'm' ? value / M_PER_FT : value; gel = gelFromAltitude(ft);
      if (gel === null) return null;
    } else {
      boilF = unit === 'C' ? c2f(value) : value; gel = gelFromBoil(boilF);
      if (gel === null) return null;
    }
    var r = { gelF: gel, gelC: f2c(gel), ft: ft, boilF: boilF, minutes: ft === null ? null : processMinutes(ft), toGoF: null, toGoC: null };
    if (nowValue !== null && nowValue !== undefined && isFinite(nowValue)) {
      var tu = mode === 'boil' ? unit : tempUnit; var nowF = tu === 'C' ? c2f(nowValue) : nowValue;
      if (nowF >= 60 && nowF <= 260) { r.toGoF = gel - nowF; r.toGoC = r.toGoF * 5 / 9; }
    }
    return r;
  }
  root.GelPoint = { TABLE: TABLE, f2c: f2c, c2f: c2f, gelFromAltitude: gelFromAltitude, gelFromBoil: gelFromBoil, processMinutes: processMinutes, analyze: analyze };
  if (typeof module !== 'undefined') module.exports = root.GelPoint;
})(typeof window !== 'undefined' ? window : globalThis);
