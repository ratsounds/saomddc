---
layout: page
title: Knowledge
permalink: /zh/knowledge/
mathjax: true
lang: zh
order: 40
index: true
---

前半會記述在記憶重組中的傷害計算方法，
後半會記述各種數值的測量方法。

## 傷害計算的基本
記憶重組中的給予傷害可以由以下算式大致推測到。

$$
damage = ({\it atk}-{\it def})\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}\cdot{\it guard}
$$

此時的各個變數請參考下表。

|變數|説明|
|:----------:|----|
|[$atk$](#攻撃力的計算)|玩家角色的攻擊力。會受到戰鬥技能(BS)和技能槽位、buff等等的補正。|
|[$def$](#防禦力的計算)|頭目的防禦力。會因debuff而變化。以試用時的狗頭人作為基本，一般的排名戰會在700前後，debuff有利的排名戰多會設定在3000～4000前後。|
|[$rate$](#傷害倍率)|普通攻擊和各劍技技能固有的傷害倍率。決定SS3的強度的重要非公開參數。|
|$crit$|暴擊時的補正值。除了特別的角色以外通常:1.0、暴擊:1.5。|
|[$elem$](#補正値的計算)|屬性相克的補正值。應該是固定在有利:1.5、不利:0.75、其他:1.0。屬性補正較高的頭目應該會在mod項目中設定了追加的屬性補正。|
|[$mod$](#傷害補正値的計算)|武器相性和追加屬性相性等的補正值，一般的有利補正:+0.5、一般的不利補正:-0.5在排名戰等等多被詳細設定。|
|$combo$|每10hit傷害會加上5％的傷害補正（上限100％）。|
|$guard$|從★6世代開始導入了排名戰的常時防守時的補正值。理解為跟一般的防守的規格不同。沒有常時防守時:1.0、常時防守時:1.0/3.0、反擊後等沒有出現防守特效的狀態下好像也有加上了防守補正，但由於補正值bug頻發所以還需要進一步的調查。|

### 攻撃力的計算
攻擊力可以透過以下的算式計算。

$$
\sum{\it ATK}
\cdot
\sum{\it MOD}^{\it atk}
+
\sum{\it SLOT}^{\it atk}
$$

這裏的
$\sum{\it ATK}$是角色、武器、飾品等，攻擊力總和、
$\sum{\it MOD}^{\it atk}$是BS和buff等，攻撃力補正値總和、
$\sum{\it SLOT}^{\it atk}$是武器等級技能槽位總和、
分別可以透過以下的算式計算。

$$
\begin{aligned}
{\it ATK}&=\left\{
{\it atk}_{\it unit},
{\it atk}_{\it weapon},
{\it atk}_{\it armor},
{\it atk}_{\it accessory}
\right\},
\\
{\it MOD}^{\it atk}&=\left\{
1,
\sum{\it BS}^{\it atk},
\max\left\{ {\it buf}_{\it self},{\it buf}_{\it group}\right\}
{\it buf}_{\it zone},
{\it title},
{\it leader},
{\it sub}
\right\},
\\
{\it SLOT}^{\it atk}&=\left\{
{\it slot}^{\it atk},
{\it slot}^{\it atk}_{\it level90},
\cdots
\right\},
\end{aligned}
$$

基本來說可以大致分為攻擊力本身，和％單位的補正值，然後再加上武器等級技能槽位的攻擊力。另外，自我攻擊buff和全隊攻擊buff會以數值較大的一方優先。關於攻擊buff的攻擊補正值可以參考[代表性的攻撃力buff和debuff効果](#代表性的攻撃力buff和debuff効果)。其他的代表性變數一覽可以參考下表。

|攻撃力變數|説明|
|----|----|
|${\it atk}_{\it unit}$|角色本體的基礎攻撃力|
|${\it atk}_{\it weapon}$|武器的攻撃力|
|${\it atk}_{\it armor}$|防具的攻撃力|
|${\it atk}_{\it accessory}$|飾品的攻撃力|

|攻撃力補正變數|説明|
|----|----|
|$\sum{\it BS}^{\it atk}$|各種BS總和|
|${\it buf}_{\it self}$|自我攻撃buff補正|
|${\it buf}_{\it group}$|全隊攻撃buff補正|
|${\it buf}_{\it zone}$|範圍攻撃buff補正|
|${\it title}$|稱號的攻撃力補正|
|${\it leader}$|隊長技能的攻撃力補正|
|${\it sub}$|副隊長技能的攻撃力補正|

|武器等級變數|説明|
|----|----|
|${\it slot}^{\it atk}$|武器等級技能槽位的攻撃力増加|
|${\it slot}^{\it atk}_{\it level90}$|等級解放型武器等級技能槽位的攻撃力増加|

### 防禦力的計算
防禦力可以透過以下的算式計算。

$$
{\it def}\cdot{\it debuf}
$$

debuff的防禦補正${\it debuf}$會是0至1的値，例如防禦補正44％的話會大約把頭目的防禦力減半，防禦補正29％的強化debuff的話會大約使頭目的防禦力減至1/3。關於debuff的防禦補正值請參考[代表性的攻撃力buff和debuff効果](#代表性的攻撃力buff和debuff効果)。

### 代表性的攻撃力buff和debuff効果

|種類|攻撃力補正|防禦補正|補充|
|--|:--:|:--:|--|
|強連結buff|33%||已強化連結buff角色バフキャラ|
|中連結buff|27%||報酬連結buff角色|
|連結buff|21%||強化前連結buff角色|
|強化啦啦隊|27%||強化後啦啦隊角色|
|強全隊buff|21%||強化前啦啦隊、★6全隊buff角色|
|強範圍buff|21%||★6範圍buff角色|
|全隊buff|16%|||
|範圍buff|16%|||
|海盜buff|16%|52％|海盜角色|
|debuff|44％||
|中debuff||34％|土有紀|
|強debuff||29％|已強化cosplay角色|

### 傷害補正値的計算
傷害補正値會在基値1(100%)加上全部以％單位表示的傷害補正値總和，可以透過以下的算式表示。

$$
{\it MOD}^{\it damage}=\{
1,
{\it parry},
{\it type_{damage}},
{\it type_{weapon}},
{\it elem}^{\it ex},
\max\left\{ {\it buf}^{\it crit}_{\it self},{\it buf}^{\it crit}_{\it group}\right\},
\sum{\it BS}^{\it damage},
{\it racc}
\},
$$

各傷害補正值，在有利≒傷害增加時會是正數值，不利≒傷害減少時會是負數值。
傷害補正值會在排名戰等的飾品，反擊補正和傷害屬性補正，傷害增加BS等有各種各樣，代表性的傷害補正值會表示於以下的一覽。

|攻撃力補正變數|説明|
|----|----|
|${\it parry}$|排名戰等在反擊後的傷害補正。通俗來說就是紅色Weak補正。|
|${\it type_{damage}}$|斬・突・打・魔的傷害類型的補正。|
|${\it type_{weapon}}$|武器種補正。|
|${\it elem}^{\it ex}$|追加屬性補正。副屬性會在這裏加算。另外主屬性的屬性補正較大的時候也會在這裏加算追加的值。|
|${\it buf}^{\it crit}_{\it self}$|增加暴擊傷害自我buff的補正。|
|${\it buf}^{\it crit}_{\it group}$|增加暴擊傷害全隊buff的補正。自我和攻擊buff同樣是全隊buff應該會優先數值較大的一方。|
|$\sum{\it BS}^{\it damage}$|各種傷害増加BS。也包括暴擊傷害増加等。|
|${\it racc}$|排名戰飾品的傷害補正。|

### 傷害倍率
決定傷害高度的參數，對於普通攻擊和各劍技技能分別設定。普通攻擊會是0.5～1.0，劍技技能的SS3的數值會有10.0-15.0前後。即使是攻擊力較低角色只要傷害倍率夠高的話就可以給出高的輸出傷害，基本上狀態畫面上的攻擊力只是裝飾，可以說是傷害倍率決定角色的強度。

#### 普通攻撃的傷害倍率
普通攻擊會在每一擊個別設定倍率，各個武器種的第一發倍率記述於下表。

|武器種|第一發倍率|
|:--:|:--:|
|單手劍|0.5|
|雙劍|0.5|
|盾劍|0.5|
|細劍|0.5|
|短劍|0.33|
|矛|0.5|
|弓|0.25|
|單手棍|0.5|
|槍|1.0|
|自動槍|0.1|
|法杖|0.14|

### 亂數引致的傷害變化
已得知遊戲內實際的給予傷害會因為亂數而有10％左右的變化，為了更直接地理解可參考以下的算式。

$$
damage = ({\it atk}-{\it def})\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}\cdot{\it guard}\cdot{\it rng\left(t\right)}
$$

此時${\it rng\left(t\right)}$是隨機從$min$到$max$的値中抽出來的函數，能夠用以下算式定義。

$$
{\it rng}\colon{T}\to R,T=\left\{1,2,3,\cdots\right\},R=\left[min,max\right]
$$

這個情況下，例如向上方修正10％的話就可以想到是$min=1,max=1.1$。另一方面，最近的調查得出攻擊力會根據以下算式作出變化的結果，但需要膨大的傷害測量樣本所以嚴密的調查很困難，即使清楚了亂數的作用規格也對遊戲玩法沒有甚麼得益所以不需要再加以調查。

$$
damage = ({\it atk}\cdot{\it rng\left(t\right)}-{\it def})\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}\cdot{\it guard}
$$

## 各種參數的測定
### 防禦的測定
防禦的測定方法有分為從給予傷害計算出來的方法和透過最低保障傷害尋找的2種類。從給予傷害的計算，雖然可以用較少的試驗次數就能推定到結果，但會因為亂數帶來的傷害變化而減低精準度。相反使用最低保証傷害的邊界值來調查的方法雖然精準度很高，但需要改變攻擊力來多次進行傷害測定。因此由剩餘的傷害來大致推定防禦力之後，再尋求最低保証傷害邊界值會較為理想。

#### 已知的倍率和透過給予傷害的防禦力推測
由於已經知道各個武器種的普通攻擊倍率，若知道其他的補正值的話就可以從傷害中透過以下算式推測到。

$$
{\it def}
=
{\it atk}-\frac{\it damage}{ {\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}\cdot{\it guard}}
$$

例如，無暴擊、無屬性補正，無其他補正，無連擊補正的條件下就可以簡化成下列算式。

$$
{\it def}={\it atk}-\frac{\it damage}{ {\it rate}\cdot{\it guard}}
$$

補正值越少計算就可以越簡略化，所以選擇沒有補正的角色和制造沒有補正的條件的話，就能簡單而準確地推測到。

實際的傷害會因為亂數而改變，所以要取複數的樣本來求平均或中央值。在邊界付近的情況下，當$0.1<atk-def<1.0$的時候，倍率未滿1的普通攻擊的傷害會變成1，倍率在1以上的技能會給出比1更大的傷害，所以能夠無誤差地求出防禦值。

#### 透過最低保証傷害邊界値的嚴密防禦力測量
透過尋找$atk-def=0$ (亦即是$atk=def$) 的atk值以嚴密地尋求防禦力。由於實際上$atk-def$不會變成負數值，在$atk-def=0$的情況下也能夠給出最低保障傷害的1傷害，具體來說是尋找給出傷害2的$atk$值(實用上目標是10傷害左右)。考慮到這些條件，更嚴密的傷害計算式可以寫為以下的算式。

$$
damage = (\max\{ {\it atk}-{\it def},0\}\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}+1)\cdot{\it guard}
$$

另外應該指出的，是擁有常時防守的頭目如果出現最低保証傷害的場合，會發生變成$1/3<1.0$而不會表示給予傷害的現象。（此時會被當作沒有擊中而MP也不會回復）。

防禦力測量時應該注意，由於攻擊力會受到BS和稱號等的補正，所以盡可能選擇沒有稱號和攻擊力增加BS的角色和裝備，可以按需要參考[攻擊力的計算](#攻撃力的計算)來尋找最終攻擊力。由於最近的排名戰頭目的防禦力為700-1500，所以較多使用未育成的未滿★3角色。

#### 已知的防禦力

|頭目|防禦力|屬性|補充|
|:--:|:--:|:--:|:--|
|試用的狗頭人|1450|無||
|武士之魂 絕級|2600|無|高準確度
|克拉帝爾 10-8 HARD|1265|無||

### 補正的測量
屬性相克和武器相性的補正會因為頭目而有所不同，如果已經知道防禦力和倍率的話就可以透過傷害的比率來尋求除去暴擊等已知的補正值。例如以不同角色如條件來測量的${damage_A}$和${damage_B}$的傷害比率可轉換成以下算式。

$$
\frac{damage_A}{damage_B}
=
\frac{
({\it atk_A}-{\it def})\cdot{\it rate_A}\cdot{\it crit_A}\cdot{\it elem_A}\cdot{\it mod_A}\cdot{\it combo_A}\cdot{\it guard}
}{
({\it atk_B}-{\it def})\cdot{\it rate_B}\cdot{\it crit_B}\cdot{\it elem_B}\cdot{\it mod_B}\cdot{\it combo_B}\cdot{\it guard}
}
$$

倍率、暴擊補正、屬性補正等一樣(例如$rate_A=rate_B$)的場合可以簡略化成以下算式。

$$
\frac{damage_A}{damage_B}
=
\frac{
({\it atk_A}-{\it def})\cdot{\it mod_A}
}{
({\it atk_B}-{\it def})\cdot{\it mod_B}
}
$$

這裏的$mod$會是以下算式的各種補正值的總和。

$$
\begin{aligned}
{\it mod}&=
\sum{\it MOD}^{\it damage}
\\
&=
1+
{\it parry}+
{\it type_{damage}}+
{\it type_{weapon}}+
{\it elem}^{\it ex}+
\cdots
\end{aligned}
$$

例如預計除了$parry$沒有其他補正的情況的傷害$damage_{parry}$，跟沒有補正值的理論值傷害$damage_0$的比例可以像以下算式般，從傷害比率減1以得出$parry$的值。

$$
\begin{aligned}
\frac{damage_{parry}}{damage_0}
&=
\frac{
({\it atk}-{\it def})\cdot(1+{parry})
}{
({\it atk}-{\it def})\cdot(1+0)
}
\\
&=
1+{parry}
\end{aligned}
$$

由於已求出$parry$，之後可以尋求武器種補正値$type_{damage}$。同上，尋求預計有武器種補正的角色A的給予傷害和預計沒有武器種補正的角色B的給予傷害的傷害比率。

$$
\frac{damage_A}{damage_B}
=
\frac{
({\it atk_A}-{\it def})\cdot(1+{parry}+type_{damage}+\cdots)
}{
({\it atk_B}-{\it def})\cdot(1+{parry}+0+\cdots)
}
$$

此時，找到兩位攻擊力和屬性補正等都一樣的角色會更為容易。假設兩位角色攻擊力幾乎一樣，沒有除了反擊補正和傷害種類以外的補正的話，可以透過以下算式求出傷害種類的補正值

$$
\begin{aligned}
\frac{damage_A}{damage_B}
&\approx
\frac{
1+{parry}+type_{damage}
}{
1+{parry}+0
}
\\
type_{damage} &= \frac{damage_A}{damage_B}\cdot(1+{parry})-(1+{parry})
\\
&=\left(\frac{damage_A}{damage_B}-1\right)\cdot\left(1+{parry}\right)
\end{aligned}
$$

由於複數的補正疊起來時計算會變得複雜，所以盡可能貼近兩邊的攻擊力會較好。這時候，尋求未知的補正值$mod_{unknown}$的算式，假設其他已知的補正值為$mod_{known}$，可以一般化為以下算式。

$$
mod_{unknown} \approx \left(\frac{damage_A}{damage_B}-1\right)\cdot\left(1+mod_{known}\right)
$$

### 透過試用狗頭人的傷害倍率測量
由於試用的狗頭人是無屬性而防禦是1450，可以由給予傷害推測到技能的倍率。試用的角色會處於Lv.80而BS和技能槽位全部開於的狀態。劍技技能的等級跟初期不同會是Lv.2而且處於劍技技能強化的技能槽位是已經解放了的狀態。要注意跟普通不同的地方是儘管角色是Lv.80，但Lv.90以上才能解放的技能槽位也會被解放。由於試用狗頭人不會受到除了屬性以外的補正，所以可以透過下列算式尋求倍率。

$$
{\it rate}=
\frac{damage}{({\it atk}-{\it def})\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}}
$$

請注意雖然防禦力是1450，但$def$會受到debuff的影響。

### 攻撃buff効果的測量方法
由於攻撃buff的效果不能單靠透過有沒有buff的單純的傷害比率來計算出來，所以一定要使用已知防禦值的敵人測量然後使用傷害計算式逆向計算出來。如果使用同一個的角色有buff時的傷害為${damage_{buffed}}$而沒有buff時的傷害為${damage_{normal}}$而除了buff以外相同條件來進行測量的話，可以像以下算式般透過傷害比率來求出buff的攻擊力補正。

$$
\begin{aligned}
\frac{\it damage_{\it buffed}}{\it damage_{\it normal}}
&=
\frac{
({\it atk}\cdot{\it buf}-{\it def})
}{
({\it atk}-{\it def})
}
\\
{\it buf}
&=
\frac{\it damage_{\it buffed}}{\it damage_{\it normal}}
\cdot
\frac{({\it atk}-{\it def})}{\it atk}
+
\frac{\it def}{\it atk}

\end{aligned}
$$

作為另一個方法，在使用同一角色對同一敵人來測量傷害的話，可以透過buff所帶來的攻擊力增加所造成的有沒有buff時的傷害相差使用下列算式求出數值。

$$
\begin{aligned}
{\it damage_{\it buffed}}-{\it damage_{\it normal}} 
&= 
({\it atk}\cdot{\it buf}-{\it atk})\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}
\\
{\it buf}
&=
\frac{({\it damage_{\it buffed}}-{\it damage_{\it normal}} )}{ {\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it atk}}+1
\end{aligned}
$$
