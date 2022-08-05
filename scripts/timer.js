let timer = document.getElementById('timer');

let l = 1;
let lSaved = 1;
let round = 1;

let m = 2;
let minutes = 0, seconds = 0;
let text = '';
showTime(1000 * 60 * m);

let alarm = new Audio('sound/notification-happy-bells.wav');
let btnStartAndStop = new Audio('sound/btn-start-and-stop.mp3');
let btnReset = new Audio('sound/btn-reset.wav');

const delay = 500; // anti-rebound for 500ms
let lastExecution = 0;

document.getElementById('btn-start').style.display = 'block';
document.getElementById('btn-start').addEventListener('click', startTimer);

function startTimer() {
    btnStartAndStop.play();
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'block';
    document.getElementById('lapse').innerHTML = (l>1) ? 'Runde 1 von ' + l : '';

    let endTime = new Date().getTime() + (1000 * 60 * m);

    console.log('timer started');


    let myTimer = setInterval(runTimer, 1000);

    function runTimer() {
        let timeLeft = endTime - new Date().getTime();

        if (timeLeft > 0) {
            showTime(timeLeft);
        } else {
            --l;
            console.log('l: ' + l);
            if (l > 0) {
                alarm.play();
                console.log('lapse terminated (non-final)')
                ++round;
                document.getElementById('lapse').innerHTML = 'Runde ' + round + ' von ' + lSaved;
                endTime = new Date().getTime() + (1000 * 60 * m);

            } else {
                clearInterval(myTimer);
                alarm.play();
                timer.innerHTML = '00 : 00';
                console.log('lapse terminated (final)')
                setTimeout(function () {
                    showTime(1000 * 60 * m);
                    document.getElementById('btn-start').style.display = 'block';
                    document.getElementById('btn-stop').style.display = 'none';
                    clearInterface();
                }, 3000);
            }
        }
    }


    document.getElementById('btn-stop').addEventListener('click', stopTimer);

    function stopTimer() {
        btnStartAndStop.play();
        clearInterval(myTimer);
        console.log('timer stopped');
        document.getElementById('btn-stop').style.display = 'none';
        document.getElementById('btn-reset').style.display = 'block';
    }
}

function showTime(timeLeft) {
    minutes = Math.floor(timeLeft / (1000 * 60));
    seconds = Math.round(timeLeft / 1000) % 60;
    seconds = ('0' + seconds).slice(-2);
    text = ('0' + minutes + ' : ' + seconds).slice(-7);
    console.log('min: '+ minutes + ', sec: ' + seconds)
    timer.innerHTML = text;
}


document.getElementById('btn-reset').addEventListener('click', reset);

function reset() {
    if ((lastExecution + delay) < Date.now()){
        btnReset.play();
        showTime(1000 * 60 * m);
        document.getElementById('btn-reset').style.display = 'none';
        document.getElementById('btn-start').style.display = 'block';
        lastExecution = Date.now();
        clearInterface();
    }
}

function clearInterface() {
    document.getElementById('lapse').innerHTML = '';
    l = lSaved;
    round = 1;

}


function validateLapsesSetting() {
    l = document.getElementById('number-of-lapses').value;
    lSaved = l;
    if (l < 0) {
        let errorLessThanZero = new Audio('sound/error-back-to-future.mp3');
        errorLessThanZero.play()
        alert('Sorry, a negative number of lapses isn\'t possible.')
        l = 1;
    }
    document.getElementById('label-number-of-lapses').innerHTML = (l == 1 ? 'Runde \u00A0' : 'Runden');
}

function resetLapsesSetting() {
    l = 1;
    document.getElementById('label-number-of-lapses').innerHTML = 'Runde \u00A0';
}

function validateMinutesSetting() {
    m = document.getElementById('time-lapse01').value;
    if (m < 0) {
        let errorLessThanZero = new Audio('sound/error-back-to-future.mp3');
        errorLessThanZero.play()
        alert('Oups, sorry, this is not a time machine. This app is a time counter only.\n'
            + 'It will not allow you to travel into the past.\n\n' +
            'Instead of ' + m + ', please enter a positive value.')
        m = -m;
    }
    showTime(1000 * 60 * m);
    document.getElementById('label-lapse01').innerHTML = (m == 1 ? 'Minute \u00A0' : 'Minuten');
}

function resetMinutesSetting() {
    m = 2;
    showTime(1000 * 60 * m);
    document.getElementById('label-lapse01').innerHTML = 'Minuten';
}

function setSound() {
        if (document.getElementById('sound1').checked) {
            alarm = new Audio('sound/notification-happy-bells.wav');
        } else if (document.getElementById('sound2').checked) {
            alarm = new Audio('sound/notification-bubbly-strings.mp3');
        } else if (document.getElementById('sound3').checked) {
            alarm = new Audio('sound/notification-musical-alert.wav');
        } else if (document.getElementById('sound4').checked) {
            alarm = new Audio('sound/notification-positive-chime.mp3');
        }
}




