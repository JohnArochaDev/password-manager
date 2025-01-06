// Make JWT last for 3 days, and when there is no JWT make a popup telling the user to sign in to regain access to autofill.

// If the site is in the credential array, and there is a username and password field present, a popup appears for autofill. 
// If there is a username and password field, but not in the credential array, copy the data input into the field, and show a different popup.
// If the user agrees to save it, make an API call to save it, clear out the data from the local variable.

let credentials = [];

let credentialAndActiveTab = {key : "value"};

let showNewCredentialPopup = false

let newCredential = {}

let currentTab = ''

// Utility Functions
function getFromStorage(key, callback) {
    chrome.storage.local.get([key], function(result) {
        callback(result[key]);
    });
}

// Data Management
function saveToChrome(callback) {
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
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // console.log("Fetched data:", data);
                    chrome.storage.local.set({ usersData: data }, () => {
                        // console.log("Encrypted data saved in chrome.storage.local.usersData");
                    });
                    chrome.storage.local.set({ credentialArray: data.loginCredentials }, () => {
                        // console.log("Credential array saved in chrome.storage.local.credentialArray");
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

function newCredentialFunc(newCredential) {
    let newCredentialForm = {
        username: newCredential.username,
        password: newCredential.password,
        website: newCredential.website
    };

    // console.log("NEW CREDENTIAL OBJECT ON REQUEST", newCredentialForm)

    chrome.storage.local.get(['jwtToken', 'userId'], async function(result) {
        const userToken = result.jwtToken;
        const userId = result.userId;

        if (!userToken || !userId) {
            console.error('User token or ID is missing');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/credentials/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCredentialForm)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();

            // console.log("RESPONSE IN CREATE: \n", responseData);

        } catch (error) {
            console.error('Error:', error);
        }
    });
}

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
                    chrome.storage.local.set({ usersData: data }, () => {
                        sendResponse({ status: 'success' });
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    sendResponse({ status: 'error', message: error.message });
                });
            } else {
                console.error('Token or userId not found in storage.');
                sendResponse({ status: 'error', message: 'Token or userId not found in storage.' });
            }
        });
    });
}

// Active Tab Management
function activeTabChange() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTabObj = tabs[0];
        let activeTab;
        if (activeTabObj?.url) {
            activeTab = activeTabObj.url;
        }

        if ((activeTab.includes('http://') || activeTab.includes('https://')) && activeTabObj.incognito === false) {
            let activeTabSnippet = activeTab.replace("http://", "").replace("https://", "");
            let idxCom = activeTabSnippet.indexOf(".com");
            let idxIo = activeTabSnippet.indexOf(".io");
        
            if (idxCom !== -1) {
                activeTabSnippet = activeTabSnippet.substring(0, idxCom + 4);
            } else if (idxIo !== -1) {
                activeTabSnippet = activeTabSnippet.substring(0, idxIo + 3);
            }
        
            currentTab = activeTabSnippet;
            // console.log("THIS IS THE CURRENT TAB: ", currentTab);
        
            for (const credential of credentials) {
                if (credential.website.includes(activeTabSnippet)) {
                    // console.log("THIS IS IN THE CREDENTIAL ARRAY", activeTabSnippet);
                    credentialAndActiveTab = credential;
                    checkForLoginFields();
                    showNewCredentialPopup = false;
                    // console.log("DONT SHOW NEW CREDENTIAL ON SUBMIT", showNewCredentialPopup);
                } else {
                    showNewCredentialPopup = true;
                    // console.log("SHOW NEW CREDENTIAL ON SUBMIT", showNewCredentialPopup);
                }
            }
        }

        chrome.storage.local.set({ activeUrl: activeTabObj.url });
    });
}

function checkForLoginFields() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    const usernameField = document.querySelector('input[type="text"], input[type="email"], input[name*="email"], input[id="user_email"], input[name="user[email]"]');
                    const passwordField = document.querySelector('input[type="password"]');
                    if (usernameField && passwordField) {
                        // console.log("Username and password fields found on the page.");
                        return true;
                    } else {
                        // console.log("Username or password field not found on the page.");
                        return false;
                    }
                }
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    // console.log("Login fields are present on the page.");
                    injectPopupOnActiveTab();
                } else {
                    // console.log("Login fields are not present on the page.");
                    // check for data in username and password fields, maybe on a submit a popup appears asking if the user wants to save that data.
                    if (usernameField && passwordField) {
                        injectPopupOnActiveTabNewCredential()
                    }
                }
            });
        }
    });
}

// Logging for Development
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
            credentials = result.credentialArray;
        } else {
            console.log("No credentialArray found in chrome.storage.local");
        }
    });
}

// Popup Injection
function injectPopupOnActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            injectPopup(tabs[0].id);
        }
    });
}

function injectPopupOnActiveTabNewCredential() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            injectPopupNewCredential(tabs[0].id);
        }
    });
}

function injectPopup(tabId) {
    chrome.tabs.get(tabId, (tab) => {
        // console.log('Injecting popup into tab:', tab.url);
        if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: createAndRenderPopup,
                args: [credentialAndActiveTab]
            });
        } else {
            // console.log('Cannot inject script into a chrome:// or chrome-extension:// URL');
        }
    });
}

function injectPopupNewCredential(tabId) {
    chrome.tabs.get(tabId, (tab) => {
        // console.log('Injecting popup into tab:', tab.url);
        if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: createAndRenderPopupNewCredential
            });
        } else {
            // console.log('Cannot inject script into a chrome:// or chrome-extension:// URL');
        }
    });
}

