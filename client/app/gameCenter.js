/* Game Center for user to win more Spiral Cash */

// TODO: next day is never stored and next day is only set when button is clicked. so when page
//refreshes it doesnt know what the next day is. create another object literal in account for storing times...


var csrfToken;
var spirals;
var currentDate; 
var nextDay;

const checkDailyReward = () =>{
    var dailyRStatus;

    let currentTime = new Date();

    console.log("current time", currentTime);

    // if(currentTime < test){
    //     document.querySelector("#dailyRewardButton").disabled = true;
    // }
    // if(currentTime > test){
    //     document.querySelector("#dailyRewardButton").disabled = false;
    // }

    sendAjax('GET', '/getDRStatus', null, (result) =>{
        dailyRStatus = result;  // should be false
        console.log("point A");
        console.log("here", dailyRStatus);

        sendAjax('GET', '/getNextDay', null, (retrieve) => {
            let tomorrow = new Date(retrieve);
            console.log("tomorrow", tomorrow);
            // console.log("tomorrow", tomorrow.setDate(retrieve.getDate()));

            console.log("dailyRStatus", dailyRStatus);
                    // user has not yet clicked

            // user already clicked
            // it's not the next day
            // button should be disable (disable = true)
            if(dailyRStatus === true && (currentTime < tomorrow)){
                console.dir("3");
                document.querySelector("#dailyRewardButton").disabled = true;
            }

            // user already clicked
            // it's the next day
            // button should be clickable (disable = false)
            if(dailyRStatus === true && (currentTime > tomorrow)){
                console.dir("4");
                document.querySelector("#dailyRewardButton").disabled = false;
            }
        });
    });
}

const afterButtonClicked = () =>{
    let dailyStatus;
    sendAjax('GET', '/getDRStatus', null, (result) =>{
        dailyStatus = result;  // should be false
        if(dailyStatus == false){
            console.dir("1");
            document.querySelector("#dailyRewardButton").disabled = false;
        }

        if(dailyStatus == true){
            console.dir("2");
            document.querySelector("#dailyRewardButton").disabled = true;
            checkDailyReward();
        }
    });
}

// Game of Chance - generate a random winning number and the user's random number
// if the two numbers match the user wins. 
// Currently: spiral cash is not added to the user's account
const playChance = () =>{
    let spiralCashWon = 50;
    let winningNum = Math.floor(Math.random() * 10);
    let userNum = Math.floor(Math.random() * 10);

    let param = `won=${spiralCashWon}&_csrf=${csrfToken}`;
    if(winningNum == userNum){
        sendAjax('PUT', '/updateSpiralsWon', param, function(){
            getSpiralsGC(); // update the spirals text display
            console.dir("success");
        });
        $("#message").text("You won " + spiralCashWon + " Spiral Cash!");
    }else{
        $("#message").text("Sorry you did not get the lucky number. Your number: " + userNum + 
            " | Winning number: " + winningNum);
    }
}

const getDailyReward = () =>{
    document.querySelector("#dailyRewardButton").disabled = true;

    let dailyCollect = 100;

    // get time when user clicked on reward button
    currentDate = new Date();
    // calculate the next day (so button can be enabled again)
    nextDay = new Date();
    nextDay.setDate(currentDate.getDate()+1);
// nextDay = new Date("2018-12-03T23:16:00-06:00");

    console.log("currentdate", currentDate);
    // console.log("nextDay", nextDay);

    // if user clicks on daily reward update the boolean in account. 
    let paramStatus = `nextDay=${nextDay}&status=${true}&_csrf=${csrfToken}`;
    sendAjax('PUT', '/updateDRStatus', paramStatus, function(){
        console.dir("clicked on daily reward button");
        checkDailyReward();
    });

    let param = `won=${dailyCollect}&_csrf=${csrfToken}`;

    sendAjax('PUT', '/updateSpiralsWon', param, function(){
        getSpiralsGC(); // update the spirals text display
        console.dir("success");
    });
}

// Game of Chance display
const Chance = function(){
    return (
        <div className="dailyReward">
            <h2> Game of Chance | Will you get the lucky number? </h2>
            <p>Rules: Play to see if your number is our winning number.</p>
            <button className="gameButton" onClick={(e)=>playChance(e)}> Play </button>

            <h2> Collect Your Daily Reward</h2>
            <button className="gameButton" id="dailyRewardButton" onClick={(e)=>getDailyReward(e)}> Collect Reward </button>
        </div>
    );

}

const SpiralCash = function(obj){
    return (
        <div className="money">
            <a href="/gameCenter">Spiral Cash: $ {obj.spiral}</a>
        </div>
    );

}

const getSpiralsGC = () => {
    sendAjax('GET', '/getSpirals', null, (result) => {
        ReactDOM.render(
            <SpiralCash spiral={result} />, document.querySelector("#spiralsGameCenter"),
        );
    });
};

const gameSetup = function(csrf){
    ReactDOM.render(
        <Chance csrf={csrf} />, document.querySelector("#games")
    )

    ReactDOM.render(
        <SpiralCash spiral={spirals} />, document.querySelector('#spiralsGameCenter')
    );
    getSpiralsGC();
}

const getTokenGame = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        gameSetup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

// $(document).ready(function(){
//     // getTokenGame();
// });