let images
const arduinoEvents = {
    BUTTON_PRESSED: 'BUTTON_PRESSED',
    DISPENSE_TRICK: 'DISPENSE_TRICK',
    DISPENSE_TREAT: 'DISPENSE_TREAT',
    DISPENSE_FINISHED: 'DISPENSE_FINISHED'
}

let currentImage
let serial
const portName = '/dev/tty.usbserial-1410'

function setup() {
    createCanvas(windowWidth, windowHeight)
    images = {
            main: loadImage('img/main.png'),
            treat: loadImage('img/treat.png'),
            trick: loadImage('img/trick.png'),
            loading: loadImage('img/loading.png')
        }
    currentImage = images.main

    serial = new p5.SerialPort()    // make a new instance of the serialport library
    serial.on('list', _onList)    // set a callback function for the serialport list event
    serial.on('connected', _onConnected) // callback for connecting to the server
    serial.on('open', _onOpen)     // callback for the port opening
    serial.on('data', _onData)  // callback for when new data arrives
    serial.on('error', _onError) // callback for errors
    serial.on('close', _onClose)   // callback for the port closing

    serial.list()                   // list the serial ports
    serial.open(portName)
}

function draw() {
    background(200)
    _drawImageAtCenter(currentImage)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function _onButtonPressed() {
    // TODO: fix this hax
    currentImage = images.loading
    if (Math.random() > 0.5) {
        // Trick
        setTimeout(() => {
            currentImage = images.trick
            serial.write(arduinoEvents.DISPENSE_TRICK);
        }, 4000)
    } else {
        // Treat
        setTimeout(() => {
            currentImage = images.treat
            serial.write(arduinoEvents.DISPENSE_TREAT);
        }, 4000)
    }
    setTimeout(() => { currentImage = images.main }, 10000)
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

function _drawImageAtCenter(img) {
    image(img, windowWidth / 2 - img.width / 2, windowHeight / 2 - img.height / 2)
}