/**  Mozifilmek oldalról (www.omdbapi.com) film-infók lekérése - js file ***/
/***************************************************************************/
            // Mozifilm oldalán  page = 1-100 - lapozási lehetőség


var searchWord ="";                     // keresett film címe
var searchYear = "";                    // keresett film éve
var startLap = true;                    // az elso megjelenítéskori beállításhoz
var aktPage;                            // aktuális/mutatott lap
var firstPageVisible = 1;               // lapozósorban első látható lap
var talalatOsszesen = 0;                // talált filmek száma összesen 
var sumPage = 1;                        // talált filmek megjelenítéséhez szüks. lapok száma
const keresoForm = document.querySelector("#formSearch");
const uresReszHelye = document.querySelector("#emptySection"); //lábléc pozicionálásához
const lapozoSav = document.querySelector(".lapozas");
const filmsList = document.querySelector(".filmLista");
const leirElem = document.querySelector(".filmLeiras");
const whichPage = document.querySelector(".pageNumbers");
const elozoPage = document.querySelector(".lapozas .prevPage");
const kovetkezoPage = document.querySelector(".lapozas .nextPage");


//kereső kifejezések kiolvasása
//*****************************
keresoForm.addEventListener('submit', function(event) {
     event.preventDefault();
     let sWord = event.target.elements.filmCim.value; 
     let sYear = event.target.elements.filmYear.value; 
     // az első oldal és ha indokolt a lapozó fülek-sor megjelenítése a keresett kifejezésre
     // a legelső alkalommal, ill. ha megváltozik a keresési feltétel
     if ( startLap || ((searchWord!=sWord) || (searchYear!=sYear)) ) {   
        searchWord = sWord;
        searchYear = sYear;
        if (searchWord.length < 3) {     
             alertSK('A kereséshez a film címéhez legaláb 3 betű beírása szükséges!',"white","#3366ff");
             return false;
        } else if ((searchYear.length == 0) || (searchYear.length == 4)  ) {
             filmekSzama(searchWord, searchYear);         // filmek számának kiszámítása        
             aktPage = "1";
             filmsLoading(aktPage);                       // filmcard-ok letöltése, megjelenítése
        } else {
            alertSK('A kereséskor az évnek vagy üresnek, vagy 4 jegyűnek kell lennie!',"white","#3366ff");
            return false;
        }        
     }
});

// a keresésnek megfelelő oldal (max. 10 db film adattal) letöltése
//*****************************************************************
async function filmsLoading(actualPage) {
    let url = `https://www.omdbapi.com/?s=${encodeURI(searchWord)}&y=${searchYear}&page=${actualPage}&apiKey=9606ae0f`;
    
        loadingShow(true,"yellow");                     // betöltés folyamatban jelzés megjelenítése        
         let responsFilm = await fetch(url);
         if (responsFilm.ok) {
            let movieList = await responsFilm.json(); 
            if (movieList.Search) {                     // az adatállomány ilyen nevű tömbben van
               loadingShow(false);                      // betöltés folyamatban jelzés eltüntetése
               // filmek megjelenítése
               filmekMegjelenitese(movieList.Search);   
            } else {
                alertSK("Sikertelen a keresés, próbálja meg újra!");
            } 
         } else {
             alertSK("Sikertelen a keresés ...");
         }
        loadingShow(false);        
}

// filmek megjelenítéséhez html-elemek összeállítása
//***************************************************
function filmsTemplateMaker(movies) {
    let filmekTemplate="";
    for(let movie of movies) {
        filmekTemplate += `
          <li class="filmElemTabla">
            <div class="filmCard" data-filmid="${movie.imdbID}">
               <div class="filmPoster">
                   <a><img src="${movie.Poster}" alt="Film-poster" class="moviePoster"></a>
               </div>      
               <p class="egyFilmLeiras">
                   <span class="movieTitle">
                      ${movie.Title}
                   </span>
               </p> 
               <div class="alsoResz clearfix">
                 <span class="movieYear">
                  ${movie.Year}
                 </span>
                 <input class="form-control" type="button" value="Részletek">
               </div>   
            </div>   
          </li>              
        `
    }
    return filmekTemplate;
}

