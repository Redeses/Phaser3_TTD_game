# TTD - Tank Tower Defence

TTD was a project made for a school project, but due to how well it turned out considering the limited scope and time frame it stands as one of my favourites. The project is a game made with phaser3.js framework using JavaScript and html. 


## Installation

Download this project from the repository

Download Node.js from [Nodejs.org](https://nodejs.org/en/download/)

Navigate to the project directory and give the command:
```bash
npm install
```


## Running the TTD
Using Node.js command prompt installed when downloading Node.js, navigate to the directory where the document is and start the project by 
```node.js
npm start

```
or if you wish modify the project
```node.js
nodemon start

```
!Project runs on port 8080, so make sure it is available or change the port at package.json start script

## Future development
- randomly generated maps. Since the code for making a path is essentially dynamic this 
would only require building tilesets with pathing functionality and making a world 
generator
- Upgrades: Giving the tanks the possibility of upgrades
- Better UI. Making the UI a bit more responsive and adding better information widgets 
so player won’t get confused.
- Enemy variety: Makingother types of enemies would not take much more and having 
enemies that are like bosses would make the gameplay more interesting. Giving the 
enemies resistance to different types of damage would also be a good twist into the 
gameplay loop
- Sound effects and animations: I would add sounds to all of the event in the game and 
animation to all of the tanks
- Code improvement: The currently is a bit of a mess and I would add classes to make it 
more clear on what does what
## License

[MIT](https://choosealicense.com/licenses/mit/)
