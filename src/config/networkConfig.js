import process from 'process';

let URL;

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // this may change, keep updated to the API
} else {
    URL = '/'
}

export default URL;
