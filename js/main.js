let videos
const arduinoEvents = {
    BUTTON_PRESSED: 'BUTTON_PRESSED',
    DISPENSE_TRICK: 'DISPENSE_TRICK',
    DISPENSE_TREAT: 'DISPENSE_TREAT',
    DISPENSE_FINISHED: 'DISPENSE_FINISHED'
}

let currentImage
let curentVideo
let serial
let isDispensing = false

const portName = '/dev/tty.usbserial-1410'

function setup() {
    noCanvas()

    serial = new p5.SerialPort()    // make a new instance of the serialport library
    serial.on('list', _onList)    // set a callback function for the serialport list event
    serial.on('connected', _onConnected) // callback for connecting to the server
    serial.on('open', _onOpen)     // callback for the port opening
    serial.on('data', _onData)  // callback for when new data arrives
    serial.on('error', _onError) // callback for errors
    serial.on('close', _onClose)   // callback for the port closing

    serial.list()                   // list the serial ports
    serial.open(portName)

    videos = {
        main: document.getElementById('video-main'),
        wheel_treat: document.getElementById('video-wheel-treat'),
        wheel_trick: document.getElementById('video-wheel-trick')
    }
    videos.main.loop = true
    videos.wheel_treat.loop = false
    videos.wheel_trick.loop = false

    videos.main.style.display = "block"

    videos.wheel_treat.addEventListener('ended', () => { 
        console.log('DISPENSE_TREAT')
        videos.main.style.display = "block"
        videos.wheel_treat.style.display = "none"
        serial.write(arduinoEvents.DISPENSE_TREAT)
    })

    videos.wheel_trick.addEventListener('ended', () => {
        console.log('DISPENSE_TRICK')
        videos.main.style.display = "block"
        videos.wheel_trick.style.display = "none"
        serial.write(arduinoEvents.DISPENSE_TRICK)
    })

    return
}

function _playMainVideo() {
    videos.main.play()
}

function _dispenseTreat() {
    videos.main.style.display = "none"
    videos.wheel_treat.style.display = "block"
    videos.wheel_treat.play()
}

function _dispenseTrick() {
    videos.main.style.display = "none"
    videos.wheel_trick.style.display = "block"
    videos.wheel_trick.play()
}

function _dispenseRandom() {
    if (Math.random() > 0.5) {
        _dispenseTreat()
    } else {
        _dispenseTrick()
    }
}


function _onButtonPressed() {
    if (!isDispensing) {
        isDispensing = true
        _dispenseRandom()
    }
}

function _onList() {
    console.log('_onList')
}

function _onConnected() {
    console.log('_onConnected')
}

function _onOpen() {
    console.log('_onOpen')
}

function _onData() {
    let inputString = serial.readStringUntil('\r\n');
    //check to see that there's actually a string there:
    if (inputString.length > 0) {
        console.log(`event from arduino = ${inputString}`)
        switch(inputString) {
            case arduinoEvents.BUTTON_PRESSED:
                _onButtonPressed()
                break
            case arduinoEvents.DISPENSE_DONE:
                isDispensing = false
                break
        }
    }
}

function _onError() {
    console.log('_onError')
}

function _onClose() {
    console.log('_onClose')
}
