# imports
import csv
import os

# Set working directory
os.chdir("/Users/maxalfaro/Desktop/Life/USF/Classes/2017-2018/Spring/Data Visualization/Assignment 3/Data")

# Read in file
file = open("/Users/maxalfaro/Desktop/Life/USF/Classes/2017-2018/Spring/Data Visualization/Assignment 3/Data/facebook/3980.edges", "r")

# Create csv
cleanedData = open('cleanedData.csv', 'w')

# Iterate over initial file
lines = file.readlines()
data = []

for line in lines:
    cleanLine = []
    for word in line.split():
        cleanLine.append(word)
    data.append(cleanLine)

# Add to csv
with cleanedData:
    writer = csv.writer(cleanedData)
    writer.writerows(data)
