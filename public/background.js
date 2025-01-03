// whenever the broswer is closed, all data in the credentials array will be lost, which is good. data stored in 
// chrome.storage.local is persistant, and needs to be encrypted.
// I need to pull data from the API EVERY TIME THE BROWSER OPENS, and store it in the credentials array. 
// I need the data to remain encrypted whe nI send it to chrome.storage.local
// I need to decrypt the data whenever I am working with it, but not alter the initial array, and empty the copied array after use
// I can then have access to check if the website is included in the array of credential objects or if it is not included, and run my
// logic control flow

let credentials = []

// saves data to chrome.storage.local
function saveToChrome() {
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
                        console.log("Encrypted data saved in chrome.storage.local.usersData")
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            } else {
                console.error('Token or userId not found in storage.');
            }
        });
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

// this is used to pull data from chrome.storage.local
function getFromStorage(key, callback) {
    chrome.storage.local.get([key], function(result) {
        callback(result[key]);
    });
}

// find the users URL
function activeTabChange() {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabObj = tabs[0]
        let activeTab = activeTabObj.url

        if(activeTab.includes('http://') && activeTabObj.incognito === false) {
            let activeTabSnippet = activeTab.replace("http://", "")
            let idx = activeTabSnippet.indexOf(".com")
            activeTabSnippet = activeTabSnippet.substring(0, idx + 4)
            // console.log(activeTabSnippet)
            return activeTabSnippet
        } else if (activeTab.includes('https://')  && activeTabObj.incognito === false) {
            let activeTabSnippet = String(activeTab).replace("https://", "");
            let idx = activeTabSnippet.indexOf(".com")
            activeTabSnippet = activeTabSnippet.substring(0, idx + 4)
            // console.log(activeTabSnippet)
            return activeTabSnippet
        }

        chrome.storage.local.set({ activeUrl: activeTabObj.url })
        // maybe call a new function to check if the snippet is different than the active tab, need to know if a user is on the same site or a new site
    })
}


//////////////////////////////////

// load credentials from storage when the extension starts
chrome.runtime.onStartup.addListener(() => {
    saveToChrome()
});

//////////////////////////////////

// this allows me to see whats in chrome.storage.local when I refresh a page for development

// function to log usersData from chrome.storage.local
function logUsersData() {
    chrome.storage.local.get(['usersData'], (result) => {
        if (result.usersData) {
            console.log("usersData from chrome.storage.local:", result.usersData);
            // credentials = result.usersData.loginCredentials            
            console.log("Credentials array encrypted", credentials)
        } else {
            console.log("No usersData found in chrome.storage.local");
        }
    });
}

// add listener for browser startup
chrome.runtime.onStartup.addListener(() => {
    logUsersData();
});

// add listener for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
    logUsersData();
});

//////////////////////////////////


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

// tab URL updates, DECRYPT THE URL FROM chrome.storage.local AND SEE IF THE SNIPPET MATCHES THE URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        activeTabChange();
    }
});

// tab change
chrome.tabs.onActivated.addListener((activeInfo) => {
    activeTabChange();
});