#include <ArduinoRS485.h>  // the ArduinoDMX library depends on ArduinoRS485
#include <ArduinoDMX.h>

const int universeSize = 50;

// Define the channel targets, values, and elapsed times
int targets[universeSize] = { 0 };
int values[universeSize] = { 0 };
unsigned long elapsed[universeSize] = { 0 };

// Delay between target value changes
int delayBetweenChanges = 4;

void setup() {

  // Start Serial port
  Serial.begin(9600);
  while (!Serial)
    ;

  // Set LED
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  // Initialize the DMX library with the universe size
  if (!DMX.begin(universeSize)) {
    Serial.println("Failed to initialize DMX!");
    while (1)
      ;  // Wait forever
  }

  Serial.println("Started");
}

void loop() {

  checkSerial();
  checkValues();
}

void checkSerial() {

  // See if a new message is incoming
  if (Serial.available() > 0) {
    // Get incoming string
    String input = Serial.readStringUntil('\n');
    input.trim();  // Trim any leading or trailing whitespace

    // Make sure message is long enough
    if (input.length() < 3) return;

    unsigned char action = input[0];

    switch (action) {

      case 'a':
        parseAll(input);
        break;
      case 'c':
        parseColor(input);
        break;
      case 'l':
        parseLight(input);
        break;

    }  // switch

  }  // if (available)
}
// checkSerial()


void parseAll(String input) {

  // Find the position of the equals sign
  int equalsIndex = input.indexOf('=');
  // If no equals sign found, return
  if (equalsIndex == -1) return;
  // get string after equals sign
  String after = input.substring(equalsIndex + 1);

  int value = 0;
  // Check if the second part is "on" or "off"
  if (after == "on") {
    value = 255;
  } else if (after == "off") {
    value = 0;
  } else {
    // Convert the second part to an unsigned integer
    value = after.toInt();
    // make sure we're in range
    if (value < 0 || value > 255) return;
  }
  // turn on all direct lights
  setTarget(1, value);
  setTarget(2, value);
  setTarget(3, value);
  setTarget(4, value);
  // turn on the LED lights
  // setLED(5,value);
  // setLED(28,value);
}


void parseColor(String input) {

  // make sure there are enough chars
  if (input.length() < 5) return;

  // Find the position of the equals sign
  int equalsIndex = input.indexOf('=');
  // If no equals sign found, return
  if (equalsIndex == -1) return;
  // get string after equals sign
  String after = input.substring(equalsIndex + 1);

  String before = input.substring(1,equalsIndex);

  int channel = before.toInt();
  if (channel > 0) {
    
    // parse spaces in after
    int firstIndex = after.indexOf(' ');
    if (firstIndex < -1) return;

    int secondIndex = after.indexOf(' ', firstIndex+1);
    if (secondIndex < -1) return;

    int thirdIndex = after.indexOf(' ', secondIndex+1);
    if (thirdIndex < -1) return;

    String first = after.substring(0,firstIndex);
    String second = after.substring(firstIndex+1,secondIndex);
    String third = after.substring(secondIndex+1,thirdIndex);
    String fourth = after.substring(thirdIndex+1);

    int cyanValue = first.toInt();
    int magentaValue = second.toInt();
    int yellowValue = third.toInt();
    int brightnessValue = fourth.toInt();

    if (cyanValue < 0 || cyanValue > 255) return;
    if (magentaValue < 0 || magentaValue > 255) return;
    if (yellowValue < 0 || yellowValue > 255) return;
    if (brightnessValue < 0 || brightnessValue > 255) return;

    // set T11 values
    setTarget(channel+0, 0);
    setTarget(channel+1, 0);
    setTarget(channel+2, 0); // CRI
    setTarget(channel+3, cyanValue);
    setTarget(channel+4, magentaValue);
    setTarget(channel+5, yellowValue);
    setTarget(channel+6, 110); // CTT
    setTarget(channel+7, 32); // Shutter
    setTarget(channel+8, brightnessValue);

  }
  
}


void parseLight(String input) {

  // make sure there are enough chars
  if (input.length() < 5) return;

  // Find the position of the equals sign
  int equalsIndex = input.indexOf('=');
  // If no equals sign found, return
  if (equalsIndex == -1) return;
  // get string after equals sign
  String after = input.substring(equalsIndex + 1);

  int value = 0;
  // Check if the second part is "on" or "off"
  if (after == "on") {
    value = 255;
  } else if (after == "off") {
    value = 0;
  } else {
    // Convert the second part to an unsigned integer
    value = after.toInt();
    // make sure we're in range
    if (value < 0 || value > 255) return;
  }

  String before = input.substring(1,equalsIndex);

  int channel = before.toInt();
  if (channel > 0) {
    setTarget(channel, value);
  }

}


void setLED(int channel, int red, int green, int blue, int brightness) {
}

//   // Find the position of the space
//   int spaceIndex = input.indexOf(' ');
//   // If no space found, return
//   if (spaceIndex == -1) return;

//   // Extract the first and second numbers as substrings
//   String firstNumberStr = input.substring(1, spaceIndex);
//   String secondNumberStr = input.substring(spaceIndex + 1);

//   // Convert the first part to an unsigned integer
//   unsigned int firstNumber = firstNumberStr.toInt();
//   unsigned int secondNumber;

//   // Check if the second part is "on" or "off"
//   if (secondNumberStr == "on") {
//     secondNumber = 255;
//   } else if (secondNumberStr == "off") {
//     secondNumber = 0;
//   } else {
//     // Convert the second part to an unsigned integer
//     secondNumber = secondNumberStr.toInt();
//   }

//   // Check if the numbers are within the valid range
//   if (firstNumber < universeSize && secondNumber <= 255) {
//     // Apply new target value
//     setTarget(firstNumber, secondNumber);
//   }
//}
// if (Serial.available())
//}
// checkSerial()


void checkValues() {
  // Track whether values changed or not
  bool changed = false;

  // Go through each value
  for (int i = 0; i < universeSize; i++) {
    // If value hasn't changed, move on to next
    if (values[i] == targets[i]) continue;

    // Register change
    changed = true;

    // If not enough time has elapsed, move on to next
    if (abs(millis() - elapsed[i]) < delayBetweenChanges) continue;

    // Change value
    if (values[i] < targets[i]) {
      values[i]++;
    } else {
      values[i]--;
    }

    // Send out the value over DMX
    DMX.beginTransmission();
    DMX.write(i, values[i]);
    DMX.endTransmission();

    // Serial.print("channel:");
    // Serial.print(i);
    // Serial.print('\t');
    // Serial.println(values[i]);

    // Record current time of this change
    elapsed[i] = millis();
  }

  // Update LED based on changes
  digitalWrite(LED_BUILTIN, changed ? HIGH : LOW);
}

void setTarget(unsigned int channel, unsigned int value) {

  // Make sure we're in bounds
  if (channel < universeSize && value <= 255) {
    targets[channel] = value;
  }
}
