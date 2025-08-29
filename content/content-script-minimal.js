// MINIMAL TEST - Just console logs and a simple alert
console.log('🚨 MINIMAL TEST: Content script loaded at', new Date().toISOString());

// Try to create a simple element
try {
  const testDiv = document.createElement('div');
  testDiv.id = 'minimal-test-div';
  testDiv.textContent = 'MINIMAL TEST DIV - ' + new Date().toLocaleTimeString();
  testDiv.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: red;
    color: white;
    padding: 10px;
    z-index: 999999;
    font-family: Arial;
    font-size: 14px;
  `;
  
  document.body.appendChild(testDiv);
  console.log('✅ MINIMAL TEST: Div created and added to page');
  
  // Add a click handler
  testDiv.addEventListener('click', () => {
    alert('MINIMAL TEST: Clicked at ' + new Date().toLocaleTimeString());
    console.log('✅ MINIMAL TEST: Click handler worked');
  });
  
} catch (error) {
  console.error('❌ MINIMAL TEST: Error creating div:', error);
}

// Try to send a message to background
try {
  chrome.runtime.sendMessage({action: 'minimalTest', timestamp: Date.now()}, (response) => {
    console.log('✅ MINIMAL TEST: Message sent to background, response:', response);
  });
} catch (error) {
  console.error('❌ MINIMAL TEST: Error sending message:', error);
}

console.log('🚨 MINIMAL TEST: Script execution complete');
