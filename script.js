// NÖVÉNYEK ADATAI

const novenyek = [
    {
        nev: "Orchidea",
        kategoria: "viragzo",
        kep: "🌺",
        leiras: "Gyönyörű virágú növény, világos helyet szeret."
    },
    {
        nev: "Rózsa",
        kategoria: "viragzo",
        kep: "🌹",
        leiras: "Klasszikus virág, rendszeres gondozást igényel."
    },
    {
        nev: "Vitorlavirág",
        kategoria: "viragzo",
        kep: "🌼",
        leiras: "Fehér virágairól és zöld leveleiről ismert."
    },
    {
        nev: "Monstera",
        kategoria: "leveles",
        kep: "🌿",
        leiras: "Nagy, lyukacsos levelekkel rendelkező szobanövény."
    },
    {
        nev: "Anyósnyelv",
        kategoria: "leveles",
        kep: "🪴",
        leiras: "Kevés gondozást igénylő, ellenálló növény."
    },
    {
        nev: "Aloe vera",
        kategoria: "leveles",
        kep: "🌵",
        leiras: "Pozsgás növény, kevés öntözést igényel."
    }
];


// KEDVENCEK BETÖLTÉSE

let kedvencek = JSON.parse(localStorage.getItem("kedvencek")) || [];


// NÖVÉNYEK MEGJELENÍTÉSE

function novenyekMegjelenitese(lista) {

    let tartalom = "";

    if (lista.length === 0) {
        tartalom = "<p>Nem található ilyen növény.</p>";
    }

    lista.forEach(function(noveny) {

        let kedvenc = kedvencek.includes(noveny.nev);

        tartalom += `
            <div class="kartya">

                <div class="noveny-kep">${noveny.kep}</div>

                <h3>${noveny.nev}</h3>

                <p>${noveny.leiras}</p>

                <button class="kedvenc-gomb"
                onclick="kedvencValtas('${noveny.nev}')">

                ${kedvenc ? "❤️ Kedvenc" : "🤍 Kedvencekhez"}

                </button>

            </div>
        `;
    });

    document.getElementById("novenyek").innerHTML = tartalom;
}


// KERESÉS ÉS KATEGÓRIASZŰRÉS

function szures() {

    let kereses = document.getElementById("kereses").value.toLowerCase();

    let kategoria = document.getElementById("kategoria").value;

    let szurtNovenyek = novenyek.filter(function(noveny) {

        let nevEgyezes = noveny.nev.toLowerCase().includes(kereses);

        let kategoriaEgyezes =
            kategoria === "osszes" || noveny.kategoria === kategoria;

        return nevEgyezes && kategoriaEgyezes;
    });

    novenyekMegjelenitese(szurtNovenyek);
}

document.getElementById("kereses").addEventListener("input", szures);

document.getElementById("kategoria").addEventListener("change", szures);


// KEDVENCEK KEZELÉSE

function kedvencValtas(nev) {

    if (kedvencek.includes(nev)) {

        kedvencek = kedvencek.filter(function(elem) {
            return elem !== nev;
        });

    } else {

        kedvencek.push(nev);
    }

    localStorage.setItem("kedvencek", JSON.stringify(kedvencek));

    szures();
    kedvencekMegjelenitese();
}


function kedvencekMegjelenitese() {

    let lista = novenyek.filter(function(noveny) {
        return kedvencek.includes(noveny.nev);
    });

    let tartalom = "";

    if (lista.length === 0) {
        tartalom = "<p>Még nincs kedvenc növényed.</p>";
    }

    lista.forEach(function(noveny) {

        tartalom += `
            <div class="kartya">

                <div class="noveny-kep">${noveny.kep}</div>

                <h3>${noveny.nev}</h3>

                <p>${noveny.leiras}</p>

                <button class="kedvenc-gomb"
                onclick="kedvencValtas('${noveny.nev}')">
                    Eltávolítás ❤️
                </button>

            </div>
        `;
    });

    document.getElementById("kedvencek-lista").innerHTML = tartalom;
}


// ÖNTÖZÉSI EMLÉKEZTETŐ

let maiNap = new Date().toLocaleDateString("hu-HU");

let mentettOntozes = JSON.parse(localStorage.getItem("ontozesAdatok")) || {};

let meglocsolt = mentettOntozes.datum === maiNap
    ? mentettOntozes.novenyek
    : [];


function ontozesMegjelenitese() {

    let tartalom = "";

    novenyek.forEach(function(noveny) {

        let kesz = meglocsolt.includes(noveny.nev);

        tartalom += `
            <div class="ontozes-elem ${kesz ? "kesz" : ""}">

                <span>${noveny.kep} ${noveny.nev}</span>

                <button onclick="ontozesValtas('${noveny.nev}')">

                    ${kesz ? "✅ Meglocsolva" : "💧 Meglocsoltam"}

                </button>

            </div>
        `;
    });

    document.getElementById("ontozes-lista").innerHTML = tartalom;
}


