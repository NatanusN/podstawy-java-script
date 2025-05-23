let button1 = document.getElementById("clickMe")
button1.addEventListener("click", function(){console.log("kliknięto");
})

let buttons = document.querySelectorAll(".button")
buttons.forEach(btn =>{
    btn.addEventListener('click', function(){console.log(this.textContent);
    })
})

const list = document.querySelectorAll('li')
list.forEach(li =>{li.addEventListener('click', function(){this.style.color = 'red'})})

let form = document.getElementById("myForm")
form.addEventListener("submit", function(event){console.log("formularz został wysłany"); event.preventDefault();
})