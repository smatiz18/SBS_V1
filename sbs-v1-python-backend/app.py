from flask import Flask, jsonify

app = Flask(__name__)

def defineRoutes():
    @app.route('/fetch_data', methods=['GET'])
    def fetch_data():
        return jsonify(message="fetch data!")

    @app.route('/fetch_web_data', methods=['GET'])
    def fetch_web_data():
        return jsonify(message="fetch web data!")
   
def init():
    print('Starting SBS_V1 python backend server')
    defineRoutes()
    if __name__ == '__main__':
        print('Starting from __main__')
        app.run('0.0.0.0', 8000)

init()