console.log('Background script running!');

function fetchData() {
  	console.log('Making API request to fetch data...');

  fetch('http://localhost:8080/users')
    .then(response => response.json())
    .then(data => {
		console.log('Fetched data:', data);
		// Store the fetched data in chrome storage
		chrome.storage.local.set({ usersData: data }, () => {
			console.log('Data stored in chrome storage.');
		});
    })
    .catch(error => {
      	console.error('Error fetching data:', error);
    });
}

// not setup yet. use in  the future
function getFavicon() {
    const linkElements = document.querySelectorAll('link[rel~="icon"]');
    if (linkElements.length > 0) {
        return linkElements[0].href;
    } else {
        // Fallback to default favicon location
        return `${window.location.origin}/favicon.ico`;
    }
}

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('Message received in background script:', message);

	if (message.action === 'fetchData') {
		fetchData();
		sendResponse({ status: 'Fetching data...' }); // Sending a response back
	} else if (message.action === 'getData') {
		// If a message asks for the stored data, retrieve it, currently not implemented
		chrome.storage.local.get('usersData', (result) => {
			if (result.usersData) {
				sendResponse({ data: result.usersData });
			} else {
				sendResponse({ data: null, error: 'No data found.' });
			}
		});
	}

  	return true;  // Ensures the message channel remains open for async response
});
