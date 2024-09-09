let chat;

async function initializeChat() {
    try {
        console.log("Fetching model ID...");
        const response = await fetch('/get_model_id');
        const data = await response.json();
        const modelId = data.model_id;
        console.log("Model ID received:", modelId);

        console.log("Initializing WebLLM...");
        if (typeof WebLLM === 'undefined') {
            throw new Error("WebLLM is not defined. Make sure the script is loaded correctly.");
        }
        chat = await WebLLM.create({model: modelId});
        console.log("WebLLM instance created");

        console.log("Warming up the model...");
        await chat.warmup();
        console.log("Chat initialized successfully");
    } catch (error) {
        console.error("Error initializing chat:", error);
        displayErrorMessage(`Failed to initialize the chat: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    console.log("DOM loaded, initializing chat...");
    initializeChat();

    sendButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            displayMessage(message, 'user-message');
            userInput.value = '';

            try {
                if (!chat) {
                    throw new Error("Chat is not initialized yet.");
                }
                console.log("Generating response...");
                const response = await chat.generate(message);
                displayMessage(response, 'bot-message');
            } catch (error) {
                console.error("Error generating response:", error);
                displayErrorMessage(`Failed to generate a response: ${error.message}`);
            }
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});

function displayMessage(message, className) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayErrorMessage(message) {
    console.error(message);
    displayMessage(`Error: ${message}`, 'bot-message');
}
