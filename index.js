function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);

  const voices = speechSynthesis.getVoices();

  utterance.voice = voices[1]; 

  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json())
    .then(json => displayLessons(json.data))
}

const manageSpinner = (status) => {
    if(status == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else{
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
}

const loadWordDetail = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
}

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("detailsContainer");
    detailsBox.innerHTML = `
            <div class="my-2">
              <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines" style="color: rgb(55, 61, 53);"></i>: ${word.pronunciation})</h2>
            </div>
            <div class="my-2">
              <h2 class="text-xl font-bold">Meaning</h2>
              <p>${word.meaning}</p>
            </div>
            <div class="my-2">
              <h2 class="text-xl font-bold">Example</h2>
              <p>${word.sentence}</p>
            </div>
            <div class="my-2">
              <h2 class="text-xl font-bold">সমার্থক শব্দ গুলো</h2>
              <span class="btn rounded-lg">${word.synonyms[0]}</span>
              <span class="btn rounded-lg">${word.synonyms[1]}</span>
              <span class="btn rounded-lg">${word.synonyms[2]}</span>
            </div>
          
    `;
    document.getElementById("word_modal").showModal();
    
}

const loadLevelWord = (id) => {
    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then(res => res.json())
    .then(data => {
        removeActive();
        const clickBtn = document.getElementById(`lessonBtn-${id}`)
        clickBtn.classList.add("active") 
        displayLevelWord(data.data)
    })
}

const removeActive = () =>{
    const lessonButtons = document.querySelectorAll(".lessonBtn")
    lessonButtons.forEach(btn => btn.classList.remove("active"))
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length == 0) {
        wordContainer.innerHTML = `
          <div class="text-center col-span-full rounded-md bg-gray-200 py-20">
            <img src="assets/alert-error.png" alt="" class=" mx-auto">
            <h3 class="text-xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</h3>
            <h1 class="text-3xl font-semibold">নেক্সট Lesson এ যান</h1>
          </div>
        `
    }

    words.forEach((word) =>{
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="card shadow-lg bg-white text-black w-auto ">
                <div class=" p-10 items-center text-center">
                    <p class="text-2xl font-semibold">${word.word === null ? "No Word Found" : word.word}</p>
                    <p><span class="text-red-400">Meaning</span> / <span class="text-green-900">Pronounciation</span></p>
                    <p class="text-xl font-semibold"><span class="text-sky-400">${word.meaning === null ? "অর্থ পাওয়া যায়নি" : word.meaning}</span> / <span class="text-blue-900">${word.pronunciation === null ? "উচ্চারণ পাওয়া যায়নি" : word.pronunciation}</span></p>
                    <div class="items-center flex justify-between mt-5">
                        <button onclick="loadWordDetail(${word.id})" class="btn btn-circle"><i class="fa-solid fa-circle-info" style="color: rgb(119, 114, 129);"></i></button>
                        <button onclick="pronounceWord('${word.word}')" class="btn btn-circle"><i class="fa-solid fa-volume-high" style="color: rgb(119, 114, 129);"></i></button>
                    </div>
                </div>
            </div>
        `
        wordContainer.appendChild(card);
    });
    manageSpinner(false)
}

const displayLessons = (lessons) => {

    //1. get container

   const levelContainer = document.getElementById("level-container");
   levelContainer.innerHTML = "";

   //2. get into all lessons

   for (let lesson of lessons){
     //3 create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lessonBtn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" id="lesson-btn" class="lessonBtn btn btn-outline btn-primary"><i
              class="fa-solid fa-book-open"
              style="color: rgb(79, 9, 222)"
            ></i> Lesson - ${lesson.level_no}</button>
    `
    //4 append child
    levelContainer.appendChild(btnDiv)
   }

   

}

loadLessons();

document.getElementById("btn-search").addEventListener('click', () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
        const allWords = data.data;
        
        const filterWords = allWords.filter (word => word.word.toLowerCase().includes(searchValue));

        displayLevelWord(filterWords);
        
    })
})