// chat_widget.js

function displayMessage(sender, message, type = "user") {
  const chatMessages = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", type);
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");
  const chatMessages = document.getElementById("chat-messages");

  // Load initial issues from storage
  chrome.storage.local.get("issues", (data) => {
    if (data.issues && data.issues.length > 0) {
      data.issues.forEach(issue => {
        displayMessage("System", `Detected issue: ${issue.method} ${issue.url} - Status: ${issue.statusCode}`, "system");
        if (issue.solution) {
          displayMessage("AI Assistant", `Solution: ${issue.solution}`, "ai");
        }
      });
    } else {
      displayMessage("System", "No issues detected recently. How can I help you?", "system");
    }
  });

  chatSend.addEventListener("click", () => {
    const message = chatInput.value;
    if (message.trim() !== "") {
      displayMessage("You", message);
      chatInput.value = "";

      // Send message to background script for processing (e.g., AI query)
      chrome.runtime.sendMessage({
        type: "chatMessage",
        message: message
      });
    }
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      chatSend.click();
    }
  });

  // Listen for messages from the background script (e.g., new issues, solutions)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "issueDetected") {
      displayMessage("System", `Detected issue: ${request.details.method} ${request.details.url} - Status: ${request.details.statusCode}`, "system");
    } else if (request.type === "solutionFound") {
      // Find the issue in storage and update it with the solution
      chrome.storage.local.get("issues", (data) => {
        const updatedIssues = data.issues.map(issue => 
          issue.id === request.issueId ? { ...issue, solution: request.solution } : issue
        );
        chrome.storage.local.set({ issues: updatedIssues }, () => {
          displayMessage("AI Assistant", `Solution for issue ${request.issueId}: ${request.solution}`, "ai");
        });
      });
    } else if (request.type === "aiResponse") {
      displayMessage("AI Assistant", request.response, "ai");
    }
  });
});


