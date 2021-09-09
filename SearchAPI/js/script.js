let wrapper = document.querySelector('#ansWrapper');
let searchField = document.querySelector('#inputField');
let btn = document.querySelector('#btnSearch');
let backLink = document.querySelector('#back');
let forwardLink = document.querySelector('#forward');
let SEARCH = searchField.value;

let request = {
    'cx': '0feda4ea9cbd4332a',
    'key': 'AIzaSyAUo4Jr7dfSjjDxphYAkM4BRtPtPB7XAlo',
    'q': SEARCH,
    'num': 5,
    'start': 0,
}

function checklinks(){
    if (request.start >= 10){
        backLink.className = 'activeLink';
    } else backLink.className = 'disableLink';
    
    if (request.start == 90){
        forwardLink.className = 'disableLink';
    }
}

function loadClient() {
    gapi.client.setApiKey('AIzaSyAUo4Jr7dfSjjDxphYAkM4BRtPtPB7XAlo');
    return gapi.client.load('https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest')
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
}

function getArr(data){
    let searchArr = [];
    let iterator = 0;
    for (let item of data.result.items){
        let searchResult = {};
        searchResult.name = item.title;
        searchResult.linkTo = item.formattedUrl;
        if(item.pagemap.cse_image[0].src){
            searchResult.image = item.pagemap.cse_image[0].src;
        }
        searchResult.snippet = item.htmlSnippet;
        searchArr.push(searchResult);
        iterator++;
        if (iterator == 9) break;
    }
    console.log(searchArr);
    return searchArr;
}

function fillHTML(data){
    for (let item of data){
        let div = document.createElement('div');
        div.classList.add('ans')

        let img = document.createElement('img');
        let title = document.createElement('a');
        let link = document.createElement('a');
        let subs = document.createElement('p');

        img.src=item.image;
        img.alt='pic';
        title.id='h2';
        title.textContent = item.name;
        title.href=item.linkTo;
        link.href=item.linkTo;
        link.textContent=item.linkTo;
        subs.innerHTML=item.snippet;

        img.onerror = () => {
            img.src="img/default.jpg";
        }

        div.appendChild(img);


        let divWrap = document.createElement('div');
        divWrap.appendChild(title);
        divWrap.appendChild(link);
        divWrap.appendChild(subs);

        div.appendChild(divWrap);
        wrapper.appendChild(div);
    }
    console.dir(wrapper);
}

function clearElement(elementToClear){
    elementToClear.innerHTML='';
    console.log(elementToClear + 'очищен');
}

function linkToggler(elementToToggle){
    if (elementToToggle.available == true){
        elementToToggle.available = false;
        elementToToggle.classList.add('disableLink');
        elementToToggle.classList.remove('activeLink');
    } else{
        elementToToggle.available = true;
        elementToToggle.classList.remove('disableLink');
        elementToToggle.classList.add('activeLink');
    }
}

window.onload = loadClient;

btn.addEventListener("click", () => {
        if(searchField.value.length > 0){
        clearElement(wrapper);
        request.q = searchField.value;
        request.start = 0;
        execute();
    }
        else {
            return;
        }
    });
btn.addEventListener("click", () => {
    btn.classList.toggle('clickButton');
    forwardLink.className = 'activeLink';
});

forwardLink.addEventListener("click", () => {
    if (forwardLink.className != 'disableLink'){
        request.start += 10;
        if (request.start == 90)
            return;
        if(request.start == 10)
            backLink.className = 'activeLink';
        clearElement(wrapper);
        checklinks();
        execute();
        console.log('Должно было запуститься');
    }
});

backLink.addEventListener("click", () => {
    if (backLink.className != 'disableLink'){
        request.start -= 10;
        if (request.start == 10){
            return;
        }
        clearElement(wrapper);
        checklinks();
        execute();
        console.log('Должно было запуститься');
    }
});


function execute() {  
    return gapi.client.search.cse.list(request).then(function(response) {
        let data = getArr(response);
        fillHTML(data);
        btn.removeEventListener('click', execute);
        console.log(response);
    },function(err) {console.error('Execute error', err); });
}
gapi.load('client');

