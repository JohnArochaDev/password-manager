import { useState, useEffect } from "react";
// import reactLogo from "../../assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

import URL from "../../config/networkConfig"

function App() {
	// const [count, setCount] = useState(0);
	const [testData, setTestData] = useState(null)

	async function testApiCall() {
		try {
		  const response = await fetch(`${URL}/users`);
		  if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		  }
		  const data = await response.json();
		  console.log(data);
		  setTestData(data.name);
		} catch (error) {
		  console.error(error); // Log the error to the console
		}
	  }

	useEffect(() => {
		testApiCall()
	}, []);

  return (
    <>
		{testData ? testData : ""}
    </>
  );
}
export default App;