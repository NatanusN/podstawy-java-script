let input = document.getElementById('myInput');
input.addEventListener('input', function() {
  console.log('Wartość wprowadzona: ' + input.value);
});

let input2 = document.getElementById('keyInput');
input2.addEventListener('keydown', function(event) {
  console.log('Naciśnięty klawisz: ' + event.key);
});

let box = document.getElementById('colorBox');
box.addEventListener('mouseover', function() {
  box.style.backgroundColor = 'green';
});

box.addEventListener('mouseout', function() {
  box.style.backgroundColor = 'blue';
});

window.addEventListener('resize', function() {
  console.log('Nowa szerokość okna: ' + window.innerWidth);
});

window.addEventListener('scroll', function() {
  console.log('Pozycja przewinięcia: ' + window.scrollY);
});

let button = document.querySelector("button#clickMeButton");
let count = 0;
button.addEventListener("click",
    function(){
        count++;
        console.log("Kliknieto przycisk " + count + " raz(y,ów)");
        content.innerText = "Kliknales w przycisk wiec tekst sie zmienil. Count = " + count;
        content.style.color = "red";
    }
)