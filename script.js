document.getElementById("send-button").addEventListener("click", sendMessage);
const userInput = document.getElementById('user-input');

// Dynamically adjust the height of the textarea based on its content
userInput.addEventListener('input', function() {
    this.style.height = 'auto'; // Reset height to auto
    this.style.height = this.scrollHeight + 'px'; // Set height to scroll height
});

async function sendMessage() {
    const userInputValue = document.getElementById("user-input").value.trim();
    if (!userInputValue) return;

    // Display the user message in the chat box
    addMessageToChat(userInputValue, 'user');
    
    // Clear the input field
    document.getElementById("user-input").value = '';

    // Send the message to the server and await the response
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: userInputValue })
    });

    const data = await response.json();
    
    // Display the bot response in the chat box
    addMessageToChat(data.output, 'bot');
}

// Function to append a message to the chat
function addMessageToChat(message, sender) {
    const chatBox = document.getElementById("chat-box");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    
    // Check if the message contains a code block (triple backticks)
    if (message.includes("```")) {
        // Format the code using extractCode function
        const formattedMessage = extractCode(message);
        messageElement.innerHTML = formattedMessage; // Insert formatted code
    } else {
        messageElement.textContent = message; // Insert plain text
    }

    chatBox.appendChild(messageElement);

    // Scroll to the bottom of the chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to extract and format code snippets
function extractCode(input) {
    const codeRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g; // Regex to find code blocks
    let formattedInput = input;
    let match;

    while ((match = codeRegex.exec(input)) !== null) {
        const language = match[1] || 'javascript'; // Get the specified language
        const codeContent = match[2];
        const highlightedCode = Prism.highlight(codeContent, Prism.languages[language], language);
        formattedInput = formattedInput.replace(match[0], `<pre><code class="language-${language}">${highlightedCode}</code></pre>`);
    }
    
    return formattedInput;
}

// Optional: Handle 'Enter' key to send messages
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();  // Prevent new line
        sendMessage();  // Call the sendMessage function
    }
});


