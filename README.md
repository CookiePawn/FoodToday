# FoodToday - 오늘의 한끼

[플레이스토어 바로가기](https://play.google.com/store/apps/details?id=com.foodtoday&pcampaignid=web_share)

# MEMBER

홍유빈 - 디자인 
[GitHub](https://github.com/binihaus)
  
안준철 - 개발/기획
[GitHub](https://github.com/CookiePawn)


# Project Period

    Main APP DEV. 2025/04/16 ~
    Google Play Store Production Upload. 2025/05/10
    

## USING
> https://github.com/CookiePawn/template-cli.git
>
> Naver Search API


## Version
>## v0.0.6-c6
> [2025-05-22]
> - 스토어 버전 확인 추가
>
>## v0.0.5-c5
> [2025-05-14]
> - Google Admob 광고 적용
>
>## v0.0.4-c4
> [2025-05-10]
> - 결과 확인 시 앱 종료 현상 해결
> - 스타일 문제 해결
>
>## v0.0.3-c3
> [2025-04-24]
> - 출석체크 추가
> - 튜토리얼 추가
> - 이미지 로드 문제 해결
>
>## v0.0.2-c2
> [2025-04-22]
> - 결과 화면 스켈레톤 추가
>
>
>## v0.0.1-c1
> [2025-04-21]
> - 기능 구현



## React Native Cli 탬플릿
> 프로젝트명 변경 가능
>
> https://development-piece.tistory.com/462?category=1222088


## Project Start
```bash
npx @react-native-community/cli templatecli --version 0.77.0
```


## ENV 분기

[android]
> android/app/build.gradle 참조
> 
> android/settings.gradle 참조

[IOS]
> https://velog.io/@2ast/React-Native-개발용-Dev-앱-분리하기-ios
> 
> https://velog.io/@heumheum2/React-Native-Multiple-Environments

[create from root]
> .env.development
> 
> .env.production


## PROJECT SETTING
```bash
yarn
```
```bash
cd ios && pod install
```


## RUN PROJECT - Scripts
[android]
```bash
yarn run android:dev # DEVELOPMENT MODE
yarn run android:prod # PRODUCTION MODE
yarn run android:dev:release # DEVELOPMENT RELEASE MODE
yarn run android:prod:release # PRODUCTION RELEASE MODE
yarn run android:dev-apk # DEVELOPMENT APK
yarn run android:dev-aab # DEVELOPMENT BUNDLE
yarn run android:prod-apk # PRODUCTION APK
yarn run android:prod-aab # PRODUCTION BUNDLE
```

[IOS]
```bash
yarn run ios:dev # DEVELOPMENT MODE
yarn run ios:prod # PRODUCTION MODE
yarn run ios:dev:release # DEVELOPMENT RELEASE MODE
yarn run ios:prod:release # PRODUCTION RELEASE MODE
```


## Gradle Clean

```bash
cd android                                                                     
./gradlew clean
cd ..
yarn run ${scripts}
```


## Reference
>
> ICON: https://feathericons.com
>
