//Bosonic Lab
function canUnlockBosonicLab() {
	return false
}
  
function updateBLUnlocks() {
	let unl = player.ghostify.wzb.unl
	el("blUnl").style.display = unl ? "none" : ""
	el("blDiv").style.display = unl ? "" : "none"
	if (!unl) updateBLUnlockDisplay()
	updateBosonicLimits()
}

function updateBLUnlockDisplay() {
	el("blUnl").textContent = "To unlock Bosonic Lab, you need to get ???"
}

function getBosonicWattGain() {
	let x = Math.max(player.money.log10() / 2e16 - 1, 0)
	if (hasAch("ng3p91")) x *= getAchBWtMult()
	if (isEnchantUsed(34)) x *= tmp.bEn[34]
	return x
}

function getAchBWtMult() {
	return player.achPow.div(Decimal.pow(1.5, 21))
}

function getBatteryGainPerSecond(toSub) {
	let batteryMult = E(1)
	if (isEnchantUsed(24)) batteryMult = batteryMult.times(tmp.bEn[24])

	let toAdd = toSub.div(2e6).times(batteryMult)
	if (toAdd.gt(1e3)) toAdd = Decimal.pow(toAdd.log10() + 7, 3)

	return toAdd
}

function getOverdriveFinalSpeed() {
	return tmp.bl.odSpeed
}

function getOverdriveSpeedDisplay() {
	let x = 1
	if (tmp.bl.battery.gt(0)) x = getOverdriveFinalSpeed()
	return x
}

function getBosonicFinalSpeed() {
	return Decimal.times(player.ghostify.bl.speed, getOverdriveSpeedDisplay()).times(ls.mult("bl"))
}

function updateBAMAmount(diff = 0) {
	let data = player.ghostify.bl
	var newBA = data.am
	var baAdded = diff ? getBosonicAMProduction().times(diff) : 0
	if (tmp.badm.start !== undefined && data.am.gt(tmp.badm.start) && tmp.badm.postDim <= Number.MAX_VALUE) data.am = tmp.badm.preDim.times(tmp.badm.start)
	updateBosonicAMDimReturnsTemp()
	newBA = data.am.add(baAdded)
	if (newBA.gt(tmp.badm.start)) {
		newBA = newBA.div(tmp.badm.start)
		tmp.badm.preDim = newBA
		newBA = newBA.sub(-tmp.badm.offset).ln() / Math.log(tmp.badm.base) + tmp.badm.offset2
		tmp.badm.postDim = newBA
		newBA = tmp.badm.start.times(newBA)
	}
	data.am = newBA
}

