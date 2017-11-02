#!/usr/bin/env python
# Name: Rosa Brakkee
# Student number: 10777601
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    result = []

    for e in dom.by_tag("div.lister-item"):

        # gets the  title
        title = e.by_tag("h3")[0].by_tag("a")[0].content.encode("utf-8")

        # gets the genre 
        genres = e.by_tag("span.genre")[0].content                               
        genres = ",".join([genres.strip('\n').strip(' ')])

        # gets the rating
        rating = (e.by_tag("span.value"))[0].content
              
        # gets the actors/actresses
        stars = []
        for k in e.by_tag("p")[2].by_tag("a"):
            stars.append(k.content.encode("utf-8"))
        stars = ", ".join(stars)

        # gets the runtime
        runtime = e.by_tag("span.runtime")[0].content.strip(' min')

        # puts tvserie in the results 
        temp_res = []
        temp_res.extend([title, rating, genres, stars, runtime])
        result.append(temp_res)

    return result

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # writes tvseries to csv file
    for tvserie in tvseries:
        writer.writerow(tvserie)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)