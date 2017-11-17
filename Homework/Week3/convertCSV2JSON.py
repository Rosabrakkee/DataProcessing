""" Rosa Brakkee 10777601
    DataProc week 3
    converts a CSV to a JSON file
"""
import csv
import json
from collections import OrderedDict

# The fieldsnames for the JSON and the array to add data from
fieldnames = ("Country","CO")
entries = []

# Reads the csv file
with open('CO2_countries.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile, fieldnames)
    for row in reader:
        # OrderedDict remembers the order entries where added
        entry = OrderedDict()
        for field in fieldnames:
            entry[field] = row[field]
        entries.append(entry)

# Wrties to JSON file
with open('data.JSON', 'w') as jsonfile:
    json.dump(entries, jsonfile)
    jsonfile.write('\n')
