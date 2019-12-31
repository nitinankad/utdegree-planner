

# UTDegree Planner
[![Netlify Status](https://api.netlify.com/api/v1/badges/fc0260e2-01ec-44fe-b75f-baec10d3f22d/deploy-status)](https://app.netlify.com/sites/utdegreeplanner/deploys) [![MIT License](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/nitinankad/utdegree-planner/blob/master/LICENSE)

```UTDegree Planner``` is a drag and drop degree planner that aims to make degree planning easier. _Note: It does not have mobile support yet._

![demo](https://user-images.githubusercontent.com/46038298/71609985-a728c100-2b52-11ea-90c9-3cb18ced9541.gif)

## Features
- Drag and drop course
- Add course
- Delete course
- Highlight course prefix and number
- Load sample four-year degree plans

## Setup
1. Create a PostgreSQL database and import ```db.sql``` into your database from ```backend``` (make sure to run ```scrapeDegreePlans.py``` and copy over the insert statements into it first).

2. Then, change ```POSTGRES_INSTANCE```, ```POSTGRES_USER```, ```POSTGRES_PASSWORD```, ```POSTGRES_DATABASE``` in ```getDegreePlan.py``` to your database. 

3. Run ```get_degree_plan()``` on any serverless platform of your choice or locally. UTDegree Planner is hosted on Google Cloud Functions.

4. Copy your API link and create .env in frontend if it doesn't exist already and set ```REACT_APP_API_URL=``` to your API endpoint

## Usage
In ```frontend```, install the requirements with ```npm install``` and then run with ```npm start```

## Future plans
See [Roadmap](https://github.com/nitinankad/utdegree-planner/projects/1)

## Contributions
Feel free to contribute! Submit an issue if you want to report a bug or suggest a feature and create a pull request if you want to submit a feature or bug fix
