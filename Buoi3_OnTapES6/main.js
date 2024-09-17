//variable

var x = 10
function myFunction(){
    var y = x + 5
    console.log(x)
    console.log(y)
    
}
console.log(x)
console.log(y)
myFunction()

let x = 20
if (x === 20) {
    let x = 40
    console.log(x)
}
console.log(x)


//default paramater
function nhan(a, b=1){
    return a*b
}
console.log(nhan(4,3))
console.log(nhan(2))


//spread

const oldCar=['bmv', 'lambo', 'luis']
const newCar=[...oldCar, 'vinfast', 'xibo']
console.log(newCar)

const oldInfor = {
    name: 'Phong',
    age: 19,
}
const newInfor = {
    ...oldInfor,
    address: 'Ha noi'
}
console.log(newInfor)


///rest operator
const arr = [1, 2, 3, 4, 5]
const [firstElement, ...otherElements, lastElement] = arr
console.log(firstElement);
console.log(lastElement);

///destructuring
const person = {
    name: 'phong',
    age: 18,
    address: 'ha noi'
}
const {name, age, address} = person
console.log(name, age, address)

//arrow function

const cong = (a, b) => a+b
console.log(cong(1, 2));


//classes
class Person {
    constructor(){
        this.name='Phong'
    }
}
let a = new Person()
console.log(a)