function createAndRenderPopup(credentialAndActiveTab) {
    const popupStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '300px',
        height: '230px',
        backgroundColor: 'rgb(32, 33, 36)',
        color: 'rgb(255, 255, 255)',
        border: '1px solid #ccc',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        zIndex: '10000',
        padding: '20px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        textAlign: 'center',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '15px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
    };

    const buttonStyle = `
        background-color: rgb(50, 50, 50);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 30px;
    `;

    const popup = document.createElement('div');
    Object.assign(popup.style, popupStyle);
    popup.innerHTML = `
        <button id="close-popup" style="${Object.entries(closeButtonStyle).map(([k, v]) => `${k}:${v}`).join(';')}">x</button>
        <h3 style="font-size: 24px;">SafePass</h3>
        <p style="margin-top: 20px;">Would you like to autofill your credentials?</p>
        <button id="autofill-passwords" style="${buttonStyle}">Yes</button>
    `;

    document.body.appendChild(popup);

    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    const button = document.getElementById('autofill-passwords');
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = 'rgb(70, 70, 70)';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = 'rgb(50, 50, 50)';
    });

    const usernameField = document.querySelector('input[type="text"], input[type="email"], input[name*="email"], input[id="user_email"], input[name="user[email]"]');
    const passwordField = document.querySelector('input[type="password"]');
    // console.log("USER FIELD", usernameField);
    // console.log("PASS FIELD", passwordField);
    if (button) {
        button.addEventListener('click', () => {
            if (usernameField && passwordField) {
                usernameField.value = credentialAndActiveTab.username;
                passwordField.value = credentialAndActiveTab.password;
                usernameField.style.backgroundColor = 'rgb(200, 255, 200)';
                passwordField.style.backgroundColor = 'rgb(200, 255, 200)';
            }

            // console.log("CREDENTIAL OBJECT: \n", credentialAndActiveTab);
            // console.log("Button clicked");
            document.body.removeChild(popup);
        });
    } else {
        console.error('Button with ID "autofill-passwords" not found.');
    }

    // console.log('Popup rendered');
}

// Event Listeners

//this makes an event listener and listens for a submit
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (currentTab) => {
                document.addEventListener('submit', (event) => {
                    event.preventDefault();

                    const form = event.target;
                    const usernameField = form.querySelector('input[type="text"], input[type="email"], input[name*="email"], input[id="user_email"], input[name="user[email]"]');
                    const passwordField = form.querySelector('input[type="password"]');

                    if (usernameField && passwordField) {
                        const newCredential = {
                            username: usernameField.value,
                            password: passwordField.value,
                            website: currentTab
                        };

                        // console.log("OBJECT WHEN ITS CREATED, LOOK FOR WEBSITE", newCredential);

                        chrome.runtime.sendMessage({ action: 'showSaveCredentialsPopup', newCredential });
                    }
                });
            },
            args: [currentTab] // Pass the current tab's URL as an argument
        });
    }
});

// if a submit happens, open the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showSaveCredentialsPopup') {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: (newCredential) => {
                function createAndRenderPopupNewCredential(newCredential) {
                    const popupStyle = {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        width: '300px',
                        height: '230px',
                        backgroundColor: 'rgb(32, 33, 36)',
                        color: 'rgb(255, 255, 255)',
                        border: '1px solid #ccc',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        zIndex: '10000',
                        padding: '20px',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '10px',
                        textAlign: 'center',
                    };

                    const closeButtonStyle = {
                        position: 'absolute',
                        top: '10px',
                        right: '15px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                    };

                    const buttonStyle = `
                        background-color: rgb(50, 50, 50);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 30px;
                    `;

                    const popup = document.createElement('div');
                    Object.assign(popup.style, popupStyle);
                    popup.innerHTML = `
                        <button id="close-popup" style="${Object.entries(closeButtonStyle).map(([k, v]) => `${k}:${v}`).join(';')}">x</button>
                        <h3 style="font-size: 24px;">SafePass</h3>
                        <p style="margin-top: 20px;">Would you like to save your credentials?</p>
                        <button id="save-credentials" style="${buttonStyle}">Yes</button>
                    `;

                    document.body.appendChild(popup);

                    const closeButton = document.getElementById('close-popup');
                    closeButton.addEventListener('click', () => {
                        document.body.removeChild(popup);
                        newCredential = {};
                    });

                    const button = document.getElementById('save-credentials');
                    button.addEventListener('mouseover', () => {
                        button.style.backgroundColor = 'rgb(70, 70, 70)';
                    });
                    button.addEventListener('mouseout', () => {
                        button.style.backgroundColor = 'rgb(50, 50, 50)';
                    });

                    if (button) {
                        button.addEventListener('click', () => {
                            // Send a message to the background script to save the credentials
                            chrome.runtime.sendMessage({ action: 'saveNewCredential', newCredential });

                            document.body.removeChild(popup);
                        });
                    } else {
                        console.error('Button with ID "save-credentials" not found.');
                    }

                    // console.log('Popup rendered');
                }

                createAndRenderPopupNewCredential(newCredential);
            },
            args: [message.newCredential] // Pass newCredential as an argument
        });
    } else if (message.action === 'saveNewCredential') {
        newCredentialFunc(message.newCredential); // Call the function to save the credential in the background script
    }
});

chrome.runtime.onStartup.addListener(() => {
    saveToChrome(logUsersData);
});

chrome.runtime.onInstalled.addListener(() => {
    saveToChrome(logUsersData);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        activeTabChange();
        saveToChrome(logUsersData);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    activeTabChange();
    saveToChrome(logUsersData);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchData') {
        fetchData(sendResponse);
    } else if (message.action === 'getData') {
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