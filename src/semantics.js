var idRegex = /[a-zA-Z_][a-zA-Z0-9_]*/;
function arithHelper(x, y) {
  var a = x.ti();
  var b = y.ti();
  if (a === 'dict' || b === 'dict') throw new Error('cannot add dicts');
  if (a === 'list' || b === 'list') throw new Error('cannot add lists');
  if (a === 'string' || b === 'string') return 'string';
  if (a === 'float' || b === 'float') return 'float';
  if (a === 'int' || b === 'int') return 'int';
  return 'bool';
}

var typeInference = {
  Program: function(x, y) { return y.ti(); },
  SourceElement: function(x) { return x.ti(); },
  ExpressionStatement: function (x, y) { return x.ti(); },
  Expression: function (x) { return x.ti(); },
  EqualityExpression_equal: (x, y, z) => 'bool',
  EqualityExpression_notEqual: (x, y, z) => 'bool',
  EqualityExpression_eq: (x, y, z) => 'bool',
  EqualityExpression_notEq: (x, y, z) => 'bool',
  AdditiveExpression_add: (x, _, y) => arithHelper(x, y),
  AdditiveExpression_sub: (x, _, y) => arithHelper(x, y),
  MultiplicativeExpression_mul: (x, _, y) => arithHelper(x, y),
  MultiplicativeExpression_div: (x, _, y) => arithHelper(x, y),
  MultiplicativeExpression_mod: (x, _, y) => arithHelper(x, y),
  UnaryExpression_unaryMinus:  (x, y) => y.ti(),
  decimalLiteral_integerOnly: function (x, y) { return 'int'; },
  decimalLiteral_bothParts: function (x, y, z, w) { return 'float'; },
  Block: function (a, b, c) { b.ti(); return 'null'; },
  FunctionDeclaration: function (a, id, c, d, e, f, body, h) {
    if (!env[id.interval.contents]) {
      env[id.interval.contents] = {
        type: 'fun',
        ret: 'unknown',
        args: [], // TODO: fix this
      };
      body.ti();
    }
    return 'null';
  },
  FunctionBody: function (a, b) { return b.ti(); },
  IfStatement: function (a, b, cond, d, expr, f, elseCase) {
    cond.ti();
    expr.ti();
    elseCase.ti();
    return 'null';
  },
  VariableStatement: function (x, y, z) {
    y.ti(); // set these values!
    return 'list';
  },
  VariableDeclaration: function (x, y) {
    var type = y.ti();
    if (x.interval.contents.match(idRegex))
      setEnv(x.interval.contents, type);
    return type;
  },
  Initialiser: function (x, y) {
    var type = y.ti();
    return type;
  },
  NonemptyListOf: function (x, y, z) {
    x.ti(); // initialize these values!
    return 'list';
  },
  TryStatement: function (x) { return x.ti(); },
  TryStatement_tryCatch: function (x, y, z) { y.ti(); z.ti(); return 'null'; },
  TryStatement_tryFinally: function (x, y, z) { y.ti(); z.ti(); return 'null'; },
  TryStatement_tryCatchFinally: function (x, y, z, w) { y.ti(); z.ti(); w.ti(); return 'null'; },
  Catch: function (a, b, c, d, e) { c.ti(); e.ti(); return 'null'; },
  Finally: function (a, b) { b.ti(); return 'null'; },
  ArrayLiteral: function (x, y, z) { return 'list'; },
  stringLiteral: function (x, y, z) { return 'string'; },
  booleanLiteral: function (x) { return 'bool'; },
  ReturnStatement: (x, y, z, w) => 'null',
  PostfixExpression_postIncrement: function(a, b, c) {
    a.ti();
    if (a.interval.contents.match(idRegex))
      setEnv(a.interval.contents, 'int');
  },
  PostfixExpression_postDecrement: function(a, b, c) {
    a.ti();
    if (a.interval.contents.match(idRegex))
      setEnv(a.interval.contents, 'int');
  },
  AssignmentExpression_assignment: (x, y, z) => {
    var type = z.ti();
    if (x.interval.contents.match(idRegex))
      setEnv(x.interval.contents, type);
    return type;
  },
  identifier: function (x) {
    // use the global env
    return getEnv(x.interval.contents);
  },
  IterationStatement: (a) => a.ti(),
  IterationStatement_doWhile: function(a, b, c, d, e, f, g) {
    b.ti();
    e.ti();
    return 'null';
  },
  IterationStatement_whileDo: function(a, b, c, d, e) {
    c.ti();
    e.ti();
    return 'null';
  },
  IterationStatement_for3: function(a, b, c, d, e, f, g, h, i) {
    c.ti();
    e.ti();
    g.ti();
    i.ti();
    return 'null';
  },
  IterationStatement_for3var: function(a, b, _var, c, d, e, f, g, h, i) {
    c.ti();
    e.ti();
    g.ti();
    i.ti();
    return 'null';
  },
  IterationStatement_forIn: function(a, b, lhs, c, expr, d, stmt) {
    lhs.ti();
    var type = expr.ti();
    setEnv(lhs.interval.contents, type === 'dict' ? 'string' : 'int');
    stmt.ti();
    return 'null';
  },
  IterationStatement_forInVar: function(a, b, _var, lhs, c, expr, d, stmt) {
    lhs.ti();
    var type = expr.ti();
    setEnv(lhs.interval.contents, type === 'dict' ? 'string' : 'int');
    stmt.ti();
    return 'null';
  },
  CallExpression_memberExpExp: function(x, y) {
    return getEnv(x.interval.contents);
  },
  PrimaryExpression_parenExpr: (x, y, z) => y.ti(),
  ObjectLiteral: (x) => 'dict',
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports.typeInference = typeInference;
}