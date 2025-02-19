# Meal-Tracker-App

### Description
An application designed to track users' daily meals, providing insights into their dietary habits over time. The app helps users identify their most frequently consumed meals, their most enjoyed dishes, and those with the highest calorie content. By offering a comprehensive analysis of calorie intake, the application supports users in making informed dietary choices to maintain a healthier lifestyle.

Deployed app: https://meal-tracker-01.herokuapp.com/   //site not available, requires paid subscription  

### Features / Pages
* Sign up page - Users can create account
* Sign in page - Users can sign in and signout
* Add meal page - Users can add meal consumptions with image, calories and rating
* Edit meal page - Users can edit meal consumptions
* My Meals page - Users can view a paginated list of their meals and can delete meal consumptions
* Reports page - Users can view their meal reports over a period of time
* Language translations - for English, French and Estonia

### Tech stack
* Nodejs framework - [Adonisjs](https://adonisjs.com/)
* MySQL database
* Bootstrap CSS library

### Build / Set-up instructions
Ensure you have [Nodejs](https://nodejs.org/en/) installed on your machine and a MySQL database server running.

* In MySQL server, create a database, e.g `meal-tracker`
* Open your terminal / command prompt, navigate to a folder of your choice
* Clone this repository: Run `git clone https://github.com/osas-Idemudia/Meal-Tracker-App.git`
* Change directory into the cloned project: Run `cd Meal-Tracker-App`
* Install dependencies: Run `npm install`
* Create a new file in the project directory called `.env`, copy over the contents of `.env.example` into `.env`
* Edit `.env` to match your database config settings, namely: `DB_USER` and `DB_PASSWORD`
* Run migrations: `node ace migration:run`
* Start the server: `npm start`
* Go to `http://127.0.0.1:3333` to view the application

### User Stories
This is the link to my trello board containing the user stories:
https://trello.com/b/AncMxg93/project-steps
