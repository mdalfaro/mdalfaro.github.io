import download_history
import subprocess
import clean_forecasts
import start_server

def main():
	# Download Chrome history
	download_history.downloadHistory()

	# Forecast
	bashCommand = "Rscript wiki_ts.R"
	process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
	output, error = process.communicate()
	clean_forecasts.cleanForecasts()

	# Start server & open js app
	start_server.openBrowser()
	start_server.startServer()

main()