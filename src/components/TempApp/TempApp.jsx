import PasswordsPage from "../PasswordsPage/PasswordsPage"

export default function TempApp() {

    const headerStyle = {
        marginTop: '20px',
        marginBottom: '10px',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    };

    return (
        <>
            <h1 style={headerStyle} >Password Manager</h1>
            <PasswordsPage />
        </>
    )
}