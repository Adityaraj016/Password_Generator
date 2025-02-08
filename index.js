const inputSlider = document.querySelector("[data-length_slilder]");

const lengthDisplay = document.querySelector("[data-length_number]");

const passwordDisplay = document.querySelector("[data-password_display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate_button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password ="";
let passwordLength = 10;
let checkCount = 1;

inputSlider.value = passwordLength;
handleSlider();

function handleSlider(){
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        inputSlider.value = passwordLength;
    }
    else{
        passwordLength = inputSlider.value;
    }
    lengthDisplay.innerText = inputSlider.value;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100/(max-min)) + "% 100%";
    // first % will show width and second 100% will show height jo default hoga wo
}
//set strength circle color to grey
inputSlider.value = passwordLength;
inputSlider.addEventListener('input', ()=>{
    if(checkCount > inputSlider.value){
        inputSlider.value= checkCount;
    }
    handleSlider();
});

//set color of circle
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.border = `2px solid ${color}`;
    indicator.style.boxShadow = `0 0 2px 2px ${color}`;

    //shadom
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
    //When you calculate 10 - 5 + 1, you get 6. This means you’re generating a range of 6 possible values (0 to 5) before adding the min value back in. When you add min back to the result, it shifts the range appropriately.
}

function generateNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,122));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}
function generateSymbol(){
    return symbols.charAt([getRndInteger(0,symbols.length-1)]);
}

//calculate strength of password
function passwordStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied"
    }
    catch(e){
        copyMsg.innerText="Failed"
    }
    //to make copied text visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },1000);

}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

copyBtn.addEventListener("click",()=>{
    // non empty ke case me call kardo
    if(passwordDisplay.value){
        copyContent();
    }
});

//funtion to generate passwrod

generateBtn.addEventListener("click",()=>{
    ////none of the checkbox are selected

    ////remove old passwrod
    password ="";
    //displaying value
    if(checkCount == 0){
        passwordDisplay.value = password;
        indicator.style.backgroundColor = 'white';
        indicator.style.border='2px solid white';
        indicator.style.boxShadow ='0 0 10px 5px white';
        alert('Please ensure the checkbox is checked');
        return;
    }


    // //pehle jo conditions hai wo fulfill kardo
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0; i < passwordLength - funcArr.length ;i++){
        let ranIndex = getRndInteger(0, funcArr.length-1);
        password += funcArr[ranIndex]();
    }
    //password made

    //shuffle the password
    //password is global varible so, there is no eed to pass it,or if you wat ypu can pass it
    password = shufflePassword(Array.from(password));

    //display the password
    //input type ko value hi denge na, we can set innertext
    passwordDisplay.value = password;
    //display passsword strenghth
    passwordStrength();

});

//algorithm is to shuffle password, which can shuffle an array
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //Math.random will generate till 0 to (i+1)
        //if i is 9, then range is 0 Tp 10, it can even gernerate 9.99 but not 10 as 10 is exclusive
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