function bosonicTick(diff) {
	let lDiff //Mechanic-local diff
	let lData //Mechanic-local data
	let data = player.ghostify.bl
	if (isNaN(diff.e)) return
	if (data.odSpeed > 1 && data.battery.gt(0)) {
		var bBtL = getBosonicBatteryLoss()
		var odDiff = diff.times(bBtL).min(data.battery)
		var fasterDiff = odDiff.div(bBtL).times(getOverdriveFinalSpeed())
		data.battery = data.battery.sub(diff.times(bBtL).min(data.battery))
		diff = fasterDiff.add(diff.sub(odDiff.min(diff)))
	}
	data.ticks = data.ticks.add(diff)
	
	//W & Z Bosons
	let apDiff
	lData = player.ghostify.wzb
	if (lData.dPUse) {
		apDiff = diff.times(getAntipreonLoss()).min(lData.dP).div(aplScalings[player.ghostify.wzb.dPUse])
		if (isEnchantUsed(13)) apDiff = apDiff.times(tmp.bEn[13])
		if (isNaN(apDiff.e)) apDiff = E(0)

		lData.dP = lData.dP.sub(diff.times(getAntipreonLoss()).min(lData.dP))
		if (lData.dP.eq(0)) lData.dPUse = 0

		if (lData.dPUse == 1) {
			lData.wQkProgress = lData.wQkProgress.add(apDiff.times(tmp.wzb.zbs))
			if (lData.wQkProgress.gt(1)) {
				let toSub = lData.wQkProgress.floor()
				lData.wpb = lData.wpb.add(toSub.add(lData.wQkUp ? 1 : 0).div(2).floor())
				lData.wnb = lData.wnb.add(toSub.add(lData.wQkUp ? 0 : 1).div(2).floor())
				if (toSub.mod(2).gt(0)) lData.wQkUp = !lData.wQkUp
				lData.wQkProgress = lData.wQkProgress.sub(toSub.min(lData.wQkProgress))

				let toAdd = getBatteryGainPerSecond(toSub.div(diff)).times(diff)

				data.battery = data.battery.add(toAdd.times(diff))
				tmp.batteryGainLast = toAdd
			}
		}
		if (lData.dPUse == 2) {
			lData.zNeProgress = lData.zNeProgress.add(apDiff.times(getOscillateGainSpeed()))
			if (lData.zNeProgress.gte(1)) {
				let oscillated = Math.floor(lData.zNeProgress.add(1).log(2))
				lData.zb = lData.zb.add(Decimal.pow(Math.pow(2, 0.75), oscillated).sub(1).div(Math.pow(2, 0.75)-1).times(lData.zNeReq.pow(0.75)))
				lData.zNeProgress = lData.zNeProgress.sub(Decimal.pow(2,oscillated).sub(1).min(lData.zNeProgress)).div(Decimal.pow(2, oscillated))
				lData.zNeReq = lData.zNeReq.times(Decimal.pow(2,oscillated))
				lData.zNeGen = (lData.zNeGen+oscillated-1)%3+1
			}
		}
		if (lData.dPUse == 3) {
			lData.wpb = lData.wpb.add(lData.wnb.min(apDiff).times(tmp.wzb.zbs))
			lData.wnb = lData.wnb.sub(lData.wnb.min(apDiff).times(tmp.wzb.zbs))
		}
	} else lData.dP = lData.dP.add(diff.times(getAntipreonProduction()))
	lData.zNeReq=pow10(Math.sqrt(Math.max(Math.pow(lData.zNeReq.log10(),2) - diff / 100, 0)))
	
	//Bosonic Extractor
	if (data.usedEnchants.includes(12)) {
		data.autoExtract = data.autoExtract.add(diff.times(tmp.bEn[12]))
		if (!data.extracting && data.autoExtract.gte(1)) {
			data.extracting = true
			data.autoExtract = data.autoExtract.sub(1)
			dynuta.times = 0
		}
	} else data.autoExtract = E(1)
	if (data.extracting) data.extractProgress = data.extractProgress.add(diff.div(getExtractTime()))
	if (data.extractProgress.gte(1)) {
		var oldAuto = data.autoExtract.floor()
		if (!data.usedEnchants.includes(12)) oldAuto = E(0)
		var toAdd = data.extractProgress.min(oldAuto.add(1).round()).floor()
		data.autoExtract = data.autoExtract.sub(toAdd.min(oldAuto))
		data.glyphs[data.typeToExtract - 1] = data.glyphs[data.typeToExtract - 1].add(toAdd).round()
		if (dynuta.check) {
			dynuta.check = false
			dynuta.times++
			if (dynuta.times >= 20) giveAchievement("Did you not understand the automation?")
		}
		if (data.usedEnchants.includes(12) && oldAuto.add(1).round().gt(toAdd)) data.extractProgress = data.extractProgress.sub(toAdd.min(data.extractProgress))
		else {
			data.extracting = false
			data.extractProgress = E(0)
		}
		player.ghostify.automatorGhosts[17].oc = true
	}
	if (data.extracting && data.extractProgress.lt(1)) {
		dynuta.check = false
		dynuta.times = 0
	}

	//Bosonic Antimatter production
	updateBAMAmount(diff)
}

function getBAMProduction(){
	return getBosonicAMProduction()
}

function getBosonicAntiMatterProduction(){
	return getBosonicAMProduction()
}

function getBosonicAMProduction() {
	let exp = player.money.max(1).log10() / 15e15 - 3
	let ret = pow10(exp).times(tmp.wzb.wbp)

	if (hasAch("ng3p113")) ret = ret.times(Math.log10(getReplEff().max(1e10).log10()))
	return ret
}

