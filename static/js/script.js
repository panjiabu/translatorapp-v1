const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const selectTag = document.querySelectorAll("select");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector("button");
const icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
    for(const country_code in countries) {
        let selected;
        if(id == 0 && country_code == "en-GB") {
            selected = "selected";
        } else if(id == 1 && country_code == "id-ID") {
            selected = "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); // adding options tag inside select tag
    }
});

exchangeIcon.addEventListener("click", () => {
    // exchanging textarea and select tag values
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;

});

translateBtn.addEventListener("click", () => {
    let text = fromText.value;
    let translateFrom = selectTag[0].value; // getting fromSelect tag value
    let translateTo = selectTag[1].value; // getting toSelect tag value
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}}`;
    // fetching api response and returning it with parsing into js obj
    // and in another then method receiving that obj
    fetch(apiURL).then(res => res.json().then(data => {
        // console.log(data);
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    }));
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
                window.alert("Text has been copied!");
            } else {
                navigator.clipboard.writeText(toText.value);
                window.alert("Text has been copied!");
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value; // setting utterance language to fromSelect tag value
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value; // setting utterance language to toSelect tag value
            }
            speechSynthesis.speak(utterance); // speak the passed utterance
        }
    });
});