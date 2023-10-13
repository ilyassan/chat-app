const msgInput = document.getElementById("message")
const sendBtn = document.getElementById("send-button")
const msgContainer = document.getElementById("chat-messages")
const toDownBtn = document.querySelector(".toDown")


let autoScroll = false
let notFirstScroll = false
msgContainer.onscroll = () =>{
    if(!autoScroll) {
        backDownBtn()
    }
};

toDownBtn.onclick = () =>{
    scrollDownMessages()
}

sendBtn.onclick = ()=>{

    if(msgInput.value != ""){
        let noSpaces = Array.from(new Set(msgInput.value.split(" ")))

        if(noSpaces.length == 1 && noSpaces.includes("")) return
        else{
            let content = msgInput.value
            socket.emit("sendMessage", {
                chat: chatId,
                content: content,
                sender: myId
            })
        }
    }
}

msgInput.onblur = ()=>{
    window.scrollTo({ top: -100, behavior:"smooth"});
}
msgInput.addEventListener("keypress", (event)=> {
    if (event.key === "Enter") {
        event.preventDefault();
    sendBtn.click();
  }
});

socket.on("newMessage", msg=>{
    
    let from;
    let member;

    if(msg.sender == myId){
        msgInput.value = ""
        from = "from-me"
    }else from = "from-him"

    if(msg.sender != myId && isGroup){
        let members = JSON.parse(document.getElementById("members").value)
        member = members.find(member => member._id == msg.sender)
    }
    
    let date = new Date()
    let hours = date.getHours()
    let minutes = String(date.getMinutes())
    let time = `${hours>12?hours%12:hours%24}:${minutes.length == 1?"0"+minutes:minutes} ${hours >= 12?"AM":"PM"}`

    if(document.querySelector(".no-messages")){
        document.querySelector(".no-messages").remove() 
    }

    if(msg.sender != myId && isGroup){
        msgContainer.innerHTML += `<div class="message groupMessage ${from}" data-time='${time}' data-name='~${member.username}'>
                                ${msg.content}
        </div>
        `
    }else{
        msgContainer.innerHTML += `<div class="message ${from}" data-time='${time}'>${msg.content}</div>`
    }
    
    scrollDownMessages()
    
})




let searchInChatBtn = document.querySelector("#searchInChat i")

searchInChatBtn.onclick = ()=>{
        let divInput = searchInChatBtn.parentElement.querySelector("div")
        let input = divInput.querySelector("input")
    if(divInput.classList.contains("d-none")){
        divInput.classList.remove("d-none")
        input.value = ""
        input.focus()
        }

        addEventListener("click", hideDivInput)
        function hideDivInput(e){
            if(e.target != divInput && e.target.parentElement != divInput && e.target != searchInChatBtn){
                divInput.classList.add("d-none")
                resetMessage()
                removeEventListener("click", hideDivInput)
            }
    }

    input.oninput = ()=>{
            let matched = []
            resetMessage()
            if(input.value !== ""){
                let messages = document.querySelectorAll(".message")
                    const searchTerm = input.value.replace(/\./g, '\\.');
                messages.forEach((message, i) =>{
                    const messageText = message.textContent;
                    const regex = new RegExp(searchTerm, 'gi');

                    // Use the regular expression to find all matches in the message text
                    const matches = messageText.match(regex);
                    
                    if (matches && matches.length > 0) {
                        matched.push(...Array(matches.length).fill(i));
                    }
                })
                matched.length != 0 ? markMatchedWords(messages, new Set(matched), searchTerm) : null
            }
            document.getElementById("matchedWords").innerHTML = `Matched ${matched.length}`
    }
}






function scrollDownMessages(behavior = "smooth"){
    autoScroll = true
    msgContainer.scrollTo({
        top: msgContainer.scrollHeight,
        behavior: behavior,
      });

      setTimeout(() => {
        autoScroll = false
      }, 100);
}



function backDownBtn() {
    if (msgContainer.scrollTop + msgContainer.clientHeight + 80 < msgContainer.scrollHeight) {
      toDownBtn.classList.remove("not-show")
      toDownBtn.classList.add("show")
      toDownBtn.style.opacity = "1"
      notFirstScroll = true
      } else {
      if(notFirstScroll){
          toDownBtn.classList.remove("show")
          toDownBtn.classList.add("not-show")
          toDownBtn.style.opacity = "0"
      }
    }
  }


  function markMatchedWords(messages, matched, value){

    matched.forEach( i =>{
        const message = messages[i]
        const contentText = message.innerText; // Get text content, not HTML
  
        // Create a regular expression to match the search term.
        const regex = new RegExp(value, 'gi');
  
        const highlightedContent = contentText.replace(regex, '<span>$&</span>');
  
        message.innerHTML = highlightedContent;
    })

}


function resetMessage(messages = false){

    if(!messages) messages = document.querySelectorAll(".message")

    messages.forEach(message =>{
        if(message.querySelector("span")){
            let spans = message.querySelectorAll("span")
            spans.forEach((span) =>{
                let text = span.textContent
                message.innerHTML = message.innerHTML.replace(`<span>${text}</span>`,text)
            })
        }
    })

    document.getElementById("matchedWords").innerHTML = `Matched 0`
}