function getBosonicAMProductionSoftcapExp(x) {
	let frac = 10

	return 1 - x / frac
}

function getBosonicAMFinalProduction() {
	let r = getBosonicAMProduction()
	if (player.ghostify.bl.am.gt(tmp.badm.start)) r = r.div(tmp.badm.preDim)
	return r
}

let maxBLLvl = 3
function updateBosonicLimits() {
	//Bosonic Level?
	let lvl = 3

	//Bosonic Lab
	br.limit = br.limits[lvl]
	bEn.limit = bEn.limits[lvl]

	if (lvl == 0) return

	var width = 100 / br.limit
	for (var r = 1; r <= br.limits[maxBLLvl]; r++) {
		el("bRuneCol" + r).style = "min-width:" + width + "%;width:" + width + "%;max-width:" + width + "%"
		if (r > 3) {
			var shown = br.limit >= r
			el("bRuneCol" + r).style.display = shown ? "" : "none"
			el("typeToExtract" + r).style.display = shown ? "" : "none"
			el("bEnRow" + (r - 1)).style.display = shown ? "" : "none"
		}
	}
}

function showBLTab(tabName) {
	//iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
	var tabs = el_class('bltab');
	var tab;
	var oldTab
	for (var i = 0; i < tabs.length; i++) {
		tab = tabs.item(i);
		if (tab.style.display == 'block') oldTab = tab.id
		if (tab.id === tabName) {
			tab.style.display = 'block';
		} else {
			tab.style.display = 'none';
		}
	}
	if (oldTab !== tabName) aarMod.tabsSave.tabBL = tabName
	closeToolTip()
}

function getEstimatedNetBatteryGain() {
	let pos = (tmp.batteryGainLast || E(0)).times(1000)
	if (player.ghostify.wzb.dPUse != 1) pos = E(0)
	let neg = getBosonicBatteryLoss().times(player.ghostify.bl.speed)
	if (pos.gte(neg)) return [true, pos.minus(neg)]
	return [false, neg.minus(pos)]
}

function updateBosonicLabTab(){
	let data = player.ghostify.bl
	let speed = getBosonicFinalSpeed()
	el("bWatt").textContent = shorten(data.watt)
	el("bSpeed").textContent = shorten(data.speed)
	el("bTotalSpeed").textContent = shorten(speed)
	el("bTicks").textContent = shorten(data.ticks)
	el("bAM").textContent = shorten(data.am)
	el("bAMProduction").textContent = "+" + shorten(getBosonicAMFinalProduction().times(speed)) + "/s"
	el("bAMProductionReduced").style.display = data.am.gt(tmp.badm.start) ? "" : "none"
	el("bAMProductionReduced").textContent = "(reduced by " + shorten(tmp.badm.preDim) + "x)"
	el("bBt").textContent = shorten(data.battery)
	let x = getEstimatedNetBatteryGain()
	s = shorten(x[1]) + "/s"
	if (!x[0]) s = "-" + s
	else s = "" //Visualizing the positive production rate is currently broken for now.
	el("bBtProduction").textContent = s
	el("odSpeed").textContent = shorten(getOverdriveSpeedDisplay()) + "x"
	el("odSpeedWBBt").style.display = data.battery.eq(0) && data.odSpeed > 1 ? "" : "none"
	el("odSpeedWBBt").textContent = " (" + shorten(getOverdriveFinalSpeed()) + "x if you have Bosonic Battery)"
	for (var g = 1;g <= br.limit; g++) el("bRune"+g).textContent = shortenDimensions(data.glyphs[g-1])
	if (el("bextab").style.display=="block") updateBosonExtractorTab()
	if (el("butab").style.display=="block") updateBosonicUpgradeDescs()
	if (el("wzbtab").style.display=="block") updateWZBosonsTab()
}

function teleportToBL() {
	showGhostifyTab("bltab")
	showTab("ghostify")
}

function updateBosonicStuffCosts() {
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		var data = bEn.costs[id]
		el("bEnG1Cost" + id).textContent = (data !== undefined && data[0] !== undefined && shortenDimensions(getBosonicFinalCost(data[0]))) || "???"
		el("bEnG2Cost" + id).textContent = (data !== undefined && data[1] !== undefined && shortenDimensions(getBosonicFinalCost(data[1]))) || "???"
	}
}

