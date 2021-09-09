let keyboard = document.querySelector('.keyboard-base');
let wrapper = document.querySelector('.wrapper');
let keys = keyboard.querySelectorAll('.key');
let capsKeys = keyboard.querySelectorAll('.caps');
let signs = keyboard.querySelectorAll('.sign');
let input = document.querySelector('#inputField'); input.focus();
let fetchForm = document.querySelector('#fetchField');
let cursor = document.querySelector('#cursor');
let label = document.querySelector('.label');
let capsFlag = 0;
let shiftFlag = 0;
let currentButton;
let inputIterator = 0;
let fetchIterator = 0;
let errorIterator = 0;
let time;

let signArray = ['!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', '/', ','];
let originalArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', '.'];
let commands = ['Control', 'Shift', 'Alt', 'Backspace', 'Space', 'Delete', 'Tab', 'CapsLock', 'Unidentified'];



fetchForm.addEventListener('click', () => { 
    input.value='';
    input.focus();
    fetchForm.classList.remove('fetchEffect');
    label.classList.remove('hide');
    label.style.top = wrapper.getBoundingClientRect().top + 5 + 'px';
    //fetchForm.value='Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: современная методология разработки выявляет срочную потребность инновационных методов управления процессами. Приятно, граждане, наблюдать, как сторонники тоталитаризма в науке освещают чрезвычайно интересные особенности картины в целом, однако конкретные выводы, разумеется, своевременно верифицированы. А также тщательные исследования конкурентов, инициированные исключительно синтетически, смешаны с не уникальными данными до степени совершенной неузнаваемости, из-за чего возрастает их статус бесполезности.';
    fetchForm.value='';
    getText();
    time = Date.now();
    errorIterator = 0;
    input.classList.remove('final');
})

document.addEventListener('keydown', function (event) {
    event.preventDefault();

    if (event.key == 'Escape' || input.value.length == fetchForm.value.length){
        finish();
        return;
    }

    let button = Array.from(keys).filter(function (item) {
        return (item.textContent == event.key);
    });
    if (button[0]) {
        if (event.key == 'CapsLock')
            button[0].classList.toggle('activeKey');
        else{
            button[0].classList.add('activeKey');
        }
    }
    if (event.key == 'Shift')
        shiftFlag = 1;
    caps(event);
    if (commands.indexOf(event.key) == -1){
        inputChar(event);
    }
    applyCommands(event);
    checkHotkeys(event);
    checkChars(event);
});

document.addEventListener('keyup', function (event) {
    let button = Array.from(keys).filter(function (item) {
        return (item.textContent == event.key);
    });
    if (button[0]) {
        if (event.key != 'CapsLock') {
            button[0].classList.remove('activeKey');
            if (event.key == 'Shift')
            shiftFlag = 0;
            caps(event);
        }  
    }
});

keyboard.addEventListener('mousedown', function(event){
    event.preventDefault();
    let button = Array.from(keys).filter(function (item) {
        return (item.textContent == event.target.textContent);
    });
    if (button[0]) {
        if (event.target.textContent == 'CapsLock' || event.target.textContent == 'Shift')
            button[0].classList.toggle('activeKey');
        else{
            button[0].classList.add('activeKey');
            currentButton = button[0];
        }
    }
    caps(event);
    if (commands.indexOf(event.key) == -1 && event.target.textContent.length == 1){
        inputChar(event);
        input.focus();
    }
    applyCommands(event);
});

keyboard.addEventListener('mouseup', function(event){
    let button = Array.from(keys).filter(function (item) {
        return (item.textContent == event.target.textContent);
    });
    if (button[0]) {
        if (event.target.textContent != 'CapsLock' && event.target.textContent != 'Shift') {
            button[0].classList.remove('activeKey');
            currentButton.classList.remove('activeKey');
            caps(event);
        }  
    }
});

