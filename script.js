
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

const chatInput = document.getElementById("messageInput");
const legacySendButton = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");

async function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) return;

    // Display the user's message
    const userMessage = document.createElement("p");
    userMessage.textContent = "You: " + message;
    chatMessages.appendChild(userMessage);

    chatInput.value = "";
    legacySendButton.disabled = true;

    const loading = document.createElement("p");
    loading.textContent = "Nova AI is thinking...";
    chatMessages.appendChild(loading);

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        loading.remove();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        const aiMessage = document.createElement("p");
        aiMessage.textContent = "Nova AI: " + data.reply;
        chatMessages.appendChild(aiMessage);

    } catch (error) {
        loading.textContent =
            "Error: " + error.message +
            ". Check that the AI server is running.";
    } finally {
        legacySendButton.disabled = false;
        chatInput.focus();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

legacySendButton.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

