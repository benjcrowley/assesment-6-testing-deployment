const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())
//include and initialize rollbar
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '307008ee0f1146a59533bd2d054d0bbe',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

//middleware to serve the files from the public folder
app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.js'))
  })

app.get('/styles', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.css'))
  })
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
  })
// middleware to serve static files (Dueling... wouldnt change to you won or you lost, counter would increase if i refreshed the page after a battle)
// app.use('/js', express.static(path.join(__dirname, 'public/index.js')))
//pushing to get hub to see if this fixed it
//commented it out, because when i added the rollbar back in, the bug continued. now i have both rollbar and static commented out

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        rollbar.critical('bots are not being sent for See All Bots')
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        if(compDuo.length != 2) {
            rollbar.warning('the match is not fair')
        }
        // add rollbar info to let us know how many times our game is played
        rollbar.info('someone played Duel Duo')
        res.status(200).send({choices, compDuo})
    } catch (error) {
        rollbar.critical('choices are not displayed')
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
            //moved rollbar after the res.status to see if we can make it work
            //there was a bug here, lets see if it still happens
            if (wins === 0) {
                rollbar.warning('Wins counter is not increasing')
            }
            
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})