function caps(event) {
    if (event.target.textContent == 'Shift') {
        shiftToggler();
    }

    if(event.key == 'CapsLock' || event.target.textContent == 'CapsLock'){
        capsToggler();
    }
    
    if (shiftFlag == 1 && capsFlag == 1) {
        for (let key of capsKeys)
            key.textContent = key.textContent.toLowerCase();
            transformSigns();
    }
    else if (shiftFlag == 1 && capsFlag == 0){
        for (let key of capsKeys) {
            key.textContent = key.textContent.toUpperCase();
            transformSigns();
        }
    }
    else if (shiftFlag == 0 && capsFlag == 1){
        for (let key of capsKeys)
            key.textContent = key.textContent.toUpperCase();
            transformSignsBack();
    }
    else {
        for (let key of capsKeys) {
            key.textContent = key.textContent.toLowerCase();
            transformSignsBack();
        }
    }
}
function capsToggler() {
    if (capsFlag == 0)
        capsFlag = 1;
    else
        capsFlag = 0;
}

function shiftToggler() {
    if (shiftFlag == 0)
        shiftFlag = 1;
    else
        shiftFlag = 0;
}

function transformSigns(){
    let i = 0;
    for (const sign of signs) {
        sign.textContent = signArray[i];
        i++;
    }
}

function transformSignsBack(){
    let i = 0;
    for (const sign of signs) {
        sign.textContent = originalArray[i];
        i++;
    }
}

function applyCommands(event){
    let command = event.key || event.target.textContent;
    let start = input.selectionStart;
    let end = input.selectionEnd;
    switch(command){
        case 'Backspace':
            if (start != end){
                input.value = input.value.slice(0, start) + input.value.slice(end);
                input.setSelectionRange(start,start);
            }
            else{
                input.value = input.value.slice(0, start-1) + input.value.slice(end);
                input.setSelectionRange(start-1,start-1);
            }
            input.classList.remove('errorBorder');
            break;
        case 'Tab':
            input.value += '\t';
            break;
        case 'Delete':
            if (start != end){
                input.value = input.value.slice(0, start) + input.value.slice(end);
                input.setSelectionRange(start,start);
            }
            else if (end < input.value.length && start == end){
                input.value = input.value.slice(0, start) + input.value.slice(end+1);
                input.setSelectionRange(start,start);
            }
            break;
    }
}

function inputChar(event){
    let char = event.key || event.target.textContent;
    let start = input.selectionStart;
    let end = input.selectionEnd;
    if (start == input.value.length){
        input.value += char;
        input.blur();
        input.focus();
    } 
    else {
        input.value = input.value.slice(0, start) + char + input.value.slice(end);
        input.setSelectionRange(start+1,start+1);
    }
}

function checkHotkeys(event){
    if (event.code == 'KeyA' && event.ctrlKey){
        input.value = input.value.slice(0,input.value.length-1);
        input.setSelectionRange(0,input.selectionEnd)
    }
    if (event.key == 'Backspace' && event.ctrlKey){
        input.value = input.value.slice(0,input.value.lastIndexOf(' ')+1);
    }
}

function checkChars(event){
    if (fetchForm.value != 'CHECK YOU TYPING SPEED' && commands.indexOf(event.key) == -1){
        if(input.value[input.value.length-1] != fetchForm.value[input.value.length-1]){
            input.classList.add('errorBorder');
            errorIterator++;
            setTimeout(() => {
                input.classList.remove('errorBorder');
            }, 100);
        }           
    }
}

function finish(){
    let length = input.value.length;
    let newTime = Date.now();
    let difference = new Date(newTime - time);
    let seconds = difference.getSeconds();
    label.classList.add('hide');
    input.classList.add('final');
    input.value = 'Потраченное время: ' + seconds + ' секунды | Скорость набора текста: ' + (length/seconds*60).toFixed(2) + ' символов в минуту | Ошибок: ' + (errorIterator) + ' ('+ ((errorIterator)/length*100).toFixed(2) + '%)';
    fetchForm.classList.add('fetchEffect');
    fetchForm.value = 'CHECK YOUR TYPING SPEED';
}

async function getText() {
    let response = await fetch('https://fish-text.ru/get?format=json&number=1');
    if (response.ok) {
        let json = await response.json();
        fetchForm.value = json.text;
    } else {
        console.log("Ошибка HTTP: " + response.status);
    }
}

