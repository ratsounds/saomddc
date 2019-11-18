---
layout: page
title: Knowledge
permalink: /ko/knowledge/
mathjax: true
lang: ko
order: 40
index: true
---

&nbsp;&nbsp;&nbsp;앞부분에는 메모디프에서 대미지를 계산하는 방법에 관해 설명하고, 뒷부분에는 각종 파리미터를 측정하는 방법에 관해 설명했습니다.

## 대미지 계산의 기본
&nbsp;&nbsp;&nbsp;메모디프에서 입히는 대미지는 다음 공식으로 대략 추정할 수 있습니다. 

$$
damage = ({\it atk}-{\it def})\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}\cdot{\it guard}
$$

&nbsp;&nbsp;&nbsp;이때 각 변수는 다음과 같습니다.

|변수|설명|
|:----------:|----|
|[$atk$](#공격력-계산)|플레이어 캐릭터의 공격력. 배틀 스킬(BS)이나 스킬 슬롯, 버프 등으로 보정됩니다.|
|[$def$](#방어력-계산)|보스의 방어력. 디버프로 인해 변화합니다. 기본적으로 체험 플레이의 코볼트는 1450을 기본으로 하고, 일반적인 랭전은 700 전후, 디버프가 유리한 랭전에서는 3000~4000 전후로 설정될 때가 많습니다.|
|[$rate$](#대미지-배율)|기본 공격이나 각 소드 스킬 고유의 대미지 배율. SS3의 위력을 결정하는 중요한 비공개 파라미터입니다.|
|$crit$|크리티컬이 발생했을 때의 보정치. 특별한 캐릭터를 제외하면 통상:1.0, 크리티컬:1.5입니다.|
|[$elem$](#대미지-보정치-계산)|속성 상성 보정치. 유리:1.5, 불리:0.75, 그 외:1.0로 고정되어 있다고 봅니다. 속성 보정이 높은 보스는 Mob 항목에 추가 속성 보정으로 설정되어 있다고 생각됩니다.|
|[$mod$](#대미지-보정치-계산)|무기 상성이나 추가 속성 상성 등의 보정치로, 일반적으로 유리 보정:+0.5, 불리 보정:-0.5으로 되어있는데, 랭킹 이벤트 등에서는 세세하게 설정될 때가 많습니다.|
|$combo$|10hit마다 5％의 대미지 보정(최대 100％)이 더해집니다.|
|$guard$|★6세대 이후 랭전에 도입된 상시 가드 시의 보정치. 일반적인 가드 사양과 다르다고 생각됩니다. 상시 가드가 없을 때:1.0, 상시 가드일 때:1.0/3.0으로 패리 후 등에 가드 이펙트가 없는 상태에서도 가드 보정이 걸려 있는 것처럼 보이나, 보정치 버그가 빈번하게 발생하던 시기에 조사한 것을 바탕으로 한 것이어서 계속 조사할 필요가 있습니다.|

### 공격력 계산
&nbsp;&nbsp;&nbsp;공격력은 다음 공식으로 계산할 수 있습니다.

$$
\sum{\it ATK}
\cdot
\sum{\it MOD}^{\it atk}
+
\sum{\it SLOT}^{\it atk}
$$

&nbsp;&nbsp;&nbsp;여기에서 $\sum{\it ATK}$는 캐릭터, 무기, 액세서리 등 공격력의 총합, $\sum{\it MOD}^{\it atk}$은 BS나 버프 등, 공격력 보정치의 총합, $\sum{\it SLOT}^{\it atk}$은 무기 레벨 스킬 슬롯의 총합으로, 각각 다음 공식을 통해 계산할 수 있습니다.  

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

&nbsp;&nbsp;&nbsp;기본적으로는 공격력 그 자체와 %단위의 보정치로 크게 나눌 수 있으며, 무기 레벨 스킬 슬롯에 의한 공격력은 보정을 한 후에 더해집니다. 또한, 자기 공격 버프와 전체 공격 버프는 둘 중에 값이 더 큰 쪽을 우선해서 적용됩니다.  
&nbsp;&nbsp;&nbsp;공격 버프의 공격 보정치에 대해서는 [대표적인 공격력 버프와 디버프 효과](#대표적인-공격력-버프와-디버프-효과)를 참조해주세요. 이 외의 대표적인 변수 목록은 아래 표를 참조하길 바랍니다.

|공격력 변수|설명|
|----|----|
|${\it atk}_{\it unit}$|캐릭터 자체의 기본 공격력|
|${\it atk}_{\it weapon}$|무기의 공격력|
|${\it atk}_{\it armor}$|방어구의 공격력|
|${\it atk}_{\it accessory}$|액세서리의 공격력|

|공격력 변수 보정치|설명|
|----|----|
|$\sum{\it BS}^{\it atk}$|각종 BS의 총합|
|${\it buf}_{\it self}$|자기 공격 버프 보정|
|${\it buf}_{\it group}$|전체 공격 버프 보정|
|${\it buf}_{\it zone}$|범위 공격 버프(장판) 보정|
|${\it title}$|칭호에 의한 공격력 보정|
|${\it leader}$|리더 스킬에 의한 공격력 보정|
|${\it sub}$|서브 리더 스킬에 의한 공격력 보정|

|무기 레벨 변수|설명|
|----|----|
|${\it slot}^{\it atk}$|무기 레벨 스킬 슬롯에 의한 공격력 증가|
|${\it slot}^{\it atk}_{\it level90}$|레벨 해방형 무기 레벨 스킬슬롯에 의한 공격력 증가|

### 방어력 계산
&nbsp;&nbsp;&nbsp;방어력은 다음 공식으로 계산할 수 있습니다.

$$
{\it def}\cdot{\it debuf}
$$

&nbsp;&nbsp;&nbsp;디버프의 방어력 보정 ${\it debuf}$은 0 부터 1의 값으로, 예를 들어 방어력 보정이 44%라고 한다면 보스의 방어력을 약 절반, 방어력 보정치가 29%인 강화 디버프는 약 1/3을 내릴 수 있습니다.  
&nbsp;&nbsp;&nbsp;디버프의 방어 보정치에 대해서는 [대표적인 공격력 버프와 디버프 효과](#대표적인-공격력-버프와-디버프-효과)를 참조하세요.

### 대표적인 공격력 버프와 디버프 효과

|종류|공격력 보정|방어력 보정|보충|
|--|:--:|:--:|--|
|강화&nbsp;연계&nbsp;버프|33%||강화를 끝낸 연계 버프 캐릭터|
|중간&nbsp;연계&nbsp;버프|27%||랭킹 보상 연계 버프 캐릭터|
|연계&nbsp;버프|21%||강화하지 않은 연계 버프 캐릭터|
|강화&nbsp;치어리더|27%||강화를 끝낸 치어리더 캐릭터|
|강화&nbsp;전체&nbsp;버프|21%||강화하지 않은 치어리더, ★6 전체 버프 캐릭터|
|강화&nbsp;장판&nbsp;버프|21%||★6 장판 버프 캐릭터|
|전체&nbsp;버프|16%|||
|장판&nbsp;버프|16%|||
|해적&nbsp;버프|16%|52％|해적 캐릭터|
|약한&nbsp;디버프||63％|신부19 사치|
|디버프||44％||
|중간&nbsp;디버프||34％|풍요(토속성) 유우키|
|강화&nbsp;디버프||29％|강화를 끝낸 코스프레(직업) 캐릭터|

### 대미지 보정치 계산
&nbsp;&nbsp;&nbsp;대미지 보정치는 기본값 1(100%)에 모든 ％단위로 표시하는 대미지 보정치의 총합을 전부 합한 것으로, 다음 공식으로 나타낼 수 있습니다.

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

&nbsp;&nbsp;&nbsp;각각의 대미지 보정치는, 유리≒대미지 증가일 때는 양수 값, 불리≒대미지 감소일 때는 음수 값이 됩니다.  
&nbsp;&nbsp;&nbsp;대미지 보정치는 랭킹 이벤트 등에서의 액세서리, 패리 보정이나 대미지 속성 보정, 대미지 증가 BS 등 다방면에 걸쳐있지만, 대표적인 대미지 보정치 목록은 다음과 같습니다.

|공격력 보정 변수|설명|
|----|----|
|${\it parry}$|랭킹 이벤트 등에서 패리 직후의 대미지 보정. 흔히 말하는 빨간 Weak 보정입니다.|
|${\it type_{damage}}$|베기·찌르기·타격·마법 대미지 종류에 따른 보정.|
|${\it type_{weapon}}$|무기 종류에 따른 보정.|
|${\it elem}^{\it ex}$|추가 속성 보정. 부속성은 여기서 더해집니다. 또한, 주속성 보정이 클 때는 이곳에서 추가분이 더해집니다.|
|${\it buf}^{\it crit}_{\it self}$|크리티컬 대미지 증가 자기 버프에 의한 보정.|
|${\it buf}^{\it crit}_{\it group}$|크리티컬 대미지 증가 전체 버프에 의한 보정. 자기 버프, 공격 버프와 마찬가지로 전체 버프에서 수치가 큰 쪽이 우선해서 적용된다고 생각합니다.|
|$\sum{\it BS}^{\it damage}$|각종 대미지 증가 BS. 크리티컬 대미지 증가 등도 포함됩니다.|
|${\it racc}$|랭킹 액세서리에 의한 대미지 보정.|

### 대미지 배율
&nbsp;&nbsp;&nbsp;대미지가 얼마나 높은지를 결정하는 파라미터로, 일반 공격이나 각각의 소드 스킬에 따라 개별적으로 설정되어 있습니다. 일반 공격에는 0.5～1.0, 소드 스킬은 SS3으로 10.0～15.0 전후의 값을 가지고 있습니다.  
&nbsp;&nbsp;&nbsp;만약 캐릭터의 공격력이 낮더라도 소드 스킬의 대미지 배율이 높으면 높은 대미지를 낼 수 있으므로, 기본적으로 스테이터스 화면의 공격력은 허울이고 대미지 배율이 캐릭터의 강함을 결정한다고 볼 수 있습니다.

#### 일반 공격 대미지 배율
&nbsp;&nbsp;&nbsp;일반 공격은 각각 적중할 때마다 다른 배율이 설정되어 있지만, 무기 종류별 첫타의 배율은 다음과 같습니다.

|무기 종류|첫타 배율|
|:--:|:--:|
|한손검|0.5|
|쌍검|0.5|
|방패검|0.5|
|세검|0.5|
|단검|0.33|
|창|0.5|
|활|0.25|
|한손몽둥이|0.5|
|저격총|1.0|
|자동총|0.1|
|지팡이|0.14|

### 난수로 인한 대미지 오차
&nbsp;&nbsp;&nbsp;인 게임에서 실제로 입히는 대미지는 난수로 인해 10% 정도 오차가 생기는 것으로 알려졌으며, 직관적으로는 다음 공식과 같이 생각할 수 있습니다.

$$
damage = ({\it atk}-{\it def})\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}\cdot{\it guard}\cdot{\it rng\left(t\right)}
$$

&nbsp;&nbsp;&nbsp;이때 ${\it rng\left(t\right)}$는 $min$부터 $max$의 값을 랜덤으로 출력하는 함수로, 다음 공식으로 정의할 수 있습니다.

$$
{\it rng}\colon{T}\to R,T=\left\{1,2,3,\cdots\right\},R=\left[min,max\right]
$$

&nbsp;&nbsp;&nbsp;이 경우, 예를 들어 10％ 위쪽에서 오차가 나는 것이라면 $min=1,max=1.1$라고 생각할 수 있습니다. 한편으로 최근 조사에 따르면 공격력은 다음 공식에 따라 오차가 생긴다고 볼 수 있는 결과를 얻었지만, 방대한 대미지 계측 샘플이 필요하므로 정밀한 조사는 어렵습니다.  
&nbsp;&nbsp;&nbsp;만약 난수가 적용하는 방식이 명확해지더라도 게임 플레이에는 별다른 도움이 되지 못한다는 점에서 더 이상의 조사는 필요하지 않습니다.

$$
damage = ({\it atk}\cdot{\it rng\left(t\right)}-{\it def})\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}\cdot{\it guard}
$$

## 각종 파라미터 측정
### 방어력 측정
&nbsp;&nbsp;&nbsp;방어력 측정 방법은 입힌 대미지에서 역산하는 방법과 최저 보증 대미지가 나오는 경계값에서 구하는 방법으로 2종류가 있습니다. 입힌 대미지에서 역산하는 방법은 적은 시행횟수로 추정할 수 있는 한편, 난수에 인한 대미지 오차 때문에 정밀도가 떨어집니다.  
&nbsp;&nbsp;&nbsp;반대로 최저 보증 대미지의 경계값으로 조사하는 방법은 높은 정밀도를 기대할 수 있는 한편, 공격력을 변경하면서 여러 차례 대미지를 측정할 필요가 있습니다. 따라서 입힌 대미지로부터 방어력을 대강 추정한 다음에 최저 보증 대미지 경곗값을 구해서 정밀도를 높이는 것이 바람직합니다.

#### 알려진 배율과 입힌 대미지로 방어력 추정
&nbsp;&nbsp;&nbsp;각 무기 종류에 따른 일반 공격의 배율은 이미 알려졌으므로, 다른 보정치에 대해서도 알고 있다면 다음 공식으로 대미지를 추정할 수 있습니다.

$$
{\it def}
=
{\it atk}-\frac{\it damage}{ {\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}\cdot{\it guard}}
$$

&nbsp;&nbsp;&nbsp;예를 들어 크리티컬 없음, 속성 보정 없음, 그 외의 보정 없음, 콤보 보정이 없는 조건이라면 다음 공식으로 간략화할 수 있습니다.

$$
{\it def}={\it atk}-\frac{\it damage}{ {\it rate}\cdot{\it guard}}
$$

&nbsp;&nbsp;&nbsp;보정치가 적을수록 계산하기 더욱 간단해지므로, 보정이 걸리지 않도록 캐릭터를 선택하고 조건을 설정하는 것으로 간단하게 높은 정밀도로 방어력을 추정할 수 있습니다.

&nbsp;&nbsp;&nbsp;실제 대미지는 난수에 따라 달라지므로, 여러 샘플을 통해 최대치를 구하거나 평균값 또는 중앙값을 구합니다. 값이 경계 근처일 때는 $0.1<atk-def<1.0$일 때, 배율이 1 미만인 일반 공격은 대미지 1이 되고, 배율이 1 이상인 스킬은 1보다 큰 대미지를 주므로 오차 없이 방어력을 구할 수 있습니다.

#### 최저 보증 대미지 경계치를 통한 정밀한 방어력 측정
&nbsp;&nbsp;&nbsp;$atk-def=0$ (즉 $atk=def$) 이 되는 atk를 찾는 것으로 정밀한 방어력을 구할 수 있습니다. 실제로는 $atk-def$가 음수 값이 되는 일은 없으며,  $atk-def=0$일 때도 최소 보증 대미지로 1의 대미지를 입기에, 구체적으로는 2 이상의 대미지를 입히는 $atk$를 찾습니다(실용적으로는 10 대미지 정도가 목표). 이것들을 고려한 더욱 정밀한 대미지 계산식은 다음처럼 작성할 수 있습니다.

$$
damage = (\max\{ {\it atk}-{\it def},0\}\cdot{\it rate}\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}\cdot{\it combo}+1)\cdot{\it guard}
$$

&nbsp;&nbsp;&nbsp;또한, 상시 가드가 있는 보스한테 최저 보증 대미지가 나왔을 때는, $1/3<1.0$가 되어서 입히는 대미지가 표시되지 않는 현상이 일어납니다. (이때는 공격이 적중하지 않은 것으로 취급되며 MP 회복도 되지 않습니다)

&nbsp;&nbsp;&nbsp;방어력을 측정할 때의 주의할 점으로 공격력은 BS나 칭호 등에 의해서 보정을 받으므로, 될 수 있는 한 칭호 및 공격력 증가 BS가 없는 캐릭터, 장비를 선택하고, 필요에 따라 [공격력 계산](#공격력-계산)을 참조해서 최종 공격력을 구할 필요가 있습니다. 최근 랭전 이벤트 보스의 방어력이 700-1500 사이라 ★3 미만의 캐릭터나 아직 육성하지 않는 캐릭터 등을 이용할 때가 많습니다.

#### 알려진 방어력

|보스|방어력|속성|보충|
|:--:|:--:|:--:|:--|
|체험 플레이 코볼트|1450|무||
|사무라이 소울 절급|2600|무|높은 정밀도
|크라딜 10-8 HARD|1265|무||

### 보정 측정
&nbsp;&nbsp;&nbsp;속성 상성이나 무기 상성 보정은 보스에 따라 다르며, 방어력이나 배율을 알고 있다면 측정한 대미지 비율에서 크리티컬 등의 기존 보정을 제외한 값으로 구할 수 있습니다. 예를 들어 다른 캐릭터나 다른 조건으로 측정한 ${damage_A}$와 ${damage_B}$의 대미지 배율은 다음 공식으로 나타낼 수 있습니다.

$$
\frac{damage_A}{damage_B}
=
\frac{
({\it atk_A}-{\it def})\cdot{\it rate_A}\cdot{\it crit_A}\cdot{\it elem_A}\cdot{\it mod_A}\cdot{\it combo_A}\cdot{\it guard}
}{
({\it atk_B}-{\it def})\cdot{\it rate_B}\cdot{\it crit_B}\cdot{\it elem_B}\cdot{\it mod_B}\cdot{\it combo_B}\cdot{\it guard}
}
$$

&nbsp;&nbsp;&nbsp;배율, 크리티컬 확정, 속성 보정 등이 같을 때는 (예를 들어 $rate_A=rate_B$) 다음 공식으로 간략화할 수 있습니다.

$$
\frac{damage_A}{damage_B}
=
\frac{
({\it atk_A}-{\it def})\cdot{\it mod_A}
}{
({\it atk_B}-{\it def})\cdot{\it mod_B}
}
$$

&nbsp;&nbsp;&nbsp;여기서 $mod$는 다음 공식처럼 다양한 보정치의 총합입니다.

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

&nbsp;&nbsp;&nbsp;예를 들어 $parry$를 제외한 보정이 없다고 예상될 때의 대미지 $damage_{parry}$, 보정치가 없을 때의 이론상 대미지 $damage_0$와의 비율은 다음 공식으로 나타낼 수 있으며, 대미지 비율에서 1을 감산하는 것으로 $parry$를 구할 수 있습니다.

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

&nbsp;&nbsp;&nbsp;$parry$의 값을 구했으므로, 다음은 무기 종류 보정치 $type_{damage}$를 구하는 방법을 생각해봅시다. 마찬가지로 무기 종류 보정치가 있을 것으로 예상되는 캐릭터 A로 입힌 대미지와 무기 종류 보정치가 없을 것으로 예상되는 캐릭터 B로 입힌 대미지의 비율을 구합니다.

$$
\frac{damage_A}{damage_B}
=
\frac{
({\it atk_A}-{\it def})\cdot(1+{parry}+type_{damage}+\cdots)
}{
({\it atk_B}-{\it def})\cdot(1+{parry}+0+\cdots)
}
$$

&nbsp;&nbsp;&nbsp;이 때, 두 캐릭터의 공격력이나 속성 보정의 유무 등이 거의 같다면 더욱 쉽게 구할 수 있습니다. 만약 두 캐릭터의 공격력이 거의 같고 패리와 대미지 종 이외의 다른 보정이 없다면, 다음 식으로 대미지 종 보정치를 구할 수 있습니다.

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

&nbsp;&nbsp;&nbsp;여러 종류의 보정이 복합적으로 걸려 있을 때는 계산이 복잡해지므로, 될 수 있는 한 공격력은 같게 하면 좋습니다. 이 때, 미지의 보정치 $mod_{unknown}$를 구하는 공식은 다른 알려진 보정치를 $mod_{known}$로 하면, 다음 공식으로 일반화할 수 있습니다.

$$
mod_{unknown} \approx \left(\frac{damage_A}{damage_B}-1\right)\cdot\left(1+mod_{known}\right)
$$

### 체험 플레이 코볼트로 대미지 배율 측정
&nbsp;&nbsp;&nbsp;체험 플레이 코볼트는 무속성에 방어력은 1450이므로 입힌 대미지를 통해서 스킬 배율을 추정할 수 있습니다. 체험 캐릭터는 LV.80에 BS 및 스킬 슬롯을 모두 해방한 상태입니다. 소드 스킬의 레벨도 초창기와는 다르게 레벨 2에 소드 스킬 강화 스킬 슬롯을 해방한 상태입니다. 통상과 다른 점은 Lv.80 캐릭터임에도 불구하고 Lv.90 이상일 때 해방할 수 있는 스킬 슬롯이 해방되어 있으니 주의.  
&nbsp;&nbsp;&nbsp;체험 플레이 코볼트는 속성을 제외한 다른 보정을 받지 않으므로 다음 공식으로 배율을 구할 수 있습니다.

$$
{\it rate}=
\frac{damage}{({\it atk}-{\it def})\cdot{\it crit}\cdot{\it elem}\cdot{\it mod}}
$$

&nbsp;&nbsp;&nbsp;방어력은 1450이지만 $def$는 디버프에 영향을 받으므로 주의합니다.

### 공격 버프 효과 측정 방법
&nbsp;&nbsp;&nbsp;공격 버프 효과는 버프 유무에 대한 단순한 대미지 비율로 계산할 수 없으므로, 반드시 방어력이 알려진 적으로 측정해서 대미지 계산 식에서 역산해야 합니다. 같은 캐릭터로 버프가 있을 때의 대미지 ${damage_{buffed}}$와 없을 때의 대미지 ${damage_{normal}}$를 버프 유무를 제외하고 같은 조건으로 측정했을 때, 대미지 비율을 통해서 버프에 의한 공격력 보정을 다음 공식으로 구할 수 있습니다.

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

&nbsp;&nbsp;&nbsp;또 다른 방법으로, 같은 캐릭터를 사용해서 같은 적에게 대미지 측정을 했을 때, 버프가 있을 때와 없을 때의 대미지 증가분을 버프로 인한 공격력 증가분을 통해 다음 공식을 사용해서 구할 수 있습니다.

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
