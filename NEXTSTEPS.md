1. ORDER THE DATA IN THE CARD LIST,  AFTER THIS ITS TIME TO FIGURE OUT HOW TO HOST BABY

2. [DONE] DARK MODE IS STARTED, WHEN YOU GET BACK FINISH IT. WERE STARTING IN settings.css. FINISH DARK MODE, THEN MOVE TO BELOW STUFF

3. [DONE] MAKE THE EDIT BUTTON CONVERT INTO A CANCEL BUTTON AFTER PRESSED, AND ADD A BUTTON TO SHOW THE PASSWORD TO THE USER WITH THE || OPERATOR

4. [DONE] PREVENT OVERFLOW SO YOU DONT SEE THE UGLY WHITE WHEN YOU SCROLL TOO FAR UP OR DOWN

5. [DONE] add login failed information, register button

6. [DONE] FREE UP THE POST /users ROUTE, CHANGE IT TO /register OR /users/register SO ANYCONE CAN MAKE AN ACCOUNT

7. [DONE] UNENCRYPT THE USERNAMES WHEN THEY COME OUT OF THE DB, SOMETHING IS VERY WRONG WITH THE USERNAMES RIGHT NOW. MAY REMOVE THEM AS EMAIL IS USED FOR LOGGING IN. LOOK INTO IT TOMORROW.

8. [DONE] Add login and conect it to protected routes

9. [DONE] connect the db and backend to the front end, data for population, and debug if necessary

10. [DONE] add a login feature and conditional rendering if the user doesn't have any saved passwords and if the user isn't logged in

12. [DONE] change how login works, primarily change how the DB stores new users email and password, hash instead of encrypt, and make sure then the user log's in they hash the attempt and compare against

13. [DONE] add a feature that encrypts the usernames and passwords for the user in the database             [WILL BE CHANGED]

14. [DONE] 4.5 Add a feature to encrypt the users saved credentials in the DB

15. [DONE] add a feature that encrypts the data going back and forth from the API call, make sure it stays encryped when in the browser until the button is pressed to show the user the password (Will look like this ******)

16. [DONE] add a hamburger menu on the ... button for logging out, and light/dark mode

17. [DONE] add login failed information, register button

18. Add a search option at the top that will look through the websites and find the site the user is looking for. partial and full searches

19. finalize styling

(JWT AUTO-LOGGOUT WORKS!!)

ADDITIONAL features

1. auto populate / auto saving / asking to save if a user logs in, bttn if its nblocked by google

2. favicon saving for closed card display

3. weak password warning, run the password through a basic formatter that I may have to build, looks for num of characters, special characters, numbers, no repetition, things like that and tells the user the password strength

4. [DONE] maybe inpliment an API that has common passwords and runs the users by it to tell them if its been in a data breech or if its too common

5. [DONE] openAPI for a spring boot backend, this will write docs for your backend for you!!!!!

6. export data

7. [DONE] password generator






This is the object to send data to the password manager : 

making a user : 

{
  "name": "john arocha",
  "username": "jparocha777@gmail.com",
  "password": "testPassword"
}

for put 

{
  "name": "john arocha",
  "username": "jparocha777@gmail.com",
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
  "username": "jparocha777@gmail.com",
  "password": "testPassword"
}

for json use url : http://localhost:8080/api-docs


for docs use url : http://localhost:8080/swagger-ui/index.html