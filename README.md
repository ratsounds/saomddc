# saomddc
Userscript for modifying Ratsound's sao:MD calculator for your own Units, Weapons and Armors

Current Version 2.0.1

# How to use
1. Install Tampermonkey (chrome), Greasemonkey (firefox) plugin.
2. Copy the PersonalUserScript.js script inside the PersonalUserscript folder in the github.
3. Replace the lists for Units, Weapons and Armors with your own.
4. Paste the script with your own units into tamper/greaseMonkey.
5. Open Ratsounds calculator with the userscript in the plugin enabled.
6. See the list with only your own stuff now.
7. If you have trouble getting to 6 then I made a puzzle guide in paint with images in the github called: guide.png (some ordering required)

# functions
- For adding your own stuff replace the arrays with your respective units/weapons/armors following the format.
- Keep a backup of your own stuff separately so you can easily paste them into updated scripts
- After pressing a unit in the list you can press "d" to remove the weapon and char from current list
- After pressing a unit in the list you can press "w" to remove only the weapon that char had equipped from the calculation
- Pressing "r" will restore the weapon and unit list.
- Added FloorCapacity filter which floors the damage from maximum SS3's to the possible SS3's from start MP. (instead of also counting the remaining mp like Capacity).
- Added C2DPM filter which also accounts for combo ss3 timings
- Fixed both DPM filters to also account for regen from attacks
- The used weapon / armor for the calcutation is visible next to the "Atk Weapon" / "Atk Armor" tab after clicking on the unit in ranking list.

Some commands will temporarily affect the script without the need to edit it:
- Commands need to be entered into the browser console
- You open the console in chrome pressing F12 / Firefox Ctrl+Shift+K
- useMy.chars = (true / false) en/disables the use of own chars
- useMy.weapons = (true / false) en/disables the use of own weapons
- useMy.armors = (true / false) en/disables the use of own armors
- showAllChars() shows database list of all char id's / names
- showAllWeps() shows database list of all weapon id's / names
- showAllArmors() shows database list of all armor id's / names
- resetWeps() restores the weapon list if you have removed some (in case pressing "r" doesn't work)

# Notes
- Only the PersonalUserScript.js in the PersonalUserScript folder is needed in Tampermonkey (chrome) or Greasemonkey (firefox)
- If using your own weapons, units with no available weapon will not show up.
- If using your own armors, units with no available armor will not show up. (male / female)
- Using your own armor only works when using own weapons as well.
- When using your own Units / Weapons the filter will ignore the level / rarity filter icons
- After new updates by Ratsounds the userscript might break, check back here for fixed script
- All testing by the developer is done using chrome
- If the script can't find the specified char/weapon/armor from your lists it will throw the culprit in the console.
- The note above also causes the script to not work until the culprit is removed/fixed.
- The calculator might load a bit slower depending on the size of your own lists.
  Setting the useMy.armors to false by default gives most performance gain in comparison to accuracy of the best units.
- Ignore the "TypeError: Cannot read property 'preset' of undefined" at startup in the console.