// a kiválasztott film részletes infójákhoz a html-elemek összeállítása
//**********************************************************************
function filmDetailsTemplateMaker(infoFilm) {
    let showReszlet = `
    <div class="infoBox">
        <span class="leirasCloseBtn clearfix">&times;</span>
        <br>
        <h5>${infoFilm.Title}</h5>               
        <div style="display: flex">
            <span>Tartalom: </span>
            <span class="plotFilm">
              ${infoFilm.Plot}
            </span> 
        </div>               
        <p><span style="float:right">${infoFilm.Runtime}</span></p>                
        <p>Rendezte: <span>${infoFilm.Director}</span></p>
        <div style="display: flex">
            <span>Főszereplők: </span>
            <span class="actorsFilm">
              ${infoFilm.Actors}
            </span> 
        </div>                                        
        <p>imdb: <span>${infoFilm.imdbRating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${infoFilm.imdbVotes} szavazat</span></p>            
    </div>
    `;
    return showReszlet;
}

//**************************************************************
// a letöltött 10 db film adatainak megjelenítése kártyaszerűen
//**************************************************************
function filmekMegjelenitese(moziFilmek) {
    if (startLap) {  
       uresReszHelye.classList.remove("uresResz");  // lábléc feletti üres terület eltörlése
       if (talalatOsszesen < 5) {
           uresReszHelye.classList.add("uresResz2");
       } 
       startLap = false;                            // csak az első lista megjelenítése előtt kell
    }

    // összeállított html-tartalom megjelenítése az oldalon 
    filmsList.innerHTML = filmsTemplateMaker(moziFilmek);

    // részletek megjelenítése - a kiválasztott film ID-je alapján a teljes adatrekord lekérhető
    document.querySelectorAll('.alsoResz input').forEach(gomb => gomb.addEventListener('click',event => {
        filmDetailShow(event.target.parentElement.parentElement.dataset.filmid);
    }));
}

// a kiválasztott filmhez részletes információk megjelenítése
//***********************************************************
async function filmDetailShow(aktID) {     
    let url = `https://www.omdbapi.com/?i=${aktID}&apiKey=9606ae0f`;

    let respFilm = await fetch(url);
    if (respFilm.ok) {
        let infoFilm = await respFilm.json();
        if (infoFilm.Response == "True") {  
            // összeállított html-tartalom megjelenítése a film-részletekről 
            leirElem.innerHTML = filmDetailsTemplateMaker(infoFilm);
            leirElem.classList.add("dispBox");
                            
            document.querySelector(".leirasCloseBtn").onclick = function(ev) {  // ablak bezárásához
                leirElem.classList.remove("dispBox");
            }  

        } else {
            alertSK("Sikertelen az adatbázis elérése, kísérelje meg újra!");        
        }
        
    } else {    
        alertSK("Sikertelen a lekérdezés ...");            
    }
}

//**  a keresési találatok - adott filmek száma
//***********************************************
async function filmekSzama(keresettWord, keresettYear) {
    let noBreakOut;  
    let lapSzam = 0;
    let movieDB = 0;
    talalatOsszesen = 0;
    loadingShow(true,"yellow");
    do {  
        noBreakOut = false;
        lapSzam = lapSzam+1;
        let url = `https://www.omdbapi.com/?s=${encodeURI(keresettWord)}&y=${keresettYear}&page=${lapSzam.toString()}&apiKey=9606ae0f`;
        
        let responsFilm = await fetch(url);
        if (responsFilm.ok) {
            let movieList = await responsFilm.json(); 
            if (movieList.Response == "True") {
                movieDB = movieList.Search.length;
                talalatOsszesen = talalatOsszesen + movieDB;  
                if (movieDB >= 10) {         
                    noBreakOut = true;
                }
            } else {
                alertSK("Ez a keresés sikertelen, próbálja meg újra!");
            } 
        } else {
            alertSK("Ez a keresés sikertelen ...");
        }                
    } while (noBreakOut);
    
    loadingShow(false); 

    sumPage = Math.ceil(talalatOsszesen / 10);        // oldalak száma összesen
    // pagination felhelyezése az oldalra, ha indokolt
    lapozasShow();                                    // egy fülön max. 10 db film megjelenítése

    let scrollingLmnt = (document.scrollingElement || document.body);  
    scrollingLmnt.scrollTop = 0;         // hogy a lap teteje látszódjon, ne ugorjon alólra
}

