from flask import Blueprint, request, jsonify
from app.services.rotowire.nba import get_rotowire_nba_lineups_response 

nba_lineups_bp = Blueprint('nba_lineups', __name__)

@nba_lineups_bp.route('/get-nba-lineups', methods=['GET'])
def get_nba_lineups():
    try:
        return get_rotowire_nba_lineups_response()
    except Exception as error:
        return jsonify({'error': error}), 400
