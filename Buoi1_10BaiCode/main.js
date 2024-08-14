
///bai 1
document.getElementById('title').innerText = 'Hello, DOM!'

//bai 2
document.getElementById('title').setAttribute('style', 'color: red')

//bai 3
document.getElementById('list').innerHTML='<li>Javascript</li>'

//bai 4
document.getElementById('remove-me').remove()

//bai 5
document.getElementById('image').setAttribute('src', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1MndL-Xp1JcnqaB0YOqTp6zDjrwYyGKsPA&s')

//bai 6
document.getElementById('btn').addEventListener('click', function (){
    alert('Xin chào bạn nhé')
})

//bai 7
Array.from(document.querySelectorAll('p')).map((value) => {
    value.innerText = 'Updated paragraph'
})

//bai 8
let t = ''
for (let index = 0; index < 3; index++) {
    t+='<tr> <td> </td> <td></td> <td></td> </tr>'
}
console.log(t);

document.getElementById('table-container').innerHTML = t

//bai 9
const divv = document.getElementsByTagName('div')
document.getElementById('display').innerText = divv.length

//bai 10
const itemm = document.getElementsByClassName('item')
Array.from(itemm).forEach((value)=>{
    value.innerText='Updated item'
})
