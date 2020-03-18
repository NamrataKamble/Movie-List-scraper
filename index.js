const axios = require('axios');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const {
    Parser
} = require('json2csv');
const fs = require('fs');
async function main() {
    const url = 'https://timesofindia.indiatimes.com/entertainment/mumbai/movies/2';
    const res = await axios.get(url);
    // console.log(res)
    const dom = new JSDOM(res.data);
    const movieEls = dom.window.document.getElementsByClassName('mr_lft_box');
    // console.log(movieEls[0])
    let movies = [];
    for (let movieEl of movieEls) {
        const name = movieEl.getElementsByTagName('h3')[0].textContent;
        const releaseDate = movieEl.getElementsByTagName('h4')[0].textContent;
        const ratingEl = movieEl.getElementsByClassName('mrB10 clearfix')[0].getElementsByClassName('star_count')[0];
        let rating = '-';
        if(ratingEl) {
            rating = ratingEl.textContent;
        }
        const genre = movieEl.getElementsByTagName('small')[0].textContent;
       
        // console.log(name, releaseDate, rating, genre)
        movies.push({
            name: name.replace(/\n/g, ' ').replace(/ /g, ' '),
            releaseDate: releaseDate.replace(/\n/g, ' ').replace(/ /g, ' '),
            genre: genre.replace(/\n/g, ' ').replace(/ /g, ' '),
            rating: rating.replace(/\n/g, ' ').replace(/ /g, ' '),
        });
    }
    const parser = new Parser({
        fields: ['name', 'releaseDate', 'genre', 'rating']
    });
    const csv = parser.parse(movies);
    fs.writeFileSync('./movies.csv', csv);
    console.log(csv);
}

main()