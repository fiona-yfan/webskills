///

Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
    return this;
}

///给string类型加一个 replace &lt;&quot;&gt;<'> 的方法
String.method("deentityify", function () {

    var entity = {
        quot: '"',
        lt: '<',
        gt: '>',
    };
    return function () {
        return this.replace(/&([^&;]+);/g,
            function (a, b) {
                var r = entity[b];
                return typeof r === 'string' ? r : a;
            }
        );
    }
}());

///函数字面量 function literal
var add = function (a, b) {
    return a + b;
}

///函数调用模式the function invocation pattern

var myObject = {
    value: 0,
    increment: function (inc) {
        this.value += typeof inc === 'number' ? inc : 1;
    }
};
myObject.double = function () {
    var that = this;

    var doub = function () {
        // 这是一个函数调用模式
        that.value = add(that.value, that.value);// this 是全局变量is window 
    };
    doub();
}

///test myObject

myObject.increment(1);//这是一个方法调用模式
console.log(myObject.value);
myObject.increment(2);
console.log(myObject.value);
myObject.double();
console.log(myObject.value);


///构造器调用模式 constructor invocation pattern
///ES2015  replace var Quo = function(string){}
class Quo {
    constructor(string) {
        this.status = string;
    }
}
    Quo.prototype.get_status= function() {
    return this.status;
}

var quo = new Quo("confused");

console.log(quo.get_status());


/// apply invocation pattern
var array = [3, 4];
var sum = add.apply(null, array);
console.log(sum);

var statusObj = {
    status: "a-ok",
};
var status = Quo.prototype.get_status.apply(statusObj);
console.log(status);



/// Arguments
var sum = function () {
    var i, sum = 0;
    for (i = 0; i < arguments.length; i++) {
        sum += arguments[i];// argument is not array,only have length property
    }
    return sum;
};
console.log(sum(1, 2, 3, 4, 5, 6, 7, 8, 9));


///curry



Function.method('curry', function () {
    var slice = Array.prototype.slice;
    args = slice.apply(arguments);
    console.log(arguments);
    that = this;
    return function () {
        console.log('curry be invocated')
        console.log(arguments);
        return that.apply(null, args.concat(slice.apply(arguments)));
    }
});

var add1 = add.curry(1);
console.log(add1(6));//7

///  memoization
// bad imply
var fibonacci_bad = function (n) {
    return n < 2 ? n : fibonacci_bad(n - 1) + fibonacci_bad(n - 2);
}

// memory  calculted result
var fibonacci = function () {
    var memo_result = [0, 1];
    var fib = function (n) {
        var result = memo_result[n];
        if (typeof result !== 'number') {
            result = fib(n - 1) + fib(n - 2);
            memo_result[n] = result;
        }
        return result;
    }
    return fib;
}();

// alternative apply
var memoizer = function (memo, formula) {

    var recur1 = function (n) {
        var result = memo[n];
        if (typeof result !== 'number') {
            result = formula(recur1, n);
            memo[n] = result;
        }
        return result;
    }
    return recur1;
}

var fibonacci_Alter= memoizer([0, 1], function (recur, n) {
    return recur(n - 1) + recur(n - 2);
});

var factorial = memoizer([1,1], function(recur,n){
    return n* recur(n-1);
});