//**************************
//*****   PAGINATION   *****
//**************************

//**  lapozó fülek megjelenítése
//********************************
function lapozasShow() { 
    if (sumPage > 1) {  
        // összeállított lapozósor megjelenítése az oldalon (ha a találat 10 feletti)
        lapozoSav.classList.remove("elrejtes");
        lapozoSav.innerHTML = lapozoSorTemplateMaker();    

        whichPage.classList.remove("elrejtes");
        whichPage.innerHTML = `<p><span>${aktPage}/${sumPage}</span> oldal</p>`;    

   //     document.querySelector(".pageNumbers p span").innerHTML = `${aktPage}/${sumPage}`; 
         pagesAddEvents();                     // eseménykezelők hozzárendelése a fülekhez               
         if (aktPage == "1") {
             document.querySelector(".lapozas a:first-child").focus();     // első oldal megjelölése kezdetkor
         }
    } else {
        lapozoSav.classList.add("elrejtes");
        whichPage.classList.add("elrejtes");
    }
}

// Oldalak lapozásához lapjelző-gombsor összeállítása - ha 1 lap van, nem jeleníti meg a lapozósort
//***************************************************
function lapozoSorTemplateMaker() {                         
    let maxLap = (sumPage < 10)?sumPage:(10+firstPageVisible-1);
    let lapSor = "";
    if (firstPageVisible > 1) {
        // a siteBottom-ra (üres div) hivatkozás azért van benne, hogy a lap alján maradjon
        lapSor += `<a class="prevPage" href="#siteBottom">&lt; Előző</a>`;
    }
    for (let i = firstPageVisible; i <= maxLap; i++) {
        lapSor += `<a class="page" href="#">${i}</a>`
    }  
    if ( (sumPage > 10) && ((talalatOsszesen - firstPageVisible) > 9) ) {
        lapSor += `<a class="nextPage" href="#siteBottom">Következő &gt;</a>`;
    }    
    return lapSor;
}

// lapozó fülek megjelenítése és a fülekhez eseménykezelők hozzáadása
//********************************************************************
function pagesAddEvents() {  
    document.querySelectorAll('.lapozas .page').forEach(page => page.addEventListener('click',event => {
        aktPage = event.target.textContent;
        filmsLoading(aktPage);                
         aktPageMarker();
        document.querySelector(".pageNumbers p span").innerHTML = `${aktPage}/${sumPage}`;     
      } 
    ));
    
    // következő lapok megjelenítése
    if ( (sumPage > 10) && ((sumPage - firstPageVisible) > 9) ) {
        document.querySelector('.nextPage').addEventListener('click',event => {
            firstPageVisible += 1;
            lapozasShow();           
        });  
    }      
    
    // előző lapok megjelenítése
    if (firstPageVisible > 1) {
        document.querySelector('.prevPage').addEventListener('click',event => {
            firstPageVisible -= 1;
            lapozasShow();   
        });
    } 
}

// lapozósávban az aktuális fül megjelölése
//******************************************
function aktPageMarker() {
    let lapMarker = Number(aktPage);
    document.querySelectorAll(".lapozas a").forEach(page => {
        if (Number(page.text)) {                              // csak a lapokat jelölje/színezze meg
            page.classList.remove("megjelolPage");
        }
    });  
    // csak akkor mutatja az aktuális lapot, ha a lapozás ellenére még az látható (a képernyőn van)
    if ((lapMarker - firstPageVisible) < 10) {
        document.querySelector(".lapozas a:nth-child("+(lapMarker-firstPageVisible+1)+")").classList.add("megjelolPage");
    } 
}

