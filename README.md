## Overview

This is the backend for the Popote app. Popote is an app that will help you find great recipes based on ingredients you have in your closet

## Features

### Search by Ingredient

### Search by Tag

### **Search by grocery store receipt!!!**

### Upcoming features

Strict Search:
Exclusions:
Time Filters:
Query Number

## How Does the Search Work

We get our data from the Spoonacular Api. We use the Ingredients that you enter into the search bar to query our database for recipies that include that ingredient. We use a regex term to see if that ingredient shows up in the `recipe.summary`. If that ingredient does exist in the summary that recipe is considered a match.

Our database was seeded from the Spoonacular Api. If your search exceeds what we have in our Mongo database (hosted on MLab), the Popote-server call to our Database will return nothing, so then it will intiate a call to the Spoonacular Api call directly. The response from the external api is cleaned, and served up to the client/user. Simultaneously, that payload is saved to a local file, where it will be picked up by a worker thread that will save those recipes to our local database. This way our DB is populated with those recipes it didn't have before.

I'm aware that saving recipes to the database is not a CPU-intensive task, thus this is not the ideal use case for a worker thread - it's slight overkill. But I wanted to learn more about worker threads and this seemed like a good excuse.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
