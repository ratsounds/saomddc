---
layout: page
title: How To Use
permalink: /zh/usage/
mathjax: true
lang: zh
order: 10
index: true
---

## 簡單的使用方法
1. 選擇關卡頭目的預置參數
1. 選擇評價基準(Metrics)
1. 根據需要設定角色過濾
1. 查看角色列表

![Quick Help](../images/quick_help.jpg)

## 角色列表及評價基準
### 參考角色列表的方法
角色列表可以透過右上選擇評價基準來排序。關於各項評價基準請參考以下的[角色的評價基準](#角色的評價基準)章節。角色列表中角色的情報會像下圖般表示等級及武器稀有度、[招募池的圖示](#banners)、以及分為三段色的火力性能指標。顯示數值會根據所選擇的評價基準而改變。

![Metrics Indicator](../images/metrics_indicator.jpg)

透過參考火力指標可以得知除了已選擇的評價基準以外的性能差。例如下圖以Damage排序的角色列表，首位的Skill connect桐人雖然有壓倒性的傷害但DPS卻比其他角色遜色，單發的傷害雖高但技能動畫較長，可見他不適合用於排名戰。另外，以樂團莉法跟思優吉歐比較，儘管兩人傷害幾乎一樣，卻因為加速技能而在DPS有很大的差距，也能看到因為最大MP的差距而造成的Capacity相差。

![Metrics Comparison](../images/metrics_comparison.jpg)

可以點擊角色列表上的指標以查看角色的詳細資料。火力指標右下附有黑色三角代表該角色在詳細資料內附有[技能動畫影片](https://twitter.com/search?src=typd&q=%23S3%E7%99%BA%E5%8B%95%E6%99%82%E9%96%93)。

![Detail Top](../images/detail_top.jpg)

### 角色的評價基準
記憶重組的排名戰大多是「儘快打倒頭目的遊戲」，在評價角色時除了單發的傷害值，還加上技能動畫的長度(Duration)以得出的DPS(Damage Per Second:每秒傷害)值最為重要。由於記憶重組在實裝★5後，角色可透過連結技能，在技能動畫途中發動另一角色的技能，所以在計算DPS時需要同時考慮這點。火力計算機中為了計算這些DPS，定義了自創的用來表示時間長度的變數。有關時間長度以及傷害計算的標準、代表性的評價基準將會在之後的章節說明。

如要應用於排名戰，參考C/2 DPS就能粗略計算到角色的強度，首先參考C/2 DPS選出隊伍後，如果傷害不夠再參考Damage來調整隊伍，以及參考Duration Gap和Duration來改善連結順序。

#### 時間長度(Duration)的標準
下圖顯示了藍色和紅色角色的藍紅紅藍的來回4連結例子以表示時間流程、以及幾項角色的參數。

![Durations](../images/durations.png)

Duration指整個技能動畫的時間長度，CSec(Combination Second)指由技能發動一刻至可以連結的一刻為止的時間長度。每個角色都分別被設定了自己的Duration和CSec數值，除了輕微的系統延遲以外數值都是固定的。在連結世代以後的角色性能評價中特別重要的是C/2 Duration及以其計算出的DPS值(C/2 DPS)。C/2是Combination or Twice的省略，而C/2 Duration則表示了★5或以上就是連結，★4則是2連發所需的時間長度。為了更直接的理解請參照上圖所標示的時間流程。

★6以後因為加速技能增加了縮短遊戲內時間的要素，加速狀態的時間長度也作為數據被參考。加速狀態下遊戲內時間會縮短為現實時間的1/3，加速長度跟連結同樣是固定為自技能發動的一定時間。因此，遊戲內的Duration和CSec可以透過以下的算式計算。

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

DPS計算基本上以遊戲內時間作為基準，可以透過右上的切換按鈕來切換遊戲內時間以及現實時間。

![Setting Time](../images/setting_time.jpg)

#### 傷害計算的標準
傷害會根據角色在裝備了設定面板下方的武器裝備設定的範圍中最高攻擊力的狀態來計算。因此，在現時關卡頭目的HP被增加，最大MP成為重要參數的大環境下計算結果會比實際的輸出傷害要高。正在裝備的武器及防具可以透過點擊角色列表中的指標，所顯示的詳細資料中查看到。防具以及飾品也會以最高攻擊力的裝備計算，但如選擇沒有裝備武器，將會以沒有裝備任何防具及飾品的狀態來計算。

![Setting Equip](../images/setting_equip.jpg)

如選擇了Default或是Default 50Hit等無視敵人屬性的預置參數，針對特定屬性的頭目才有效果的BS全都會被計算在內。

#### 代表性的評價基準的說明

|基準|説明|
|:--|:--|
|Duration|技能發動至技能僵硬解除後能活動為止的時間長度，是標誌技能動畫的速度的基準|
|CSec|技能發動至能夠連結為止的時間長度，是標誌連結的速度的基準|
|C/2&nbsp;Duration|使用了Duraion和CSec計算出來的數值，例如可連結的A和B的兩個角色做出的ABBA來回4連結時的A和B的技能時間長度。是標誌考慮到連結的綜合速度的基準。不可連結的角色則會以技能二連發（=${Duration}\times2$）時的數值代替。|
|Duration&nbsp;Gap|Duration和CSec的差距，此數值越大在作為連結發起者時所縮短的時間越大，是標誌連結發起者資質的基準。另外，也跟連結之後連結發起者留在畫面上的時間相近(留在畫面上的時間會是Duration Gap再加上退出時的向後踏步動畫的時間長度)。基本上以Duration Gap較大的一方作為連結發起者會較快。|
|Damage|輸出傷害。是標誌火力的評價基準|
|DPS|一個時間單位(1秒)內輸出的傷害，是標誌排名戰資質的基準。連結世代以後參考C/2 DPS會較理想|
|CDPS|只考慮作為連結發起者的情況下的DPS，是標誌反擊戰略向的排名戰資質的評價基準。請注意這是以在連結前已經把技能的所有傷害打出來的數值。|
|C/2&nbsp;DPS|基於C/2 Duration計算出的DPS，是標誌排名戰資質的泛用評價基準。可以理解為ABBA的來回4連結中的DPS高低。|
|DPM|一個時間單位(1分鐘)內輸出的傷害、是標誌公會排名資質的基準。有MP的時候就發動技能、MP不足的時候就會進行1組普通攻擊以MP回復、重復1分鐘後的輸出傷害。|
|Capacity|跟在沒有回復MP下把MP全用來發動技能時的總輸出傷害值相似，是標誌對付體質較硬的頭目的資質的基準值。例如同樣為100MP消耗，總MP量分別為390和100的兩個角色，明顯地在對付體質較硬的頭目的資質會有相差，計算上會像"能打3.7發"這樣連同小數點計算乘數。|
|P.DPS|在取消反擊時的估計DPS。在考慮了矛・法杖・蓄力角色能夠使用取消反擊來消除掉反擊動畫的0.2秒的情況下計算出的DPS。|
|P.CDPS|在取消反擊時的估計CDPS。在考慮了矛・法杖・蓄力角色能夠使用取消反擊來消除掉反擊動畫的0.2秒的情況下計算出的CDPS。|

#### 代表性的評價基準的計算方法

|基準|計算方法|
|:--|:--|:--|
|Duration|${Duration}$|
|CSec|${CSec}$|
|C/2&nbsp;Duration|$$\begin{aligned} \begin{cases} ★6,★5 & {Duration}+{CSec} \\ otherwise & {Duration}\times2\end{cases} \end{aligned}$$|
|Duration&nbsp;Gap|${Duration}-{CSec}$|
|Damage|${Damage}$|
|DPS|${Damage}/{Duration}$|
|CDPS|${Damage}/{CSec}$|
|C/2&nbsp;DPS|$2\cdot{Damage}/{\it C2Duration}$|
|DPM|${Damage}\cdot{\it SS3TimesPer60s}$, 這裏的${\it SS3TimesPer60s}$是指有考慮普通攻擊的時間長度和MP回復量的計算 |
|Capacity|${Damage}\cdot{MP_{max}}/{MP_{cost}}$|
|P.DPS|${Damage}/({Duration}-0.2)$|
|P.CDPS|${Damage}/({CSec}-0.2)$|

## 頭目的預置參數和設定
輸出傷害是會根據頭目的屬性和角色的屬性相克、防禦力、特殊的特攻和耐性而改變所以適當設定就能知道角色的有利不利。另一方面由於有很多不同的參數要設定所以網站準備了一些典型的頭目和最新的排名戰用的預置參數。建議首先確認預設參數的設定內容，習慣一下各類頭目的參數設定。

使用頻率特別高的有設定面板最上方的debuff(降防)和buff，和連擊相關的設定，所以建議首先學會設定這幾項參數。

### 防禦力和debuff的設定
防禦需要經過詳細的調查所以參考預設參數會比較好。如果希望自己測量防禦力的話請參考[防禦的測量](../knowledge/#防禦的測量)。Debuff是在頭目被上了debuff的狀態下尋找能給出火力的角色時設定。因為debuff值是防禦力的減少率，所以請注意數値越低增加傷害的効果會越高。

![Setting DEF](../images/setting_def.jpg)

### 攻擊力和buff的設定
在自己已經被上了全隊buff或連結buff的狀態下尋找能給出火力的角色時設定。這時候持有自我攻擊buff的角色會優先計算兩個buff中效果較高的一方。另外，自我/全隊攻擊buff和範圍buff可以重疊地發揮效果。

![Setting ATK](../images/setting_atk.jpg)

### 連擊數補正的設定
設定使用技能時的連擊數。除了連擊數的傷害補正，像是雙劍等的因連擊加速所減少的Duration也會被計算所以DPS等等會有所變化。特別是最近的排名戰在開首先疊連擊數成了主流戰略所以設定的機會很多。

![Setting Combo](../images/setting_combo.jpg)

### 設定項目一覧

|項目|設定的説明|
|:--:|:--|
|![def](../../icons/def.png)|頭目的防禦值。最近的排名戰多在700前後。debuff接待的時候會在4000前後。|
|![buff](../../icons/buff.png)|全隊攻撃buff。詳細請參考[代表性的攻撃力buff和debuff効果](#代表性的攻撃力buff和debuff効果)。|
|![cbuff](../../icons/cbuff.png)|範圍攻撃buff。詳細請參考[代表性的攻撃力buff和debuff効果](#代表性的攻撃力buff和debuff効果)。|
|![gcrit](../../icons/gcrit.png)|暴擊傷害提昇。現在能夠確認到的只有+10%傷害的效果。|
|![debuff](../../icons/debuff.png)|Debuff的防禦減少率。詳細請參考[代表性的攻撃力buff和debuff効果](#代表性的攻撃力buff和debuff効果)。|
|![combo](../../icons/combo.png)|設定連擊數。傷害補正和連擊加速所引致的Duration減少會被計算。|
|![exelem](../../icons/exelement.png)|追加屬性補正。頭目屬性和角色屬性的主屬性相克補正會在上方的屬性設定一律設定成+50/-25%的補正。|
|![red weak](../../icons/rweak.png)|像是表示紅色Weak時、反擊獎勵或昏迷獎勵補正。|
|![etc](../../icons/etcmod.png)|其他傷害補正。一般會被設定作無反擊時表示resist時的傷害耐性。|
|![gurad](../../icons/guard.png)|排名戰等持有常時防守狀態的頭目時的補正。大多固定為3。|
|![rank acc](../../icons/racc.png)|排名戰飾品的傷害補正。但飾品並沒有被嚴密計算，會用攻擊力最高的飾品再加上排名戰飾品特攻來計算。|
|![trophy](../../icons/trophy.png)|稱號的攻擊力補正。|
|![ls](../../icons/ls.png)|隊長技能和副隊長技能的攻擊力補正。|

### 代表性的攻撃力buff和debuff効果

|種類|攻撃力補正|防禦補正|補充|
|--|:--:|:--:|--|
|強連結buff|33%||已強化的連結buff角色|
|中連結buff|27%||報酬連結buff角色|
|連結buff|21%||強化前連結buff角色|
|強化啦啦隊|27%||強化後啦啦隊角色|
|強全隊buff|21%||強化前啦啦隊、★6全隊buff角色|
|強範圍buff|21%||★6範圍buff角色|
|全隊buff|16%|||
|範圍buff|16%|||
|海盜buff|16%|52％|海盜角色|
|debuff||44％||
|中debuff||34％|土有紀|
|強debuff||29％|已強化cosplay角色|

## 應用程式設定
可以透過設定面板右下的切換按鈕顯示應用程式設定面板。設定項目會依瀏覽器保存。

![App Config](../images/config.jpg)

|項目|説明|
|:--:|:--|
|![wallpaper](../../icons/wallpaper.png)|牆紙設定。在左側指定圖片的URL。在右側選擇效果。效果可以使用Mist使整體變白，或Smoke使整體變黑來降低對比度以增加能見度。另外使用低解像度的牆紙時使用Line或Grid會較好。|
|![ls](../../icons/theme.png)|預設主題。雖然說是主題其實也只是最上方的標題欄的顏色。預設主題的一覽請參考[Characters](#characters)。|
|![ls](../../icons/theme_color.png)|標題欄的文字顏色。|
|![ls](../../icons/theme_body.png)|標題欄的背景顏色。|
|![ls](../../icons/theme_head.png)|標題欄的強調色其一。|
|![ls](../../icons/theme_highlight.png)|標題欄的強調色其二。|
|![ls](../../icons/info_icon.png)|PC等横向畫面可以透過指定URL來設定標題欄。推薦設定為遊戲通知。記憶重組通知([日文版](https://api-defrag.wrightflyer.net/webview/announcement?phone_type=2) : [英文版](https://api-defrag-ap.wrightflyer.net/webview/announcement?phone_type=2&lang=en) : [中文版](https://api-defrag-ap.wrightflyer.net/webview/announcement?phone_type=2&lang=tc))|

{% include data.md %}