function getBosonicFinalCost(x) {
	x = E(x)
	if (hasAch("ng3p91")) x = x.div(2)
	return x.ceil()
}

function updateBosonicLabTemp() {
	delete tmp.bEn
	tmp.wzb = {}

	if (!pH.did("ghostify")) return 
	if (!player.ghostify.wzb.unl) return 

	updateBosonicEnchantsTemp()
	updateWZBosonsTemp()

	if (!tmp.badm) updateBosonicAMDimReturnsTemp()
}

//Bosonic Extractor / Bosonic Runes
let dynuta={
	check: false,
	times: 0
}
function extract() {
	let data = player.ghostify.bl
	if (data.extracting) return
	dynuta.check = true
	data.extracting = true
}

function getExtractTime() {
	let data = player.ghostify.bl
	let r = E(br.scalings[data.typeToExtract] || 1/0)
	r = r.div(tmp.wzb.wbt)
	return r
}

function getRemainingExtractTime() {
	let data = player.ghostify.bl
	let x = getExtractTime().div(data.speed)
	if (data.extracting) x = x.times(Decimal.sub(1, data.extractProgress))
	return x
}

function changeTypeToExtract(x) {
	let data = player.ghostify.bl
	if (data.typeToExtract == x) return
	el("typeToExtract" + data.typeToExtract).className = "storebtn"
	el("typeToExtract" + x).className = "chosenbtn"
	data.typeToExtract = x
	data.extracting = false
	data.extractProgress = E(0)
	data.autoExtract = E(1)

	player.ghostify.automatorGhosts[17].t = 0
	delete player.ghostify.automatorGhosts[17].oc
}

function canBuyEnchant(id) {
	let data = player.ghostify.bl
	let costData = bEn.costs[id]
	let g1 = Math.floor(id / 10)
	let g2 = id % 10
	if (costData === undefined) return
	if (costData[0] === undefined || !data.glyphs[g1 - 1].gte(getBosonicFinalCost(costData[0]))) return
	if (costData[1] === undefined || !data.glyphs[g2 - 1].gte(getBosonicFinalCost(costData[1]))) return
	return true
}

function getMaxEnchantLevelGain(id) {
	let data = player.ghostify.bl
	let costData = bEn.costs[id]
	let g1 = Math.floor(id / 10)
	let g2 = id % 10
	if (costData === undefined) return E(0)
	let lvl1 = data.glyphs[g1 - 1].div(getBosonicFinalCost(costData[0])).floor()
	let lvl2 = data.glyphs[g2 - 1].div(getBosonicFinalCost(costData[1])).floor()
	if (costData[0] == 0) lvl1 = 1/0
	if (costData[1] == 0) lvl2 = 1/0
	return Decimal.min(lvl1, lvl2)
}

function canUseEnchant(id) {
	if (isEnchantUsed(id)) return true
	if (!tmp.bl.enchants[id]) return false
	if (tmp.bl.usedEnchants.length >= bEn.limit) return false
	return true
}

function takeEnchantAction(id) {
	bEn.actionFuncs[bEn.action](id)
}

function changeEnchantAction(id) {
	bEn.action = bEn.actions[id - 1]
}

function getEnchantEffect(id, desc) {
	let data = player.ghostify.bl
	let l = E(0)
	if (bEn.effects[id] === undefined) return
	if (desc ? data.enchants[id] : data.usedEnchants.includes(id)) l = E(data.enchants[id])
	return bEn.effects[id](l)
}

function updateBosonExtractorTab(){
	let data = player.ghostify.bl
	let speed = getBosonicFinalSpeed()
	let time = getExtractTime().div(speed)
	if (data.extracting) el("extract").textContent = "Extracting" + (time.lt(0.1)?"":" ("+data.extractProgress.times(100).toFixed(1)+"%)")
	else el("extract").textContent="Extract"
	if (time.lt(0.1)) el("extractTime").textContent="This would automatically take "+shorten(Decimal.div(1,time))+" runes per second."
	else if (data.extracting) el("extractTime").textContent=shorten(time.times(Decimal.sub(1, data.extractProgress)))+" seconds left to extract."
	else el("extractTime").textContent="This will take "+shorten(time)+" seconds."
	updateEnchantDescs()
}

