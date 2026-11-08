// A HTML-elemek kiválasztása
const kartyak = document.querySelectorAll(".kartya");
const keresoInput = document.getElementById("keresoInput");
const szuroGombok = document.querySelectorAll(".szuro-gomb");
const darabSzam = document.getElementById("darabSzam");

let aktualisKategoria = "mind";

// Mentett adatok betöltése
let kedvencek = JSON.parse(localStorage.getItem("kedvencek")) || [];
let ontozesek = JSON.parse(localStorage.getItem("ontozesek")) || [];

// Új funkciók létrehozása
const funkciok = document.createElement("div");
funkciok.className = "uj-funkciok";

funkciok.innerHTML = `
    <div class="funkcio-doboz">
        <h3>🌱 Növénykvíz</h3>
        <p>Teszteld a növényismeretedet!</p>
        <button id="kvizGomb">Kvíz indítása</button>
        <div id="kvizEredmeny" class="funkcio-eredmeny"></div>
    </div>

    <div class="funkcio-doboz">
        <h3>🌸 Növényteszt</h3>
        <p>Melyik növény illik hozzád?</p>
        <button id="tesztGomb">Teszt indítása</button>
        <div id="tesztEredmeny" class="funkcio-eredmeny"></div>
    </div>

    <div class="funkcio-doboz">
        <h3>💧 Öntözési emlékeztető</h3>
        <p>A beállított öntözési dátumaid:</p>
        <div id="ontozesLista"></div>
    </div>

    <div class="funkcio-doboz">
        <h3>❤️ Kedvenc növényeim</h3>
        <p>Itt találod a kedvencnek jelölt növényeidet.</p>
        <div id="kedvencekLista"></div>
    </div>
`;

// A funkciók beszúrása a növények elé
const viragRacs = document.querySelector(".virag-racs");
viragRacs.parentNode.insertBefore(
    funkciok,
    viragRacs.nextSibling
);
// Növénykártyák beállítása
kartyak.forEach(kartya => {
    const nev = kartya.querySelector("h3").textContent;

    // Kedvenc gomb létrehozása
    const kedvencGomb = document.createElement("button");
    kedvencGomb.className = "kedvenc-gomb";

    function kedvencAllapot() {
        if (kedvencek.includes(nev)) {
            kedvencGomb.textContent = "❤️";
            kedvencGomb.classList.add("kedvenc");
        } else {
            kedvencGomb.textContent = "♡";
            kedvencGomb.classList.remove("kedvenc");
        }
    }

    kedvencAllapot();
    kartya.appendChild(kedvencGomb);

    kedvencGomb.addEventListener("click", function(event) {
        event.stopPropagation();

        if (kedvencek.includes(nev)) {
            kedvencek = kedvencek.filter(elem => elem !== nev);
        } else {
            kedvencek.push(nev);
        }

        localStorage.setItem("kedvencek", JSON.stringify(kedvencek));

        kedvencAllapot();
        kedvencekMegjelenitese();
    });

    // Öntözés gomb létrehozása
    const ontozesGomb = document.createElement("button");
    ontozesGomb.className = "ontozes-gomb";
    ontozesGomb.textContent = "💧 Öntözés";

    kartya.appendChild(ontozesGomb);

    ontozesGomb.addEventListener("click", function(event) {
        event.stopPropagation();

        const napok = prompt(
            "Hány nap múlva szeretnéd megöntözni a növényt?"
        );

        if (napok === null) return;

        const nap = Number(napok);

        if (!Number.isInteger(nap) || nap < 1 || nap > 365) {
            alert("Kérlek, 1 és 365 közötti egész számot adj meg!");
            return;
        }

        const datum = new Date();
        datum.setDate(datum.getDate() + nap);

        const datumSzoveg = datum.toLocaleDateString("hu-HU");

        ontozesek = ontozesek.filter(elem => elem.nev !== nev);

        ontozesek.push({
            nev: nev,
            datum: datumSzoveg
        });

        localStorage.setItem("ontozesek", JSON.stringify(ontozesek));

        ontozesMegjelenitese();

        alert("Sikeresen beállítottad az öntözési dátumot! 🌱");
    });

    // Kártya megnyitása és bezárása
    kartya.addEventListener("click", function(event) {
        if (event.target.closest("button")) return;

        this.classList.toggle("nyitva");
    });
});

// Keresés és szűrés
function szures() {
    const keresettSzo = keresoInput.value.toLowerCase();
    let darab = 0;

    kartyak.forEach(kartya => {
        const nev = kartya.querySelector("h3").textContent.toLowerCase();
        const leiras = kartya.querySelector(".leiras").textContent.toLowerCase();

        const tipusSor = Array.from(
            kartya.querySelectorAll(".leiras p")
        ).find(p => p.textContent.includes("Típus:"));

        const tipus = tipusSor ? tipusSor.textContent : "";

        const megfeleloNev =
            nev.includes(keresettSzo) ||
            leiras.includes(keresettSzo);

        let megfeleloKategoria = true;

        if (aktualisKategoria === "Benti") {
            megfeleloKategoria = tipus.includes("Benti növény");
        }

        if (aktualisKategoria === "Kinti") {
            megfeleloKategoria = tipus.includes("Kinti növény");
        }

        if (megfeleloNev && megfeleloKategoria) {
            kartya.classList.remove("elrejtve");
            darab++;
        } else {
            kartya.classList.add("elrejtve");
            kartya.classList.remove("nyitva");
        }
    });

    darabSzam.textContent = darab;
}

