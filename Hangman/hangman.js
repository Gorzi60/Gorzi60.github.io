// HANGMAN programhoz - vezérlések, betűvizsgálatok
//--------------------------------------------------
const betuk = ['A','Á','B','C','D','E','É','F','G','H','I','Í','J','K','L','M','N','O','Ó','Ö','Ő','P','Q','R','S','T','U','Ú','Ü','Ű','V','W','X','Y','Z'];
let betuSor = betuk.reduce((total,betu) => (total+`<li class="letterBox">${betu}</li>`),`<ul class="betuLista">`) + `</ul>`;
let szolasok = [];            // ebbe kerülnek beolvasásra a kérdések egy külső file-ből (több mint 600 db)
let kerdesTomb = [];          // a véletlenszerűen kiválasztott kérdés betűi tömb-elemmé alakkítva
let kerdesSorok = [];         // a megjelenítendő kérdés tördelt sorokban
let kitalalandoBetukSzama;    // a kitalálandó betűk száma - írásjelek nélkül
let betuChoice;               // felhasználó által kiválasztott betű az ABC-ből
let sSzam = 0;                // a feladvány egyes sorainak azonosítója
let sorokSzama = 0;           // a feltett kérdés ennyi sorból áll a tördelés után 
let kitalaltBetuk = 0;        // a kitalált betűk aktuális száma 
let rosszValasz = 0;          // a rossz betű-választások száma
let talalat = false;          // jelzi ha van helyes betűválasztás

// Beállítja, hogy hány betűt jelenít meg egy sorban
const rowWidth = (window.innerWidth > 1000) ? 15 : 12;

// szótagaloláshoz RegExp-sablon - a magyar kettősbetűket nem tudja kezelni :-(
const syllableRegex = /[^aáeéiíoóöőuúüű-]*[aáeéiíoóöőuúüű-]+(?:[^aáeéiíoóöőuúüű-]*$|[^aáeéiíoóöőuúüű-](?=[^aáeéiíoóöőuúüű-]))?/gi;

 fetch('question.lst')                    // beolvassa tömbbe a kérdések adatállományát
    .then(resp => resp.text())
    .then(text => {
        szolasok = text.split("\r\n");            
        kerdestFeltesz(rowWidth);       
    });


//****************************************

$(document).ready(function() {

    $("#taskTipus").text("S Z Ó L Á S");
    $(".lettersCont").append(betuSor);                                         // felhelyezi az ABC-t
     
    //-----------------------------------
     
    $(".letterBox").on('click', function() {                                   // kiválaszthat egy betűt az ABC-ből
      if ((kitalaltBetuk < kitalalandoBetukSzama) && (rosszValasz < 10)) {     // hogy ne lehessen betűre kattintani, ha már vége a játéknak
         $(this).fadeTo(800,0);
         betuChoice = $(this).text();      
         choiceControll();
         gameOverControll();
      }
    });
       
    function choiceControll() {                              // elleneőrzi a választott betű helyességét
       talalat = false;
       for(sSzam=0; sSzam < sorokSzama; sSzam++) {
          kerdesSorok[sSzam].forEach(foundControll);
       }  
       if (talalat == false) {                               // nem volt jó betű-választás
          rosszValasz++;
          hangmanDraw(rosszValasz);
       }
    }
      
    function foundControll(betu, index) {
       if (betu == betuChoice) {
          talalat = true;
          kitalaltBetuk++;
          $(`.taskBox[data-letter=${sSzam}${index}] > p`).addClass("letterTurn");      // megfordítja a betűt, hogy ne a tükörképe látszon  
          $(`.taskBox[data-letter=${sSzam}${index}]`).addClass("taskBoxShow");         // a jó válaszok megmutatása, elfordulása
       } 
    }

    function gameOverControll() {                                   // ellenőrzi, hogy nincs-e vége a játéknak
      if (rosszValasz == 10) {
         setTimeout(function(){
            alertSK("Sajnos ez nem sikerült! Próbálja meg újra, legközelebb jobb lesz!","black","red",4);
            $('button.gameBtn').removeClass("rejtes");
         },1000);
      } 
      if (kitalaltBetuk == kitalalandoBetukSzama) {
         setTimeout(function(){
           alertSK("GRATULÁLÁCIÓ !!!  Ez ügyes játék volt! Ezt érdemes megismételni!","white","limegreen",4);
           $('button.gameBtn').removeClass("rejtes");
         },2000);
      }
    }

    //------------------------------
    function hangmanDraw(elem) {                                   // rosszválasz esetén rajzol egy részt a hangman-ből
       $(`#hm0${elem}`).addClass("figure-part");
    }

})

