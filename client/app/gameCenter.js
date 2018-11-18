var csrfToken;
var spirals;

const playChance = () =>{
    let spiralCashWon = 50;
    let winningNum = Math.floor(Math.random() * 20);
    let userNum = Math.floor(Math.random() * 20);

    if(winningNum == userNum){
        $("#message").text("You won " + spiralCashWon + " Spiral Cash!");
    }else{
        $("#message").text("Sorry you did not get the lucky number. Your number: " + userNum + " | Winning number: " + winningNum);
    }
}

const DailyReward = function(){
    return (
        <div className="dailyReward">
            <h2> Game of Chance | Will you get the lucky number? </h2>
            <p>Rules: Play to see if your number is our winning number.</p>
            <button onClick={(e)=>playChance(e)}> Play </button>
        </div>
    );

}

const gameSetup = function(csrf){
    ReactDOM.render(
        <DailyReward csrf={csrf} />, document.querySelector("#games")
    )
}

const getTokenGame = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        gameSetup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function(){
    getTokenGame();
});