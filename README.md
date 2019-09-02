Ugo
====

## 概要
本作品は、**「　いつでも、どこでも、どんな時でも雨から衣類を守る」** をコンセプトに作られたカーテン式IoTスマートデバイスである。

ベランダに設置したカーテン式IoTスマートデバイスを制御することにより、雨から衣服を守ることができる。本システムの制御方法は、次の４つである。
- ユーザによるスマートフォンの操作
- スマートスピーカーによる音声入力
- WeatherAPIによる予測情報を用いた制御
- 水センサーを用いたリアルタイムセンシング制御

私達が目指す目標は、「いつでもどこでも、どんな時でも衣服を雨から守ること」である。
構成要素としては、ユーザの入力方法として、スマートフォン(iOSアプリ)、スマートスピーカー(google Home mini)が存在する。また、IoTスマートデバイスとしては、Raspberry pi、サーボモーター、水センサー、カーテンから構成される。
データベースは、FirebaseのRealtimeDatabaseを用い、その他活用した技術としては、天気情報の取得に、「OpenWeatherMap」、位置情報の取得にGoogle Cloud Platformの「Geolocation API」を用いた。
また、Google Home MiniとFirebaseの連携にIFTTTを使用した。
実装機能としては、 Firebaseの状態変化をスマートフォン、Raspberry Piで常に監視し、スマホアプリからの入力や音声入力に伴い、カーテンを開閉させる機能が存在する。
また、天気予報情報から予測し、カーテンを閉めることができたり、雨センサーから直接雨情報を検出し、カーテンを閉め、大切な衣服を守ることができる。

## 制作者
- ソフトウェア担当：[hogaku](https://github.com/hogaku)
- ハードウェア担当：[mihhus](https://github.com/mihhus)

## システム処理フロー
![Images Not Found](https://github.com/hogaku/Ugo/blob/master/systemProcessFlow.png)