let alarm = new Audio('sound/alarm.mp3');
document.getElementById('btn-start').addEventListener('click', startTimer);

let timer = document.getElementById('timer');
let m = 5;
let mSaved = m;
let minutes = 0;
let seconds = 0;
let text ='';
showTime(1000 * 60 * m);
let timerStarted = false;

function startTimer() {

    if (!timerStarted) {
        timerStarted = true;
        let startTime = new Date().getTime();
        let endTime = startTime + (1000 * 60 * m);
        console.log('timer started');

        const myTimer = setInterval(runTimer, 1000);

        function runTimer() {
            let timeLeft = endTime - new Date().getTime();

            if (timeLeft > 0) {
                showTime(timeLeft);
            } else {
                clearInterval(myTimer);
                timerStarted = false;
                alarm.play();
                timer.innerHTML = '00 : 00';
                setTimeout(function () {
                    m = mSaved;
                    showTime(1000 * 60 * m);
                    console.log('lapse terminated')
                }, 11000);
            }
        }

        document.getElementById('btn-stop').addEventListener('click', stopTimer);

        function stopTimer() {
            if (timerStarted) {
                clearInterval(myTimer);
                console.log('timer stopped');
                let timeRemaining = timer.innerHTML;
                console.log(timeRemaining);
                // yet to calculate m...

                setTimeout(function () {
                    timerStarted = false;
                }, 1500);
            } else {
                showMessage('noStop', 'Timer isn\'t running');
                console.log(timerStarted);
            }
        }
    } else {
        showMessage('noRun', 'Timer already started');
    }
}

function showTime(timeLeft) {
    minutes = Math.floor(timeLeft / (1000 *60));
    seconds = Math.round(timeLeft / 1000) % 60;
    seconds = ('0' + seconds).slice(-2);
    text = '0' + minutes + ' : ' + seconds;
    timer.innerHTML = text;
}

document.getElementById('btn-reset').addEventListener('click', reset);

function reset() {
    if (timerStarted) {
        showMessage('noReset', 'Timer is still running')
    } else {
        m = mSaved;
        showTime(1000 * 60 * m);
    }
}

function showMessage(idClip, message) {
    document.getElementById('msg_' + idClip).style.display = 'block';
    document.getElementById('msg_' + idClip).innerHTML = message;
    setTimeout(function () {
        document.getElementById('msg_' + idClip).style.display = 'none';
    }, 2000);

}

