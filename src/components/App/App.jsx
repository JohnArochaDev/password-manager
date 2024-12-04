import React, { useEffect, useState } from 'react';

// Custom hook to interact with the background script
function useBackgroundData() {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Trigger background script to fetch data
const fetchDataFromBackground = () => {
	chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
	console.log('Response from background:', response);
	});
};

useEffect(() => {
	// Fetch data from chrome storage once the background script is done
	chrome.storage.local.get('usersData', (result) => {
		if (result.usersData) {
			setData(result.usersData);
			setLoading(false);
		} else {
			setError('No data found.');
			setLoading(false);
		}
	});
}, []); // Run this effect once on component mount

// Call background to fetch data when the component mounts
useEffect(() => {
	fetchDataFromBackground();
}, []); // Empty dependency array to only call once when the component mounts

return { data, loading, error };
}

	// Main App component
export default function App() {
	const { data, loading, error } = useBackgroundData();

	return (
		<div>
			<h1>Data from Background Script</h1>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{data ? (
				<pre>{JSON.stringify(data, null, 2)}</pre>
			) : (
				!loading && <p>No data to display.</p>
			)}
		</div>
	);
}
