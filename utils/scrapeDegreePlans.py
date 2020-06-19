# Helper script to scrape degree plans and create an SQL query

import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, abort
from uuid import uuid4
import json

degrees = {
    # Engineering and Computer Science
    "Biomedical Engineering": "https://catalog.utdallas.edu/2019-undergraduate/programs/ecs/biomedical-engineering/four-year",
    "Computer Engineering": "https://catalog.utdallas.edu/2019-undergraduate/programs/ecs/computer-engineering/four-year",
    "Computer Science": "https://catalog.utdallas.edu/2019-undergraduate/programs/ecs/computer-science/four-year",
    "Electrical Engineering": "https://catalog.utdallas.edu/2019/undergraduate/programs/ecs/electrical-engineering/four-year",
    "Mechanical Engineering": "https://catalog.utdallas.edu/2019-undergraduate/programs/ecs/mechanical-engineering/four-year",
    "Software Engineering": "https://catalog.utdallas.edu/2019-undergraduate/programs/ecs/software-engineering/four-year"
}

def uuid():
    return str(uuid4())

def clean_text(name):
    for i in range(len(name), 0, -1):
        if name[i-1].isalpha():
            return name[:i]

    return name

def fetch_course(degreeName, degreeLink):
    global file
    result = []

    print("Fetching %s..." % degreeName)

    r = requests.get(degreeLink)
    html = r.text

    soup = BeautifulSoup(html, "html.parser")
    tables = soup.findAll("table")[:-1]

    for table in tables:
        year_name = table.find("th").getText().split(" ")[0].upper()

        year = {}
        year["id"] = uuid()
        year["year"] = year_name
        year["semesters"] = []

        fall, spring = {}, {}

        fall["id"] = uuid()
        fall["semesterName"] = "Fall semester"
        fall["courses"] = []

        spring["id"] = uuid()
        spring["semesterName"] = "Spring semester"
        spring["courses"] = []

        for row in table.find_all("tr")[2:]:
            try:
                col = row.find_all("td")

                if len(col) == 0: continue

                if len(col[0].getText()) != 0:
                    courseName = clean_text(col[0].getText())

                    if courseName.startswith("or "): continue

                    fall_class = {
                        "id": uuid(),
                        "courseName": courseName
                    }
                    fall["courses"].append(fall_class)

                if len(col[2].getText()) != 0:
                    courseName = clean_text(col[2].getText())

                    if courseName.startswith("or "): continue

                    spring_class = {
                        "id": uuid(),
                        "courseName": courseName
                    }

                    spring["courses"].append(spring_class)

            except: continue
            

        year["semesters"].append(fall)
        year["semesters"].append(spring)
        year["semesters"].append({
            "id": uuid(),
            "semesterName": "Summer semester",
            "courses": []
        })

        result.append(year)

    sql = "INSERT INTO degree_plans VALUES ('%s', '%s');" % (degreeName, json.dumps(result))
    file.write(sql + "\n")
    print("Done fetching %s" % degreeName)

file = open("insertdata.txt", "w")

for degree in degrees:
    fetch_course(degree, degrees[degree])

file.close()