// this is used to pull data from chrome.storage.local
function getFromStorage(key, callback) {
    chrome.storage.local.get([key], function(result) {
        callback(result[key]);
    });
}

// grabs the jwt token and the userid from storage
function fetchData(sendResponse) {
    getFromStorage('jwtToken', function(token) {
        getFromStorage('userId', function(userId) {
            if (token && userId) {
                fetch(`http://localhost:8080/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    // Store the fetched data in chrome storage
                    chrome.storage.local.set({ usersData: data }, () => {
                        sendResponse({ status: 'success' }); // Sending a response back
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    sendResponse({ status: 'error', message: error.message }); // Send error response
                });
            } else {
                console.error('Token or userId not found in storage.');
                sendResponse({ status: 'error', message: 'Token or userId not found in storage.' }); // Send error response
            }
        });
    });
}

// not setup yet. use in the future

// function getFavicon() {
//     const linkElements = document.querySelectorAll('link[rel~="icon"]');
//     if (linkElements.length > 0) {
//         return linkElements[0].href;
//     } else {
//         // Fallback to default favicon location
//         return `${window.location.origin}/favicon.ico`;
//     }
// }

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchData') {
        fetchData(sendResponse);
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

    // write more functions and listeners here

    return true;  // Ensures the message channel remains open for async response
});

// find the users URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let activeTabObj = tabs[0]

            let activeTab = activeTabObj.url
            
            console.log("Current URL: \n", activeTab)
            console.log("Current OBJ: \n", activeTabObj)

            if(activeTab.includes('http://')) {
                let activeTabSnippet = activeTab.replace("http://", "")
                let idx = activeTabSnippet.indexOf(".com")
                activeTabSnippet = activeTabSnippet.substring(0, idx + 4)
                console.log("http URL: \n", activeTabSnippet)
            } else if (activeTab.includes('https://')) {
                let activeTabSnippet = String(activeTab).replace("https://", "");
                console.log('activeTab no http: ', activeTabSnippet);
                let idx = activeTabSnippet.indexOf(".com")
                console.log('idx: ', idx)
                activeTabSnippet = activeTabSnippet.substring(0, idx + 4)
                console.log("https URL: \n", activeTabSnippet)
            }

            chrome.storage.local.set({ activeUrl: activeTabObj.url }, () => {
                console.log("URL saved in chrome.storage.local")
            });
            // maybe call a new function to check if the snippet is different than the active tab, need to know if a user is on the same site or a new site
        })
    }
})