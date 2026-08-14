# Android Build Configuration Checklist
## Pre-Build Verification for APK Generation

### ✅ Environment Setup
- [ ] **Java Version**: Java 17 installed and configured (current: OpenJDK 17)
- [ ] **Android SDK**: Available at ~/Library/Android/sdk
- [ ] **Android NDK**: Version 23.1.7779620 available
- [ ] **Node.js**: Version 16+ installed (as per package.json engines)
- [ ] **Dependencies**: npm/yarn packages installed and up to date

### ✅ Android Configuration
- [ ] **compileSdkVersion**: 35 (current configuration)
- [ ] **targetSdkVersion**: 35 (current configuration)
- [ ] **minSdkVersion**: 24 (covers 95%+ devices)
- [ ] **buildToolsVersion**: 35.0.0 (matches compileSdk)
- [ ] **ndkVersion**: 23.1.7779620 (stable for RN 0.70.15)

### ✅ Gradle Configuration
- [ ] **Gradle Version**: 7.6.4 (compatible with RN 0.70.15)
- [ ] **Android Gradle Plugin**: 7.4.2 (compatible with RN 0.70.15)
- [ ] **Kotlin Version**: 1.7.22 (stable)
- [ ] **JVM Args**: Optimized for Java 17 (-Xmx4096m -XX:MaxMetaspaceSize=1024m)

### ✅ React Native Configuration
- [ ] **React Native**: 0.70.15 (current stable version)
- [ ] **React**: 18.1.0 (compatible with RN 0.70.15)
- [ ] **Hermes**: Enabled (hermesEnabled=true)
- [ ] **New Architecture**: Disabled (newArchEnabled=false)
- [ ] **Dependencies**: All versions compatible with RN 0.70.15

### ✅ Build Files Verification
- [ ] **package.json**: All dependencies installed and compatible
- [ ] **android/build.gradle**: Correct SDK/NDK/build tools versions
- [ ] **android/app/build.gradle**: Proper configuration with signing
- [ ] **gradle.properties**: Java 17 path set correctly
- [ ] **gradle-wrapper.properties**: Gradle 7.6.4 configured

### ✅ Signing Configuration
- [ ] **Debug Keystore**: Available (android/app/debug.keystore)
- [ ] **Release Keystore**: Configured (nobiasmedia-release.keystore)
- [ ] **Keystore Passwords**: Set in gradle.properties
- [ ] **Key Alias**: nobiasmedia configured for release

