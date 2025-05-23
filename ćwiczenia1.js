let przycisk1 = document.getElementById("clickMe")
przycisk1.addEventListener("click", function(){ console.log("kliknieto");})

let przyciski = document.querySelectorAll('.button')
przyciski.forEach(btn => {btn.addEventListener('click', function() {console.log(this.textContent)})});

const list = document.querySelectorAll('li')
list.forEach(li => {li.addEventListener('click', function() {this.style.color = "red"})})

let formularz = document.getElementById("myForm")
formularz.addEventListener("submit", function(form){form.preventDefault(); console.log("Formularz został wysłany")})