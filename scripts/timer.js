let timer = document.getElementById('timer');

let m = 5;
let minutes = 0, seconds = 0;
let text = '';
showTime(1000 * 60 * m);

let alarm = new Audio('sound/mixkit-happy-bells-notification-937.wav');


document.getElementById('btn-start').style.display = 'block';
document.getElementById('btn-start').addEventListener('click', startTimer);

function startTimer() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'block';

    let startTime = new Date().getTime();
    let endTime = startTime + (1000 * 60 * m);

    console.log('timer started');

    let myTimer = setInterval(runTimer, 1000);

    function runTimer() {
        let timeLeft = endTime - new Date().getTime();

        if (timeLeft > 0) {
            showTime(timeLeft);
        } else {
            clearInterval(myTimer);
            alarm.play();
            timer.innerHTML = '00 : 00';
            console.log('lapse terminated')
            setTimeout(function () {
                showTime(1000 * 60 * m);
                document.getElementById('btn-start').style.display = 'block';
                document.getElementById('btn-stop').style.display = 'none';
            }, 8000);
        }
    }


    document.getElementById('btn-stop').addEventListener('click', stopTimer);

    function stopTimer() {
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
    text = '0' + minutes + ' : ' + seconds;
    timer.innerHTML = text;
}


document.getElementById('btn-reset').addEventListener('click', reset);

function reset() {
    showTime(1000 * 60 * m);
    document.getElementById('btn-reset').style.display = 'none';
    document.getElementById('btn-start').style.display = 'block';
}


function validateInput() {
    m = document.getElementById('time-lapse01').value;
    if (m < 0) {
        alert('Oups, sorry, this is not a time machine. This app only is a time counter.\n'
            + 'It will not allow you to travel into the past.\n\n' +
            'Instead of ' + m + ' please enter a positive value.')
        m = -m;
    }
    showTime(1000 * 60 * m);
    document.getElementById('label-lapse01').innerHTML = (m == 1 ? 'Minute \u00A0' : 'Minuten');
}

function resetInput() {
    m = 5;
    document.getElementById('timer').innerText = '05 : 00';
    document.getElementById('label-lapse01').innerHTML = 'Minuten';
}

function setSound() {
        if (document.getElementById('sound1').checked) {
            alarm = new Audio('sound/mixkit-happy-bells-notification-937.wav');
        } else if (document.getElementById('sound2').checked) {
            alarm = new Audio('sound/alarm.mp3');
        } else if (document.getElementById('sound3').checked) {
            alarm = new Audio('sound/mixkit-musical-alert-notification-2309.wav');
        }
}




