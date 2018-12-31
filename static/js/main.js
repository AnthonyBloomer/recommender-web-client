const request = new XMLHttpRequest()

window.onload = () => {
    genres = ['ambient',
              'chicago-house',
              'classical',
              'deep-house',
              'detroit-techno',
              'drum-and-bass',
              'folk',
              'house',
              'idm',
              'minimal-techno',
              'progressive-house',
              'techno']
    const shuffled = genres.sort(() => .5 - Math.random())
    let selected =shuffled.slice(0, 1).join()
    request.open('POST', `/recommendations?genre=${selected}&min_popularity=50`, true)
    request.send()
    request.onload = () => {
        if (request.status == 200) {
            displayRecommendations(JSON.parse(request.responseText))
        }
    };
    request.onerror = () => {
        console.error(request.responseText)
    };
}

const displayRecommendations = recommendations => {
    let tracks = recommendations.tracks
    let content = ""
    const theDiv = document.getElementById("resultsArea")
    tracks.forEach(({name, artists, external_urls}) => {
        const track = `${name} - ${artists[0].name}`
        content += "<div class='row'>"
        content += "<div class='col-md-11'>"
        content += `<i onclick='playSong("${track}")' class='fas fa-play-circle '></i> ${track}`
        content += "</div>"
        content += "<div class='col-md-1'>"
        content += `<a href='${external_urls.spotify}'><i class='fab fa-spotify'></i></a>`
        content += "</div>"
        content += "</div>"
        content+= "<hr>"
    });
    theDiv.innerHTML = content
}

const loadYoutubeFrame = videoId => {
    let player = document.getElementById("ytplayer")
    const url = `https://hooktube.com/embed/${videoId}?autoplay=1`
    player.innerHTML = `<iframe id='video' src='${url}'></iframe>`;
}

const searchRecommendations = e => {
    e.preventDefault()

    let artist = document.getElementById("artist").value
    let genre = document.getElementById("genre").value
    let track = document.getElementById("track").value

    request.open('POST', `/recommendations?artist=${artist}&genre=${genre}&track=${track}`, true)
    request.send()
    request.onload = () => {
        if (request.status == 200) {
            console.log(request.responseText)
            displayRecommendations(JSON.parse(request.responseText))
        }
    };
    request.onerror = () => {
        console.error(request.responseText)
    };

};

const playSong = e => {
    request.open('POST', `/play?track=${e}`, true)
    request.onload = () => {
        if (request.status == 200) {
            let resp = request.responseText
            let data = JSON.parse(resp)
            loadYoutubeFrame(data.id)
        }
    };
    request.onerror = () => {
        console.error(request.responseText)
    };
    request.send()
}

const form = document.getElementById('searchForm')
form.addEventListener('submit', e => {
    e.preventDefault()
    searchRecommendations(e)
});

const ele = document.getElementById('findRecommendations')
ele.onclick = searchRecommendations;