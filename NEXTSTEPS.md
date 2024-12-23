-1. MAKE SURE A USER CANT DELETE OTHER ACCOUNTS IF IT HAS THE LOGIN INFORMATION

0. DARK MODE IS STARTED, WHEN YOU GET BACK FINISH IT. WERE STARTING IN settings.css. FINISH DARK MODE, THEN MOVE TO BELOW STUFF

0.5 MAKE THE EDIT BUTTON CONVERT INTO A CANCEL BUTTON AFTER PRESSED, AND ADD A BUTTON TO SHOW THE PASSWORD TO THE USER WITH THE || OPERATOR

0.7 PREVENT OVERFLOW SO YOU DONT SEE THE UGLY WHITE WHEN YOU SCROLL TOO FAR UP OR DOWN

1. [DONE] add login failed information, register button

2. [DONE] FREE UP THE POST /users ROUTE, CHANGE IT TO /register OR /users/register SO ANYCONE CAN MAKE AN ACCOUNT

3. UNENCRYPT THE USERNAMES WHEN THEY COME OUT OF THE DB, SOMETHING IS VERY WRONG WITH THE USERNAMES RIGHT NOW. MAY REMOVE THEM AS EMAIL IS USED FOR LOGGING IN. LOOK INTO IT TOMORROW.

4. [DONE] Add login and conect it to protected routes

5. [DONE] connect the db and backend to the front end, data for population, and debug if necessary

6. [DONE] add a login feature and conditional rendering if the user doesn't have any saved passwords and if the user isn't logged in

7. change how login works, primarily change how the DB stores new users email and password, hash instead of encrypt, and make sure then the user log's in they hash the attempt and compare against

8. [DONE] add a feature that encrypts the usernames and passwords for the user in the database             [WILL BE CHANGED]

9. [DONE] 4.5 Add a feature to encrypt the users saved credentials in the DB

10. add a feature that encrypts the data going back and forth from the API call, make sure it stays encryped when in the browser until the button is pressed to show the user the password (Will look like this ******)

11. [HALF-DONE] add a hamburger menu on the ... button for logging out, adding 2 factor auth, and light/dark mode

12. [DONE] add login failed information, register button

13. Add a search option at the top that will look through the websites annd find the sire the user is looking for. partial and full searches

14. finalize styling

(JWT AUTO-LOGGOUT WORKS!!)

ADDITIONAL features

1. auto populate

2. favicon saving for closed card display

3. weak password warning, run the password through a basic formatter that I may have to build, looks for num of characters, special characters, numbers, no repetition, things like that and tells the user the password strength

4. maybe inpliment an API that has common passwords and runs the users by it to tell them if its been in a data breech or if its too common







This is the object to send data to the password manager : 

making a user : 

{
  "username": "jpjpjppj",
  "name": "john arocha",
  "email": "jparocha777@gmail.com",
  "password": "testPassword"
}

for put 

{
  "username": "jpjpjppj",
  "name": "john arocha",
  "email": "jparocha777@gmail.com",
  "password": "testPassword"
}

making a credential :

{
  "username": "exampleUsername",
  "password": "examplePassword",
  "website": "https://example.com"
}

to login : 

{
  "email": "jparocha777@gmail.com",
  "password": "testPassword"
}