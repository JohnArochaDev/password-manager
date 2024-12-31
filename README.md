# SafePass

This project is a secure password manager Chrome extension, built with React and Vite. It provides a range of features to help users manage their passwords securely and efficiently.

## Features

1. **Dark Mode and Light Mode**: Toggle between dark and light themes for better user experience.
2. **Login and Registration**: Secure login and registration functionality.
3. **Password Management**: Add, edit, and delete credentials.
4. **Password Strength Checking**: Check the strength of passwords and detect breaches.
5. **Data Encryption**: Secure storage and transmission of data.
6. **Export Data**: Export password data to a PDF.
7. **Search Functionality**: Search for credentials easily.
8. **JWT-based Authentication**: Secure authentication with auto-logout.
9. **Chrome Extension Integration**: The Chrome extension can be used anywhere.
10. **Password Generator**: Generate strong passwords.
11. **Settings Page**: Customize user preferences.
12. **Visual Indicators**: Indicators for compromised and weak passwords.
13. **Encrypted Databse**: User credentials are securely stored and transferred

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/password-manager.git
    cd password-manager
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [`.env`](https://www.npmjs.com/package/dotenv) file in the root directory and add your environment variables:
    ```env
    VITE_SECRET_KEY=your_secret_key
    ```

## Usage

### Development

To start the development server with hot module replacement:
```sh
npm run dev
```

### Build
To build the project for production:

```sh
npm run build
```

### Configuration
The project uses Vite for configuration. You can find the configuration file at vite.config.js.


### Project Structure

```sh
public/
    background.js
    manifest.json
README.md
src/
    assets/
    components/
        App/
            .prettierrc
            App.css
            App.jsx
        Login/
            login.css
            Login.jsx
        PasswordsPage/
            passwordPage.css
            PasswordsPage.jsx
        Settings/
            settings.css
            Settings.jsx
        UserData/
            userData.css
            UserData.jsx
    config/
        networkConfig.js
    utils/
        checkForCompromise.js
        checkForWeakPassword.js
        decryption.js
        export.js
        passwordGenerator.js
    main.css
    main.jsx
    .env
    .gitignore
    index.html
    LICENSE
    NEXTSTEPS.md
    package-lock.json
    package.json
    vite.config.js
```

### API Docs

[`Docs`](http://localhost:8080/swagger-ui/index.html#/) (Available when back-end is up and running)

### License
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International Public License.

### Disclaimer
While this project strives to offer secure password management, the author is not responsible for any security breaches, data loss, or financial loss that may result from the use of this software. Users are responsible for implementing their own security practices and safeguarding their data. This project was developed as part of a school assignment to demonstrate proficiency in web development and security practices.