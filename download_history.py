import datetime
import pandas as pd
import numpy as np
import sqlite3
import os
import getpass

pd.options.mode.chained_assignment = None

def getChromeHistoryPath():

	try:
		path = '/Users/' + getpass.getuser() + '/Library/Application Support/Google/Chrome/Default/History'
		if not os.path.isfile(path):
			raise Exception('invalid path')
	except:
		# Get user's path to Chrome History folder
		path = input('Provide path to Chrome History folder.\ne.g., /Users/maxalfaro/Library/Application Support/Google/Chrome/Default/History\nPath: ')

	return(path)

def getHistory(path):

	# Create a connection that represents the database
	conn = sqlite3.connect(path)

	# Select all URLs with '- Wikipedia' in the title
	query = "SELECT title, last_visit_time AS date, url \
	    FROM urls \
	    WHERE title LIKE '%- Wikipedia%'"

	# Pipe query results into dataframe
	wiki_history = pd.read_sql_query(query, conn)

	return(wiki_history)


def clean(wiki_history):

	# Remove entries with missing dates
	wiki_history = wiki_history[wiki_history['date'] != 0]

	# Convert 'last_visit_time' from miliseconds-since-1601 to datetime
	wiki_history['date'] = wiki_history['date'].apply(lambda microsecs : (datetime.datetime(1601, 1, 1) + datetime.timedelta(microseconds=microsecs)).replace(microsecond=0))

	# Remove the '- Wikipedia' part from the titles
	wiki_history['title'] = wiki_history['title'].apply(lambda x : x.replace(' - Wikipedia', ''))

	# Wiki views per day
	views_per_day = wiki_history['date'].apply(lambda date : str(date).split(' ')[0]).value_counts()
	views_per_day = pd.DataFrame({'date':list(views_per_day.index), 'count':list(views_per_day)})
	views_per_day['date'] = views_per_day['date'].apply(lambda x : datetime.datetime(int(x.split('-')[0]), int(x.split('-')[1]), int(x.split('-')[2])))

	# Fill in misssing dates with (date, 0) entries
	time_range = pd.DataFrame({'date':list(pd.date_range(min(views_per_day['date']), max(views_per_day['date'])))})
	views_per_day = pd.DataFrame.merge(views_per_day, time_range, on='date', how='right')
	views_per_day.fillna(0, inplace=True)
	views_per_day.sort_values('date', inplace=True)

	# Add running sum column
	views_per_day['total'] = list(np.cumsum(views_per_day['count']))

	return(views_per_day)

def writeOut(df, path='wiki_history.csv'):
	# Write to csv
	df.to_csv(path)


def downloadHistory():
	path = getChromeHistoryPath()
	df = clean(getHistory(path))
	writeOut(df)