keresoInput.addEventListener("input", szures);

// Szűrőgombok működése
szuroGombok.forEach(gomb => {
    gomb.addEventListener("click", function() {
        szuroGombok.forEach(elem => {
            elem.classList.remove("active");
        });

        this.classList.add("active");
        aktualisKategoria = this.dataset.kategoria;

        szures();
    });
});

// Kedvencek megjelenítése
function kedvencekMegjelenitese() {
    const lista = document.getElementById("kedvencekLista");
    lista.innerHTML = "";

    if (kedvencek.length === 0) {
        lista.textContent = "Még nincs kedvenc növényed.";
        return;
    }

    kedvencek.forEach(nev => {
        const sor = document.createElement("p");
        sor.className = "kedvenc-sor";
        sor.textContent = "❤️ " + nev;
        lista.appendChild(sor);
    });
}

// Öntözési dátumok megjelenítése
function ontozesMegjelenitese() {
    const lista = document.getElementById("ontozesLista");
    lista.innerHTML = "";

    if (ontozesek.length === 0) {
        lista.textContent = "Még nincs beállított emlékeztető.";
        return;
    }

    ontozesek.forEach(elem => {
        const sor = document.createElement("p");
        sor.className = "ontozes-sor";
        sor.textContent = "💧 " + elem.nev + " – " + elem.datum;

        lista.appendChild(sor);
    });
}

// Növénykvíz
document.getElementById("kvizGomb").addEventListener("click", function() {
    const kerdesek = [
        {
            kerdes: "Melyik növény követi fiatal korában a Nap mozgását?",
            valaszok: "1. Orchidea\n2. Napraforgó\n3. Tulipán",
            helyes: "2",
            magyarazat: "A napraforgó fiatal virágfeje követi a Nap mozgását."
        },
        {
            kerdes: "Melyik növény bírja különösen jól a szárazságot?",
            valaszok: "1. Kövirózsa\n2. Hortenzia\n3. Vitorlavirág",
            helyes: "1",
            magyarazat: "A kövirózsa húsos leveleiben vizet tárol."
        },
        {
            kerdes: "Melyik növény kedveli a párás környezetet?",
            valaszok: "1. Kaktusz\n2. Flamingóvirág\n3. Levendula",
            helyes: "2",
            magyarazat: "A flamingóvirág trópusi növény, ezért szereti a párát."
        }
    ];

    const kerdes = kerdesek[Math.floor(Math.random() * kerdesek.length)];

    const valasz = prompt(
        kerdes.kerdes + "\n\n" + kerdes.valaszok
    );

    if (valasz === null) return;

    const eredmeny = document.getElementById("kvizEredmeny");

    if (valasz.trim() === kerdes.helyes) {
        eredmeny.textContent = "Helyes válasz! Ügyes vagy! 🌸";
    } else {
        eredmeny.textContent = "Nem egészen! " + kerdes.magyarazat;
    }
});

// Milyen növény illik hozzád?
document.getElementById("tesztGomb").addEventListener("click", function() {
    const valasz = prompt(
        "Milyen helyet kedvelsz a legjobban?\n\n" +
        "1. Napos, meleg helyet\n" +
        "2. Árnyékos, nyugodt helyet\n" +
        "3. Világos, otthonos helyet"
    );

    if (valasz === null) return;

    const eredmeny = document.getElementById("tesztEredmeny");

    if (valasz.trim() === "1") {
        eredmeny.textContent = "Hozzád a levendula illik! 💜";
    } else if (valasz.trim() === "2") {
        eredmeny.textContent = "Hozzád a vitorlavirág illik! 🌿";
    } else if (valasz.trim() === "3") {
        eredmeny.textContent = "Hozzád az orchidea illik! 🌸";
    } else {
        eredmeny.textContent = "Kérlek, 1, 2 vagy 3 közül válassz!";
    }
});

// Kapcsolati űrlap ellenőrzése
const kapcsolatForm = document.getElementById("kapcsolatForm");

kapcsolatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const telefon = document.getElementById("telefon").value.trim();
    const telefonHiba = document.getElementById("telefonHiba");

    const joTelefon = /^06\d{9}$/.test(telefon);

    if (!joTelefon) {
        telefonHiba.style.display = "block";
        return;
    }

    telefonHiba.style.display = "none";

    alert("Az űrlap kitöltése sikeres!");

    kapcsolatForm.reset();
});

// Vissza a tetejére gomb
const topGomb = document.getElementById("topGomb");

window.addEventListener("scroll", function() {
    if (window.scrollY > 300) {
        topGomb.style.display = "block";
    } else {
        topGomb.style.display = "none";
    }
});

topGomb.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Kezdeti megjelenítés
szures();
kedvencekMegjelenitese();
ontozesMegjelenitese();

// Fejléc címének eltüntetése görgetéskor

const fejléc = document.querySelector("header");

window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        fejléc.classList.add("elrejtve");
    } else {
        fejléc.classList.remove("elrejtve");
    }
});
