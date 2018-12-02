/* Game Center for user to win more Spiral Cash */

var csrfToken;
var spirals;

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
    // TODO: do time here.
    // if user clicked && date is still current date -> disable button
    // else disable = false
    document.querySelector("#dailyRewardButton").disabled = true;
    let dailyCollect = 100;

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
            <button onClick={(e)=>playChance(e)}> Play </button>

            <h2> Collect Your Daily Reward</h2>
            <button id="dailyRewardButton" onClick={(e)=>getDailyReward(e)}> Collect Reward </button>
        </div>
    );

}

const SpiralCash = function(obj){
    console.dir(obj);
    return (
        <div className="money">
            <a href="/gameCenter">Spiral Cash: {obj.spiral}</a>
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