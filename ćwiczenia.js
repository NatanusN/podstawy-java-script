let click = document.getElementById("clickMe")
click.addEventListener("click", function(){console.log("kliknięto");
})

let przyciski = document.querySelectorAll(".button")
przyciski.forEach(btn => {
  btn.addEventListener('click', function() {
    console.log(this.textContent);
  });
});

const list = document.querySelectorAll('li');
list.forEach(li => {
  li.addEventListener('click', function() {
    this.style.color = 'red';
  });
});

let form = document.getElementById("myForm")
form.addEventListener("submit", function(formularz) {
    formularz.preventDefault();
    console.log("formularz został wysłany");})