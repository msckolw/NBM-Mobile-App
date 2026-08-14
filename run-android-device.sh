#!/bin/bash

# Script to run React Native app on Android device via USB
# Make sure your Android device is connected via USB and USB debugging is enabled

# Set Android SDK path (adjust if needed)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device found. Please connect your device via USB and enable USB debugging."
    exit 1
fi

echo "✅ Device found!"

# Set up port forwarding for Metro bundler
echo "Setting up port forwarding..."
adb reverse tcp:8081 tcp:8081

# Start Metro bundler in background if not already running
if ! lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "Starting Metro bundler..."
    npm start &
    sleep 5
fi

# Build and install the app
echo "Building and installing app..."
cd android && ./gradlew assembleDebug && cd ..
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Launch the app
echo "Launching app..."
adb shell am start -n com.nobiasnews/.MainActivity

echo "✅ App launched! Check your device."