function updateEnchantDescs() {
	let data = player.ghostify.bl
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		if (bEn.action == "upgrade" || bEn.action == "max") el("bEn" + id).className = "gluonupgrade "  +(canBuyEnchant(id) ? "bl" : "unavailablebtn")
		else if (bEn.action == "use") el("bEn" + id).className = "gluonupgrade " + (canUseEnchant(id) ? "storebtn" : "unavailablebtn")
		el("bEnLvl" + id).textContent = bEn.action == "max" ?
			"+" + shortenDimensions(getMaxEnchantLevelGain(id)) + " levels" :
			"Level: " + shortenDimensions(tmp.bEn.lvl[id])
		el("bEnOn" + id).textContent = bEn.action == "use" ?
			(data.usedEnchants.includes(id) ? "Disable" : !canUseEnchant(id) ? "Disabled" : "Enable") :
			(data.usedEnchants.includes(id) ? "Enabled" : "Disabled")
		if (tmp.bEn[id] != undefined) {
			let effect = getEnchantEffect(id, true)
			let effectDesc = bEn.effectDescs[id]
			el("bEnEffect" + id).textContent = effectDesc !== undefined ? effectDesc(effect) : shorten(effect) + "x"	
		}
	}
	el("usedEnchants").textContent = "You have used " + data.usedEnchants.length + " / " + bEn.limit + " Bosonic Enchants."
}

function autoMaxEnchant(id, times) {
	if (!canBuyEnchant(id)) return

	let data = player.ghostify.bl
	let costData = bEn.costs[id]
	let g1 = Math.floor(id / 10)
	let g2 = id % 10
	let toAdd = getMaxEnchantLevelGain(id).times(times)
	if (data.enchants[id] == undefined) data.enchants[id] = E(toAdd)
	else data.enchants[id] = data.enchants[id].add(toAdd).round()
	bEn.onBuy(id)
}

function autoMaxAllEnchants(times) {
	for (let g2 = 2; g2 <= br.limit; g2++) for (let g1 = 1; g1 < g2; g1++) autoMaxEnchant(g1 * 10 + g2, times)
}

function isEnchantUsed(x) {
	return tmp.bEn !== undefined && tmp.bEn[x] !== undefined && tmp.bl.usedEnchants.includes(x)
}

var br = {
	names: [null, "Infinity", "Eternity", "Quantum", "Ghostly", "Ethereal", "Sixth", "Seventh", "Eighth", "Ninth"], //Current maximum limit of 9.
	limits: [0, 3, 4, 5],
	scalings: {
		1: 60,
		2: 120,
		3: 600,
		4: 6e7,
		5: 6e20
	}
}

