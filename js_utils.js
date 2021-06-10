//*********************************************************************************
//    Hivása:    alertSK("üzenet szöveg","#fff","#39e600",waitTime);              *
// saját üzenet megjelenítése adott betű és háttérszínnel, várakozással (sec-ben) *
// - ha nincs megadva várakozási idő, akkor vár a bezárására az ablak             *
//*********************************************************************************

//jQuery beimportálása, ha nincs - az üzenet hossz-számítása miatt szükséges
if ( !document.querySelector("script[src~='jquery.com']") ) {
   let jQueryScript = document.createElement('script');  
   jQueryScript.setAttribute("src","https://code.jquery.com/jquery-3.5.1.slim.min.js");
   document.head.appendChild(jQueryScript);
}

//**************************************************************************************
function alertSK(uzenet="Nincs üzenet!", colorBetu="white", colorHatter="#cc0000", waitTime=0) {

  // üzenet hosszának meghatározása pixelben - megerőszakolva
    let calcDiv = document.createElement("div");
    calcDiv.setAttribute("id","textDiv");
    calcDiv.style ="display:none;";
    document.body.appendChild(calcDiv); 
    calcDiv.innerHTML = `${uzenet}`;
    let uziHossz = Math.floor($("#textDiv").width());      // ehhez kellett a jQuery, mert csak ebben van a width() fgv.
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


//**************************************************************************************************************
//       meghívása:  loadingShow(true/false,color);   - a "body", vagy az ablak pozicionált legyen!            *
// betöltésre várakozó ikon megjelenítése - ha az átadott paraméter true-megjeleníti,ha false, akkor eltünteti *
//**************************************************************************************************************
// pl.:
//     loadingShow(true,"#0099ff");    
//     setTimeout(function() {
//         loadingShow(false);
//         alertSK("üzenet szöveg","brown","yellow"); 
//     },5000);
 
// fontawesome beimportálása, ha nincs - a loading-icon megjelentetése miatt
if ( !document.querySelector("script[src~='fontawesome.com']") ) {
    let iconScript = document.createElement('script');  
    iconScript.setAttribute("src","https://kit.fontawesome.com/ec2c2b7cb5.js");
    document.head.appendChild(iconScript);
 }
//-----------------------------------------------
function loadingShow(onoff, szin="dodgerblue") {
    if (onoff!==undefined) {
        if (onoff) {
            let waitBtn = document.createElement("button");
            waitBtn.setAttribute("id","loadingButton");
            waitBtn.style =`border:none; background:none; color:${szin}; position:absolute; top: 38vh; left: 48vw; font-size:4rem; z-index:5000;`  
            waitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
           //  waitBtn.innerHTML = `<i class="fas fa-circle-o-notch fa-spin"></i>`;
           //  waitBtn.innerHTML = `<i class="fas fa-refresh fa-spin"></i>`;            
            document.body.appendChild(waitBtn); 
        } else {
            let torol = document.querySelector("#loadingButton");
            if (torol) {
                torol.remove();
            }
        }
    }
}
 
//*******************************************************************
//             aktuális képernyő méreteinek kiíratása               *
//*******************************************************************

//  html-be:  <span id="spanID" style = "position:absolute; top:0; right:0; color:black; background:none;"></span>

//  scriptbe: 
//  ---------
//  window.onload = () => ( document.querySelector("#spanID").innerHTML = window.innerWidth+` * `+window.innerHeight );
//
//  window.onresize = function() {
//     let kiiras = document.querySelector("#spanID");
//     kiiras.innerHTML = "";
//     kiiras.innerHTML = window.innerWidth+` * `+window.innerHeight;
//  }        


//*******************************************************************
//             árnyékolt button szimulációja                        *
//*******************************************************************

// <button class="gomb" onmouseup=releaseBtn(event) onmousedown=pushBtn(event)>Ez egy gomb</button>
//   a currentTarget akkor is a gombra mutat, ha ikon van rajta!

pushBtn = (event) => {
  event.currentTarget.style.outline = 0;
  event.currentTarget.style.boxShadow = ".15rem .15rem .5rem 0 black inset";
}

releaseBtn = (event) => {
  event.currentTarget.style.boxShadow = "none";  
}

                            
//************************************************************************************************ 
//******************  LAPOZÁS - UTIL  (hivása pl.: myLapozas(callFuggveny,146,10) **************** 
//************************************************************************************************
     /* **********************************************************************
           Html-be elhelyezni: (Oldalak lapozásához gombsor és akt.lap kiírása)
              <div class="lapozas elrejtes"></div> 
              <div class="pageNumbers elrejtes"></div>  
      *************************************************************************/

             const state = {
                pageShowFgv : function(){},   // lapfül katt-ra aktivizálódó függyvény
                filmTomb : [],                // a találatnak megfelelő filmeket tartalmazó tömb
                aktPage : "1",                // aktuális/mutatott lap
                firstPageVisible : 1,         // lapozósorban első látható lap
                talalatOsszesen : 0,          // talált tételek száma összesen (pl. 146)
                mutatottElemekSzama : 1,      // az egy lapon megmutatott tételek száma (pl. 10)     
                sumPage : 0                   // talált tételek megjelenítéséhez szüks. lapok száma összesen
             };
             const lapozoSav = document.querySelector(".lapozas");      // az a div, ahol megjelenik a lapozósor
             const whichPage = document.querySelector(".pageNumbers");  // az a div, ahol megjelenik az akt. lapszám
     
             //************************************************************
             function myLapozas(callFgv, osszTalalat=0, lathatoElemek=1) {
                 if (typeof callFgv =="function") {
                     state.pageShowFgv = callFgv;
                 } else {
                     alert("Hibás a lapozáskor végrehajtandó függvény megadása !!")
                     return
                 }
                 state.talalatOsszesen = osszTalalat,   
                 state.mutatottElemekSzama = lathatoElemek, 
                 state.sumPage = Math.ceil(state.talalatOsszesen / state.mutatottElemekSzama);
     
                 myPagination()
             }
                     
             //**  lapozó fülek megjelenítése
             //********************************
             function myPagination() {       //  ha nem fér rá egy lapra a mutatandó tételek száma lapozósort jelenít meg
                 if (state.sumPage > 1) {  
                     // összeállított lapozósor megjelenítése az oldalon (ha a találat > mint a mutatottElemekSzama érték)
                     lapozoSav.classList.remove("elrejtes");
                     lapozoSav.innerHTML = lapozoSorTemplateMaker();    
     
                     whichPage.classList.remove("elrejtes");
                     whichPage.innerHTML = `<p><span>${state.aktPage}/${state.sumPage}</span> oldal</p>`;    
     
                     pagesAddEvents();                             // eseménykezelők hozzárendelése a lapfülekhez               
                 
                 } else {
                    lapozoSav.classList.add("elrejtes");
                    whichPage.classList.add("elrejtes");
                 }
             }
     
             // Oldalak lapozásához lapjelző-gombsor összeállítása - ha 1 lap van, nem jeleníti meg a lapozósort
             //***************************************************
             function lapozoSorTemplateMaker() {                         
                 const maxLap = (state.sumPage < 10)?state.sumPage:(10 + state.firstPageVisible - 1);
                 const ablakMeret = window.innerWidth;
                 const akt_lap = Number(state.aktPage);
                 let lapSor = "";
     
                 // az Előző-gomb felhelyezése a sor elejére - szükség esetén
                 // kisebb ablakméretnél elhagyja a szöveget a gombról
                 if (state.firstPageVisible > 1) {
                     lapSor += `<span class="prevPage">&lt;`+ ((ablakMeret > 550) ? ` Előző` : ``)+`</span>`;   
                 }
     
                 // max. 10 db lapozó-gomb elhelyezése (ha kevesebb lap van, akkor annyit)
                 // akkor jelöli meg, ha a látható az aktPage
                 if ( (akt_lap >= state.firstPageVisible) && (akt_lap <= maxLap) ) {
                     for (let i = state.firstPageVisible; i < akt_lap; i++) {
                         lapSor += `<span class="page pageColor">${i}</span>`
                     }                              
                     lapSor += `<span class="page megjelolPage">${state.aktPage}</span>`  // az aktuális, megjelölt lap
                     for (let i = akt_lap+1; i <= maxLap; i++) {
                         lapSor += `<span class="page pageColor">${i}</span>`
                     }                  
                 } else {
                     for (let i = state.firstPageVisible; i <= maxLap; i++) {             // ekkor nem jelöl meg egy lapot sem
                         lapSor += `<span class="page pageColor">${i}</span>`
                     }  
                 }
     
                 // a Következő-gomb felhelyezése a sor elejére - szükség esetén
                 if ( (state.sumPage > 10) && ((state.sumPage - state.firstPageVisible) > 9) ) {
                     lapSor += `<span class="nextPage">`+ ((ablakMeret > 550) ? `Következő ` : ``)+`&gt;</span>`;       
                 }    
                 return lapSor;
             }
     
             // lapozó fülek megjelenítése és a fülekhez eseménykezelők hozzáadása
             //********************************************************************
             function pagesAddEvents() {  
                 document.querySelectorAll('.lapozas .page').forEach(page => page.addEventListener('click',event => {
                     state.aktPage = event.target.textContent;
                      //*****  a lapozás által kezelt/meghívott függvény  *****
                      state.pageShowFgv();
     
                     document.querySelector(".pageNumbers p span").innerHTML = `${state.aktPage}/${state.sumPage}`;   
                    
                      scrollingLmnt = (document.scrollingElement || document.body);  
                      scrollingLmnt.scrollTop = 0;         // hogy a lap teteje látszódjon,ne ugorjon alólra
                     myPagination(); 
                 } 
                 ));
                 
                 // következő lapok megjelenítése
                 if ( (state.sumPage > 10) && ((state.sumPage - state.firstPageVisible) > 9) ) {
                     document.querySelector(".nextPage").addEventListener('click',event => {
                         state.firstPageVisible += 1;
                         myPagination();           
                     });  
                 }      
                 
                 // előző lapok megjelenítése
                 if (state.firstPageVisible > 1) {
                     document.querySelector(".prevPage").addEventListener('click',event => {
                         state.firstPageVisible -= 1;
                         myPagination();   
                     });
                 }                  
             }   

        /***********************/
        /***  LAPOZÁS-style  ***/
        /***********************/
   /* .lapozas {
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
          margin-top: 2rem;
      }
          .lapozas .page,
          .lapozas .prevPage,
          .lapozas .nextPage {
              display: inline-block;
              padding: 0.3rem 0.4rem;
              border: 0.08rem solid rgba(0,0,0,0.2);
              margin: 0 0.4rem 1rem 0;
              text-decoration: none;  
              cursor: pointer;
          }
                      
              .lapozas .pageColor {
                  background:white;
                  color:grey;
              }

              .lapozas .page:hover:not(.megjelolPage) {
                  background: rgb(170, 170, 231);
                  color: #fff
              }

          .lapozas .prevPage,
          .lapozas .nextPage {
              background: rgb(161, 233, 233);
              border-radius: .4rem;
          }

              .lapozas .prevPage:hover,
              .lapozas .nextPage:hover {
                  background: rgb(40, 116, 116);
                  color: #fff
              }

          --- aktuális lap megjelölése -----        
          .megjelolPage {
              background:rgb(94, 94, 231);
              color:white;
          }

      --- Aktuális lapszám kiírása a pagination alá ---
      .pageNumbers {
          display: flex;
          justify-content: center;
      }            
          .pageNumbers p {
              margin: 0 auto 1rem;
              font-style: italic;
              color: darkblue;
          }

      .elrejtes {display: none} 

      ****** LAPOZÁS-style VÉGE *******/


//**************************************************************
//             kövi rutin                                      *
//**************************************************************