// import { useEffect, useState } from 'react';
// import PasswordsPage from "../PasswordsPage/PasswordsPage";
// import "./App.css";

// function useBackgroundData(reload) {
//     const [data, setData] = useState(null); // Use state instead of context
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Tells the background.js script to fetch the data
//     const fetchDataFromBackground = () => {
//         return new Promise((resolve, reject) => {
//             chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
//                 if (response.status === 'success') {
//                     console.log('Response from background:', response);
//                     resolve(response);
//                 } else {
//                     console.error('Failed to fetch data:', response.message);
//                     reject(new Error(response.message || 'Failed to fetch data'));
//                 }
//             });
//         });
//     };

//     useEffect(() => {
//         fetchDataFromBackground()
//             .then(() => {
//                 chrome.storage.local.get('usersData', (result) => {
//                     if (result.usersData) {
//                         console.log("Setting data in state:", result.usersData);
//                         setData(result.usersData);
//                         setLoading(false);
//                     } else {
//                         setError('No data found.');
//                         setLoading(false);
//                     }
//                 });
//             })
//             .catch((error) => {
//                 console.error('Failed to fetch data:', error);
//                 setError('Failed to fetch data');
//                 setLoading(false);
//             });
//     }, [reload]); // Add reload as a dependency

//     return { data, loading, error };
// }

// // Main App component
// export default function App({ reload }) {
//     const { data, loading, error } = useBackgroundData(reload);

//     const headerStyle = {
//         marginBottom: '2vh',
//         textAlign: 'center',
//         fontSize: '2rem',
//         fontWeight: 'bold',
//     };

//     useEffect(() => {
//         console.log("DATA CHANGED", data);
//     }, [data]);

//     return (
//         <>
//             <h1 style={headerStyle} className="doto-title">SafePass</h1>
//             <hr style={{ width: '90%', borderColor: '#37383a' }} />
//             {loading ? (
//                 "Loading...."
//             ) : error ? (
//                 <p>{error}</p>
//             ) : (
//                 data && data.loginCredentials.map((secureData, idx) => {
//                     console.log('This is the data in the return statement' + secureData);
//                     return (
//                         <PasswordsPage key={idx} secureData={secureData} className="mb-2" />
//                     );
//                 })
//             )}
//         </>
//     );
// }

import { useEffect, useState, useRef } from 'react';
import PasswordsPage from "../PasswordsPage/PasswordsPage";
import "./App.css";

function useBackgroundData(reload) {
    const [data, setData] = useState(null); // Use state instead of context
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isInitialRender = useRef(true);

    // Tells the background.js script to fetch the data
    const fetchDataFromBackground = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
                if (response.status === 'success') {
                    console.log('Response from background:', response);
                    resolve(response);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    reject(new Error(response.message || 'Failed to fetch data'));
                }
            });
        });
    };

    const fetchData = async () => {
        try {
            await fetchDataFromBackground();
            chrome.storage.local.get('usersData', (result) => {
                if (result.usersData && JSON.stringify(result.usersData) !== JSON.stringify(data)) {
                    console.log("Setting data in state:", result.usersData);
                    setData(result.usersData);
                    setLoading(false);
                } else {
                    setError('No data found.');
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            fetchData();
        }
    }, []); // Ensure the useEffect hook only runs once

    return { data, loading, error };
}

// Main App component
export default function App({ reload }) {
    const { data, loading, error } = useBackgroundData(reload);

    const headerStyle = {
        marginBottom: '2vh',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    };

    useEffect(() => {
        console.log("DATA CHANGED", data);
    }, [data]);

    return (
        <>
            <h1 style={headerStyle} className="doto-title">SafePass</h1>
            <hr style={{ width: '90%', borderColor: '#37383a' }} />
            {loading ? (
                "Loading...."
            ) : error ? (
                <p>{error}</p>
            ) : (
                data && data.loginCredentials.map((secureData, idx) => {
                    console.log('This is the data in the return statement' + secureData);
                    return (
                        <PasswordsPage key={idx} secureData={secureData} className="mb-2" />
                    );
                })
            )}
        </>
    );
}