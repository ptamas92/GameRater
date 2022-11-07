0.) Download the GameRater project here:
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

username: test@email.com / test2@email.com
password: #Aaaaaa1

/****************************************************************************************************************************************************************/

Megjegyz�sek:

- Az alkamaz�s nem minden tekintetben m�k�dik a "Single Page Application" elven. A fejl�c, a klasszikus m�don "redirect"-el. Term�szetesen �les k�rnyezetben nem �gy val�s�tan�m meg. 

- A "cache"-el�ssel nem foglalkoztam, amivel a lek�rdez�sek optimaliz�lhat�k lehetnn�nek.

- A "log"-ol�s is kimaradt, amit legal�bb az alkalmaz�s ind�t�sakor, illetve adatb�zis DML m�veletek (insert, update, delete) futtat�sa eset�n illene napl�zni.