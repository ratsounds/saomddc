---
layout: page
title: How To Use
permalink: /en/usage/
mathjax: true
lang: en
order: 10
index: true
---

## Quick Usage
1. Choose Boss Preset.
1. Choose Metrics.
1. Check Filter if you need.
1. Verify Unit List.

![Quick Help](../images/quick_help.jpg)

## Unit List & Metrics
### Unit List & Indicator
Unit List is sorted by metrics selected by drop-down list at top right.
Refer [Unit Metrics](#unit%20metrics) for the description for each metric.
Unit information is consist of Level, Weapon Rarity, Weapon Type and [Banner Icons](#banners) and the gradient colored Unit Indicator for damage specs. Shown number is value of selected metric.

![Metrics Indicator](../images/metrics_indicator.jpg)

Unit Indicator intuitively shows the characteristics of damage specs other than selected metrics.
For example in next figure, 
SC Kirito always stays on 1st place under the list sorted by Damage but, from indicator, you can see DPS is lower than other units and SC Kirito is not good at ranking events due to low DPS. 
In another case on comparison of Band Leafa and Will Eugeo, Damage output is almost same but acceleration and max mp 6 star unit advantages can be seen from the difference of DPS and Capacity.

![Metrics Comparison](../images/metrics_comparison.jpg)
Detail information is opened by clicking Unit Indicator.
Small black triangle at bottom right shows the existence of [SS3 video](https://twitter.com/search?src=typd&q=%23S3%E7%99%BA%E5%8B%95%E6%99%82%E9%96%93).

![Detail Top](../images/detail_top.jpg)

### Unit Metrics
The game type of standard ranking event can be considered as "Game to defeat boss as quickly as possible", therefore DPS(Damage Per Second) is most important metrics for unit rating.
SAO:MD:DC defines a type of DPS Metrics called "C/2 DPS" in order to handle combination skills' DPS. See table below for the detail of metrics specification.

For the application in ranking events, pick three higher C/2 DPS units first. After that, exchange a unit to higher damage / shorter duration unit when dealt damage is insufficient / sufficient, and optimize combination order from Duration Gap.

#### Durations
The following figure is a timeline of ABBA combination (A:blue and B:red) and duration parameters. 

![Durations](../images/durations.png)

Duration is whole skill motion, CSec(Combination Second) is combination-able time from skill triggered. Duration and CSec is independently and statically defined for each unit without tinny lags. Most important parameters are C/2 Duration and DPS based on C/2 Duration(C/2 DPS). C/2 (that is abbreviation of Combination or Twice) means duration of Self to Self combination for over 5 star or Twice non-combination skills for under 4 star.
After the 6 star generation, Acceleration duration is used as duration parameters since Acceleration occurs in-game time delaying. Acceleration delays time count for 1/3 of real-time counting. Acceleration duration is independently and statically defined for each unit same as CSec. Thus in-game Duration and CSec can be calculated as follow.

$$
\begin{aligned}
{Duration_{ingame}}&={Accel}/3+Duration_{realtime}-{Accel}
\\
{CSec_{ingame}}&=
\begin{cases}
{CSec_{realtime}}<{Accel} &CSec_{realtime}/3
\\
{CSec_{realtime}}>{Accel} &{Accel}/3+CSec_{realtime}-{Accel}
\end{cases}
\end{aligned}
$$

DPS calculation is based on in-game for default setting but you can change setting by in-game / real-time toggle switch at top right.

![Setting Time](../images/setting_time.jpg)

#### Damage Calculation Specification
Damage is calculated with highest Atk equipment in given level and equipment setting from bottom of config panel. Therefore, calculated damage tend to be bit higher than real damage under current ranking environment with MP equipments. Automatically selected equipment can be seen at detail information that shown by clicking unit indicator. Armor and Accessory are also selected to be highest Atk but Armor and Accessory are un-equipped when non-weapon is selected.

![Setting Equip](../images/setting_equip.jpg)

If boss element is set to null element like as Default and Default 50Hit preset, all elemental specific BS and damage modifier effect is activated in damage calculation for the comparison over element relations.

#### Descriptions of Unit Metrics

|Metrics|Description|
|:--|:--|
|Duration|A metric for skill quickness that is defined by duration time between skill triggered frame (frame that MP is spent) to last frame of skill motion (previous frame of frame that can be move to next action).|
|CSec|A metric for combination host quickness that is defined by skill triggered frame to combination-able first frame.|
|C/2&nbsp;Duration|A metric for overall skill quickness that is defined by ${Duration}+{CSec}$ for combination-able unit and ${Duration}\times2$ for others. C/2 Duration means B's duration time on ABBA combination.|
|Duration&nbsp;Gap|a metric for combination host suitability that is defined by ${Duration}-{CSec}$. Generally, total duration of combination become shorter when larger Duration Gap unit is used as combination host.|
|Damage|A simple metric for Damage. |
|DPS|A metric for ranking suitability that is defined by DPS. C/2 DPS is better for over 5 star|
|CDPS|A metric for ranking suitability as combination host that is defined by presumptive DPS substitute CSec for Duration.|
|C/2&nbsp;DPS|A metric for overall ranking suitability that is defined by DPS substitute C/2 Duration for Duration. C/2 DPS almost equals to DPS in ABBA combination.|
|DPM|A metric for guild ranking that is defined by DPM(Damage Per Minute). DPM is calculated with simple bot that uses skill when MP is sufficient and uses 1set of normal attack when MP is insufficient in order to consider MP recovery capacity by weapon type. |
|Capacity|A metric for vs large HP boss suitability that is defined by approximated total damage of skills when spent all MP without MP recovery. Considering the difference of total damage output capability from Max MP, skill times (${Max MP}/{MP cost}$) is calculated as decimal value.|
|P.DPS|A metric for DPS with parry cancel such as lance, staff, and charge units. Corresponding units get -0.2sec for duration in DPS calculation.|
|P.CDPS|A metric for CDPS with parry cancel such as lance, staff, and charge units. Corresponding units get -0.2sec for duration in DPS calculation.|

#### Calculation of Unit Metrics

|Metrics|Formula|
|:--|:--|:--|
|Duration|${Duration}$|
|CSec|${CSec}$|
|C/2&nbsp;Duration|$$\begin{aligned} \begin{cases} ★6,★5 & {Duration}+{CSec} \\ otherwise & {Duration}\times2\end{cases} \end{aligned}$$|
|Duration&nbsp;Gap|${Duration}-{CSec}$|
|Damage|${Damage}$|
|DPS|${Damage}/{Duration}$|
|CDPS|${Damage}/{CSec}$|
|C/2&nbsp;DPS|$2\cdot{Damage}/{\it C2Duration}$|
|DPM|${Damage}\cdot{\it SS3TimesPer60s}$, ここで${\it SS3TimesPer60s}$は通常攻撃の時間長とMP回復量を考慮して計算 |
|Capacity|${Damage}\cdot{MP_{max}}/{MP_{cost}}$|
|P.DPS|${Damage}/({Duration}-0.2)$|
|P.CDPS|${Damage}/({CSec}-0.2)$|

## Preset and Boss Config
与ダメージはボスの属性とキャラの属性相性や、防御力、特殊な特攻や耐性によって変化することから適切に設定することでより正しくキャラの有利不利を知ることが出来る。一方でその設定は多岐に渡る為、典型的なボスや最新のランイベ用のプリセットを用意している。まずはプリセットの設定内容を確認しながら、各種ボスのパラメータ設定に慣れると良い。

特にアクセス頻度が高いのは設定パネル最上段のデバフとバフ、コンボ関連の設定なのでまずはここだけでも設定できるようにすると良い。

### Def and Debuff
防御は詳細な調査が必要なのでプリセットを参照するのが良い。自分で防御力を測定する場合は[防御の測定](../knowledge/#防御の測定)を参照のこと。デバフはデバフがかった状態で火力の出せるキャラを探す場合に設定する。デバフの値は防御力の減少率なので、値が低いほどダメージ増加効果が高いことに注意する。

![Setting DEF](../images/setting_def.jpg)

### Atk and Buff
全体バフや連携バフを受けた状態で火力の出せるキャラを探す場合に設定する。このとき自己攻撃バフを持つキャラは設定した攻撃バフと効果の高い方が優先して計算される。また、自己/全体攻撃バフと範囲バフは重複して効果を発揮する。

![Setting ATK](../images/setting_atk.jpg)

### Combo Modifier
スキル使用時のコンボヒット数を設定する。コンボによる補正はダメージだけではなく双剣などのようなコンボ加速によるDuration減少も計算されるのでDPS等に変化がある。特に最近のランイベでは開始からコンボを稼ぎ継続する戦略が主流なため設定する機会が多い。

![Setting Combo](../images/setting_combo.jpg)

### List of Parameters

|項目|設定の説明|
|:--:|:--|
|![def](../../icons/def.png)|ボスの防御。最近のランイベでは700前後が多い。デバフ接待の場合は4000前後。|
|![buff](../../icons/buff.png)|全体攻撃バフ。詳しくは[代表的な攻撃力バフとデバフの効果](#代表的な攻撃力バフとデバフの効果)を参照のこと。|
|![cbuff](../../icons/cbuff.png)|範囲攻撃バフ。詳しくは[代表的な攻撃力バフとデバフの効果](#代表的な攻撃力バフとデバフの効果)を参照のこと。|
|![gcrit](../../icons/gcrit.png)|クリティカルダメージアップ。現状確認されているのはダメージ+10％効果のみ。|
|![debuff](../../icons/debuff.png)|デバフによる防御減少率。詳しくは[代表的な攻撃力バフとデバフの効果](#代表的な攻撃力バフとデバフの効果)を参照のこと。|
|![combo](../../icons/combo.png)|コンボ数を設定する。ダメージ補正とコンボ加速によるDuration減少が計算される。|
|![exelem](../../icons/exelement.png)|追加属性補正。ボス属性とキャラ属性の主属性相性補正は上段の属性設定により一律+50/-25％の補正がかかっている。|
|![red weak](../../icons/rweak.png)|赤Weakが表示される時のような、パリィボーナスやスタンボーナス補正。|
|![etc](../../icons/etcmod.png)|その他のダメージ補正。一般的には通常殴りでresist表示になる時にダメージ耐性を設定する。|
|![gurad](../../icons/guard.png)|ランイベ等での常時ガードを持つボスの場合の補正。だいたい3固定。|
|![rank acc](../../icons/racc.png)|ランキングアクセサリによるダメージ補正。なおアクセサリは厳密な計算をしておらず、最も攻撃力が高くなるアクセサリで且つこの設定によるランキングアクセサリの補正が加算される。|
|![trophy](../../icons/trophy.png)|称号による攻撃力補正。|
|![ls](../../icons/ls.png)|リーダースキルとサブリーダースキルによる攻撃力補正。|

### List of Buff and Debuff

|種類|攻撃力補正|防御補正|補足|
|--|:--:|:--:|--|
|強連携バフ|33%||強化済み連携バフキャラ|
|中連携バフ|27%||報酬連携バフキャラ|
|連携バフ|21%||強化前連携バフキャラ|
|強化チア|27%||強化後チアキャラ|
|強全体バフ|21%||強化前チア、★6全体バフキャラ|
|強範囲バフ|21%||★6範囲バフキャラ|
|全体バフ|16%|||
|範囲バフ|16%|||
|海賊バフ|16%|52％|海賊キャラ|
|デバフ||44％||
|中デバフ||34％|土ユウキ|
|強デバフ||29％|強化済みコスプレキャラ|

## App Config
設定パネル右下のトグルスイッチでアプリ設定パネルが表示できる。設定項目はブラウザ毎に保存される。

![App Config](../images/config.jpg)

|項目|説明|
|:--:|:--|
|![wallpaper](../../icons/wallpaper.png)|壁紙設定。左側に画像のURLを指定。右側はエフェクトを選択。エフェクトはMistで全体的に白く、Smokeで黒くしコントラストを下げることで視認性が上がる。また低解像度の壁紙を利用する場合はLineやGridにすると良い。|
|![ls](../../icons/theme.png)|テーマのプリセット。テーマと言っても最上部のタイトルバーの色だけ。プリセットの一覧は[Characters](#characters)を参照。|
|![ls](../../icons/theme_color.png)|タイトルバーの文字色。|
|![ls](../../icons/theme_body.png)|タイトルバー背景色。|
|![ls](../../icons/theme_head.png)|タイトルバーのハイライトその１。|
|![ls](../../icons/theme_highlight.png)|タイトルバーのハイライトその２。|
|![ls](../../icons/info_icon.png)|PC等横長の画面の場合にサイドバーで指定したURLを表示することができる。お知らせを設定するのがおすすめ。メモデフお知らせ([日本語版](https://api-defrag.wrightflyer.net/webview/announcement?phone_type=2) : [英語版](https://api-defrag-ap.wrightflyer.net/webview/announcement?phone_type=2&lang=en))|

{% include data.md %}
{% include keywords.md %}