var bEn = {
	costs: {
		12: [3, 1],
		13: [20, 2],
		23: [1e4, 2e3],
		14: [1e6, 2],
		24: [1e6, 10],
		34: [1, 0],
		15: [2e21, 20],
		25: [2e210, 2e190],
		35: [1e12, 1],
		45: [0, "2e1250"],
	},
	descs: {
		12: "You automatically extract Bosonic Runes.",
		13: "Things that consume Anti-Preons are stronger.",
		23: "Bosonic Antimatter boosts oscillate speed.",
		14: "Reduce the Higgs requirement and start with Bosonic Upgrades, even it is disabled.",
		24: "You gain more Bosonic Battery.",
		34: "Higgs Bosons boost Bosonic Watts.",
		15: "You gain more Gravity Energy.",
		25: "Z Bosons give a stronger boost to W Bosons.",
		35: "Above 200, Higgs Bosons multiples the efficiency of Auto-Enchanter Ghost.",
		45: "Multiply the gain of Gravity Energy, but reduce the charging effect.",
	},
	effects: {
		12(l) {
			let exp = 0.75
			if (tmp.ngp3_exp) exp += .025
			if (l.gt(1e10)) exp *= Math.sqrt(Decimal.log10(l) / 10)

			return Decimal.pow(l, exp).div(bEn.autoScalings[player.ghostify.bl.typeToExtract])
		},
		13(l) {
			return Decimal.add(l, 1).sqrt()
		},
		14(l) {
			let eff = Decimal.add(l, 9).log10()
			if (eff > 15) eff = Math.sqrt(eff * 15)
			if (eff > 20) eff = 20
			return {
				bUpgs: Math.floor(eff),
				higgs: Decimal.add(l, 1).pow(0.4)
			}
		},
		23(l) {
			if (Decimal.eq(0, l)) return E(1)
			let exp = Math.max(l.max(1).log10() + 1, 0) / 3
			if (player.ghostify.bl.am.gt(1e11)) exp *= player.ghostify.bl.am.div(10).log10() / 10
			if (exp > 5) exp = Math.sqrt(exp * 5)
			return Decimal.pow(player.ghostify.bl.am.add(10).log10(), exp)
		},
		24(l) {
			return Decimal.pow(Decimal.add(l, 100).log10(), 4).div(16)
		},
		34(l) {
			return 1
		},
		15(l) {
			let x = Math.pow(Math.log10(l.add(1).log10() + 1) / 5 + 1, 2)
			return x
		},
		25(l) {
			return 0.65 - 0.15 / Math.sqrt(l.add(1).log10() / 50 + 1)
		},
		35(l) {
			return E(1)
		},
		45(l) {
			return 2.5 - 1.5 / (Math.log10(l.add(1).log10() / 300 + 1) / 2 + 1)
		}
	},
	effectDescs: {
		12(x) {
			x = x.times(getBosonicFinalSpeed())
			if (x.lt(1) && x.gt(0)) return x.m.toFixed(2) + "/" + shortenCosts(pow10(-x.e)) + " seconds"
			return shorten(x) + "/second"
		},
		14(x) {
			return "/" + shorten(x.higgs) + " to Higgs requirement, " + getFullExpansion(x.bUpgs) + " starting upgrades"
		},
		25(x) {
			return "x^0.500 -> x^" + x.toFixed(3)
		},
		35(x) {
			return shorten(x) + "x"
		}
	},
	action: "upgrade",
	actions: ["upgrade", "max", "use"],
	actionFuncs: {
		upgrade(id) {
			if (!canBuyEnchant(id)) return

			let data = player.ghostify.bl
			let costData = bEn.costs[id]
			let g1 = Math.floor(id / 10)
			let g2 = id % 10
			data.glyphs[g1 - 1] = data.glyphs[g1 - 1].sub(getBosonicFinalCost(costData[0])).round()
			data.glyphs[g2 - 1] = data.glyphs[g2 - 1].sub(getBosonicFinalCost(costData[1])).round()
			if (data.enchants[id] == undefined) data.enchants[id] = E(1)
			else data.enchants[id] = data.enchants[id].add(1).round()
			bEn.onBuy(id)
		},
		max(id) {
			if (!canBuyEnchant(id)) return

			let data = player.ghostify.bl
			let costData = bEn.costs[id]
			let g1 = Math.floor(id / 10)
			let g2 = id % 10
			let lvl = getMaxEnchantLevelGain(id)
			data.glyphs[g1 - 1] = data.glyphs[g1 - 1].sub(lvl.times(getBosonicFinalCost(costData[0])).min(data.glyphs[g1 - 1])).round()
			data.glyphs[g2 - 1] = data.glyphs[g2 - 1].sub(lvl.times(getBosonicFinalCost(costData[1])).min(data.glyphs[g2 - 1])).round()
			if (data.enchants[id] == undefined) data.enchants[id] = E(lvl)
			else data.enchants[id] = data.enchants[id].add(lvl).round()
			bEn.onBuy(id)
		},
		use(id) {
			if (!canUseEnchant(id)) return

			let data = player.ghostify.bl
			if (bEn.limit == 1) data.usedEnchants = [id]
			else {
				if (data.usedEnchants.includes(id)) {
					var newData = []
					for (var u = 0; u < data.usedEnchants.length; u++) if (data.usedEnchants[u] != id) newData.push(data.usedEnchants[u])
					data.usedEnchants = newData
				} else data.usedEnchants.push(id)
			}
			if (id == 14) updateBAMAmount()
		}
	},
	onBuy(id) {
		if (id == 14 && isEnchantUsed(14)) {
			tmp.bEn[14] = getEnchantEffect(14)
			updateBAMAmount()
		}
	},
	limits: [0, 2, 5, 9],
	autoScalings:{
		1: 1.5,
		2: 3,
		3: 12,
		4: 1e6,
		5: 1e17
	}
}

