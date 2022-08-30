"use strict";

// --------------------------------------------
// get basis inputs
const submit = document.getElementById("submit");
const reset = document.getElementById("reset");
const hoogte = document.getElementById("hoogte");
const breedte = document.getElementById("breedte");
const mogelijkeKleuren = ["bg-rood", "bg-groen", "bg-blauw", "bg-wit"];
const saveButton = document.getElementById("save");
const fileInput = document.getElementById("load");

// welke kleur is gekozen
function findSelected() {
  const selected = document.querySelector("input[name='kleur']:checked");
  return selected.value;
}

function bepaalKleur(dezeCell) {
  let kleur = "wit";
  if (dezeCell.classList[0]) {
    kleur = dezeCell.classList[0].substr(3);
  }
  return kleur;
}
// wat als er op een cell geclicked word
function handleEvent() {
  const gekozen = findSelected();
  const kolom = this.cellIndex + 1;
  const rij = this.parentNode.rowIndex + 1;

  if (gekozen !== "info") {
    kleurIn(gekozen, rij, kolom, this);
  } else {
    const kleur = bepaalKleur(this);
    console.log(
      `clicked on a cell at rij ${rij} , kolom ${kolom}, ik ben ${kleur}`
    );
  }
}

function kleurIn(kleur, rij, kolom, dezeCell) {
  console.log(`cell at rij ${rij} , kolom ${kolom}, ik werd zopas ${kleur}`);
  mogelijkeKleuren.forEach((bg_kleur) => {
    dezeCell.classList.remove(bg_kleur);
  });
  dezeCell.classList.add(`bg-${kleur}`);
}
// -----------------------------------------------------
// classes
class veld {
  constructor(breedte, hoogte) {
    this.breedte = breedte;
    this.hoogte = hoogte;
    this.maakGrid(this.breedte, this.hoogte);
  }

  dropGrid() {
    const table = document.getElementsByTagName("table")[0];
    if (table) {
      document.body.removeChild(table);
    }
  }

  maakGrid(breedte, hoogte, rijen = null) {
    console.log(`maak grid: ${breedte} breed en ${hoogte} hoog`);
    const body = document.getElementsByTagName("body")[0];
    this.dropGrid();

    const newTable = document.createElement("table");
    for (let i = 0; i < hoogte; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < breedte; j++) {
        const cell = document.createElement("td");
        if (rijen) {
          const kleur = rijen[i][j].kleur;
          if (kleur !== "wit") {
            kleurIn(kleur, i, j, cell);
          }
        }
        cell.addEventListener("click", handleEvent);
        row.appendChild(cell);
      }
      newTable.appendChild(row);
    }
    body.appendChild(newTable);
  }

  loadGrid(veld) {
    this.dropGrid();
    console.log(veld);
    const hoogte = veld[0].hoogte;
    const breedte = veld[0].breedte;
    this.hoogte = hoogte;
    this.breedte = breedte;
    // hoogte en breedte aanpassen van het object zodat reset goed werkt
    const array = veld.slice(1);
    this.maakGrid(breedte, hoogte, array);
  }

  saveVeld() {
    const volledigeTabel = document.getElementsByTagName("table")[0];
    const opgeslagenVeld = [{ breedte: grid.breedte, hoogte: grid.hoogte }];

    // start foreach rij
    volledigeTabel.childNodes.forEach((rij, rijIndex) => {
      // start foreach kolom
      const row = [];
      rij.childNodes.forEach((cell, kolomIndex) => {
        const kleur = bepaalKleur(cell);
        // console.log(
        //   `saved cell at rij ${rijIndex} , kolom ${kolomIndex}, ik ben ${kleur}`
        // );
        row.push({
          rij: rijIndex,
          kolom: kolomIndex,
          kleur: kleur,
        });
      });
      // einde foreach kolom
      opgeslagenVeld.push(row);
    });
    // einde foreach rij
    const mijnJSON = JSON.stringify(opgeslagenVeld);
    console.log(mijnJSON);

    function download(content, fileName, contentType) {
      const a = document.createElement("a");
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
    download(mijnJSON, "veld.json", "text/plain");
  }
}

// -------------------------------------------------

// load JSON file
function checkFile() {
  const file = fileInput.files[0];
  const fileread = new FileReader();
  fileread.onload = function (e) {
    const content = e.target.result;
    const intern = JSON.parse(content);
    grid.loadGrid(intern);
  };
  fileread.readAsText(file);
  // ????????????????
  // ??????? hoe krijg je intern buiten de function (e)?
  // ????????????????
}
// --------------------------------------------

// logica
// teken starting grid
let grid = new veld(breedte.value, hoogte.value);
// teken nieuw grid na submit
submit.addEventListener("click", (e) => {
  grid = new veld(breedte.value, hoogte.value);
});
// teken zelfde grid na reset
reset.addEventListener("click", (e) => {
  const nieuweBreedte = grid.breedte;
  const nieuweHoogte = grid.hoogte;
  grid = new veld(nieuweBreedte, nieuweHoogte);
});

saveButton.addEventListener("click", grid.saveVeld);
fileInput.addEventListener("change", checkFile);
