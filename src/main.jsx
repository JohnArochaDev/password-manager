import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App/App.jsx' // use this for the official extension, wont render in a tab because of no access to 'chrome'
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported in your project

import TempApp from './components/TempApp/TempApp.jsx' // temporary for styling
import { Container } from 'react-bootstrap';

const backgroundStyle = {
	backgroundColor: '#242424',
	minHeight: '100vh', // Ensures it takes the full viewport height
  };


createRoot(document.getElementById('root')).render(
	<StrictMode>
		<div style={backgroundStyle} >
			<Container className="d-flex flex-column justify-content-center align-items-center text-white ">
				<TempApp />
			</Container>
		</div>
	</StrictMode>
)
