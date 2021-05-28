//************************************************************************
//    Hivása:    alertSK("üzenet szöveg","#fff","#39e600");              *
// saját üzenet megjelenítése adott betű és háttérszínnel                *
//************************************************************************

//jQuery beimportálása, ha nincs - az üzenet hossz-számítása miatt szükséges
if ( !document.querySelector("script[src~='jquery.com']") ) {
   let jQueryScript = document.createElement('script');  
   jQueryScript.setAttribute("src","https://code.jquery.com/jquery-3.5.1.slim.min.js");
   document.head.appendChild(jQueryScript);
}

function alertSK(uzenet="Nincs üzenet!", colorBetu="white", colorHatter="#cc0000") {

  // üzenet hosszának meghatározása pixelben - megerőszakolva
    let calcDiv = document.createElement("div");
    calcDiv.setAttribute("id","textDiv");
    calcDiv.style ="display:none;";
    document.body.appendChild(calcDiv); 
    let segedDiv = document.getElementById("textDiv");
    segedDiv.innerHTML = `${uzenet}`;
      let uziHossz = Math.floor($("#textDiv").width());    // ehhez kellett a jQuery, mert csak ebben van a width() fgv.
    segedDiv.remove();
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
        <span onclick = bezarUzenet(this) onmouseover=closeHover(this,"lightgrey") onmouseout=closeHover(this,["${colorHatter}"])
                style="position:absolute; top:0; right:0; font-size:1.5rem; color:#000; cursor:pointer">&nbsp;&times;&nbsp;</span>
        <br>
        <p style="text-align:center; margin-top: 1rem; line-height:1.5rem;">${uzenet}</p>  
        <br>       
      </div>
    `    
    document.querySelector("#uziBox").innerHTML = message;
    
}

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

function loadingShow(onoff,szin="black") {
    if (onoff!==undefined) {
        if (onoff) {
            let waitBtn = document.createElement("button");
            waitBtn.setAttribute("id","loadingButton");
            waitBtn.style =`border:none; background:none; color:${szin}; position:absolute; top: 38vh; left: 48vw; font-size:2.4rem; z-index:5000;`  
            waitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            //waitBtn.innerHTML = `<i class="fas fa-circle-o-notch fa-spin"></i>`;
            // waitBtn.innerHTML = `<i class="fas fa-refresh fa-spin"></i>`;            
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

//**************************************************************
//             kövi rutin                                      *
//**************************************************************