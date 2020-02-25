# Camping Comfort

> 

## Usage

``` bash
# Install dependencies
npm install

# Preview on device
tns preview

# Build, watch for changes and run the application
tns run

# Build, watch for changes and debug the application
tns debug <platform>

# Build for production
tns build <platform> --env.production

```

## Build an iOS release
```
tns build ios --bundle --env.production --release --for-device --provision 6a499659-bfe4-43fc-a027-0ca1ee66846c
tns appstore upload info@vandersluis.media Iloum2007$ --ipa platforms/ios/build/Release-iphoneos/campingcomfortapp.ipa --appleApplicationSpecificPassword habo-czir-zodk-nmso
```

## Build an Android release
```
tns build android --env.production --bundle --key-store-path ./campingcomfort.keystore --key-store-password Iloum2007$ --key-store-alias=CampingComfort --key-store-alias-password Iloum2007$ --release --aab --copy-to platforms/android/app/build/outputs/aab/app-release.aab
```