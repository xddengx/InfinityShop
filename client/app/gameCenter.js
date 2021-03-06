/* Game Center for user to win more Spiral Cash */

var csrfToken;
var spirals;
var currentDate;
var nextDay;

// Daily Reward - user is able to collect a daily reward every 24hours
// function is called when page is loaded to ensure button is disabled/enabled
const checkDailyReward = () => {
  var dailyRStatus;
  let currentTime = new Date();

  // console.log("current time", currentTime);

  sendAjax('GET', '/getDRStatus', null, (result) => {
    dailyRStatus = result;

    // get the next time user is allowed to collect reward (specific to each user)
    sendAjax('GET', '/getNextDay', null, (retrieve) => {
      // save the next day as a Date object
      let tomorrow = new Date(retrieve);

      // user already clicked
      // it's not the next day
      // button should be disable (disable = true)
      if (dailyRStatus === true && (currentTime < tomorrow)) {
        // console.dir("3");
        document.querySelector("#dailyRewardButton").disabled = true;
      }

      // user already clicked
      // it's the next day
      // button should be clickable (disable = false)
      if (dailyRStatus === true && (currentTime > tomorrow)) {
        // console.dir("4");
        document.querySelector("#dailyRewardButton").disabled = false;
      }
    });
  });
}

// wWhen button is clicked enable/disable button
const afterButtonClicked = () => {
  let dailyStatus;
  sendAjax('GET', '/getDRStatus', null, (result) => {
    dailyStatus = result;
    if (dailyStatus == false) {
      // console.dir("1");
      document.querySelector("#dailyRewardButton").disabled = false;
    }

    if (dailyStatus == true) {
      // console.dir("2");
      document.querySelector("#dailyRewardButton").disabled = true;
      checkDailyReward();
    }
  });
}

// Game of Chance - generate a random winning number and the user's random number
// if the two numbers match the user wins. 
// Currently: spiral cash is not added to the user's account
const playChance = () => {
  let spiralCashWon = 50; // default of spiral cash won
  let winningNum = Math.floor(Math.random() * 10);    // random winning number
  let userNum = Math.floor(Math.random() * 10);       // users generated number

  let param = `won=${spiralCashWon}&_csrf=${csrfToken}`;
  if (winningNum == userNum) {
    sendAjax('PUT', '/updateSpiralsWon', param, function () {
      getSpiralsGC(); // update the spirals text display
      // console.dir("success");
    });
    $("#winNum").text(winningNum);
    $("#userNum").text(userNum);
    $("#message").text("You won " + spiralCashWon + " Spiral Cash!");
  } else {
    $("#winNum").text(winningNum);
    $("#userNum").text(userNum);
    $("#message").text("Sorry, better luck next time!");
  }
}

const getDailyReward = () => {
  document.querySelector("#dailyRewardButton").disabled = true;
  let dailyCollect = 100;

  // get time when user clicked on reward button
  currentDate = new Date();
  // calculate the next day (so button can be enabled again)
  nextDay = new Date();
  nextDay.setDate(currentDate.getDate() + 1);
  // nextDay = new Date("2018-12-03T23:16:00-06:00");

  // console.log("currentdate", currentDate);
  // console.log("nextDay", nextDay);

  // if user clicks on daily reward update the boolean in account. 
  let paramStatus = `nextDay=${nextDay}&status=${true}&_csrf=${csrfToken}`;
  sendAjax('PUT', '/updateDRStatus', paramStatus, function () {
    // console.dir("clicked on daily reward button");
    checkDailyReward();
  });

  let param = `won=${dailyCollect}&_csrf=${csrfToken}`;

  sendAjax('PUT', '/updateSpiralsWon', param, function () {
    getSpiralsGC(); // update the spirals text display
    console.dir("success");
  });
}

// Game of Chance display
const Chance = function () {
  return (
    <div id="gameCont">
      <div id="dailyReward">
        <div className="column left">
          <h2>Daily Reward</h2>
          <p> Collect your bonus every 24 hours </p>
        </div>
        <div className="column right">
          <button className="gameButton" id="dailyRewardButton" onClick={(e) => getDailyReward(e)}> Collect </button>
        </div>
      </div>

      <div id="chanceGame">
        <div className="column left">
          <h2> Game of Chance </h2>
          <p>Will you get the lucky number? </p>
          <button className="gameButton gameBtns" onClick={(e) => playChance(e)}> Play </button>
        </div>
        <div className="column right" id="chanceInfo">
          <p>Winning number: <span id="winNum"></span></p>
          <p>Your number: <span id="userNum"></span></p>
          <h3 id="message"></h3>
        </div>
      </div>
    </div>
  );

}

// Display Sprial Cash
const SpiralCash = function (obj) {
  return (
    <div className="money">
      <a href="/gameCenter">Spiral Cash: $ {obj.spiral}</a>
    </div>
  );

}

// Get spiral cash
const getSpiralsGC = () => {
  sendAjax('GET', '/getSpirals', null, (result) => {
    ReactDOM.render(
      <SpiralCash spiral={result} />, document.querySelector("#infinityCoins"),
    );
  });
};

// setup
const gameSetup = function (csrf) {
  ReactDOM.render(
    <Chance csrf={csrf} />, document.querySelector("#games")
  )

  ReactDOM.render(
    <SpiralCash spiral={spirals} />, document.querySelector('#infinityCoins')
  );
  getSpiralsGC();
}

const getTokenGame = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    gameSetup(result.csrfToken);
    csrfToken = result.csrfToken;
  });
};