//****************************** ÜZENET rutin ******************************************
//**************************************************************************************
function alertSK(uzenet="Nincs üzenet!", colorBetu="white", colorHatter="#cc0000", waitTime=0) {

    // üzenet hosszának meghatározása pixelben - megerőszakolva
      let calcDiv = document.createElement("div");
      calcDiv.setAttribute("id","textDiv");
      calcDiv.style ="display:none;";
      document.body.appendChild(calcDiv); 
      calcDiv.innerHTML = `${uzenet}`;
      let uziHossz = Math.floor($("#textDiv").width());      
      calcDiv.remove();
    //  let uziHossz = uzenet.length*9;                      // a 9 egy becslés pixelben, ha fenti túl bonyolult lenne. :-)
      
      let ablakSize = window.innerWidth;
      uziHossz = (uziHossz > 0.8*ablakSize) ? 0.8*ablakSize+35 : uziHossz+80;  // 80%-nál ne legyen nagyobb az üzenet-ablak
      let leftDiv = (ablakSize-(uziHossz+16)) / 2 / 16;                        // üzenet pozicionálása középre és 16-al osztva a rem megadás miatt (+padding,border)
      let widthDiv = uziHossz / 16;                                            // üzenet ablak méretének átszámítása rem-be
      
      // üzenet ablak létrehozása id-vel
      let uziDiv = document.createElement("div");
      let uziId = document.createAttribute("id")
      uziId.value = "uziBox";   
      uziDiv.setAttributeNode(uziId);
      document.body.appendChild(uziDiv);
  
      // üzenet-ablak stílus hozzáadása és a tartalom megjelenítése
      let message = `
        <div style="
            font-family: Arial, Helvetica, sans-serif;
            font-size: 1rem;
            position:fixed;
            top:40vh;
            left: ${leftDiv}rem;       
            z-index:5000;
            background-color : ${colorHatter};
            color : ${colorBetu};
            padding: 0.2rem 0.3rem;
            margin: auto;
            border: 0.2rem double #000;
            box-shadow: 0.5rem 0.5rem 0.4rem rgba(0, 0, 0);
            width: ${widthDiv}rem;            
          ">
          <span onclick=bezarUzenet(this) onmouseover=closeHover(this,"lightgrey") onmouseout=closeHover(this,["${colorHatter}"])
                  style="position:absolute; top:0; right:0; font-size:1.5rem; color:#000; cursor:pointer">&nbsp;&times;&nbsp;</span>
          <br>
          <p style="text-align:center; margin-top: 1rem; line-height:1.5rem;">${uzenet}</p>  
          <br>       
        </div>
      `    
     const uziAblak = document.querySelector("#uziBox");
     uziAblak.style.display = "block";                     // mert valahogy megjegyzi az előző meghíváskori "none"-t
     uziAblak.innerHTML = message;
  
     if (waitTime > 1) {                                   // a megadott idő múlva bezáródik az üzenet
       setTimeout(function() {
          uziAblak.style.display = "none";
       }, waitTime * 1000 );    
     }
     
  }
  //-------------------------------
  function bezarUzenet(elem) {
     elem.parentElement.style.display = "none";
  }
  
  function closeHover(elem,szin) {
     elem.style.backgroundColor = szin;
  }

//*************************************
// Button benyomódás szimulálása
//*************************************
pushBtn = (event) => {
   event.target.style.outline = 0;
   event.target.style.boxShadow = ".2rem .3rem .4rem .1rem black inset";
}

releaseBtn = (event) => {
   event.target.style.boxShadow = "none";  
}

//*************************************