const input = document.querySelector('input');
const list = document.querySelector('.cities');
const form = document.querySelector('form');

localStorage.setItem("apiKey", EncryptStringAES("f8629dea111911718fa387bb71cac116"));

let lang = 'en';

document.querySelector('.flags').addEventListener('click', (e)=>{
    if (e.target.classList.contains('turkish-flag')){
        lang = 'tr';
        console.log(lang);
    } else if (e.target.classList.contains('american-flag')){
        lang = 'en';
        console.log(lang);
    }
});

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    axiosCaller();
    console.log('deneme');
})

    const axiosCaller = async ()=>{
        const apiKey2 = DecryptStringAES(localStorage.getItem("apiKey"));
        let city = input.value;
        let language = "en";
        const unit = 'metric';
        
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=${lang}&appid=${apiKey2}`;
    
        try {
            const res = await axios(url);
            const iconUrl = `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`;
            console.log(res);
            const cityList = document.querySelectorAll(".cities li");
            console.log(cityList);
            if (cityList.length > 0){
                let cityIsInTheCards = false;
                cityList.forEach((item) => {
                    if (item.querySelector('span').innerText.toLowerCase() == res.data.name.toLowerCase()){
                        document.querySelector('.msg').innerText = `There is already ${res.data.name} in the cards!`;
                        cityIsInTheCards = true;
                        input.value = '';
                        setTimeout(()=>{
                            document.querySelector('.msg').innerText = '';
                        }, 5000);
                    }
                })
                 if (cityIsInTheCards){
                    return;
                 }
            }

            const cityCard = document.createElement("li");
            cityCard.classList.add("city");
            const cityCardInnerHTML =  `
            <h2 class="city-name" data-name="${res.data.name}, ${res.data.sys.country}">
            <span>${res.data.name}</span>
            <sup>${res.data.sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(res.data.main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${res.data.weather[0].description}</figcaption>
        </figure>`;
            cityCard.innerHTML = cityCardInnerHTML;
            list.append(cityCard);
            form.reset();

        } catch (error) {
            document.querySelector('.msg').innerText = `Looks like there is a problem. (${error})`;
            setTimeout(()=>{
                document.querySelector('.msg').innerText = '';
            }, 5000);
            return;
        }
    }
 
    