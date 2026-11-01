const kartyak = document.querySelectorAll('.kartya');
const darabSzam = document.getElementById('darabSzam');
const szuroGombok = document.querySelectorAll('.szuro-gomb');
const keresoInput = document.getElementById('keresoInput');

function frissitSzamlalo() {
    let lathato = 0;
    kartyak.forEach(kartya => {
        if (kartya.style.display !== 'none') {
            lathato++;
        }
    });
    if (darabSzam) {
        darabSzam.textContent = lathato;
    }
}

kartyak.forEach(kartya => {
    kartya.addEventListener('click', function() {
        this.classList.toggle('nyitva');
    });
});

function szures() {
    const keresettSzo = keresoInput ? keresoInput.value.toLowerCase() : '';
    const aktivGomb = document.querySelector('.szuro-gomb.active');
    const aktivKategoria = aktivGomb ? aktivGomb.getAttribute('data-kategoria') : 'mind';

    kartyak.forEach(kartya => {
        const viragNeve = kartya.querySelector('h3').textContent.toLowerCase();
        const leirasSzoveg = kartya.querySelector('.leiras').textContent;

        const egyezikKereses = viragNeve.includes(keresettSzo);
        const egyezikKategoria = aktivKategoria === 'mind' || leirasSzoveg.includes(aktivKategoria);

        if (egyezikKereses && egyezikKategoria) {
            kartya.style.display = 'flex';
        } else {
            kartya.style.display = 'none';
        }
    });

    frissitSzamlalo();
}

if (keresoInput) {
    keresoInput.addEventListener('input', szures);
}

szuroGombok.forEach(gomb => {
    gomb.addEventListener('click', function() {
        szuroGombok.forEach(g => g.classList.remove('active'));
        this.classList.add('active');
        szures();
    });
});

const topGomb = document.getElementById('topGomb');

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        if (topGomb) topGomb.style.display = "block";
    } else {
        if (topGomb) topGomb.style.display = "none";
    }
};

if (topGomb) {
    topGomb.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.getElementById('kapcsolatForm').addEventListener('submit', function(esemeny) {
    esemeny.preventDefault();

    const nevMezo = document.getElementById('nev').value.trim();
    const telefonszamMezo = document.getElementById('telefon').value.trim();
    const hibaCimke = document.getElementById('telefonHiba');
    const csakBetuk = /^[a-zA-AÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]+$/;

    if (!csakBetuk.test(nevMezo)) {
        alert('A név mező csak betűket tartalmazhat!');
        return;
    }

    if (telefonszamMezo.startsWith('06') && telefonszamMezo.length === 11 && !isNaN(telefonszamMezo)) {
        hibaCimke.style.display = 'none';
        alert('Köszönjük! Az üzenetet és a helyes adatokat rögzítettük.');
        document.getElementById('kapcsolatForm').reset();
    } else {
        hibaCimke.style.display = 'block';
    }
});

frissitSzamlalo();