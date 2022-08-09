let timer = document.getElementById('timer');

let l = 1;
let lSaved = 1;
let round = 1;

let m = 2;
let h = 0;
let minutes = 0, seconds = 0, hours = 0;
let text = '';
showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));

let alarm = localStorage.getItem('alarm');
console.log('alarm saved: ' + localStorage.getItem('alarm'));
console.log('alarm set: ' + alarm);
let btnStartAndStop = new Audio('sound/btn-start-and-stop.mp3');
let btnReset = new Audio('sound/btn-reset.wav');
let errorAlarm = new Audio('sound/error-back-to-future.mp3');

const delay = 500; // anti-rebound for 500ms
let lastExecution = 0;

document.getElementById('btn-start').style.display = 'block';
document.getElementById('btn-start').addEventListener('click', startTimer);


function startTimer() {
    btnStartAndStop.play();
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'block';
    document.getElementById('lapse').innerHTML = (l > 1) ? 'Runde 1 von ' + l : '';
    markActualAlarmSet();

    let endTime = new Date().getTime() + ((1000 * 60 * m) + (1000 * 60 * 60 * h));

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
                playAlarm();
                console.log('lapse terminated (non-final)')
                ++round;
                document.getElementById('lapse').innerHTML = 'Runde ' + round + ' von ' + lSaved;
                endTime = new Date().getTime() + ((1000 * 60 * m) + (1000 * 60 * 60 * h));

            } else {
                clearInterval(myTimer);
                playAlarm();
                timer.innerHTML = '00 : 00';
                console.log('lapse terminated (final)')
                setTimeout(function () {
                    showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
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
    hours = Math.floor(timeLeft / (1000 * 60 * 60));
    minutes = Math.floor(timeLeft / (1000 * 60) - (hours * 60));
    minutes = ('0' + minutes).slice(-2);
    seconds = Math.round(timeLeft / 1000) % 60;
    seconds = ('0' + seconds).slice(-2);
    hours = (hours < 10) ? '0' + hours : hours;
    text = (hours > 0)
        ? (hours + ' : ' + minutes + ' : ' + seconds)
        : (minutes + ' : ' + seconds);
    timer.innerHTML = text;
}


document.getElementById('btn-reset').addEventListener('click', reset);

function reset() {
    if ((lastExecution + delay) < Date.now()) {
        btnReset.play();
        showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
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
        errorAlarm.play()
        alert('Sorry, a negative number of lapses isn\'t possible.')
        l = 1;
    }
    document.getElementById('label-number-of-lapses').innerHTML = (l == 1 ? 'Runde \u00A0' : 'Runden');
}

function resetLapsesSetting() {
    l = 1;
    document.getElementById('label-number-of-lapses').innerHTML = 'Runde \u00A0';
}

function validateTimeSetting() {
    m = document.getElementById('minutes-lapse01').value;
    h = document.getElementById('hours-lapse01').value;
    if (h < 0) {
        let unit = h == -1 ? 'hour' : 'hours';
        showAlert(h, unit);
        h = 0;
    }
    if (m < 0) {
        let unit = m == -1 ? 'minute' : 'minutes';
        showAlert(m, unit);
        m = -m;
    }
    if (m > 59) {
        errorAlarm.play()
        alert('Sorry, a number of minutes greater than 59 is not possible.');
        m = 2;
    }

    showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
    document.getElementById('label-minutes-lapse01').innerHTML = (m == 1 ? 'Minute \u00A0' : 'Minuten');
    document.getElementById('label-hours-lapse01').innerHTML = (m == 1 ? 'Stunde \u00A0' : 'Stunden');
}

function resetTimeSetting() {
    m = 2;
    h = 0;
    showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
    document.getElementById('label-minutes-lapse01').innerHTML = 'Minuten';
    document.getElementById('label-hours-lapse01').innerHTML = 'Stunden';
}

function showAlert(amount, unit) {
    errorAlarm.play()
    alert('Oups, sorry, this is not a time machine. This app is a time counter only.\n'
        + 'It will not allow you to travel into the past.\n\n' +
        'Instead of ' + amount + ' ' + unit + ', please enter a positive value.')
}


function setAlarm() {
    readAlarm();
    localStorage.setItem('alarm', alarm);
}

function testAlarm() {
    let alarmSet = alarm;
    readAlarm();
    playAlarm(alarm);
    alarm = alarmSet;
}

function readAlarm() {
    if (document.getElementById('sound1').checked) {
        alarm = 'alarm1';
    } else if (document.getElementById('sound2').checked) {
        alarm = 'alarm2';
    } else if (document.getElementById('sound3').checked) {
        alarm = 'alarm3';
    } else if (document.getElementById('sound4').checked) {
        alarm = 'alarm4';
    }
}

function markActualAlarmSet() {
    switch (alarm) {
        case 'alarm2':
            document.getElementById('sound2').checked = true;
            break;
        case 'alarm3':
            document.getElementById('sound3').checked = true;
            break;
        case 'alarm4':
            document.getElementById('sound4').checked = true;
            break;
        default:
            document.getElementById('sound1').checked = true;
            break;
    }
}

function playAlarm() {
    console.log(alarm);
    switch (alarm) {
        case 'alarm2':
            alarm = new Audio('sound/notification-bubbly-strings.mp3');
            break;
        case 'alarm3':
            alarm = new Audio('sound/notification-musical-alert.wav');
            break;
        case 'alarm4':
            alarm = new Audio('sound/notification-positive-chime.mp3');
            break;
        default:
            alarm = new Audio('sound/notification-happy-bells.wav');
            break;
    }
    alarm.play();
}



