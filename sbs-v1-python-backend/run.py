from flask import Flask, jsonify
from app.handlers.nba.get_nba_lineups import nba_lineups_bp

app = Flask(__name__)

def register_blueprints():
    app.register_blueprint(nba_lineups_bp, url_prefix='/')
   
def init():
    print('Starting SBS_V1 python backend server')
    register_blueprints()
    if __name__ == '__main__':
        print('Starting from __main__')
        app.run('0.0.0.0', 8000)

init()