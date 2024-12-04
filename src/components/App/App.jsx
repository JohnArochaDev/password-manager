import { useEffect, useState } from 'react'

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
	}, [])
  
	return { data, loading, error }
}  

	// Main App component
export default function App() {
	const { data, loading, error } = useBackgroundData()

	const TopLevelStyle = {
        color: 'blue',
        fontSize: '2rem',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

	return (
		<div style={TopLevelStyle} >
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
