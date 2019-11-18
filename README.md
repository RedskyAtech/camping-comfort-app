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
tns publish ios --bundle --env.production --appleApplicationSpecificPassword [app-password]
```

## Build an Android release
```
tns build android --bundle --env.production --key-store-path ./campingcomfort.keystore --key-store-password Iloum2007$ --key-store-alias=CampingComfort --key-store-alias-password Iloum2007$ --release
```

## Build an Android release with Android App Bundle
```
tns build android --bundle --env.production --key-store-path ./campingcomfort.keystore --key-store-password Iloum2007$ --key-store-alias=CampingComfort --key-store-alias-password Iloum2007$ --release --aab --copy-to platforms/android/app/build/outputs/aab/app-release.aab
```