let path = window.location.pathname

addEventListener("click",async(e)=>{
    
    if(e.target.classList.contains("copyBtn") && again == 0){
            again = 1
            let done = document.getElementById("done")
            let text = document.getElementById("userId").textContent

            try{
                await navigator.clipboard.writeText(text)
            }catch(err){                
                const textarea = document.createElement("textarea");
                textarea.value = text;
                document.body.appendChild(textarea)
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
            }finally{
                idCopiedDone(done)
            }
            
        }
    if(e.target.classList.contains("pasteBtn")){
        if (navigator.clipboard) {
            // Read text from the clipboard
            navigator.clipboard.readText().then((text) => {
              let idInput = document.getElementsByName("idOrName")[0];
              idInput.value = text.slice(0,35);
            })
          }
    }
        
})




let again = 0

function idCopiedDone(done){
    done.classList.remove("not-visible")
    done.classList.add("show")

    let showAfter = 2 * 1000
    let repeat = 1 * 1000
    let myInterval = setInterval(() => {
        showAfter -= repeat
        if(showAfter == 0){
            done.classList.remove("show")
            done.classList.add("not-show")
            clearInterval(myInterval)
            let miniInterval = setInterval(()=>{
                done.classList.remove("not-show")
                done.classList.add("not-visible")
                again = 0
                clearInterval(miniInterval)
            },repeat - 100)
        }
    }, repeat);
}



addEventListener("load",()=>{
    if(document.querySelector(".ljjmpvbuq657ljsms")){
        let searchId = document.querySelector(".ljjmpvbuq657ljsms").value
        setTimeout(()=>{
            document.querySelector(".searchUser").value = searchId
          document.querySelector(".searchBtn").click()
        document.querySelector(".searchUser").value = ""
        },250)
    }
})

if(document.querySelector(".createGroupForm")){
    document.querySelector(".createGroupForm").addEventListener("submit",(form) =>{
        let checkBoxs = Array.from(document.querySelectorAll(".createGroupForm .form-check-input"))
        let checked = 0;
        checkBoxs.forEach((box) => box.checked?checked++:null)

        let alert = document.querySelector(".alert.h6")
        if(checked < 2){
            alert.style.display = "block"
            alert.classList.add("show")
            form.preventDefault()
        }else{
            alert.classList.remove("show")
            alert.classList.add("not-show")
            setTimeout(() => {
                alert.style.display = "none"
            }, 500);
        }
    })
}


if(document.querySelector(".fileImage")){
    let selectImage = document.querySelector(".fileImage")

    selectImage.addEventListener("change", ()=>{
        document.querySelector(".select-image").classList.add("disabledSelectImage")
    })
}


if(document.querySelectorAll("input[type='password']")){
    let inputPasswords = document.querySelectorAll("input[type='password']")
    let seePasswords = document.querySelectorAll(".seePassword")
    let hidePasswords = document.querySelectorAll(".hidePassword")

    
    inputPasswords.forEach((input,i) =>{
        let show = true
        input.addEventListener("keyup",()=>{
            if(input.value.length > 0){
                if(show){
                    seePasswords[i].style.display = "block"
                    show = false
                }
                seePasswords[i].onclick = ()=>{
                        seePasswords[i].style.display = "none"
                        hidePasswords[i].style.display = "block"
                        input.type = "text"
                        hidePasswords[i].onclick = ()=>{
                            seePasswords[i].style.display = "block"
                            hidePasswords[i].style.display = "none"
                            input.type = "password"
                        }
                    }
                }else{
                    seePasswords[i].style.display = "none"
                    hidePasswords[i].style.display = "none"
                    show = true
                    input.type = "password"
                }
          })
        })
}


if(path === "/signup" || path === "/login"){

    let from = path.slice(1)
    let emailInput = document.querySelector("[name='email']")
    let usernameInput = document.querySelector("[name='username']") || {value:false}


    if(sessionStorage.getItem("dataSend") && sessionStorage.getItem("submit")){
        let data = JSON.parse(sessionStorage.getItem("dataSend"))
        if(data.from === from){
            usernameInput.value = data.username
            emailInput.value = data.email
        }else sessionStorage.clear()
        sessionStorage.removeItem("submit")
    }

    document.querySelector("form").addEventListener("submit",()=>{
        let email = emailInput.value
        let username = usernameInput.value
        sessionStorage.setItem("dataSend",JSON.stringify({from,username,email}))
        sessionStorage.setItem("submit","yes")
    })


}else sessionStorage.clear()



if(path === "/signup" || path === "/login" || path === "/profile/search"){
    let inputs = document.querySelectorAll("input")
    inputs.forEach((input) => {
        input.oninput = () =>{
            if(document.querySelector("p.alert")){
                document.querySelector("p.alert").remove()
            }
        }
    })
}