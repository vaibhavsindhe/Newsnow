const apiKey = 's698aQ5tKvx-X9wqY9zQkgqFREkIwgoXK7N2pGLewzM';  
const apiUrl = `https://api.newscatcherapi.com/v2/latest_headlines?`;  
let country='countries=IN';
let language='&lang=en';
let topic="";

window.addEventListener("load",()=>fetchNews(country,topic,language));

function reloade(){
  window.location.reload();
}
function fetchNews(country,topic,language){
    fetch(apiUrl+country+topic+language, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey
          
        }
      })
        .then(response => response.json())
        .then(data => {
          // Process the data returned by the API
           bindData(data.articles);
        })
        .catch(error => {
          console.error('Error:', error);
        });
}


function bindData(articles){
   const cardsContainer=document.getElementById("cards-container");
   const newscardTemplate=document.getElementById("template-news-card");

   cardsContainer.innerHTML=""; /* this is because when all cards are successfully created there after again cards are created frombigining*/

   articles.forEach(article =>{
       if(!article.media){
        return;
       }
       const cardClone=newscardTemplate.content.cloneNode(true);
       fillDataInCard(cardClone,article);
       cardsContainer.appendChild(cardClone);
   });
}


function fillDataInCard(cardClone,article){
    const newsImg=cardClone.querySelector("#news-image");
    const newsTitle=cardClone.querySelector("#news-title");
    const newsSource=cardClone.querySelector("#news-source");
    const newsDesc=cardClone.querySelector("#news-desc");


    newsImg.setAttribute("src",article.media);
    newsTitle.innerHTML=article.title;
    newsDesc.innerHTML=article.summary;

    const data=new Date(article.published_date).toLocaleString("en-Us",{
      timeZone:"Asia/Jakarta",
    });
    
    newsSource.innerHTML=`${article.rights}  . ${data}`;
    cardClone.firstElementChild.addEventListener("click",()=>{
      window.open(article.link);
    });
}


//nav links

let curSelectednav=null;
function onNavItemClick(id){
   topic=`&topic=${id}`;
  fetchNews(country,topic,language);                
  const navItem=document.getElementById(id);
  if(curSelectednav!=null){
     curSelectednav.classList.remove('active');
     curSelectednav=navItem;
     curSelectednav.classList.add('active');
  }
  else{
     curSelectednav=navItem;
     curSelectednav.classList.add('active');
  }
}



//search

const searchButton=document.getElementById("search-button");
const searchText=document.getElementById("search-text");

searchButton.addEventListener("click",()=>{
  const querry=searchText.value;
  if(querry==""){
    return;
  }
  else{
    if(curSelectednav!=null){
      curSelectednav.classList.remove('active');
      curSelectednav=null;
    }
    search(querry);
  }
});

function search(querry){
  const searchUrl=`https://api.newscatcherapi.com/v2/search?q=${querry}&${country}${language}`;
  fetch(searchUrl, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey
      
    }
  })
    .then(response => response.json())
    .then(data => {
       bindData(data.articles);
    })
    .catch(error => {
      console.error('Error:', error);
    });

}


//tools

let dark=document.querySelector(".dark-mode");
let backgroundcolor=0;
dark.addEventListener("click",activateDarkmode);

function activateDarkmode(){
  let navbackground=document.querySelector("nav");
  let bodybackground=document.querySelector("body");
  if(backgroundcolor==0){
        backgroundcolor=1;
        navbackground.style.backgroundColor="black";
        bodybackground.style.backgroundColor="black";
        bodybackground.style.color="white";
        tuneContainer.style.backgroundColor="black";
        dark.classList.add("active");
  }
  else{
        backgroundcolor=0;
        navbackground.style.backgroundColor="white";
        bodybackground.style.backgroundColor="white";
        bodybackground.style.color="#183b56";
        tuneContainer.style.backgroundColor="white";
        dark.classList.remove("active");

 }
  
}

let tune=document.querySelector(".tune");
tune.addEventListener("click",activateTune);
const tuneContainer=document.querySelector(".tune-container");
let activated=true;
function activateTune(){
   if(activated){
      activated=false;   
      tuneContainer.classList.add("slidedown");
      tuneContainer.classList.remove("slideup");
      tune.classList.add("active");
  
   }
   else{
      activated=true;
      tuneContainer.classList.remove("slidedown");
      tuneContainer.classList.add("slideup");
      tune.classList.remove("active");

   }
}

const form=document.querySelector("form");
   form.addEventListener("submit", function(event) {
      event.preventDefault();

      //language
      const selectedLanguage = document.querySelector("input[name='language']:checked");
      //country
      const selectedCountry=document.querySelector("input[name=country]:checked");
      
      if(selectedCountry!=null && selectedLanguage!=null){
        country=`countries=${selectedCountry.id}`;
        language=`&lang=${selectedLanguage.id}`;
      }
      fetchNews(country,topic,language)
      
  });