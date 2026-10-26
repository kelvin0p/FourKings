
const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

const conversation = [];

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    messageInput.value = "";
    sendButton.disabled = true;

    const loading = addMessage("FourKings is thinking...", "bot");

    conversation.push({
        role: "user",
        content: message
    });

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                conversation
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "AI request failed");
        }

        loading.textContent = data.reply;

        conversation.push({
            role: "assistant",
            content: data.reply
        });
    } catch (error) {
        loading.textContent = "Error: " + error.message;
        conversation.pop();
    } finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
});

function addMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = "message " + sender;
    bubble.textContent = text;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
    return bubble;
}

