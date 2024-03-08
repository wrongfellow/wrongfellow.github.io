var jobsDiv = document.querySelector(".jobs")
var recDiv = document.querySelector(".resources")

function jobsClick(e) {
    var target = e.target
    if (!target) target = e.touchs[0].target
    // alert(target.innerText)
    if ( target.classList.contains('job-div') ) {
        jobs.forEach( (job, index) => {
            if (job.name === target.innerText) changeJob(index)
        })
    }
}

jobsDiv.addEventListener("mousedown", jobsClick, false);
jobsDiv.addEventListener("touchstart", jobsClick, false);



var currentJob = 0
var lastSave = Date.now()
var loopSpeed = 1000
var last_time = Date.now()

var resources = [
    {name: "Credits", amount: 0, new: false},
    {name: "Faction", amount: 0, new: true},
    {name: "Ore", amount: 0, new: true}
]

var jobs = [

    {
        name: "Door Dash",
        req: [],
        reward: [{resource: 0, amount: 1}],
        new: false
    },

    {
        name: "Courier",
        req: [{resource: 0, amount: 20}],
        reward: [
            {resource: 0, amount: 1},
            {resource: 1, amount: 1}
        ],
        new: true
    },

    {
        name: "Faction Ore Job",
        req: [{resource: 1, amount: 30}],
        reward: [
            {resource: 0, amount: 1},
            {resource: 2, amount: 2}
        ],
        new: true
    },

]

function updateJobs() {
    var jobsHTML = ""
    jobs.forEach( (job, index) => {
        var show = true
        job.req.forEach( (req) => {
            if ( resources[req.resource].amount < req.amount ) show = false
        })
        if ( show === true ) job.new = false

        if ( job.new === false ) {
            jobsHTML += "<div class='job-div"
            if (index === currentJob) {
                jobsHTML += ' currentJob'
            }
            jobsHTML += "' onclick='changeJob(" + index + ")'"
            jobsHTML += ">" + job.name + "</div>"
        }
    })
    jobsDiv.innerHTML = jobsHTML
}

function updateResources() {
    var recHTML = ""
    resources.forEach( (rec, index) => {
        if (rec.amount > 0) rec.new = false
        if (rec.new === false) {
            recHTML += "<div>" + rec.name + ": " + Math.floor(rec.amount) + "</div>"
        }
    })
    recDiv.innerHTML = recHTML
}

function changeJob(index) {
    currentJob = index
    updateJobs()
}




// setInterval(gameLoop, loopSpeed)

// function gameLoop() {
//     getResources(loopSpeed / 1000)
//     updateDisplay()
//     if (Date.now() > lastSave + 10000) saveGame() // save every 10 seconds
// }


function gameLoop(current_time) {
    if (last_time === null) last_time = current_time;
    const delta_time = current_time - last_time;
    // console.log(current_time, delta_time)
    last_time = current_time;
    
    if (delta_time > 0) getResources(delta_time);
    updateDisplay()
    
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);



// function getResources(ticks) {
//     var diff = Date.now() - lastGet
//     console.log(ticks, diff)
//     jobs[currentJob].reward.forEach( (rew) => {
//         resources[rew.resource].amount += rew.amount * ticks * diff/loopSpeed
//     })
// }

function getResources(delta) {
    // console.log(delta)
    jobs[currentJob].reward.forEach( (rew) => {
        resources[rew.resource].amount += rew.amount * (delta/1000)
        // console.log(resources[rew.resource].amount, rew.amount, delta)
    })
}




function updateDisplay() {
    updateJobs()
    updateResources()
}

function saveGame() {
    lastSave = Date.now()
    var gameSave = {
        currentJob: currentJob,
        lastSave: lastSave,
        resources: resources
    }
    localStorage.setItem("gameSave",JSON.stringify(gameSave))
}

function loadGame() {
    if (localStorage.getItem("gameSave") !== null) {
        var savedGame = JSON.parse(localStorage.getItem("gameSave"))
        if (typeof savedGame.currentJob !== "undefined") currentJob = savedGame.currentJob
        if (typeof savedGame.lastSave !== "undefined") lastSave = savedGame.lastSave;
        if (typeof savedGame.resources !== "undefined") {
            for (i=0; i<savedGame.resources.length; i++) {
                resources[i].amount = savedGame.resources[i].amount
            }
        }
        if ( Date.now() > lastSave + 10000 ) {
            var timeGone = Math.floor( (Date.now() - lastSave) / 1000 )
            getResources(timeGone)
            alert("You have been gone for " + timeGone + " seconds.  Resources have been updated.")
        }
    }
    updateDisplay()
}

function resetGame() {
    if (confirm("Are you sure you want to reset your game?")) {
        var gameSave = {};
        localStorage.setItem("gameSave",JSON.stringify(gameSave));
        location.reload();
    }
}