// HANGMAN programhoz - a feladvány felhelyezése a felületre
//-----------------------------------------------------------
    // felhelyezi a kérdést az oldalra a rowWidth számú betűszélességben
    function kerdestFeltesz(rowWidth) {
        let rndSorsz = Math.floor(Math.random() * szolasok.length)
        let kerdes = szolasok[rndSorsz];                              // a kérdés véletlenszerű kiválasztása
        kitalalandoBetukSzama = betutSzamol(kerdes); 
        sorokSzama = kerdesDarabolas(kerdes, rowWidth);        
        let feladatSor = ``;
        for(let ssz=0; ssz < sorokSzama; ssz++){
            feladatSor += kerdesSorok[ssz].reduce((total,betu,ix) => (total+`<li data-letter=${ssz}${ix} class="taskBox"><p style="margin: .5rem 0 0 0">${betu}</p></li>`),`<ul class="taskLista">`)+`</ul>`;                        
        }
        $('button.gameBtn').addClass("rejtes");
        kitalaltBetuk = 0;
        rosszValasz = 0;
        $(".feladatCont").empty(feladatSor);                          // törli az előző kérdést
        $(".feladatCont").append(feladatSor);                         // felhelyezi az új kérdést
        $(".letterBox").fadeTo(0,1);                                  // láthatóvá teszi a kiválasztott betűket
        for(let ii=1; ii<11; ii++) {                                  // visszaszínezi a hangman-t az alaphelyzetbe
            $(`#hm0${ii}`).removeClass("figure-part");
        }                                           
       
        kerdestMaszkol(sorokSzama);                                  // rögzíti a nem kitalálandó betűket (, . szóköz)    
     
 } 

    //-----------------------------------------------
    // Feldarabolja a kérdést a megadott sorszélességnek megfelelően
    //   let kerdesSorokSzama = Math.ceil(kerdesHossz / sorHossz);  // kb. ennyi sorra fogja darabolni a kérdést
    function kerdesDarabolas (feladvany, sorHossz) {
        kerdesTomb =  szeletel(feladvany);         // tömmbbe beolvassa a betűket
        kerdesSorok = [];                          // ebbe tárolja majd a darabolt sorokat - és kiüríti az előzőt
        let kerdesHossz = kerdesTomb.length;       // feladvány karakter hossza
        let qix = 0;                               // sorok indexe     
        let startPoz = 0;                          // darabolás kezdőpoziciója a kerdesTomb-ben
        let endPoz = sorHossz;                     // darabolás végpoziciója a kerdesTomb-ben
        let maradekSor = {};                       // szótag obj, ami tartalmazza a szótagot, amit a darabolt sor végéhez kell adni
        let maradekBetu = kerdesHossz;             // a sorhoz hozzáadott szótag rendelkezésére álló hely az új soroknál
        let segedSzam;

        if (kerdesHossz <= sorHossz) {             // ekkor nem kell darabolni                         
            kerdesSorok[qix] = kerdesTomb.slice(startPoz, kerdesHossz); 
        } else {

        while (true) {
            if ( maradekBetu > sorHossz ) {
            endPoz = ((startPoz+sorHossz) < kerdesHossz) ? (startPoz+sorHossz) : kerdesHossz;
            kerdesSorok[qix] = kerdesTomb.slice(startPoz, endPoz);
            if ((kerdesTomb[endPoz] == " ") || (kerdesTomb[endPoz-1] == " ") || (kerdesTomb[endPoz-1] == ","))  {
                startPoz = endPoz;
            } else if ((("BCDFGHJKLMNPQRSTVWXYZ.!?").includes(kerdesTomb[endPoz-1]) && (kerdesTomb[endPoz-2]) == " ")) {
                kerdesSorok[qix] = kerdesTomb.slice(startPoz, endPoz-1);
                startPoz = endPoz -1;
            } else {                            // ha ki kell egészíteni a sort egy szótaggal, mert az elválasztés ráesik
                maradekSor = szoDarabolas(startPoz, sorHossz);        
                kerdesSorok[qix] = maradekSor.potoltSor;
                startPoz = maradekSor.ujSorStartPoz;
            }  
            segedSzam = kerdesSorok[qix].length;                // a tömb-elemek összehasonlítása miatt stringé alakítom a kar-t
            maradekBetu = maradekBetu - segedSzam + (JSON.stringify(kerdesSorok[qix].slice(segedSzam-1,segedSzam)) == JSON.stringify(["-"]) ? 1 : 0);
            qix++;                                     
            } else {
                kerdesSorok[qix] = kerdesTomb.slice(startPoz, kerdesHossz);
                break;
            }
        } 
        }
        return qix+1;
    }

    //--------------------------------- 
    // sztringek betűit tömb-elemekké alakítja
    function szeletel(str) {
    let i = 0;
    let taskLetters = [];
    for(let betu of str) {
        taskLetters[i] = betu;
        i++;
    }
    return taskLetters;
    }
    
    //----------------------------------
    // elvégzi a sorok szótaggal való kiegészítését - ha lehetséges
    function szoDarabolas(qStartPoz, qSorHossz) {
        let wordObj = szoKiemelo(kerdesTomb, qStartPoz+qSorHossz);        // kiemeli a sorvégi szót a szótagolás elvégzéséhez
        let maradekHely = qStartPoz+qSorHossz - wordObj.kezdesPoz;
        // a szótagolandó szót stringként adom át, ezért lesz átalakítva
        let kiegSzo = szotagolas(wordObj.cutWord.join(""), maradekHely);  // azt a szótagot adja vissza, amivel ki kell egészíteni a sort

        if (kiegSzo) {                                                   // ha sikerült szótag toldása a sorhoz - volt elég hely a sor végén
            let seged = kerdesTomb.slice(qStartPoz, wordObj.kezdesPoz).join("");
            let aktSor = szeletel(seged + kiegSzo);                           // átalakítom a szótaggal kiegészített sort
            return {potoltSor: aktSor, ujSorStartPoz: wordObj.kezdesPoz+kiegSzo.length-1}
        } else {
            return {potoltSor: kerdesTomb.slice(qStartPoz, wordObj.kezdesPoz), ujSorStartPoz: wordObj.kezdesPoz}
        }
    }

    //---------------------------------------
    // kiemeli a tördelési pozicónál lévő szót és kezdő pozicióját
    function szoKiemelo(qTomb, aktPoz) {       
    let kezdoPoz = aktPoz;                                        // kiindulási pont a szótagoláshoz
    let vegPoz = aktPoz;
    while ((qTomb[kezdoPoz]!= " ") && (kezdoPoz > 0)) {
          kezdoPoz--;
        }
        kezdoPoz++;
        while ((qTomb[vegPoz]!= " ") && (vegPoz < qTomb.length)) {   // a szó utáni ,.!? is a szóhoz tartozik az elválasztás szempontjából
          vegPoz++;   
        }
        return {cutWord:qTomb.slice(kezdoPoz,vegPoz), kezdesPoz:kezdoPoz};
    }

    //*********************************************
    // a szótagolás elvégzése a magyar magánhangzókhoz módosított RegExp alapján  
    function szotagolas(word, maradoHely) {
        let tagoltWords = word.match(syllableRegex);
        let kiegSzo = "";
        let aa = 0;
        while (tagoltWords[aa].length < maradoHely) {
            kiegSzo += tagoltWords[aa];
            maradoHely = maradoHely - tagoltWords[aa].length;
            aa++;
        }
        return kiegSzo + ((kiegSzo!="") ? '-' : '')
    }
    
    //*********************************************

    // kiemelei a listából a nem kiválasztható betűket - szóköz és írásjel
    function kerdestMaszkol(sorokSzama)  {
        for(sSzam=0; sSzam < sorokSzama; sSzam++) {
            kerdesSorok[sSzam].forEach(betutVizsgal);
        }
    }
    function betutVizsgal(betu, index) {
      if ( (" .!?,-").includes(betu) ) {
          $(`.taskBox[data-letter=${sSzam}${index}]`).addClass("taskBoxFix");
        }
    }

    //**************************************
    function betutSzamol(keresettSzolas){                            // a kitalálandó betűk számát számolja meg
        let betuk = 0;
        for(let ii = 0; ii < keresettSzolas.length; ii++) {
            if ( !(" .!?,-").includes(keresettSzolas[ii]) ) {
                betuk++;
              }
        }
        return betuk;
    }