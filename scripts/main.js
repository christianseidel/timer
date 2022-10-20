let m = localStorage.getItem('minutes') > 0
    ? localStorage.getItem('minutes')
    : 2;
document.getElementById('minutes-lapse01').value = m;

let h = localStorage.getItem('hours') > 0
    ? Number(localStorage.getItem('hours'))
    : 0;

let minutes = 0, seconds = 0, hours = 0;
let time = '';
let timer = document.getElementById('timer');
showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));


let alarm = localStorage.getItem('alarm');
markActualAlarmSet();
let soundStartAndStop = new Audio('sound/btn-start-and-stop.mp3');
let soundReset = new Audio('sound/btn-reset.wav');
let soundError = new Audio('sound/error-back-to-future.mp3');
let soundClick = new Audio('sound/click.mp3');

document.getElementById('btn-start').style.display = 'block';
document.getElementById('btn-start').addEventListener('click', startTimer);


function startTimer() {
    soundStartAndStop.play();
    document.getElementById('control-panel').style.display = 'none';
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'block';
    document.getElementById('lapse').innerHTML = (numberOfCycles > 1) ? 'Runde 1 von ' + numberOfCycles : '';
    markActualAlarmSet();
    console.log('timer started (' + numberOfCycles + ' cycles)');
    let endTime = new Date().getTime() + ((1000 * 60 * m) + (1000 * 60 * 60 * h));

    let myTimer = setInterval(runTimer, 1000);

    function runTimer() {
        let timeLeft = endTime - new Date().getTime();

        if (timeLeft > 0) {
            showTime(timeLeft);
        } else {
            --numberOfCycles;
            if (numberOfCycles > 0) {
                playAlarm();
                console.log('cycle ' + lapse + ' terminated')
                ++lapse;
                document.getElementById('lapse').innerHTML = 'Runde ' + lapse + ' von ' + numberOfCyclesSaved;
                endTime = new Date().getTime() + ((1000 * 60 * m) + (1000 * 60 * 60 * h));
            } else {
                clearInterval(myTimer);
                playAlarm();
                timer.innerHTML = '00 : 00';
                console.log('final cycle terminated')
                setTimeout(function () {
                    showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
                    document.getElementById('btn-start').style.display = 'block';
                    document.getElementById('btn-stop').style.display = 'none';
                    clearInterface();
                }, 4000);
                console.log('timer ended');
            }
        }
    }

    document.getElementById('btn-stop').addEventListener('click', stopTimer);

    function stopTimer() {
        soundStartAndStop.play();
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
    time = (hours > 0)
        ? (hours + ' : ' + minutes + ' : ' + seconds)
        : (minutes + ' : ' + seconds);
    timer.innerHTML = time;
}


document.getElementById('btn-reset').addEventListener('click', reset);
const delay = 500; // anti-rebound for 500ms
let lastExecution = 0;

function reset() {
    if ((lastExecution + delay) < Date.now()) {
        soundReset.play();
        showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
        document.getElementById('btn-reset').style.display = 'none';
        document.getElementById('btn-start').style.display = 'block';
        lastExecution = Date.now();
        clearInterface();
    }
}

function clearInterface() {
    document.getElementById('lapse').innerHTML = '';
    numberOfCycles = numberOfCyclesSaved;
    lapse = 1;
    document.getElementById('control-panel').style.display = 'block';
}


//----------- CONTROL CYCLE SETTING -----------//

let numberOfCycles = localStorage.getItem('cycles') > 1
    ? Number(localStorage.getItem('cycles'))
    : 1;
let numberOfCyclesSaved = numberOfCycles;
let lapse = 1;

document.getElementById('number-of-cycles').value = numberOfCycles;
document.getElementById('label-number-of-cycles').innerHTML = (numberOfCycles === 1 ? 'Runde' : 'Runden');
document.getElementById('btn-reset-cycles').style.display = numberOfCycles !== 1 ? 'unset' : 'none';
document.getElementById('number-of-cycles').addEventListener('change', setNumberOfCycles);

function setNumberOfCycles() {
    numberOfCycles = Number(document.getElementById('number-of-cycles').value);
    document.getElementById('label-number-of-cycles').innerHTML = (numberOfCycles === 1 ? 'Runde' : 'Runden');
    if (numberOfCycles <= 0) {
        soundError.play()
        alert('Achtung! Die Anzahl der Runden muss mindestens 1 betragen.')
        numberOfCycles = 1;
        localStorage.setItem('cycles', '1')
        document.getElementById('number-of-cycles').value = numberOfCycles;
        document.getElementById('label-number-of-cycles').innerHTML = 'Runde';
    } else {
        localStorage.setItem('cycles', numberOfCycles);
        document.getElementById('btn-reset-cycles').style.display = (numberOfCycles !== 1) ? 'unset' : 'none';
        numberOfCyclesSaved = numberOfCycles;
    }
}

function resetCyclesSetting() {
    confirmSetting('checkmark-cycles-reset')
    numberOfCycles = 1;
    localStorage.removeItem('cycles');
    document.getElementById('label-number-of-cycles').innerHTML = 'Runde';
    document.getElementById('btn-reset-cycles').style.display = 'none';
}


//----------- CONTROL TIME SETTING -----------//

document.getElementById('hours-lapse01').value = h;
document.getElementById('label-hours-lapse01').innerHTML = (h === 1 ? 'Stunde' : 'Stunden');
document.getElementById('btn-reset-time').style.display = (h !== 0 || m !== 2) ? 'unset' : 'none';
document.getElementById('hours-lapse01').addEventListener('change', setHours);

function setHours() {
    h = Number(document.getElementById('hours-lapse01').value);
    if (h < 0) {
        let unit = h === -1 ? 'Stunde' : 'Stunden';
        showAlert(h, unit);
        h = 0;
        document.getElementById('hours-lapse01').value = 0;
    }
    document.getElementById('label-hours-lapse01').innerHTML = (h === 1 ? 'Stunde' : 'Stunden');
    document.getElementById('btn-reset-time').style.display = (h !== 0 || m !== 2) ? 'unset' : 'none';
    localStorage.setItem('hours', h);
    showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
}

document.getElementById('minutes-lapse01').value = m;
document.getElementById('label-minutes-lapse01').innerHTML = (m === 1 ? 'Minute' : 'Minuten');
document.getElementById('minutes-lapse01').addEventListener('change', setMinutes);

function setMinutes() {
    m = Number(document.getElementById('minutes-lapse01').value);
    if (m < 0) {
        let unit = m === -1 ? 'Minute' : 'Minuten';
        showAlert(m, unit);
        m = -m;
        document.getElementById('minutes-lapse01').value = m;
    }
    document.getElementById('label-minutes-lapse01').innerHTML = (m === 1 ? 'Minute' : 'Minuten');
    document.getElementById('btn-reset-time').style.display = (h !== 0 || m !== 2) ? 'unset' : 'none';
    localStorage.setItem('minutes', m);
    showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
}

function showAlert(amount, unit) {
    soundError.play()
    alert('Oups, Sorry, diese App ist keine Zeitmaschine. Sie ist einfach nur ein Kurzzeitwecker. '
        + 'Eine Reise in die Vergangenheit ist mit ihr nicht möglich.\n\n' +
        'Bitte gib statt ' + amount + ' ' + unit + ' einen positiven Wert an.')
}

function resetTimeSetting() {
    confirmSetting('checkmark-time-reset')
    m = 2;
    h = 0;
    showTime((1000 * 60 * m) + (1000 * 60 * 60 * h));
    document.getElementById('label-minutes-lapse01').innerHTML = 'Minuten';
    document.getElementById('label-hours-lapse01').innerHTML = 'Stunden';
    document.getElementById('btn-reset-time').style.display = 'none';
    localStorage.removeItem('minutes');
    localStorage.removeItem('hours');
}


//----------- COMMON FEATURE -----------//

function confirmSetting(location) {
    soundClick.play();
    document.getElementById(location).innerHTML = '&#10004;'
    setTimeout(function () {
        document.getElementById(location).innerHTML = ''
    }, 1000);
}



//----------- CONTROL ALARM -----------//

function setAlarm() {
    readAlarm();
    localStorage.setItem('alarm', alarm);
    confirmSetting('checkmark-alarm-set');
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
    let alarmToPlay;
    switch (alarm) {
        case 'alarm2':
            alarmToPlay = new Audio('sound/notification-bubbly-strings.mp3');
            break;
        case 'alarm3':
            alarmToPlay = new Audio('sound/notification-musical-alert.wav');
            break;
        case 'alarm4':
            alarmToPlay = new Audio('sound/notification-positive-chime.mp3');
            break;
        default:
            alarmToPlay = new Audio('sound/notification-happy-bells.wav');
            break;
    }
    alarmToPlay.play();
}
