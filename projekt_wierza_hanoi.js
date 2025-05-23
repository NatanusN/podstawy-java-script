let selectedDisk = null;
let fromTower = null;
let ruchy = 0
let przyciski = document.querySelectorAll('button')
let wieża1 = document.getElementById('tower1')
let ilośćKrążków = undefined
console.log(przyciski);

przyciski.forEach(disk => disk.addEventListener("click", function(){console.log(this.textContent)
if (disk.textContent === "2") 
  {const div2 = document.createElement('div')
   div2.classList.add("disk")
   div2.classList.add("disk2")
   div2.innerText = "2"
   wieża1.appendChild(div2)
    
   const div = document.createElement('div')
   div.classList.add("disk")
   div.classList.add("disk1")
   div.innerText = "1"
   wieża1.appendChild(div)
  }
else if (disk.textContent === "3")
{const div3 = document.createElement('div')
   div3.classList.add("disk")
   div3.classList.add("disk3")
   div3.innerText = "3"
   wieża1.appendChild(div3)

   const div2 = document.createElement('div')
   div2.classList.add("disk")
   div2.classList.add("disk2")
   div2.innerText = "2"
   wieża1.appendChild(div2)

const div = document.createElement('div')
   div.classList.add("disk")
   div.classList.add("disk1")
   div.innerText = "1"
   wieża1.appendChild(div)
}
else if (disk.textContent === "4")
{const div4 = document.createElement('div')
   div4.classList.add("disk")
   div4.classList.add("disk4")
   div4.innerText = "4"
   wieża1.appendChild(div4)

const div3 = document.createElement('div')
   div3.classList.add("disk")
   div3.classList.add("disk3")
   div3.innerText = "3"
   wieża1.appendChild(div3)

   const div2 = document.createElement('div')
   div2.classList.add("disk")
   div2.classList.add("disk2")
   div2.innerText = "2"
   wieża1.appendChild(div2)

const div = document.createElement('div')
   div.classList.add("disk")
   div.classList.add("disk1")
   div.innerText = "1"
   wieża1.appendChild(div)
}
else if (disk.textContent === "5")
{const div5 = document.createElement('div')
   div5.classList.add("disk")
   div5.classList.add("disk5")
   div5.innerText = "5"
   wieża1.appendChild(div5)

  const div4 = document.createElement('div')
   div4.classList.add("disk")
   div4.classList.add("disk4")
   div4.innerText = "4"
   wieża1.appendChild(div4)

const div3 = document.createElement('div')
   div3.classList.add("disk")
   div3.classList.add("disk3")
   div3.innerText = "3"
   wieża1.appendChild(div3)

   const div2 = document.createElement('div')
   div2.classList.add("disk")
   div2.classList.add("disk2")
   div2.innerText = "2"
   wieża1.appendChild(div2)

const div = document.createElement('div')
   div.classList.add("disk")
   div.classList.add("disk1")
   div.innerText = "1"
   wieża1.appendChild(div)
  }
  else {const div6 = document.createElement('div')
   div6.classList.add("disk")
   div6.classList.add("disk6")
   div6.innerText = "6"
   wieża1.appendChild(div6)
   
    const div5 = document.createElement('div')
   div5.classList.add("disk")
   div5.classList.add("disk5")
   div5.innerText = "5"
   wieża1.appendChild(div5)

  const div4 = document.createElement('div')
   div4.classList.add("disk")
   div4.classList.add("disk4")
   div4.innerText = "4"
   wieża1.appendChild(div4)

const div3 = document.createElement('div')
   div3.classList.add("disk")
   div3.classList.add("disk3")
   div3.innerText = "3"
   wieża1.appendChild(div3)

   const div2 = document.createElement('div')
   div2.classList.add("disk")
   div2.classList.add("disk2")
   div2.innerText = "2"
   wieża1.appendChild(div2)

const div = document.createElement('div')
   div.classList.add("disk")
   div.classList.add("disk1")
   div.innerText = "1"
   wieża1.appendChild(div)
  }
  ilośćKrążków = wieża1.children.length
}))
document.querySelectorAll('.tower').forEach(tower => {
  tower.addEventListener('click', function () {
    const topDisk = this.lastElementChild;

    if (!selectedDisk && topDisk) {
      selectedDisk = topDisk;
      fromTower = this;
      selectedDisk.style.backgroundColor = '#f39c12';
    } else if (selectedDisk) {
      const targetTower = this;
      const topTargetDisk = targetTower.lastElementChild;

      const diskSize = parseInt(selectedDisk.textContent);
      const targetSize = topTargetDisk ? parseInt(topTargetDisk.textContent) : Infinity;

      if (diskSize < targetSize) {
        targetTower.appendChild(selectedDisk);
        ruchy++
      }

      selectedDisk.style.backgroundColor = '';
      selectedDisk = null;
      fromTower = null;
    }
  });
});
let wieża3 = document.getElementById("tower3")
wieża3.addEventListener("click", function(){if (wieża3.children.length === ilośćKrążków) alert("wygrałeś ruszyłeś krążek " + ruchy + " razy")})

