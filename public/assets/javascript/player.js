console.log("Hej")
let params = new URLSearchParams(window.location.search);
const trackNumber = params.get("track_number");

var music = document.querySelector(".music");
var btn = document.getElementById("play-pause");
var btnSkip = document.getElementById("skip-song");
var btnLastSong = document.getElementById("last-song");
var progressBar = document.getElementById("progress-bar");
var progressDot = document.querySelector(".dot");

function audioDuration() {
  var audioDuration = music.duration;

  var minutes = "0" + Math.floor(audioDuration / 60);
  var seconds = "0" + Math.floor(audioDuration - minutes * 60);
  var songLength = minutes.substr(-2) + ":" + seconds.substr(-2);

  document.querySelector(".song__length").textContent = songLength;
}

function tooglePlayPause() {
  if (music.paused) {
    btn.className = "buttons-pause";
    music.play();
    audioDuration();
  } else {
    btn.className = "buttons-play";
    music.pause();
  }
}

music.onended = function() {
  btn.className = "buttons-play";
};

btnSkip.onclick = function() {
  let track = trackNumber;
  let track_Number = ++track;
  if (trackNumber == 49) {
    btnSkip.href = `/?track_number=0`;
  } else {
    btnSkip.href = `/?track_number=${track_Number}`;
  }
};

btnLastSong.onclick = function() {
  let track = trackNumber;
  let track_Number = --track;
  if (trackNumber == 0) {
    btnLastSong.href = `/?track_number=49`;
  } else {
    btnLastSong.href = `/?track_number=${track_Number}`;
  }
};

btn.onclick = function() {
  tooglePlayPause();
};

music.addEventListener("timeupdate", updateProgressBar, false);

function updateProgressBar() {
  var percentage = Math.floor((100 / music.duration) * music.currentTime);
  progressBar.value = percentage;

  var audioCurrentTime = music.currentTime;

  var minutes = "0" + Math.floor(audioCurrentTime / 60);
  var seconds = "0" + Math.floor(audioCurrentTime - minutes * 60);
  var dur = minutes.substr(-2) + ":" + seconds.substr(-2);
  document.querySelector(".song__time").innerText = dur;
  progressDot.style.left = percentage - 5 + "%";
}

// function song__length() {
//   const seconds = music.duration.toFixed(0);
//   const h = Math.floor(seconds / 3600);
//   const m = Math.floor((seconds % 3600) / 60);
//   const s = seconds % 60;
//   //   return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
//   //     .filter(a => a)
//   //     .join(":");

//   console.log(
//     [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
//       .filter(a => a)
//       .join(":")
//   );
// }

// song__length();

progressBar.addEventListener("click", seek);

function seek(e) {
  var percent = e.offsetX / this.offsetWidth;
  music.currentTime = percent * music.duration;
  e.target.value = Math.floor(percent / 100);
}

let base64Token = window.btoa(
  "65b5a46dffa441a4a68af4d29e6dd2e4:8426778dd5b942cfa1f8cbb311818b39"
);

function post() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    withCredentials: true,
    headers: {
      Authorization: "Basic " + base64Token,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  })
    .then(resp => resp.json())
    .then(function(data) {
      let key = data.access_token;
      sessionStorage.setItem("refreshtoken", key);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getfeatured() {
  let refreshtoken = sessionStorage.getItem("refreshtoken");
  fetch(`https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + refreshtoken
    }
  })
    .then(resp => resp.json())
    .then(function(data) {
      if (data.statusCode !== "200") {
        post();
      }

      document
        .querySelector(".music")
        .setAttribute("src", data.items[trackNumber].track.preview_url);
      document
        .querySelector(".coverart")
        .setAttribute("src", data.items[trackNumber].track.album.images[0].url);
      document
        .querySelector(".artist__img")
        .setAttribute("src", data.items[trackNumber].track.album.images[2].url);
      document.querySelector(".title__feat").innerText =
        data.items[trackNumber].track.album.name;
      document.querySelector(".title__song").innerText =
        data.items[trackNumber].track.album.artists[0].name;

      if (data.items[trackNumber].track.preview_url === null) {
        document
          .querySelector(".music")
          .setAttribute("src", "/assets/images/SeinfeldTheme.mp3");
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

getfeatured();
