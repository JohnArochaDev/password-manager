import { useEffect, useState } from 'react'
import PasswordsPage from "../PasswordsPage/PasswordsPage"

function useBackgroundData() {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
  
	// Tells the background.js script to fetch the data
	const fetchDataFromBackground = () => {
			chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
			console.log('Response from background:', response)
		})
	}
  
	useEffect(() => {
	    // Fetch data from chrome storage once the background script is done
	  	chrome.storage.local.get('usersData', (result) => {
			if (result.usersData) {
			setData(result.usersData)
			setLoading(false)
			} else {
			setError('No data found.')
			setLoading(false)
			}
	  	})
	}, [])
  
	useEffect(() => {
	  	fetchDataFromBackground()
	}, []) // make this reload when the data is given, need a logout route for testing first
  
	return { data, loading, error }
}  

	// Main App component
export default function App() {
	const { data, loading, error } = useBackgroundData()

	const headerStyle = {
        marginBottom: '2vh',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    };

	return (
        <>
            <h1 style={headerStyle} className="doto-title" >SafePass</h1>
            <hr style={{ width: '90%', borderColor: 'black' }} />
            {(data && !loading) ? data.loginCredentials.map((secureData, idx) => {
                console.log('This is the data in the return statement' + secureData);
                return (
                    <PasswordsPage key={idx} secureData={secureData} className="mb-2" />
                );
            }) : "Loading...."}
        </>
    );

	return (
		<div style={headerStyle} >
			<h1>Data from Background Script</h1>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{data ? (
				<pre>{JSON.stringify(data, null, 2)}</pre>
			) : (
				!loading && <p>No data to display.</p>
			)}
		</div>
	)
}
