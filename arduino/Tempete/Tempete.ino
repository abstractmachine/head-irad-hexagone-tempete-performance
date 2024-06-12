#include <ArduinoRS485.h> // the ArduinoDMX library depends on ArduinoRS485
#include <ArduinoDMX.h>

const int universeSize = 16;

// Define the channel targets, values, and elapsed times
int targets[universeSize] = {0};
int values[universeSize] = {0};
unsigned long elapsed[universeSize] = {0};

// Delay between target value changes
int delayBetweenChanges = 4;

void setup() {

  // Start Serial port
  Serial.begin(9600);
  while (!Serial);

  // Set LED
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  // Initialize the DMX library with the universe size
  if (!DMX.begin(universeSize)) {
    Serial.println("Failed to initialize DMX!");
    while (1); // Wait forever
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

    // Find the position of the space
    int spaceIndex = input.indexOf(' ');
    // If no space found, return
    if (spaceIndex == -1) return;

    // Extract the first and second numbers as substrings
    String firstNumberStr = input.substring(0, spaceIndex);
    String secondNumberStr = input.substring(spaceIndex + 1);

    // Convert the first part to an unsigned integer
    unsigned int firstNumber = firstNumberStr.toInt();
    unsigned int secondNumber;

    // Check if the second part is "on" or "off"
    if (secondNumberStr == "on") {
      secondNumber = 255;
    } else if (secondNumberStr == "off") {
      secondNumber = 0;
    } else {
      // Convert the second part to an unsigned integer
      secondNumber = secondNumberStr.toInt();
    }

    // Check if the numbers are within the valid range
    if (firstNumber < universeSize && secondNumber <= 255) {
      // Apply new target value
      setTarget(firstNumber, secondNumber);
    }
  }
}
// check Serial

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
