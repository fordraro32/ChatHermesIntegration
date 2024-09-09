from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from config import MODEL_ID

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_model_id', methods=['GET'])
def get_model_id():
    return jsonify({'model_id': MODEL_ID})

@app.errorhandler(404)
def not_found_error(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('index.html'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
