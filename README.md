# Data-Viz-Project

Background & motivation
We have long been enamoured by baseball. Initially, we both started out simply watching and rooting for our respective Major League Baseball (MLB) home teams – Aren pulling for The Los Angeles Angels of Anaheim and Max rooting (more fruitfully) for the San Francisco Giants. While we still do enjoy the thrills of watching our clubs representing our home towns, we have added to the mix another element through which we can enjoy the game – fantasy baseball. Fantasy baseball widens the scope of enjoying the MLB, making games that are of no consequence to our home teams relevant for the fact that we root for players on our fantasy teams. So, what is fantasy baseball exactly? 
Fantasy baseball is a game in which users compete against one other by compiling points derived from the performance of MLB players. Ottoneu is an online platform that hosts more involved fantasy baseball leagues, and will act as the league type that we will stick to in this project. Ottoneu hosts dynasty leagues – i.e., leagues in which fantasy teams may “keep” players on their team from season to season. This results in the need for owners to manage short term and long term success. Three main constraints exist in an Ottoneu league – the number of fantasy teams (12), the maximum possible roster spots available (40 players), and cap space ($400). Each player is valued (in dollars) based on the results of an auction for that individual player. Maximizing points based on these constraints is the goal of the game.
Teams are filled with players via auctions. Two flavors of auctions exist – in-season acquisitions and the main, preseason draft. In this project, we will focus solely on the main, preseason draft. Going into the draft, each of the twelve team arrive with partially filled rosters based on which players they chose to keep from the previous season. Thus, each team begins the draft with a variable amount of roster spots and cap space. It follows that the needs of each team differ drastically based on the players that each team decides to keep. The draft works in the following way: A team nominates a player to be auctioned. The league bids on this player in a timed atmosphere. The team with the highest bid when the time runs out wins the player. 
The three-hour long auction draft, although only taking a relatively small amount of time in the scope of this year-long commitment, is a central foundation on which successful teams are built. Auction drafts, though, demand analyzing a variety of moving variables under time pressure. The current draft interface provided by Ottoneu is simple, providing only the necessary information. We believe that we can make an interactive visualization that owners can utilize in order to make smarter, more data-driven decisions come draft day. 




Project Objectives
We would like to create a visualization tool that owners can use as an aid to improve time-constrained decision-making during the auction draft. Chiefly, we would like to build a visualization that could first and foremost answer the following question:

Given my current roster and budget, which players would add the most value to my team?

	We believe that this problem has a hierarchical solution, meaning that there is an initial quick and dirty solution that will quickly solve the problem, with many features that can be added onto it. We will discuss this more in the following sections, namely Must-Have Features & Optional Features.

Data
	All data will be gleaned from Fangraphs.com (an excellent free resource that provides seemingly endless MLB data). Using mono-sourced data should provide consistency in format (e.g., Player name consistency). Three types of data will be used: projection data, current rosters, and average values. For simplicity, we will combine all three of our files into one csv file.
	
	Projection Data	
There are a variety of projections out there, so ideally, we will let the user use whatever projections he or she wants to. Here are some examples of available projection data: 

		• ZiPS 		Projections courtesy of Dan Szymborski
		• Fans		Created by anyone
• Steamer	steamerprojections.com
		• Steamer600	Steamer projections given standard 600PA /65IP / 200IP
		• Depth Charts	A combination of ZiPS and Steamer projections with playing time 
allocated by Fangraphs staff
		• ATC		Ariel Cohen
		• The BAT	Projections courtesy of Derek Carty

	Current Rosters
		This file will provide three key elements – Player Name, Fantasy Team, Dollar Value. 

	Average Values
An assortment of helpful tidbits (Such as %-owned, average $ values) that would be interesting to add to a player card. 

Data Processing
We hope to combine all of the projections & current lineups into one CSV file. In order to successfully do this, we will most likely utilize PostgreSQL in order to write some queries to properly join the necessary information together without including excess information. We don’t expect this to be substantially difficult for two reasons: The data sources all will come from Fangraphs.com, so the elements on which we will group (such as Player Name or Fantasy Team) will all be standardized. Secondly, we have experience writing SQL queries. 

Visualization Design
	• Attached are some preliminary visualization designs.
	

Must-Have Features
	• The ability to SORT
	• Legible player names on the x-axis. 
	• Some sort of hover over details-on-demand.

Optional Features
• Given the rosters of my opponents, what value would this player add to an average fantasy team, and how does that value compare to my team? (If there is a large discrepancy here, maybe I can get a discount!) 
	• The ability to toggle between which projections to use. 
	• A detailed player card that displays other information of the player via the CSV. 
	• The ability to toggle between sort types. 

