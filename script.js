let nasaDataImg;
let nasaDataVideo;
let nasaDataAudio;
let search = "Rocket Launch";
function fetchData(){
    if(search == ""){
        search = "Rocket Launch";
    }
    fetch(`https://images-api.nasa.gov/search?q=${search.replace(" ", "%20")}&media_type=image`)
        .then((response) => {
            if (response.ok) {
            return response.json();
            } else {
            throw new Error("NETWORK RESPONSE ERROR");
            }
        })
        .then(data => {
            nasaDataImg = data;
            console.log(data);
            generatePhoto(false)
    })
    .catch((error) => console.error("FETCH ERROR:", error));
    fetch(`https://images-api.nasa.gov/search?q=${search.replace(" ", "%20")}&media_type=video`)
        .then((response) => {
            if (response.ok) {
            return response.json();
            } else {
            throw new Error("NETWORK RESPONSE ERROR");
            }
        })
        .then(data => {
            nasaDataVideo = data;
            console.log(data);
            generateVideo(false)
        })
        .catch((error) => console.error("FETCH ERROR:", error));

    fetch(`https://images-api.nasa.gov/search?q=${search.replace(" ", "%20")}&media_type=audio`)
        .then((response) => {
            if (response.ok) {
            return response.json();
            } else {
            throw new Error("NETWORK RESPONSE ERROR");
            }
        })
        .then(data => {
            nasaDataAudio = data;
            console.log(data);
            generateAudio(false)
        })
        .catch((error) => console.error("FETCH ERROR:", error));
}
let photoHystory = [];
let photoIndex = -1;
function generatePhoto(scroll = true) {
    
    const hits = nasaDataImg.collection.metadata.total_hits;
    const pageNum = Math.floor(Math.random() * (hits/100))+1;
    //Getting photo and data
    const photo = nasaDataImg.collection.items[Math.floor(Math.random() * nasaDataImg.collection.items.length)];
    photoHystory.push(photo);
    photoIndex++;
    displayPhoto(photo,scroll);
}
function displayPhoto(photo,scroll) {
    const photoContainer = document.getElementById("photo-container");

    const descriptionContainer = document.getElementById("description-container-photo");
    photoContainer.innerHTML = `<img id="photo" src="${photo.links[0].href}" alt="Rocket Photo">`;
    descriptionContainer.innerHTML = `<p>${photo.data[0].description}</p>`;
    if(scroll){
        photoContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function previousPhoto() {
    if (photoIndex > 0) {
        photoIndex--;
        displayPhoto(photoHystory[photoIndex],true);
    }
}

let videoHystoryMP4 = [];
let videoHystoryData = [];
let videoIndex = -1;
async function generateVideo(scroll = true) {
    
    const hits = nasaDataVideo.collection.metadata.total_hits;
    const pageNum = Math.floor(Math.random() * (hits/100))+1;
    //Getting chunck of Video data/meta data and unspecified MP4
    const Video = nasaDataVideo.collection.items[Math.floor(Math.random() * nasaDataVideo.collection.items.length)];
    
    //Getting the MP4 File
    const assetResponse = await fetch(
        Video.href.replace("http://", "https://")
    );
    const assets = await assetResponse.json();
    const mp4 = assets.find(file => file.endsWith("~orig.mp4"));
    videoHystoryMP4.push(mp4);
    videoHystoryData.push(Video);
    videoIndex++;
    displayVideo(Video,mp4,scroll);
}
function displayVideo(Video,mp4,scroll) {
    const VideoContainer = document.getElementById("video-container");
    VideoContainer.innerHTML = `
    <video id="video" src="${mp4}" alt="Rocket Video" controls>
        <source src="${mp4}" type="video/mp4">
    </video>`;
    const descriptionContainer = document.getElementById("description-container-video")
    descriptionContainer.innerHTML = `<p>${Video.data[0].description}</p>`;
    if(scroll){
        VideoContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function previousVideo() {
    if (videoIndex > 0) {
        videoIndex--;
        displayVideo(videoHystoryData[videoIndex], videoHystoryMP4[videoIndex],true);
    }
}

let audioHystoryMP3 = [];
let audioHystoryData = [];
let audioIndex = -1;
let fullAudioDescription;
async function generateAudio(scroll = true) {
    const hits = nasaDataAudio.collection.metadata.total_hits;
    const pageNum = Math.floor(Math.random() * (hits/100))+1;
    //Getting chunck of Audio data/meta data and unspecified MP3
    const Audio = nasaDataAudio.collection.items[Math.floor(Math.random() * nasaDataAudio.collection.items.length)];

    const assetResponse = await fetch(
        Audio.href.replace("http://", "https://")
    );
    const assets = await assetResponse.json();
    //Getting the MP3 File
    const mp3 = assets.find(file => file.endsWith(".mp3"));
    audioHystoryMP3.push(mp3);
    audioHystoryData.push(Audio);
    audioIndex++;
    displayAudio(Audio, mp3,scroll);

}
function displayAudio(Audio, mp3,scroll) {
    const AudioContainer = document.getElementById("audio-container");

    AudioContainer.innerHTML = `<audio id="audio" src="${mp3}" alt="Rocket Audio" controls></audio>`;

    const descriptionContainer = document.getElementById("description-container-audio");
    fullAudioDescription = Audio.data[0].description;
    if ((fullAudioDescription.length) < 1200) {
        descriptionContainer.innerHTML = `<p>${fullAudioDescription}</p>`;
    } else {
        const slice = fullAudioDescription.slice(0,1000).trim() + "...";
        descriptionContainer.innerHTML = `
        <p>${slice}</p>
        <a href="#description-container-audio" onclick="showMoreDescription()">Read More</a>`;
    }
    if(scroll){
        AudioContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function previousAudio() {
    if (audioIndex > 0) {
        audioIndex--;
        displayAudio(audioHystoryData[audioIndex], audioHystoryMP3[audioIndex],true);
    }
}
function showMoreDescription() {
    const descriptionContainer = document.getElementById("description-container-audio");
    descriptionContainer.innerHTML = `<a href="#description-container-audio" onclick="showLessDescription()">Read Less</a>
    <p>${fullAudioDescription}</p>
    <a href="#description-container-audio" onclick="showLessDescription()">Read Less</a>`;
}
function showLessDescription() {
    const descriptionContainer = document.getElementById("description-container-audio");
    const slice = fullAudioDescription.slice(0,1000).trim() + "...";
    descriptionContainer.innerHTML = `
    <p>${slice}</p>
    <a href="#description-container-audio" onclick="showMoreDescription()">Read More</a>`;
}
function userSearch(){
    search = document.getElementById("search-box").value;
    fetchData();
    console.log(search);
}