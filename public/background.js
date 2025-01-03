// whenever the broswer is closed, all data in the credentials array will be lost, which is good. data stored in 
// chrome.storage.local is persistant, and needs to be encrypted.
// I need to pull data from the API EVERY TIME THE BROWSER OPENS, and store it in the credentials array. 
// I need the data to remain encrypted whe nI send it to chrome.storage.local
// I need to decrypt the data whenever I am working with it, but not alter the initial array, and empty the copied array after use
// I can then have access to check if the website is included in the array of credential objects or if it is not included, and run my
// logic control flow

let credentials = []

// saves data to chrome.storage.local
function saveToChrome(callback) {
    // console.log("saveToChrome called");
    getFromStorage('jwtToken', function(token) {
        // console.log("jwtToken:", token);
        getFromStorage('userId', function(userId) {
            // console.log("userId:", userId);
            if (token && userId) {
                fetch(`http://localhost:8080/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched data:", data);
                    // Store the fetched data in chrome storage
                    chrome.storage.local.set({ usersData: data }, () => {
                        console.log("Encrypted data saved in chrome.storage.local.usersData");
                    });
                    chrome.storage.local.set({ credentialArray: data.loginCredentials }, () => {
                        console.log("Credential array saved in chrome.storage.local.credentialArray");
                        // Call the callback after saving the data
                        if (callback) callback();
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
        let activeTab
        if(activeTabObj?.url) {
            activeTab = activeTabObj.url
        }

        if ((activeTab.includes('http://') || activeTab.includes('https://')) && activeTabObj.incognito === false) {
            let activeTabSnippet = activeTab.replace("http://", "").replace("https://", "");
            let idx = activeTabSnippet.indexOf(".com");
            activeTabSnippet = activeTabSnippet.substring(0, idx + 4);
            console.log("SNIPPET: \n", activeTabSnippet)
            console.log('CREDENTIALS: \n', credentials)
            for (credential of credentials) {
                if (credential.website.includes(activeTabSnippet)) {
                    console.log("THIS IS IN THE CREDENTIAL ARRAY", activeTabSnippet)
                }
            }
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
        } else {
            console.log("No usersData found in chrome.storage.local");
        }
    });
    chrome.storage.local.get(['credentialArray'], (result) => {
        if (result.credentialArray) {
            console.log("credentialArray from chrome.storage.local:", result.credentialArray);
            credentials = result.credentialArray
        } else {
            console.log("No credentialArray found in chrome.storage.local");
        }
    });
}

// add listener for browser startup
chrome.runtime.onStartup.addListener(() => {
    saveToChrome(logUsersData);
});

// add listener for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
    saveToChrome(logUsersData);
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











chrome.runtime.onStartup.addListener(() => {
    injectPopupOnActiveTab();
});

chrome.runtime.onInstalled.addListener(() => {
    injectPopupOnActiveTab();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        injectPopup(tabId);
    }
});

chrome.action.onClicked.addListener((tab) => {
    injectPopup(tab.id);
});

function injectPopupOnActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            injectPopup(tabs[0].id);
        }
    });
}

function injectPopup(tabId) {
    chrome.tabs.get(tabId, (tab) => {
        console.log('Injecting popup into tab:', tab.url);
        if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: createAndRenderPopup
            });
        } else {
            console.log('Cannot inject script into a chrome:// or chrome-extension:// URL');
        }
    });
}

function createAndRenderPopup() {
    const popupStyle = {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: '300px',
        height: '150px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        zIndex: '10000',
        padding: '10px',
    };

    const popup = document.createElement('div');
    Object.assign(popup.style, popupStyle);
    popup.innerHTML = `
        <h3>SafePass Notification</h3>
        <p>Your extension is closed. Click here to reopen it.</p>
        <button id="reopen-extension">Reopen</button>
    `;

    document.body.appendChild(popup);

    document.getElementById('reopen-extension').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'reopenExtension' });
    });

    console.log('Popup rendered');
}