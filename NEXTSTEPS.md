1. change back-end to use the correct model / a user has many loginCredentials to remember, but also a username and password to get in to the account //// MOSTLY DONE, change ho data is sent, only send by ID data (look below at the differences between the two objects)

2. connect the db and backend to the front end, data for population, and debug if necessary

3. add a login feature and conditional rendering if the user doesn't have any saved passwords and if the user isn't logged in

4. add a feature that hashes the usernames and passwords in the database

5. add a feature that encrypts the data going back and forth from the API call, make sure it stays encryped when in the browser until the button is pressed to show the user the password (Will look like this ******)

6. add a hamburger menu on the ... button for logging out, adding 2 factor auth, and light/dark mode

7. finalize styling







This is the object to send data to the password manager : 

{
  "username": "exampleUsername",
  "password": "examplePassword",
  "website": "https://example.com",
  "user": {
        "id": 2,
        "name": "Johnathan Doughburry",
        "email": "kindamatters@gmail.com",
        "password": null,
        "loginCredentials": []
    }
}

for put 

{
  "username": "exampleUsername",
  "password": "examplePassword",
  "website": "https://example.com",
  "userId": 2
}