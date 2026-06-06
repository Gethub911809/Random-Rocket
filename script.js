let nasaDataImg;
let nasaDataVideo;
let nasaDataAudio;
fetch("https://images-api.nasa.gov/search?q=Rocket%20Launch&media_type=image")
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
    generatePhoto(data)
  })
  .catch((error) => console.error("FETCH ERROR:", error));
fetch("https://images-api.nasa.gov/search?q=Rocket%20Launch&media_type=video")
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
    generateVideo(data)
  })
  .catch((error) => console.error("FETCH ERROR:", error));

fetch("https://images-api.nasa.gov/search?q=Rocket%20Launch&media_type=audio")
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
    generateAudio(data)
  })
  .catch((error) => console.error("FETCH ERROR:", error));

function generatePhoto() {
    
    const hits = nasaDataImg.collection.metadata.total_hits;
    const pageNum = Math.floor(Math.random() * (hits/100))+1;
    const photo = nasaDataImg.collection.items[Math.floor(Math.random() * nasaDataImg.collection.items.length)];
    const photoContainer = document.getElementById("photo-container");

    const descriptionContainer = document.getElementById("description-container-photo");
    photoContainer.innerHTML = `<img id="photo" src="${photo.links[0].href}" alt="Rocket Photo">`;
    descriptionContainer.innerHTML = `<p>${photo.data[0].description}</p>`;
}
async function generateVideo() {
    
    const hits = nasaDataVideo.collection.metadata.total_hits;
    const pageNum = Math.floor(Math.random() * (hits/100))+1;
    const Video = nasaDataVideo.collection.items[Math.floor(Math.random() * nasaDataVideo.collection.items.length)];
    const VideoContainer = document.getElementById("video-container");

    console.log(Video.href);

    const assetResponse = await fetch(
        Video.href.replace("http://", "https://")
    );
    const assets = await assetResponse.json();

    const mp4 = assets.find(file => file.endsWith("~orig.mp4"));
    console.log(mp4);
    VideoContainer.innerHTML = `
    <video id="video" src="${mp4}" alt="Rocket Video" controls>
        <source src="${mp4}" type="video/mp4">
    </video>`;
    console.log(mp4);
    const descriptionContainer = document.getElementById("description-container-video")
    descriptionContainer.innerHTML = `<p>${Video.data[0].description}</p>`;
}
async function generateAudio() {
    const hits = nasaDataAudio.collection.metadata.total_hits;
    const pageNum = Math.floor(Math.random() * (hits/100))+1;
    const Audio = nasaDataAudio.collection.items[Math.floor(Math.random() * nasaDataAudio.collection.items.length)];
    const AudioContainer = document.getElementById("audio-container");

    const assetResponse = await fetch(
        Audio.href.replace("http://", "https://")
    );
    const assets = await assetResponse.json();

    const mp3 = assets.find(file => file.endsWith(".mp3"));
    AudioContainer.innerHTML = `<audio id="audio" src="${mp3}" alt="Rocket Audio" controls></audio>`;
    
    const descriptionContainer = document.getElementById("description-container-audio");
    descriptionContainer.innerHTML = `<p>${Audio.data[0].description}</p>`;
}