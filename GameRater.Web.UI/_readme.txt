Download the GameRater project here:
	- https://github.com/ptamas92/GameRater

1.) Install Node.js from here:
	- https://nodejs.org/en/

2.) Open Visual Studio, then install the following in the Extensions / Manage Extensions menu item on the header:
	- NPM Task Runner
	- WebPack Task Runner

3.) Open the Task Runner Explorer window (View / Other Windows) then click below to run the commands:
	- package.json / Defaults / install
	- webpack.config.js / Watch / Watch - development

4.) Build Solution

5.) Set ConnectionString in the appsettings.json

6.) Open the Package Manager Console window (View / Other Windows) and after selecting the "GameRater.Repo" project, run the following command:
	- update-database

/****************************************************************************************************************************************************************/

Megjegyzések:

- Az alkamazás nem a "Single Page Application" elven mûködik. A fejléc a klasszikus módon "redirect"-el. Természetesen éles környezetben nem így valósítanám meg. 

- Kimaradt a "cache"-elés, amivel a lekérdezések optimalizálhatók lehetnnének.

- A "log"-olás is kimaradt, amit legalább az alkalmazás indításakor, illetve adatbázis DML mûveletek (insert, update, delete) futtatása esetén illene naplózni.

- Bár a megjelenõ tartalmak "resonsive"-ak, a mobilos dizájnnal nem volt foglalkozva.


nyelvesítés