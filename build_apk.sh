#!/usr/bin/env bash
set -e

echo "🌸 Rebuilding HER LIFE Web Assets..."
cd /home/piet/Desktop/harshita/frontend
npm run build

echo "📲 Syncing with Capacitor Android..."
npx cap sync android

echo "🔨 Compiling Android APK..."
cd /home/piet/Desktop/harshita/frontend/android
export JAVA_HOME="/home/piet/jdk-17"
export ANDROID_HOME="/home/piet/android-sdk"
./gradlew assembleDebug

cp -f /home/piet/Desktop/harshita/frontend/android/app/build/outputs/apk/debug/app-debug.apk /home/piet/Desktop/harshita/HER_LIFE.apk

echo "✨ SUCCESS! APK generated at:"
echo "👉 /home/piet/Desktop/harshita/HER_LIFE.apk"
ls -lh /home/piet/Desktop/harshita/HER_LIFE.apk
