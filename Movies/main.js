var MovieScrapper = function (){
    var showInfo = function (data) {
        var response = data.contents;
        var movieTitle = response.match(/(?<=h1\>)(?!\<)(.+?)(?=\<\/h1)/g);
        var movies = movieTitle.filter(function (value, index, array) {
            return array.indexOf(value) === index
        });
        for (var i = 0; i < movies.length; i++) {
            movies[i] = normalize(movies[i]).toLowerCase();
            window["imdb$" + movies[i]] = function (result) {
                var movieId = result.d[0].id;
                xhrRequest(movieId);
            };
            loadMovie(movies[i]);
        }
    }

    function xhrRequest(movieId) {
        var data = null;
    
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
    
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                var movie = JSON.parse(this.responseText);
                createTable(movie);
            }
        });
    
        xhr.open("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/?i="+movieId+"&r=json");
        xhr.setRequestHeader("x-rapidapi-host", "movie-database-imdb-alternative.p.rapidapi.com");
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Accept', 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01');
        xhr.setRequestHeader("x-rapidapi-key", "4e2c23ecadmsheb0557b54657cf5p1b43b9jsneefbd78cfad7");
    
        xhr.send(data);
    }

    function loadMovie(movie) {
        var script = document.createElement('script');
        var url = 'https://sg.media-imdb.com/suggests/' + movie.substr(0, 1) + '/' + movie + '.json';
        script.setAttribute('src', url);
        script.addEventListener('load', function () {
            document.head.removeChild(script);
        })
        document.head.appendChild(script);
    }

    function createTable(movie) {
        if(!movie.Title && !movie.imdbRating && !movie.Actors) return;
        var tbody = document.querySelector("#table tbody");
        var tr = document.createElement("tr");
    
        var tdTilte = document.createElement("td");
        tdTilte.innerText = movie.Title;
    
        var tdScore = document.createElement("td");
        tdScore.innerText = movie.imdbRating;
    
        var tdActors = document.createElement("td");
        tdActors.innerText = movie.Actors;
    
        tr.appendChild(tdTilte);
        tr.appendChild(tdScore);
        tr.appendChild(tdActors);
        tbody.appendChild(tr);
    }
    
    var normalize = (function () {
        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç:,.",
            to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc___",
            mapping = {};
    
        for (var i = 0, j = from.length; i < j; i++)
            mapping[from.charAt(i)] = to.charAt(i);
    
        return function (str) {
            str = str.replace(/ /g, '_');
            var ret = [];
            for (var i = 0, j = str.length; i < j; i++) {
                var c = str.charAt(i);
                if (mapping.hasOwnProperty(str.charAt(i)))
                    ret.push(mapping[c]);
                else
                    ret.push(c);
            }
            return ret.join('');
        }
    })();

    (function () {
        var url = 'http://www.whateverorigin.org/get?url=' + encodeURIComponent('https://www.cinepolis.co.cr/') + '&callback=movies.showInfo';
        var script = document.createElement('script');
        script.setAttribute('src', url);
        script.addEventListener('load', function () {
            document.head.removeChild(script);
        })
        document.head.appendChild(script);
    })();

    return{
        showInfo : showInfo
    }
}

var movies = MovieScrapper();