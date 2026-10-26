#!/usr/bin/env bash
# Source this file to add Flutter, Java 17, and Android SDK to your current terminal session:
# source env_setup.sh

export JAVA_HOME="/home/piet/jdk-17"
export ANDROID_HOME="/home/piet/android-sdk"
export PATH="/home/piet/flutter/bin:/home/piet/jdk-17/bin:/home/piet/android-sdk/cmdline-tools/latest/bin:/home/piet/android-sdk/platform-tools:$PATH"

echo "✅ Environment configured:"
echo " • Flutter: $(which flutter 2>/dev/null || echo 'in /home/piet/flutter/bin')"
echo " • Java:    $(java -version 2>&1 | head -n 1)"
echo " • Android: $ANDROID_HOME"
