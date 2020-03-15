suppressMessages(library(lubridate))

tryCatch({
  suppressWarnings(library(forecast))
}, error = function(e) {
  install.packages('forecast',repos = 'http://cran.us.r-project.org')
})


views <- read.csv('wiki_history.csv')

start_day <- decimal_date(as.Date(views['date'][[1]][1]))

# Create time series object
views_ts <- ts(views['total'], start=start_day, freq=365)

# Use auto.arima to choose ARIMA terms
fit <- auto.arima(views_ts, seasonal=FALSE)

# Forecast for next 30 days
fore <- forecast(fit, h = 30)

# Write to csv 
write.csv(fore, 'forecast.csv')
