/* Game Center for user to win more Spiral Cash */

var csrfToken;

// Game of Chance - generate a random winning number and the user's random number
// if the two numbers match the user wins. 
// Currently: spiral cash is not added to the user's account
const playChance = () =>{
    let spiralCashWon = 50;
    let winningNum = Math.floor(Math.random() * 20);
    let userNum = Math.floor(Math.random() * 20);

    if(winningNum == userNum){
        $("#message").text("You won " + spiralCashWon + " Spiral Cash!");
    }else{
        $("#message").text("Sorry you did not get the lucky number. Your number: " + userNum + 
            " | Winning number: " + winningNum);
    }
}

// Game of Chance display
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

// const getTokenGame = () => {
//     sendAjax('GET', '/getToken', null, (result) => {
//         gameSetup(result.csrfToken);
//         csrfToken = result.csrfToken;
//     });
// };

// $(document).ready(function(){
//     // getTokenGame();
// });