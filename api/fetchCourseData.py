import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, abort
from random import randint

app = Flask(__name__)

# Function to clear out any trailing spaces and numbers from the end of a course name
def clean_text(name):
	for i in range(len(name), 0, -1):
		if name[i-1].isalpha():
			return name[:i]

	return name

@app.route('/api/<int:task_id>', methods=['GET'])
def get_task(task_id):
	if task_id == 1:
		result = []

		r = requests.get("https://catalog.utdallas.edu/2019-undergraduate/programs/ecs/computer-science/four-year")
		html = r.text

		soup = BeautifulSoup(html, "html.parser")
		tables = soup.findAll("table")[:-1]

		for table in tables:
			year_name = table.find("th").getText().split(" ")[0].upper()

			year = {}
			year["id"] = str(randint(1000,9999))
			year["year"] = year_name
			year["semesters"] = []

			fall, spring = {}, {}

			fall["id"] = str(randint(10000, 99999))
			fall["content"] = "Fall semester"
			fall["subItems"] = []

			spring["id"] = str(randint(10000, 99999))
			spring["content"] = "Spring semester"
			spring["subItems"] = []

			for row in table.find_all("tr")[2:]:
				col = row.find_all("td")

				if len(col) == 0: continue

				if len(col[0].getText()) != 0:
					fall_class = {
						"id": str(randint(100000, 999999)),
						"content": clean_text(col[0].getText())
					}
					fall["subItems"].append(fall_class)

				if len(col[2].getText()) != 0:
					spring_class = {
						"id": str(randint(100000, 999999)),
						"content": clean_text(col[2].getText())
					}

					spring["subItems"].append(spring_class)

			year["semesters"].append(fall)
			year["semesters"].append(spring)
			year["semesters"].append({
				"id": str(randint(10000, 99999)),
				"content": "Summer semester",
				"subItems": []
			})

			result.append(year)

		return jsonify(result)

	return jsonify({"Error": "Invalid API request"})

if __name__ == '__main__':
	app.run(port=8000,debug=True)