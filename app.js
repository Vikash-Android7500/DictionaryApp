const input = document.querySelector("#input");
const SerachBtn = document.querySelector(".btn");
const NotFound = document.querySelector(".NotFound");
const DefBox = document.querySelector(".Def");
const AudioBox = document.querySelector(".Audio");
const LoadingBox = document.querySelector(".Loading");
const Toast = document.querySelector("#snackbar");

// Api Url and Key
const ApiKey = "288de837-5822-4d08-8215-ce0a743f7f32";
const Url = "https://www.dictionaryapi.com/api/v3/references/learners/json/";

SerachBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // old data crear
{
  AudioBox.innerHTML = "";
  NotFound.innerHTML = "";
  DefBox.innerHTML = "";
  LoadingBox.style.display = "none";
}

  // get input data
  let word = input.value.trim();
  // call Api get data
  if (word === "") {
     return showToast("Word Required !");
  } else {
    getData(word);
  }
});

// Function now accepts `word` as a parameter
async function getData(word) {
  try {
    LoadingBox.style.display = "block";
    const response = await fetch(
      `${Url}${word}?key=${ApiKey}`
    );
    const data = await response.json();
    console.log(data);

    //   empty result
    if (!data.length) {
      LoadingBox.style.display = "none";
      NotFound.innerText = "No result found";
    }

    if (typeof data[0] === "string") {
      LoadingBox.style.display = "none";
      const heading = document.createElement("h3");
      heading.innerText = "Did you mean ?";
      NotFound.appendChild(heading);

      data.forEach((element) => {
        const suggnetion = document.createElement("span");
        suggnetion.classList.add("suggnetion");
        suggnetion.innerText = element;
        NotFound.appendChild(suggnetion);
      });
      return 0;
    }

    //   Result found
    LoadingBox.style.display = "none";
    const defination = data[0].shortdef[0];
    DefBox.innerText = defination;

    // Sound
    const AudioSound = data[0].hwi.prs[0].sound.audio;
    if (AudioSound) {
      renderSound(AudioSound);
    }

    function renderSound(AudioSound) {
      const SubFolder = AudioSound.charAt(0);
      const SoundSrc = `https://media.merriam-webster.com/soundc11/${SubFolder}/${AudioSound}.wav?key=${ApiKey}`;

      const Aud = document.createElement("audio");
      Aud.src = SoundSrc;
      Aud.controls = true;
      AudioBox.appendChild(Aud);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Toast function
//show Toast
function showToast(content = "Unknown error") {

  Toast.innerHTML = content;

  Toast.classList.add("show");

   setTimeout(() => {

     Toast.classList.remove("show");

   }, 1500);
}
