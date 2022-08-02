let alarm = new Audio('sound/alarm.mp3');
let input = 2;
let numberOfMinutes = 1000 * 60 * input;
let timer = document.getElementById('timer');
let timerStarted = false;

let displayStartBtn = true;
document.getElementById('stopper').style.display = 'none';

document.getElementById('starter').addEventListener('click', startTimer);

function startTimer() {
        if (!timerStarted) {
        timerStarted = false;
        console.log('Timer started ' + timerStarted);
        toggleStartBtn();
        changeBackground();
        let startTime = new Date().getTime();
        numberOfMinutes = 1000 * 60 * input;
        console.log(input);
        let endTime = startTime + numberOfMinutes;

        const idTimer = setInterval(runTimer, 1000);

        function runTimer() {
            let timeLeft = endTime - new Date().getTime();
            if (timeLeft > 0) {
                let minutes = timeLeft / (1000 * 60);
                minutes = Math.floor(minutes);
                let seconds = (timeLeft / 1000) % 60;
                seconds = Math.round(seconds);
                seconds = ('0' + seconds).slice(-2);
                let text = '0' + minutes + ' : ' + seconds;
                timer.innerHTML = text;
            } else {
                clearInterval(idTimer);
                timerStarted = false;
                timer.innerHTML = '00 : 00'
                alarm.play();
                console.log('end');
            }

            document.getElementById('stopper').addEventListener('click', pauseTimer);

            function pauseTimer() {
                clearInterval(idTimer);
                timerStarted = false;
                console.log('Timer stopped! (' + timerStarted + ')' )
                toggleStartBtn();
            }
        }
    }
}


function toggleStartBtn() {
    console.log('toggle button: ' + displayStartBtn);
    if (displayStartBtn) {
        document.getElementById('starter').style.display = 'none';
        document.getElementById('stopper').style.display = 'block';
    } else {
        document.getElementById('starter').style.display = 'block';
        document.getElementById('stopper').style.display = 'none';
        }
    displayStartBtn = !displayStartBtn;
}

let toggleBackground = true;
function changeBackground() {
    document.body.className = toggleBackground
        ? 'background-blue'
        : 'background-black';
    toggleBackground = !toggleBackground;
}

function validateInput() {
    input = document.getElementById('time-round_1').value;
    if (input < 1) {
        alert('Please enter the number of minutes required.\n' + input + ' minutes is not a valid input.')
    }
    document.getElementById('timer').innerText = ((input < 10) ? '0' : '') + input + ' : 00';
    document.getElementById('label-round_1').innerHTML = (input == 1 ? 'Minute \u00A0' : 'Minuten');
}

function resetInput() {
    input = 2;
    document.getElementById('timer').innerText = '02 : 00';
    document.getElementById('label-round_1').innerHTML = 'Minuten';
}