function ontozesValtas(nev) {

    if (meglocsolt.includes(nev)) {

        meglocsolt = meglocsolt.filter(function(elem) {
            return elem !== nev;
        });

    } else {

        meglocsolt.push(nev);
    }

    let adatok = {
        datum: maiNap,
        novenyek: meglocsolt
    };

    localStorage.setItem("ontozesAdatok", JSON.stringify(adatok));

    ontozesMegjelenitese();
}


// VIRÁGFELISMERŐ KVÍZ

const kerdesek = [
    {
        kerdes: "Melyik növénynek vannak nagy, lyukacsos levelei?",
        valaszok: ["Orchidea", "Monstera", "Rózsa"],
        helyes: "Monstera"
    },
    {
        kerdes: "Melyik növény igényel kevés öntözést?",
        valaszok: ["Aloe vera", "Vitorlavirág", "Orchidea"],
        helyes: "Aloe vera"
    },
    {
        kerdes: "Melyik növénynek jellegzetesek a fehér virágai?",
        valaszok: ["Anyósnyelv", "Monstera", "Vitorlavirág"],
        helyes: "Vitorlavirág"
    },
    {
        kerdes: "Melyik növénynek vannak tüskéi?",
        valaszok: ["Rózsa", "Orchidea", "Vitorlavirág"],
        helyes: "Rózsa"
    },
    {
        kerdes: "Melyik növény ismert különleges virágairól?",
        valaszok: ["Monstera", "Orchidea", "Anyósnyelv"],
        helyes: "Orchidea"
    }
];

let aktualisKerdes = -1;
let pontszam = 0;
let megvalaszolva = false;


// KVÍZ INDÍTÁSA ÉS KÖVETKEZŐ KÉRDÉS

function kovetkezoKerdes() {

    if (aktualisKerdes === -1 || aktualisKerdes === kerdesek.length) {

        aktualisKerdes = 0;
        pontszam = 0;
        megvalaszolva = false;

        document.getElementById("eredmeny").innerHTML = "";

        document.getElementById("kovetkezo").innerHTML = "Következő kérdés";

        kerdesMegjelenitese();

        return;
    }

    if (!megvalaszolva) {
        return;
    }

    aktualisKerdes++;

    if (aktualisKerdes < kerdesek.length) {

        megvalaszolva = false;
        kerdesMegjelenitese();

    } else {

        document.getElementById("kerdes").innerHTML =
            "Vége a kvíznek! 🎉";

        document.getElementById("valaszok").innerHTML = "";

        document.getElementById("eredmeny").innerHTML =
            "Eredményed: " + pontszam + " / " + kerdesek.length + " pont.";

        document.getElementById("kovetkezo").innerHTML =
            "Újra szeretném játszani";
    }
}


// KÉRDÉS MEGJELENÍTÉSE

function kerdesMegjelenitese() {

    let aktualis = kerdesek[aktualisKerdes];

    document.getElementById("kerdes").innerHTML =
        (aktualisKerdes + 1) + ". " + aktualis.kerdes;

    let tartalom = "";

    aktualis.valaszok.forEach(function(valasz) {

        tartalom += `
            <button onclick="valaszEllenorzes('${valasz}')">
                ${valasz}
            </button>
        `;
    });

    document.getElementById("valaszok").innerHTML = tartalom;

    document.getElementById("eredmeny").innerHTML = "";
}


// VÁLASZ ELLENŐRZÉSE

function valaszEllenorzes(valasz) {

    if (megvalaszolva) {
        return;
    }

    megvalaszolva = true;

    let helyes = kerdesek[aktualisKerdes].helyes;

    if (valasz === helyes) {

        pontszam++;

        document.getElementById("eredmeny").innerHTML =
            "🎉 Helyes válasz!";

    } else {

        document.getElementById("eredmeny").innerHTML =
            "❌ Sajnos nem jó! A helyes válasz: " + helyes;
    }

    document.getElementById("valaszok").innerHTML =
        "<p>Válaszod: " + valasz + "</p>";
}


// MILYEN NÖVÉNY ILLIK HOZZÁD?

function novenyTeszt() {

    let gondozas = document.getElementById("gondozas").value;

    let tipus = document.getElementById("tipus").value;

    let eredmeny = "";

    if (gondozas === "keves" && tipus === "leveles") {

        eredmeny = "🌵 Neked az Aloe vera illik! Kevés gondozást igényel.";

    } else if (gondozas === "keves" && tipus === "viragzo") {

        eredmeny = "🌺 Neked egy könnyen gondozható virágzó növény illik!";

    } else if (gondozas === "sok" && tipus === "viragzo") {

        eredmeny = "🌹 Neked a rózsa lehet a tökéletes választás!";

    } else if (gondozas === "sok" && tipus === "leveles") {

        eredmeny = "🌿 Neked a Monstera illik, amit rendszeresen gondozhatsz!";

    } else if (tipus === "leveles") {

        eredmeny = "🪴 Neked az Anyósnyelv lehet jó választás!";

    } else {

        eredmeny = "🌸 Neked az Orchideát ajánljuk!";
    }

    document.getElementById("ajanlas").innerHTML = eredmeny;
}


// OLDAL BETÖLTÉSEKOR

novenyekMegjelenitese(novenyek);

kedvencekMegjelenitese();

ontozesMegjelenitese();
