import PasswordsPage from "../PasswordsPage/PasswordsPage"
import Card from 'react-bootstrap/Card'
import "./App.css"

// Will need to copy all styling and information over to the real app, but need to work here for now because 'chrome' is not accessable from a tab but it is from a extension


export default function TempApp() {
    let arr = [
        {
            "id": 1,
            "website" : "https://www.myurl.com/something",
            "name": "John Doe",
            "password": "Password123",
            "email": "john.doe@gmail.com"
        },
        {
            "id": 2,
            "website" : "https://www.myurl.com/something",
            "name": "Johnathan Doughburry",
            "password": "Password123",
            "email": "doesntmatter@gmail.com"
        },
        {
            "id": 3,
            "website" : "https://www.myurl.com/something",
            "name": "Johnathan Doughburry",
            "password": "Password123",
            "email": "kindamatters@gmail.com"
        }
    ]

    const headerStyle = {
        // paddingTop: '2vh',
        marginBottom: '2vh',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    };

    return (
        <>
            <h1 style={headerStyle} className="doto-title" >SafePass</h1>
            <hr style={{ width: '90%', borderColor: 'black' }} />
            {arr.map((secureData, idx) => {
                console.log(secureData); // Log the secureData object
                return (
                    <PasswordsPage key={idx} secureData={secureData} className="mb-2" />
                );
            })}
        </>
    );
}