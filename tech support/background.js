// background.js

// IMPORTANT: You need to include the Supabase client library. 
// For a Chrome Extension, you might download the library and include it locally,
// or use a bundler like Webpack to manage dependencies.
// For simplicity in this example, we'll assume `createClient` is available.
// In a real scenario, you'd add something like:
// import { createClient } from 'https://esm.sh/@supabase/supabase-js';
// or include it via a script tag in a background HTML page (Manifest V2) 
// or bundle it (Manifest V3).

// Placeholder for Supabase client initialization
// Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// This is a simplified placeholder. In a real extension, you'd import the library.
// For now, we'll mock createClient if it's not defined.
const supabase = typeof createClient !== 'undefined' ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : {
  functions: {
    invoke: async (functionName, options) => {
      console.log(`Mock Supabase Function Invoke: ${functionName}`, options);
      // Simulate an API call to your Edge Function
      // In a real scenario, this would be a fetch call to your Supabase Edge Function URL
      // For example: fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, { ... });
      return { data: { solution: `Mock solution for ${options.body.issue.url}` }, error: null };
    }
  }
};

chrome.runtime.onInstalled.addListener(() => {
  console.log("Tech Support Extension Installed");
});

// Function to store issues in local storage and attempt solution matching
async function storeIssue(issue) {
  let { issues } = await chrome.storage.local.get("issues");
  if (!issues) {
    issues = [];
  }
  issues.push(issue);
  await chrome.storage.local.set({ issues });
  console.log("Issue stored:", issue);

  // Attempt to get a solution using Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('match-solution', {
      body: { issue: issue },
    });

    if (error) {
      console.error("Error invoking Supabase function:", error);
    } else if (data && data.solution) {
      console.log("Solution found:", data.solution);
      // Here you would store the solution with the issue or update UI
      // For now, let's just log it.
      // You might want to send this solution back to the content script or popup
      chrome.tabs.sendMessage(issue.tabId, {
        type: "solutionFound",
        issueId: issue.id,
        solution: data.solution
      }).catch(e => console.warn("Could not send solution to content script:", e));
    }
  } catch (e) {
    console.error("Failed to call Supabase function:", e);
  }
}

// Listen for messages from content scripts (development approach)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "networkIssue") {
    const issue = {
      id: Date.now(),
      url: message.url,
      method: message.method || "GET",
      statusCode: message.statusCode,
      type: message.type || "main_frame",
      timeStamp: Date.now(),
      tabId: sender.tab.id
    };
    
    storeIssue(issue);
    sendResponse({ success: true, issueId: issue.id });
  }
  
  if (message.type === "getIssues") {
    chrome.storage.local.get("issues", (result) => {
      sendResponse({ issues: result.issues || [] });
    });
    return true; // Keep message channel open for async response
  }
});

// Note: webRequest permission removed to avoid Google review
// For production, consider using:
// 1. Content script-based monitoring on specific pages
// 2. User-initiated network testing
// 3. Limited scope to specific domains
// 4. Alternative APIs that don't require broad permissions


