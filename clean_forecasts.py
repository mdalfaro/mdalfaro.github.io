import pandas as pd
import datetime

def cleanForecasts(path='forecast.csv'):

	# Read in
	forecasts = pd.read_csv(path)
	historical = pd.read_csv('wiki_history.csv')

	# Clean up df
	forecasts.columns = ['date', 'forecast', '80_lo', '80_hi', '95_lo', '95_hi']
	historical['date'] = pd.to_datetime(historical['date'])
	forecasts['date'] = pd.date_range(historical['date'].max(), max(historical['date']) + datetime.timedelta(days=len(forecasts)-1))
	forecasts.drop(columns=['80_lo', '80_hi'], axis=1, inplace=True)

	# Write out
	forecasts.to_csv('forecast.csv')