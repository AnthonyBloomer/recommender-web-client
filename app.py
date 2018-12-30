from flask import Flask, render_template, request, jsonify
from recommender.api import Recommender
import requests
import os

app = Flask(__name__)


@app.route('/play', methods=['POST'])
def play():
    if not request.args.get('track'):
        return jsonify({
            'error': 'Track is required.'
        })
    params = {
        'q': request.args.get('track'),
        'part': 'id,snippet',
        'maxResults': 1,
        'type': 'video',
        'key': os.getenv('YOUTUBE_API_KEY')
    }

    req = requests.get('https://www.googleapis.com/youtube/v3/search', params=params)
    json = req.json()
    return jsonify({
        "id": json['items'][0]['id']['videoId']
    })


@app.route('/recommendations', methods=['POST'])
def recommendations():
    recommender = Recommender()
    if not request.args.get('artist') and not request.args.get('genre') and not request.args.get('tracks'):
        return jsonify({
            'error': 'At least one artist, genre or track is required.'
        })
    if request.args.get('artist'):
        recommender.artists = request.args.get('artist')

    if request.args.get('genre'):
        recommender.genres = request.args.get('genre')

    if request.args.get('tracks'):
        recommender.tracks = request.args.get('tracks')

    recommender.tunable_track_attributes = {
        'min_popularity': 50,
        'max_popularity': 65,
    }

    return jsonify(recommender.find_recommendations())


@app.route("/", methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 33507))
    app.run(debug=True, host='0.0.0.0', port=port)
