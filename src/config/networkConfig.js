let URL;

if (import.meta.env.MODE === 'development') {
    // Use Vite environment variables prefixed with 'VITE_'
    URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'; 
} else {
    URL = '/';
}

export default URL;