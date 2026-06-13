const settingsBtn = document.getElementById("settingsBtn");
const modal = document.getElementById("settingsModal");

settingsBtn.onclick = () => {
    modal.style.display = "block";
};

function closeSettings(){
    modal.style.display = "none";
}

function saveApiKey(){
    const key = document.getElementById("apiKeyInput").value;
    localStorage.setItem("gemini_api_key", key);
    alert("API Key Saved!");
}

async function sendMessage(){

    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if(!message) return;

    addMessage("You", message, "user");

    input.value = "";

    const apiKey = localStorage.getItem("gemini_api_key");

    if(!apiKey){
        addMessage("Bot",
        "Please add your Gemini API Key in Settings.",
        "bot");
        return;
    }

    try{

        const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                contents:[
                    {
                        parts:[
                            {
                                text:message
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response.";

        addMessage("Bot", reply, "bot");

    }catch(error){
        addMessage("Bot",
        "Error connecting to Gemini.",
        "bot");
    }
}

function addMessage(sender,text,className){

    const chatBox = document.getElementById("chatBox");

    const div = document.createElement("div");
    div.className = `message ${className}`;
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
