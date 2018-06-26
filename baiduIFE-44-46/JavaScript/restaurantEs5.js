function Restaurant(obj) {
    this.cash = obj.cash;
    this.seats = obj.seats;
    this.staff = obj.staff;
}
// 招聘职员
Restaurant.prototype.hire = function (newStaff) {
    this.staff.push(newStaff);
}
// 解雇职员
Restaurant.prototype.fire = function (oldStaff) {
    var index = this.staff.indexOf(oldStaff);
    if (index >= 0) {
        this.staff.splice(index, 1);
    }
}
//职员类
function Staff(id, name, age, salary) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.salary = salary;
}
Staff.prototype.work = function () {
    console.log("完成");
}
// 服务员类
// 混合继承（构造+原型）
function Waiter(id, name, age, salary) {
    Staff.call(this, id, name, age, salary)
}
Waiter.prototype = new Staff();
Waiter.prototype.constructor = Waiter;

Waiter.prototype.work = function (dishes) {
    if (Array.isArray(dishes)) {
        console.log("服务员告诉厨师顾客点的菜是：" + dishes)
        return dishes;
    } else {
        console.log("服务员上菜:" + dishes);
    }
}
//添加一个静态方法来实现单例：
Waiter.getSingle = (function () {
    var waiter = null;
    return function (id, name, age, salary) {
        if (!waiter) {
            waiter = new Waiter(id, name, age, salary);
        }
        return waiter;
    }
})();
//厨师类
function Cook(id, name, age, salary) {
    Staff.call(this, id, name, age, salary)
}
Cook.prototype = new Staff(); //不传参
Cook.prototype.constructor = Cook;
Cook.prototype.work = function (dishes) {
    for (let i = 0; i < dishes.length; i++) {
        console.log("厨师:" + dishes[i] + "做好了");
    }
    return dishes;
}
Cook.getSingle = (function () {
    var cook = null;
    return function (id, name, age, salary) {
        if (!cook) {
            cook = new Cook(id, name, age, salary);
        }
        return cook;
    }
})()
// 顾客类
function Customer(name) {
    this.name = name;
    this.dishes = [];
}
Customer.prototype.eat = function (dishes) {
    for (let i = 0; i < dishes.length; i++) {
        console.log("顾客吃:" + dishes[i]);
    }
}
Customer.prototype.come = function (res) {
    if (res.seats > 0) {
        res.seats--;
        console.log("顾客来吃饭，先坐下点菜");

    } else {
        console.log("顾客排队");
    }
}
Customer.prototype.leave = function (res) {
    res.seats++;
    console.log(this.name + "离开")
}
// 点菜
Customer.prototype.order = function (dishesId) {
    this.dishes.push(menu.order(dishesId));
}
// 菜品类
// function Dish(name, cost, price) {
//     this.name = name;
//     this.cost = cost;
//     this.price = price;
// }
var menu = {
    1: {
        name: "烤鱼",
        price: 199,
    },
    order: function (id) {
        console.log("点菜");
        return this[id]["name"];
    }
}
var ifeRestaurant = new Restaurant({
    cash: 1000000,
    seats: 1,
    staff: []
});

var waiter = Waiter.getSingle(001, "Fan", 25, 5000);
var cook = Cook.getSingle(002, "Q", 35, 8000);
ifeRestaurant.hire(waiter);
ifeRestaurant.hire(cook);
// console.log(ifeRestaurant);
var customer1 = new Customer("小明");
customer1.come(ifeRestaurant);
customer1.order(1);
var dishesList = waiter.work(customer1["dishes"]);
var dish = cook.work(dishesList);
for (let i = 0; i < dish.length; i++) {
    waiter.work(dish[i]);
}
customer1.eat(dish);
customer1.leave(ifeRestaurant);
    // customer1.eat(dishes);