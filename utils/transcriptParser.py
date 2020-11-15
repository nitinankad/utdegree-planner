from flask import Flask, request, jsonify, flash, redirect, url_for, send_from_directory, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)


@app.route('/api/pdfParse', methods=['GET', 'POST'])
@cross_origin()
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        print(request.files)
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(save_dir, filename))

            read_pdf = PdfFileReader(save_dir + filename)
            courses = read_pdf.getPage(0).extractText()
            # courses = courses.split("2020 Fall")[1]
            print(courses)

            res = re.findall(r"([A-Z]+ [0-9]+)([^\.]*)", courses)
            res = [(a + ' ' + b[:-1].title()) for (a, b) in res]
            resp = jsonify(res)
            return resp
            """return redirect(url_for('uploaded_file',
                                    filename=filename))"""

    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input id=file type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    read_pdf = PdfFileReader(save_dir + filename)
    courses = read_pdf.getPage(0).extractText()
    res = courses.split("2020 Fall")[0].findall(r"[A-Z]+ [0-9]+")
    resp = jsonify(res)
    return resp


if __name__ == '__main__':
    app.run()
