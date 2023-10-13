let peer = new Peer()
let peerId;

peer.on('open', id => {
	peerId = id
});

let otherUserPeerId;

let callInterval;

let overlay = document.getElementById("callOverLay")
let calllay = document.getElementById("calling")
let noCall = document.getElementById("noCall")

socket.on("declinecall", ()=>{
    Array.from(overlay.children).forEach(child => {
        child.classList.add("d-none")
    });
    let declineCallOverlay = document.getElementById("declineCall")
    let declineMeBtn = document.getElementById("declineMeBtn")

    declineCallOverlay.classList.remove("d-none")
    hideOverlay(declineMeBtn)
})

socket.on('endCall', ()=>{
    let endCallBtn = document.getElementById("endCall")
    const otherUserAudio = document.getElementById('otherUserAudio');
    
    hideOverlay(endCallBtn,"click")
    stopStream(otherUserAudio)
})

function showCall(stream){
    Array.from(overlay.children).forEach(child => {
        child.classList.add("d-none")
    });
    let answerCallOverlay = document.getElementById("answerCall")
    let endCallBtn = document.getElementById("endCall")
    answerCallOverlay.classList.remove("d-none")
    
    const otherUserAudio = document.getElementById('otherUserAudio');
    const parent = otherUserAudio.parentElement
    otherUserAudio.srcObject = stream;
    parent.appendChild(otherUserAudio);
    otherUserAudio.play()

    callTimer()
    
    endCallBtn.onclick = () => {
        hideOverlay(endCallBtn, "click")
        stopStream(otherUserAudio)
        socket.emit("stopCall", chatId)
    }
}


function hideOverlay(btn,x){
    btn.onclick = ()=>{
        overlay.classList.remove("fshow")
        overlay.classList.add("not-show")
        setTimeout(() =>overlay.classList.add("d-none"), 1000);
        btn.parentElement.classList.add("d-none")
    }
    if(x == "click") btn.click()
}

function stopStream(audio){
    let stream = audio.srcObject;
    let tracks = stream.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });

  audio.srcObject = null;
  clearInterval(callInterval)
  resetTimer()
}


function callTimer(){

    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    var totalSeconds = 0;
    callInterval = setInterval(setTime, 1000);
    
    function setTime() {
      ++totalSeconds;
      secondsLabel.innerHTML = pad(totalSeconds % 60);
      minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }
    
    function pad(val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    }
} 

function resetTimer(){
    document.getElementById("minutes").innerHTML = "0";
    document.getElementById("seconds").innerHTML = "00";
}