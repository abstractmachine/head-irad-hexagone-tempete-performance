let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;
let writeQueue = [];

async function initializeSerial() {
    // Attempt auto-connect on page load
    const savedPortInfo = localStorage.getItem('savedPort');
    if (savedPortInfo) {
        const autoConnectedPort = await attemptAutoConnect(JSON.parse(savedPortInfo));
        if (autoConnectedPort) {
            port = autoConnectedPort;
            await connectSerial();
        }
    }
}

async function connectSerial() {
    try {
        const savedPortInfo = localStorage.getItem('savedPort');
        if (savedPortInfo) {
            port = await attemptAutoConnect(JSON.parse(savedPortInfo));
        }

        if (!port) {
            port = await navigator.serial.requestPort();
        }

        await port.open({ baudRate: 9600 });

        const info = port.getInfo();
        localStorage.setItem('savedPort', JSON.stringify(info));

        const encoder = new TextEncoderStream();
        outputDone = encoder.readable.pipeTo(port.writable);
        outputStream = encoder.writable;

        const decoder = new TextDecoderStream();
        inputDone = port.readable.pipeTo(decoder.writable);
        inputStream = decoder.readable;

        reader = inputStream.getReader();
        readLoop();  // Start the read loop automatically

        // console.log('Serial port connected');
    } catch (error) {
        console.log('There was an error opening the serial port:', error);
    }
}

async function attemptAutoConnect(savedPortInfo) {
    const ports = await navigator.serial.getPorts();
    for (const port of ports) {
        const info = port.getInfo();
        if (info.usbVendorId === savedPortInfo.usbVendorId && info.usbProductId === savedPortInfo.usbProductId) {
            return port;
        }
    }
    return null;
}

async function disconnectSerial() {
    if (reader) {
        await reader.cancel();
        await inputDone.catch(() => {});
        reader = null;
        inputDone = null;
    }

    if (outputStream) {
        await outputStream.getWriter().close();
        await outputDone;
        outputStream = null;
        outputDone = null;
    }

    if (port) {
        await port.close();
        port = null;
    }

    console.log('Serial port disconnected');
}

async function readLoop() {
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }
            console.log(value);
        }
    } catch (error) {
        console.error('Read loop error:', error);
    }
}

async function sendData(channel, value) {
    if (outputStream) {
        // Add the data to the write queue
        writeQueue.push(`${channel} ${value}\n`);
        // Process the write queue
        processWriteQueue();
    }
}

async function processWriteQueue() {
    try {
        if (writeQueue.length > 0) {
            const writer = outputStream.getWriter();
            while (writeQueue.length > 0) {
                const data = writeQueue.shift();
                await writer.write(data);
            }
            writer.releaseLock();
        }
    } catch (error) {
        console.error('Error processing write queue:', error);
    }
}

// Initialize the serial connection on page load
document.addEventListener('DOMContentLoaded', initializeSerial);