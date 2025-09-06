// popup.js - Enhanced Tech Support Assistant

document.addEventListener("DOMContentLoaded", async () => {
  const openChatButton = document.getElementById("openChat");
  const issueListDiv = document.getElementById("issueList");
  const chatContainer = document.getElementById("chatContainer");
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendButton");
  const chatMessages = document.getElementById("chatMessages");

  // OpenAI API configuration
  const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; // Replace with your actual API key
  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

  // Enhanced state management
  let chatHistory = [];
  let isChatOpen = false;
  let userTechLevel = 'intermediate'; // beginner, intermediate, advanced
  let currentTroubleshootingSession = null;
  let performanceBaselines = {};

  // Initialize the assistant
  initializeAssistant();

  // Toggle chat interface
  openChatButton.addEventListener("click", () => {
    if (!isChatOpen) {
      openChat();
    } else {
      closeChat();
    }
  });

  async function initializeAssistant() {
    // Load user preferences and performance data
    const { userPrefs, performanceData } = await chrome.storage.local.get(['userPrefs', 'performanceData']);
    
    if (userPrefs) {
      userTechLevel = userPrefs.techLevel || 'intermediate';
    }
    
    if (performanceData) {
      performanceBaselines = performanceData;
    }
    
    // Start proactive monitoring
    startProactiveMonitoring();
  }

  function startProactiveMonitoring() {
    // Monitor for critical issues every 30 seconds
    setInterval(async () => {
      await checkForCriticalIssues();
    }, 30000);
  }

  async function checkForCriticalIssues() {
    const { issues } = await chrome.storage.local.get("issues");
    if (!issues || issues.length === 0) return;

    const recentIssues = issues.filter(issue => 
      Date.now() - issue.timeStamp < 300000 // Last 5 minutes
    );

    // Check for critical patterns
    const criticalPatterns = analyzeCriticalPatterns(recentIssues);
    
    if (criticalPatterns.length > 0) {
      showCriticalAlert(criticalPatterns);
    }
  }

  function analyzeCriticalPatterns(issues) {
    const patterns = [];
    
    // Check for repeated failures
    const urlFailures = {};
    issues.forEach(issue => {
      const domain = new URL(issue.url).hostname;
      urlFailures[domain] = (urlFailures[domain] || 0) + 1;
    });

    // Identify critical patterns
    Object.entries(urlFailures).forEach(([domain, count]) => {
      if (count >= 3) {
        patterns.push({
          type: 'repeated_failures',
          domain,
          count,
          severity: 'high',
          message: `${domain} has failed ${count} times in the last 5 minutes`
        });
      }
    });

    // Check for cascading failures (multiple 5xx errors)
    const serverErrors = issues.filter(issue => issue.statusCode >= 500);
    if (serverErrors.length >= 2) {
      patterns.push({
        type: 'server_cascade',
        count: serverErrors.length,
        severity: 'critical',
        message: `${serverErrors.length} server errors detected - possible infrastructure issue`
      });
    }

    return patterns;
  }

  function showCriticalAlert(patterns) {
    // Create notification for critical issues
    const alertDiv = document.createElement('div');
    alertDiv.className = 'critical-alert';
    alertDiv.innerHTML = `
      <div class="alert-header">ALERT: Critical Network Issues Detected</div>
      <div class="alert-content">
        ${patterns.map(p => `<div class="alert-item ${p.severity}">${p.message}</div>`).join('')}
      </div>
      <button onclick="this.parentElement.remove()" class="alert-dismiss">Dismiss</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => alertDiv.remove(), 10000);
  }

  function openChat() {
    chatContainer.style.display = 'block';
    openChatButton.textContent = 'Close Chat';
    isChatOpen = true;
    
    // Enhanced welcome with practical troubleshooting guidance
    const greeting = getPracticalGreeting();
    addChatMessage('AI Assistant', greeting, 'assistant');
    
    // Show recent network issues with actionable guidance
    showActionableNetworkIssues();
    
    // Offer practical troubleshooting paths
    offerPracticalHelp();
  }

  function getPracticalGreeting() {
    const timeOfDay = new Date().getHours();
    let timeGreeting = '';
    
    if (timeOfDay < 12) timeGreeting = 'Good morning';
    else if (timeOfDay < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    return `${timeGreeting}! I'm your practical network troubleshooting assistant. 

I'll guide you through:

- Console Navigation - Step-by-step browser DevTools guidance
- Practical Workflows - Real troubleshooting steps you can follow
- Issue Analysis - How to interpret what you're seeing
- Actionable Solutions - Specific commands and steps to try

What network issue are you experiencing? I'll walk you through the console and give you specific steps to troubleshoot it.`;
  }

  async function showActionableNetworkIssues() {
    const { issues } = await chrome.storage.local.get("issues");
    if (issues && issues.length > 0) {
      const recentIssues = issues.slice(-5);
      const categorizedIssues = categorizeIssues(recentIssues);
      
      let issuesText = '**Recent Network Issues Detected:**\n\n';
      
      // Group by category with actionable guidance
      Object.entries(categorizedIssues).forEach(([category, categoryIssues]) => {
        if (categoryIssues.length > 0) {
          issuesText += `**${category}:** ${categoryIssues.length} issue(s)\n`;
          categoryIssues.forEach(issue => {
            const statusText = issue.statusCode === 0 ? 'Network Error' : `HTTP ${issue.statusCode}`;
            const severity = getIssueSeverity(issue);
            issuesText += `  • ${severity} ${issue.method} ${issue.url}\n    Status: ${statusText}\n`;
          });
          issuesText += '\n';
        }
      });
      
      issuesText += '**Next Steps:** I can guide you through:\n';
      issuesText += '1. Opening browser DevTools (F12)\n';
      issuesText += '2. Navigating to the Console tab\n';
      issuesText += '3. Finding specific error messages\n';
      issuesText += '4. Interpreting the results\n';
      issuesText += '5. Taking action to fix the issues\n\n';
      issuesText += 'What would you like me to help you with first?';
      
      addChatMessage('AI Assistant', issuesText, 'assistant');
    }
  }

  function categorizeIssues(issues) {
    const categories = {
      'Client Errors (4xx)': [],
      'Server Errors (5xx)': [],
      'Network Failures': [],
      'Timeouts': [],
      'Other': []
    };

    issues.forEach(issue => {
      if (issue.statusCode === 0) {
        categories['Network Failures'].push(issue);
      } else if (issue.statusCode >= 400 && issue.statusCode < 500) {
        categories['Client Errors (4xx)'].push(issue);
      } else if (issue.statusCode >= 500) {
        categories['Server Errors (5xx)'].push(issue);
      } else {
        categories['Other'].push(issue);
      }
    });

    return categories;
  }

  function getIssueSeverity(issue) {
    if (issue.statusCode === 0) return '[CRITICAL]';
    if (issue.statusCode >= 500) return '[CRITICAL]';
    if (issue.statusCode >= 400) return '[WARNING]';
    return '[INFO]';
  }

  function offerPracticalHelp() {
    setTimeout(() => {
      addChatMessage('AI Assistant', `**Practical Troubleshooting Paths:** I can guide you through:

1. **Console Navigation** - How to open DevTools and find errors
2. **Network Tab Analysis** - Understanding request/response details
3. **Error Interpretation** - What different status codes mean
4. **Step-by-Step Fixes** - Specific actions to resolve issues
5. **Prevention Strategies** - How to avoid similar problems

**Quick Start:** Try asking me something like:
- "How do I open the browser console?"
- "What does HTTP 500 mean?"
- "How do I check network requests?"
- "Walk me through troubleshooting this error"

I'll give you specific, actionable steps!`, 'assistant');
    }, 2000);
  }

  function closeChat() {
    chatContainer.style.display = 'none';
    openChatButton.textContent = 'Open Chat Assistant';
    isChatOpen = false;
  }

  // Enhanced message handling with practical guidance
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addChatMessage('You', message, 'user');
    chatInput.value = '';

    // Show practical typing indicator
    const typingDiv = addChatMessage('AI Assistant', 'Analyzing your request and preparing practical guidance...', 'assistant', 'typing');

    try {
      // Enhanced context gathering with practical focus
      const context = await buildPracticalContext(message);
      
      // Smart message routing based on content
      const response = await routePracticalMessage(message, context, typingDiv);
      
      // Update chat history
      updateChatHistory(message, response);
      
      // Offer follow-up practical assistance
      offerFollowUpPracticalHelp(message, response);

    } catch (error) {
      console.error('Error in practical message handling:', error);
      typingDiv.remove();
      addChatMessage('AI Assistant', 'Sorry, I encountered an error. Let me try a different approach...', 'error');
    }
  }

  async function buildPracticalContext(message) {
    const { issues } = await chrome.storage.local.get("issues");
    const recentIssues = issues ? issues.slice(-10) : [];
    
    // Enhanced context focused on practical troubleshooting
    let context = `You are a practical network troubleshooting assistant who provides SPECIFIC, ACTIONABLE guidance. Your expertise includes:

**Core Approach:**
- ALWAYS give step-by-step instructions users can follow immediately
- ALWAYS explain HOW to do something, not just what to do
- Focus on console navigation and practical DevTools usage

**Specific Skills:**
- Browser DevTools navigation (F12, Console, Network tabs)
- HTTP status code interpretation and troubleshooting
- Console error message analysis and resolution
- Network request/response debugging
- Step-by-step troubleshooting workflows

**User Context:**
- Tech Level: ${userTechLevel}
- Current Session: ${currentTroubleshootingSession ? 'Active troubleshooting' : 'New session'}

**Recent Network Issues:** `;
    
    if (recentIssues.length > 0) {
      const categorized = categorizeIssues(recentIssues);
      Object.entries(categorized).forEach(([category, categoryIssues]) => {
        if (categoryIssues.length > 0) {
          context += `\n${category}: ${categoryIssues.length} issue(s)`;
          categoryIssues.slice(0, 3).forEach(issue => {
            const statusText = issue.statusCode === 0 ? 'Network Error' : `HTTP ${issue.statusCode}`;
            context += `\n  - ${issue.method} ${issue.url} (${statusText})`;
          });
        }
      });
    }
    
    context += `\n\n**INSTRUCTIONS:** 
1. Provide specific, actionable steps
2. Include exact console commands and navigation paths
3. Explain WHAT to look for and HOW to interpret it
4. Give users concrete actions they can take right now
5. Use numbered lists and clear formatting`;
    
    return context;
  }

  async function routePracticalMessage(message, context, typingDiv) {
    // Check if this is a console navigation request
    if (isConsoleNavigationRequest(message)) {
      return await handleConsoleNavigationRequest(message, context, typingDiv);
    }
    
    // Check if this is a troubleshooting request
    if (isTroubleshootingRequest(message)) {
      return await handlePracticalTroubleshootingRequest(message, context, typingDiv);
    }
    
    // Check if this is a general help request
    if (isGeneralHelpRequest(message)) {
      return await handleGeneralHelpRequest(message, context, typingDiv);
    }
    
    // Default to practical AI response
    return await getPracticalAIResponse(message, context, typingDiv);
  }

  function isConsoleNavigationRequest(message) {
    const consoleKeywords = ['console', 'devtools', 'f12', 'developer tools', 'browser console', 'open console', 'find error'];
    return consoleKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  function isTroubleshootingRequest(message) {
    const troubleshootingKeywords = ['fix', 'solve', 'troubleshoot', 'error', 'problem', 'issue', 'broken', 'not working', 'how to'];
    return troubleshootingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  function isGeneralHelpRequest(message) {
    const helpKeywords = ['help', 'what', 'how', 'explain', 'understand', 'mean', 'guide'];
    return helpKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  async function handleConsoleNavigationRequest(message, context, typingDiv) {
    // Enhanced console navigation context
    const consoleContext = context + `\n\n**Console Navigation Mode:** You are now in console navigation mode. Provide EXACT step-by-step instructions for opening DevTools, navigating tabs, and finding specific information. Include keyboard shortcuts, menu paths, and visual cues.`;
    
    const response = await getPracticalAIResponse(message, consoleContext, typingDiv);
    
    // Add console navigation session info
    if (!currentTroubleshootingSession) {
      currentTroubleshootingSession = {
        id: Date.now(),
        startTime: new Date(),
        steps: [],
        currentStep: 0,
        mode: 'console_navigation'
      };
    }
    
    currentTroubleshootingSession.steps.push({
      step: currentTroubleshootingSession.steps.length + 1,
      question: message,
      answer: response,
      timestamp: new Date(),
      mode: 'console_navigation'
    });

    return response;
  }

  async function handlePracticalTroubleshootingRequest(message, context, typingDiv) {
    // Start a practical troubleshooting session
    currentTroubleshootingSession = {
      id: Date.now(),
      startTime: new Date(),
      steps: [],
      currentStep: 0,
      mode: 'practical_troubleshooting'
    };

    // Enhanced troubleshooting context
    const troubleshootingContext = context + `\n\n**Practical Troubleshooting Mode:** You are now in practical troubleshooting mode. Provide SPECIFIC, ACTIONABLE steps that users can follow immediately. Include exact commands, console navigation, and concrete actions.`;
    
    const response = await getPracticalAIResponse(message, troubleshootingContext, typingDiv);
    
    // Add troubleshooting session info
    currentTroubleshootingSession.steps.push({
      step: 1,
      question: message,
      answer: response,
      timestamp: new Date(),
      mode: 'practical_troubleshooting'
    });

    return response;
  }

  async function handleGeneralHelpRequest(message, context, typingDiv) {
    // Add general help context
    const helpContext = context + `\n\n**General Help Mode:** Focus on explaining concepts clearly and providing practical examples. Always include "how to" steps and actionable guidance.`;
    
    return await getPracticalAIResponse(message, helpContext, typingDiv);
  }

  async function getPracticalAIResponse(message, context, typingDiv) {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: context },
          ...chatHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 1200,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  function updateChatHistory(message, response) {
    chatHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    );

    // Keep only last 15 messages for better context
    if (chatHistory.length > 15) {
      chatHistory = chatHistory.slice(-15);
    }
  }

  function offerFollowUpPracticalHelp(message, response) {
    // Analyze the conversation and offer relevant follow-up
    setTimeout(() => {
      const followUpSuggestions = generatePracticalFollowUpSuggestions(message, response);
      if (followUpSuggestions.length > 0) {
        addChatMessage('AI Assistant', `**Next Steps & Follow-up:**\n\n${followUpSuggestions.join('\n')}`, 'assistant');
      }
    }, 1000);
  }

  function generatePracticalFollowUpSuggestions(message, response) {
    const suggestions = [];
    
    // Check if this was a console navigation session
    if (currentTroubleshootingSession && currentTroubleshootingSession.mode === 'console_navigation') {
      suggestions.push('**Continue Console Navigation:** Would you like me to guide you to the next step in the console?');
      suggestions.push('**Find Specific Errors:** I can help you locate and interpret specific error messages.');
      suggestions.push('**Network Tab Analysis:** Let me show you how to analyze network requests and responses.');
    }
    
    // Check if this was a troubleshooting session
    if (currentTroubleshootingSession && currentTroubleshootingSession.mode === 'practical_troubleshooting') {
      suggestions.push('**Continue Troubleshooting:** Would you like me to guide you through the next troubleshooting step?');
      suggestions.push('**Test the Fix:** Let me help you verify if the solution worked.');
      suggestions.push('**Prevention Tips:** I can show you how to avoid this issue in the future.');
    }
    
    // General practical suggestions
    suggestions.push('**Ask for Specific Steps:** If you need more detailed instructions, just ask!');
    suggestions.push('**Console Commands:** I can show you specific console commands to run.');
    suggestions.push('**Visual Guidance:** I can guide you through the browser interface step-by-step.');
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  // Enhanced message display
  function addChatMessage(sender, message, type, className = '') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type} ${className}`;
    
    // Enhanced message formatting
    const formattedMessage = formatMessage(message);
    
    messageDiv.innerHTML = `
      <div class="message-sender">${sender}</div>
      <div class="message-content">${formattedMessage}</div>
      <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
  }

  function formatMessage(message) {
    // Convert markdown-style formatting to HTML
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  // Event listeners
  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Enhanced issue display with practical guidance
  await displayPracticalIssues();
});

async function displayPracticalIssues() {
  const { issues } = await chrome.storage.local.get("issues");
  if (issues && issues.length > 0) {
    const categorizedIssues = categorizeIssues(issues);
    
    Object.entries(categorizedIssues).forEach(([category, categoryIssues]) => {
      if (categoryIssues.length > 0) {
        const categoryHeader = document.createElement('h4');
        categoryHeader.textContent = `${category} (${categoryIssues.length})`;
        issueListDiv.appendChild(categoryHeader);
        
        categoryIssues.forEach(issue => {
          const issueElement = document.createElement("p");
          const statusText = issue.statusCode === 0 ? 'Network Error' : `HTTP ${issue.statusCode}`;
          const severity = getIssueSeverity(issue);
          issueElement.innerHTML = `
            <span class="issue-severity">${severity}</span>
            <span class="issue-time">[${new Date(issue.timeStamp).toLocaleTimeString()}]</span>
            <span class="issue-method">${issue.method}</span>
            <span class="issue-url">${issue.url}</span>
            <span class="issue-status">${statusText}</span>
          `;
          issueListDiv.appendChild(issueElement);
        });
      }
    });
  } else {
    issueListDiv.textContent = "No network issues detected recently.";
  }
}

// Helper functions
function categorizeIssues(issues) {
  const categories = {
    'Client Errors (4xx)': [],
    'Server Errors (5xx)': [],
    'Network Failures': [],
    'Timeouts': [],
    'Other': []
  };

  issues.forEach(issue => {
    if (issue.statusCode === 0) {
      categories['Network Failures'].push(issue);
    } else if (issue.statusCode >= 400 && issue.statusCode < 500) {
      categories['Client Errors (4xx)'].push(issue);
    } else if (issue.statusCode >= 500) {
      categories['Server Errors (5xx)'].push(issue);
    } else {
      categories['Other'].push(issue);
    }
  });

  return categories;
}

function getIssueSeverity(issue) {
  if (issue.statusCode === 0) return '[CRITICAL]';
  if (issue.statusCode >= 500) return '[CRITICAL]';
  if (issue.statusCode >= 400) return '[WARNING]';
  return '[INFO]';
}


