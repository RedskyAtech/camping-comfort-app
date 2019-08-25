# Camping Comfort

> CampingComfort

## Usage

``` bash
# Install dependencies
npm install

# Build for production
tns build <platform> --bundle

# Build, watch for changes and debug the application
tns debug <platform> --bundle

# Build, watch for changes and run the application
tns run <platform> --bundle
```

## Core overrides

To switch the background of the image swiper to white:

Comment the following line in /node_modules/nativescript-image-swipe/image-swipe.ios.js

`view.backgroundColor = utils.ios.getter(UIColor, UIColor.blackColor);`

## Build an Android release
```
tns build android --bundle --key-store-path ./campingcomfort.keystore --key-store-password Iloum2007$ --key-store-alias=CampingComfort --key-store-alias-password Iloum2007$ --release
```

## Build an Android release with Android App Bundle
```
tns build android --bundle --key-store-path ./campingcomfort.keystore --key-store-password Iloum2007$ --key-store-alias=CampingComfort --key-store-alias-password Iloum2007$ --release --aab --copy-to platforms/android/app/build/outputs/aab/app-release.aab
```