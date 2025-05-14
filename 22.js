document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function() {
    console.log("Kliknięto przycisk nr:", this.dataset.numer)
  })
})

document.querySelectorAll(".product").forEach(el => {
  el.addEventListener("click", function() {
    const name = this.dataset.name;
    const price = this.dataset.price;
    alert(name + " kosztuje " + price + " zł")
  })
})
