const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json())
    .then(json => displayLessons(json.data))
}

const loadLevelWord = (id) => {
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
        console.log(word);
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="card shadow-lg bg-white text-black w-auto ">
                <div class=" p-10 items-center text-center">
                    <p class="text-2xl font-semibold">${word.word === null ? "No Word Found" : word.word}</p>
                    <p><span class="text-red-400">Meaning</span> / <span class="text-green-900">Pronounciation</span></p>
                    <p class="text-xl font-semibold"><span class="text-sky-400">${word.meaning === null ? "অর্থ পাওয়া যায়নি" : word.meaning}</span> / <span class="text-blue-900">${word.pronunciation === null ? "উচ্চারণ পাওয়া যায়নি" : word.pronunciation}</span></p>
                    <div class="items-center flex justify-between mt-5">
                        <button class="btn btn-circle"><i class="fa-solid fa-circle-info" style="color: rgb(119, 114, 129);"></i></button>
                        <button class="btn btn-circle"><i class="fa-solid fa-volume-high" style="color: rgb(119, 114, 129);"></i></button>
                    </div>
                </div>
            </div>
        `
        wordContainer.appendChild(card);
    });
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