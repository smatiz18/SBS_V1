from flask import Blueprint, jsonify
from app.services.rotowire.nba import get_rotowire_nba_lineups_response 

nba_matchups_bp = Blueprint('nba_matchups', __name__)

@nba_matchups_bp.route('/get-nba-matchups', methods=['GET'])
def get_nba_matchups():
    response = {}
    try:
        response = jsonify(get_rotowire_nba_lineups_response())
    except Exception as error:
        response = jsonify({ 'isError': True, 'error': error}), 400
    finally:
        response.headers.add('Content-Type', 'application/json')
        return response
