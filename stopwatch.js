"use strict";

const lapCount  = 200;
let lapNum = 1;

const storage = getStorage();

let state       = storage.state       ?? 0, 
    startTime   = storage.startTime   ?? 0, 
    stopTime    = storage.stopTime    ?? 0, 
    lapTime     = storage.lapTime     ?? 0, 
    lapStopTime = storage.lapStopTime ?? 0, 
    id;

onload = function() {
    if(state === 1) {
        if(id = setInterval(printTime, 1)) {
            document.querySelector('#start').value = 'STOP';
            document.querySelector('#reset').value = 'LAP';
        }
        setStorage();
    }
}

const eventHandlerType =
    window.ontouchstart !== undefined ? 'touchstart' : 'mousedown';

document.querySelector('#start').addEventListener(eventHandlerType, function() {
    if(state === 0) {
        if(id = startCount()) {
            document.querySelector('#start').value = 'STOP';
            document.querySelector('#reset').value = 'LAP';
            state = 1;
            setStorage();
        }
    }
    else {
        if(id) {
            clearInterval(id);
            stopCount();
            document.querySelector('#start').value = 'START';
            document.querySelector('#reset').value = 'RESET';
            state = 0;
            deleteStorage();
        }
    }
}, false);

document.querySelector('#reset').addEventListener(eventHandlerType, function() {
    if(state === 0) {
        stopTime    = 0;
        lapStopTime = 0;
        document.querySelector('#lap').innerHTML = '';
        document.querySelector('#disp').textContent = '0:00:00.000 / 0:00:00.000';
    }
    else {
        document.querySelector('#lap').appendChild(document.createElement("div"));
        document.querySelector('#lap>div:last-of-type').textContent = (lapNum++) + ' : ' + getTimeString();
        lapTime = Date.now();
        if(document.querySelector('#lap').childElementCount > lapCount)
            document.querySelector('#lap').removeChild(document.querySelector('#lap').childNodes[0]);
        document.querySelector('#lap').scrollTop = document.querySelector('#lap').scrollHeight;

        setStorage();
    }
}, false);

function startCount() {
    const now = Date.now();
    startTime = now - stopTime;
    lapTime   = now - lapStopTime;
    return setInterval(printTime, 1);
}

function stopCount() {
    const now   = Date.now()
    stopTime    = now - startTime;
    lapStopTime = now - lapTime;
}

function printTime() {
    document.querySelector('#disp').textContent = getTimeString();
}

function getTimeString() {
    const
        now       = Date.now(),
        time      = now - startTime,
        splitTime = now - lapTime,

        main =
            Math.floor(time / 3600000) + ':' +
            String(Math.floor(time / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(time / 1000) % 60).padStart(2, '0') + '.' +
            String(time % 1000).padStart(3, '0'),

        split =
            Math.floor(splitTime / 3600000) + ':' +
            String(Math.floor(splitTime / 60000) % 60).padStart(2, '0') + ':' +
            String(Math.floor(splitTime / 1000) % 60).padStart(2, '0') + '.' +
            String(splitTime % 1000).padStart(3, '0');

    return main + ' / ' + split;
}

function setStorage() {
    localStorage.setItem('stopwatch_params', JSON.stringify({
        state: state,
        startTime: startTime,
        stopTime: stopTime,
        lapTime: lapTime,
        lapStopTime: lapStopTime,
    }));
}

function deleteStorage() {
    localStorage.removeItem('stopwatch_params');
}

function getStorage() {
    const params = localStorage.getItem('stopwatch_params');
    return params ? JSON.parse(params) : {};
}
document.addEventListener('keypress', keypress_ivent);