//Bosonic Upgrades
//Gone

//Bosonic Overdrive
function getBosonicBatteryLoss() {
	if (player.ghostify.bl.odSpeed == 1) return E(0)
	return pow10(player.ghostify.bl.odSpeed * 2 - 3)
}

function changeOverdriveSpeed() {
	player.ghostify.bl.odSpeed = el("odSlider").value / 50 * 4 + 1
}

//W & Z Bosons
function getAntipreonProduction() {
	return 1 / 10
}

var aplScalings = {
	0: 0,
	1: 24,
	2: 96,
	3: 48
}

function getAntipreonLoss() {
	return 1 / 30
}

function useAntipreon(id) {
	player.ghostify.wzb.dPUse = id
}

function getOscillateGainSpeed() {
	let r = tmp.wzb.wbo
	if (isEnchantUsed(23)) r = r.times(tmp.bEn[23])
	return Decimal.div(r, player.ghostify.wzb.zNeReq)
}

function updateWZBosonsTab() {
	let data = tmp.bl
	let data2 = tmp.wzb
	let data3 = player.ghostify.wzb
	let speed = getBosonicFinalSpeed()
	let show0 = data3.dPUse == 1 && Decimal.div(getAntipreonLoss(), aplScalings[1]).times(speed).times(tmp.wzb.zbs).gte(10)
	let gainSpeed = getOscillateGainSpeed()
	let r = speed.times(data3.dPUse ? getAntipreonLoss() : getAntipreonProduction())
	el("ap").textContent = shorten(data3.dP)
	el("apProduction").textContent = (data3.dPUse ? "-" : "+") + shorten(r) + "/s"
	el("apUse").textContent = data3.dPUse == 0 ? "" : "You are currently consuming Anti-Preons to " + (["", "decay W Bosons", "oscillate Z Bosons", "convert W- to W+ Bosons"])[data3.dPUse] + "."
	el("wQkType").textContent = data3.wQkUp ? "positive" : "negative"
	el("wQkProgress").textContent = data3.wQkProgress.times(100).toFixed(1) + "% to turn W Boson to a" + (data3.wQkUp ? " negative" : " positive")+" Boson."
	el("wQk").className = show0 ? "zero" : data3.wQkUp ? "up" : "down"
	el("wQkSymbol").textContent = show0 ? "0" : data3.wQkUp ? "+" : "−"
	el("wpb").textContent = shortenDimensions(data3.wpb)
	el("wnb").textContent = shortenDimensions(data3.wnb)
	el("wbTime").textContent = shorten(data2.wbt)
	el("wbOscillate").textContent = shorten(data2.wbo)
	el("wbProduction").textContent = shorten(data2.wbp)
	el("zNeGen").textContent = (["electron", "Mu", "Tau"])[data3.zNeGen - 1]
	el("zNeProgress").textContent = data3.zNeProgress.times(100).toFixed(1) + "% to oscillate Z Boson to " + (["Mu", "Tau", "electron"])[data3.zNeGen-1] + "."
	el("zNeReq").textContent = "Oscillate progress gain speed is currently " + (gainSpeed.gt(1) ? shorten(gainSpeed) : "1 / " + shorten(Decimal.div(1, gainSpeed))) + "x."
	el("zNe").className = (["electron","mu","tau"])[data3.zNeGen - 1]
	el("zNeSymbol").textContent = (["e", "μ", "τ"])[data3.zNeGen - 1]
	el("zb").textContent = shortenDimensions(data3.zb)
	el("zbGain").textContent = "You will gain " + shortenDimensions(data3.zNeReq.pow(0.75)) + " Z Bosons on next oscillation."
	el("zbSpeed").textContent = shorten(data2.zbs)
}