### ✅ Dependencies Verification
- [ ] **Navigation**: @react-navigation/* packages compatible
- [ ] **Google Sign-In**: TEMPORARILY DISABLED (commented out for build)
- [ ] **Reanimated**: react-native-reanimated@2.17.0 (stable for RN 0.70.15)
- [ ] **Vector Icons**: react-native-vector-icons@10.0.3 with fonts.gradle applied
- [ ] **Native Modules**: All third-party libraries compatible with RN 0.70.15

### ✅ Clean State
- [ ] **Gradle Cache**: Cleared (~/.gradle/caches)
- [ ] **Build Directory**: Cleaned (android/build, android/app/build)
- [ ] **Node Modules**: Fresh install (rm -rf node_modules && npm install)
- [ ] **Metro Cache**: Cleared (npx react-native start --reset-cache)

### ✅ Architecture Configuration
- [ ] **CPU Architectures**: armeabi-v7a, arm64-v8a, x86, x86_64 enabled
- [ ] **Separate APKs**: Disabled (enableSeparateBuildPerCPUArchitecture = false)
- [ ] **Universal APK**: Disabled for smaller file sizes
- [ ] **Proguard**: Disabled for debug, configurable for release

---

## Current Configuration Status

### Environment Check
**Java**: OpenJDK 17 (configured in gradle.properties)
**React Native**: 0.70.15 (stable, well-tested version)
**Gradle**: 7.6.4 (compatible with RN 0.70.15)
**Android Gradle Plugin**: 7.4.2 (stable)

### Key Dependencies Status
- 🟡 **@react-native-google-signin/google-signin**: 10.1.1 (TEMPORARILY DISABLED)
- ✅ **react-native-reanimated**: 2.17.0 (stable for RN 0.70.15)
- ✅ **react-native-screens**: 3.29.0 (compatible)
- ✅ **@react-navigation/***: All packages compatible with RN 0.70.15

### Build Configuration Issues to Monitor
- [ ] **Google Services**: google-services.json NOT REQUIRED (auth disabled)
- [ ] **SDK Version Alignment**: compileSdk 35 is newer than typical for RN 0.70.15
- [ ] **Build Tools Version**: 35.0.0 should be tested for compatibility
- [ ] **Flipper Version**: 0.125.0 configured for debugging

---

## ⚠️ TEMPORARY CONFIGURATION - GOOGLE AUTH DISABLED

### What Was Changed
- ✅ **App.tsx**: GoogleSignin.configure() commented out
- ✅ **ReadMoreScreen.tsx**: googleLogin() call commented out  
- ✅ **googleAuth.tsx**: GoogleSignin import commented out, returns mock token
- ✅ **RootNavigator.tsx**: Always shows AppStack (no auth check)

### Current Behavior
- 🟢 **No authentication required** - anyone can access all features
- 🟢 **No google-services.json needed** - build will work without it
- 🟢 **All Google Sign-In code preserved** - just commented out
- 🟢 **Mock token provided** - app functions normally

### To Restore Google Auth Later
1. Uncomment all Google Sign-In imports and code
2. Add google-services.json to android/app/
3. Add Google Services plugin to build.gradle files
4. Update RootNavigator to check token properly

---

## Pre-Build Commands Checklist

### ✅ Clean Environment
```bash
# Clean React Native cache
npx react-native start --reset-cache

# Clean Gradle cache
cd android && ./gradlew clean

# Clean node modules
rm -rf node_modules && npm install

# Clean Gradle daemon
./gradlew --stop
```

### ✅ Build Commands
```bash
# Debug build
cd android && ./gradlew assembleDebug

# Release build (requires signing configuration)
cd android && ./gradlew assembleRelease

# Install debug APK
cd android && ./gradlew installDebug
```

---

## Critical Checkboxes to Maintain

### 🔴 **MUST VERIFY BEFORE EACH BUILD**
- [ ] **Java Path**: Correct Java 17 path in gradle.properties
- [ ] **Keystore Files**: Both debug.keystore and nobiasmedia-release.keystore present
- [ ] **Gradle Daemon**: Stopped before clean builds (`./gradlew --stop`)
- [ ] **Metro Cache**: Cleared for fresh builds
- [ ] **Node Modules**: Recently installed and up to date

### 🟡 **VERIFY WEEKLY/AFTER DEPENDENCY CHANGES**
- [ ] **Dependency Compatibility**: All packages compatible with RN 0.70.15
- [ ] **Android SDK Updates**: No breaking changes in SDK 35
- [ ] **Gradle Version**: Still compatible with current setup
- [ ] **NDK Version**: 23.1.7779620 still available and working

### 🟢 **VERIFY MONTHLY/MAJOR UPDATES**
- [ ] **React Native Version**: Consider updates to newer stable versions
- [ ] **Android Target SDK**: Update when required by Play Store
- [ ] **Build Tools**: Update to latest compatible versions
- [ ] **Security Updates**: Java, Android SDK, dependencies

---

## Build Success Verification

### ✅ Debug Build Success Indicators
- [ ] `./gradlew assembleDebug` completes without errors
- [ ] APK generated at `android/app/build/outputs/apk/debug/app-debug.apk`
- [ ] APK size reasonable (typically 20-50MB for this project)
- [ ] No ProGuard/R8 errors in logs

### ✅ Release Build Success Indicators
- [ ] `./gradlew assembleRelease` completes without errors
- [ ] APK generated at `android/app/build/outputs/apk/release/app-release.apk`
- [ ] APK properly signed with release keystore
- [ ] APK optimized and minified (if enabled)

### ✅ Installation Test
- [ ] Debug APK installs on device/emulator: `adb install app-debug.apk`
- [ ] App launches without crashes
- [ ] All native modules function (Google Sign-In, Vector Icons, etc.)
- [ ] Navigation works correctly
- [ ] No runtime errors in Metro logs

---

## Troubleshooting Quick Reference

### Common Build Failures
1. **"Could not find tools.jar"** → Check Java path in gradle.properties
2. **"NDK not found"** → Verify NDK 23.1.7779620 installed
3. **"Duplicate class"** → Clean build and check dependency conflicts
4. **"Task :app:mergeDebugResources FAILED"** → Check vector icons setup
5. **"Execution failed for task ':app:processDebugGoogleServices'"** → Verify google-services.json

### Emergency Reset Commands
```bash
# Nuclear option - complete reset
rm -rf node_modules
rm -rf android/build
rm -rf android/app/build
rm -rf ~/.gradle/caches
npm install
cd android && ./gradlew clean
```

---

## Team Checklist Maintenance

### 🔄 **Daily** (During Active Development)
- [ ] Verify build works on current branch
- [ ] Check for dependency security alerts
- [ ] Ensure keystore files are backed up

### 🔄 **Weekly** (Regular Maintenance)
- [ ] Update this checklist if configuration changes
- [ ] Test release build process
- [ ] Verify all team members can build successfully

### 🔄 **Monthly** (Strategic Updates)
- [ ] Review React Native version for updates
- [ ] Check Android SDK requirements
- [ ] Update build tools if needed
- [ ] Review and update dependency versions

---

## Configuration Backup

### Essential Files to Backup
- `android/gradle.properties` (contains Java path and signing config)
- `android/app/debug.keystore` (debug signing)
- `android/app/nobiasmedia-release.keystore` (release signing)
- `package.json` (dependency versions)
- `android/build.gradle` (SDK versions)
- `android/app/build.gradle` (app configuration)

### Backup Command
```bash
# Create configuration backup
tar -czf android-config-backup-$(date +%Y%m%d).tar.gz \
  android/gradle.properties \
  android/app/debug.keystore \
  android/app/nobiasmedia-release.keystore \
  package.json \
  android/build.gradle \
  android/app/build.gradle
```

---

*Last Updated: January 21, 2026*
*React Native Version: 0.70.15*
*Target Android SDK: 35*