//Quantum worth
var quantumWorth
function updateQuantumWorth(mode) {
	if (!tmp.ngp3) return
	if (player.ghostify.milestones<8) {
		if (mode != "notation") mode=undefined
	} else if (mode == "notation") return
	if (mode != "notation") {
		if (mode != "display") {
			quantumWorth = tmp.qu.quarks.add(tmp.qu.usedQuarks.r).add(tmp.qu.usedQuarks.g).add(tmp.qu.usedQuarks.b).add(tmp.qu.gluons.rg).add(tmp.qu.gluons.gb).add(tmp.qu.gluons.br).round()
		}
		if (player.ghostify.times) {
			var automaticCharge = Math.max(Math.log10(quantumWorth.add(1).log10() / 150) / Math.log10(2), 0) + Math.max(tmp.qu.bigRip.spaceShards.add(1).log10() / 20 - 0.5, 0)
			player.ghostify.automatorGhosts.power = Math.max(automaticCharge, player.ghostify.automatorGhosts.power)
			if (mode != "quick") {
				getEl("automaticCharge").textContent = automaticCharge.toFixed(2)
				getEl("automaticPower").textContent = player.ghostify.automatorGhosts.power.toFixed(2)
			}
			while (player.ghostify.automatorGhosts.ghosts<MAX_AUTO_GHOSTS&&player.ghostify.automatorGhosts.power>=autoGhostRequirements[player.ghostify.automatorGhosts.ghosts-3]) {
				player.ghostify.automatorGhosts.ghosts++
				getEl("autoGhost"+player.ghostify.automatorGhosts.ghosts).style.visibility="visible"
				if (player.ghostify.automatorGhosts.ghosts == 22) getEl("autoCS").style.display = ""
				if (player.ghostify.automatorGhosts.ghosts == MAX_AUTO_GHOSTS) getEl("nextAutomatorGhost").parentElement.style.display="none"
				else {
					getEl("automatorGhostsAmount").textContent=player.ghostify.automatorGhosts.ghosts
					getEl("nextAutomatorGhost").parentElement.style.display=""
					getEl("nextAutomatorGhost").textContent=autoGhostRequirements[player.ghostify.automatorGhosts.ghosts-3].toFixed(1)
				}
			}
		}
	}
	if (mode != "quick") for (var e = 1; e <= 2; e++) getEl("quantumWorth" + e).textContent = shortenDimensions(quantumWorth)
}

//Quark Assertment Machine
function getAssortPercentage() {
	return tmp.qu.assortPercentage ? tmp.qu.assortPercentage : 100
}

function getAssortAmount() {
	return tmp.qu.quarks.floor().min(tmp.qu.quarks).times(getAssortPercentage() / 100).round()
}

var assortDefaultPercentages = [10, 25, 50, 100]
function updateAssortPercentage() {
	let percentage = getAssortPercentage()
	getEl("assort_percentage").value = percentage
	for (var i = 0; i < assortDefaultPercentages.length; i++) {
		var percentage2 = assortDefaultPercentages[i]
		getEl("assort_percentage_" + percentage2).className = percentage2 == percentage ? "chosenbtn" : "storebtn"
	}
}

function changeAssortPercentage(x) {
	tmp.qu.assortPercentage = Math.max(Math.min(parseFloat(x || getEl("assort_percentage").value), 100), 0)
	updateAssortPercentage()
	updateQuarksTabOnUpdate()
}

function assignQuark(color) {
	var usedQuarks = getAssortAmount()
	if (usedQuarks.eq(0)) {
		$.notify("Make sure you are assigning at least one quark!")
		return
	}
	var mult = getQuarkAssignMult()
	tmp.qu.usedQuarks[color] = tmp.qu.usedQuarks[color].add(usedQuarks.times(mult)).round()
	tmp.qu.quarks = tmp.qu.quarks.sub(usedQuarks)
	getEl("quarks").innerHTML = "You have <b class='QKAmount'>0</b> quarks."
	if (!mult.eq(1)) updateQuantumWorth()
	updateColorCharge()
	if (player.ghostify.another > 0) player.ghostify.another--
}

function assignAll(auto) {
	var ratios = tmp.qu.assignAllRatios
	var sum = ratios.r+ratios.g+ratios.b
	var oldQuarks = getAssortAmount()
	var colors = ['r','g','b']
	var mult = getQuarkAssignMult()
	if (oldQuarks.lt(100)) {
		if (!auto) $.notify("You can only use this feature if you will assign at least 100 quarks.")
		return
	}
	for (c = 0; c < 3; c++) {
		var toAssign = oldQuarks.times(ratios[colors[c]]/sum).round()
		if (toAssign.gt(0)) {
			tmp.qu.usedQuarks[colors[c]] = tmp.qu.usedQuarks[colors[c]].add(toAssign.times(mult)).round()
			if (player.ghostify.another > 0) player.ghostify.another--
		}
	}
	tmp.qu.quarks = tmp.qu.quarks.sub(oldQuarks).round()
	if (tmp.qu.autoOptions.assignQKRotate) {
		if (tmp.qu.autoOptions.assignQKRotate > 1) {
			tmp.qu.assignAllRatios = {
				r: tmp.qu.assignAllRatios.g,
				g: tmp.qu.assignAllRatios.b,
				b: tmp.qu.assignAllRatios.r
			}
		} else tmp.qu.assignAllRatios = {
			r: tmp.qu.assignAllRatios.b,
			g: tmp.qu.assignAllRatios.r,
			b: tmp.qu.assignAllRatios.g
		}
		var colors = ['r','g','b']
		for (c = 0; c < 3; c++) getEl("ratio_" + colors[c]).value = tmp.qu.assignAllRatios[colors[c]]
	}
	if (mult.gt(1)) updateQuantumWorth()
	updateColorCharge()
}

function getQuarkAssignMult() {
	let r = new Decimal(1)
	if (hasBosonicUpg(23)) r = r.times(tmp.blu[23])
	return r
}

function changeRatio(color) {
	var value = parseFloat(getEl("ratio_" + color).value)
	if (value < 0 || isNaN(value)) {
		getEl("ratio_" + color).value = tmp.qu.assignAllRatios[color]
		return
	}
	var sum = 0
	var colors = ['r','g','b']
	for (c = 0; c < 3; c++) sum += colors[c] == color ? value : tmp.qu.assignAllRatios[colors[c]]
	if (sum == 0 || sum == 1/0) {
		getEl("ratio_" + color).value = tmp.qu.assignAllRatios[color]
		return
	}
	tmp.qu.assignAllRatios[color] = value
}

function toggleAutoAssign() {
	tmp.qu.autoOptions.assignQK = !tmp.qu.autoOptions.assignQK
	getEl('autoAssign').textContent="Auto: O"+(tmp.qu.autoOptions.assignQK?"N":"FF")
	if (tmp.qu.autoOptions.assignQK && tmp.qu.quarks.gt(0)) assignAll(true)
}

function rotateAutoAssign() {
	tmp.qu.autoOptions.assignQKRotate=tmp.qu.autoOptions.assignQKRotate?(tmp.qu.autoOptions.assignQKRotate+1)%3:1
	getEl('autoAssignRotate').textContent="Rotation: "+(tmp.qu.autoOptions.assignQKRotate>1?"Left":tmp.qu.autoOptions.assignQKRotate?"Right":"None")
}

//Color Charge
colorCharge = {
	normal: {}
}
colorShorthands = {
	r: 'red',
	g: 'green',
	b: 'blue'
}

function updateColorCharge() {
	if (!tmp.ngp3) return
	var colors = ['r', 'g', 'b']
	var colorPowers = {}
	for (var i = 0; i < 3; i++) {
		var ret = Decimal.add(tmp.qu.usedQuarks[colors[i]], 1). log10()
		colorCharge[colors[i]] = player.ghostify.milestones >= 2 ? ret : 0
		colorPowers[colors[i]] = ret
	}

	var sorted = []
	for (var s = 0; s < 3; s++) {
		var search = ''
		for (var i = 0; i < 3; i++) if (!sorted.includes(colors[i])&&(search==''||tmp.qu.usedQuarks[colors[i]].gte(tmp.qu.usedQuarks[search]))) search=colors[i]
		sorted.push(search)
	}

	colorCharge.normal = {
		color: sorted[0],
		charge: colorPowers[sorted[0]] * Decimal.div(
			Decimal.sub(tmp.qu.usedQuarks[sorted[0]], tmp.qu.usedQuarks[sorted[1]]),
			Decimal.add(tmp.qu.usedQuarks[sorted[0]], 1)
		)
	}
	if (player.ghostify.milestones <= 2) colorCharge[sorted[0]] = colorCharge.normal.charge
	if (tmp.qu.usedQuarks[sorted[0]] > 0 && colorCharge.normal.charge == 0) giveAchievement("Hadronization")

	updateQuarksTabOnUpdate()
}

function getColorPowerQuantity(color) {
	let ret = colorCharge[color]
	if (tmp.qkEng) ret = ret * tmp.qkEng.eff1 + tmp.qkEng.eff2
	if (tmp.glB) ret = ret * tmp.glB[color].mult - tmp.glB[color].sub
	return Math.max(ret, 0)
}

colorBoosts = {
	r: 1,
	g: 1,
	b: 1
}

function updateColorPowers() {
	//Red
	colorBoosts.r = Math.log10(tmp.qu.colorPowers.r * 2 + 1) / 3 + 1

	//Green
	colorBoosts.g = Math.log10(tmp.qu.colorPowers.g * 3 + 1) + 1

	//Blue
	colorBoosts.b = Math.pow(Math.max(tmp.qu.colorPowers.b * 2.5, 1), 2)
}

//Gluons
function gainQuarkEnergy() {
	let x = Math.cbrt(quantumWorth.add(1).log10()) * getQuarkEnergyMult() * 1.25
	tmp.qu.quarkEnergy = isNaN(x) ? 0 : x
}

function getQuarkEnergyMult() {
	let x = 1
	if (ENTANGLED_BOOSTS.active(1)) x += tmp.glB.enB1
	return x
}

function updateQuarkEnergyEffects() {
	tmp.qkEng = {}

	tmp.qkEng.eff1 = Math.log10(tmp.qu.quarkEnergy / 1.7 + 1) + 1
	tmp.qkEng.eff2 = tmp.qu.quarkEnergy * tmp.qkEng.eff1 / 1.7
}

GUCosts = [null, 1, 2, 4, 100, 7e15, 4e19, 3e28, "1e570"]

function buyGluonUpg(color, id) {
	var name = color + id
	if (tmp.qu.upgrades.includes(name) || tmp.qu.gluons[color].plus(0.001).lt(GUCosts[id])) return
	tmp.qu.upgrades.push(name)
	tmp.qu.gluons[color] = tmp.qu.gluons[color].sub(GUCosts[id])
	updateGluonsTab("spend")
	if (name == "gb3") bumpInfMult()
	if (name == "rg4" && !tmp.qu.autoOptions.sacrifice) updateElectronsEffect()
	if (name == "gb4") player.tickSpeedMultDecrease = 1.25
	updateQuantumWorth()
	updateGluonsTabOnUpdate()
}

function GUBought(id) {
	return player.quantum && player.quantum.upgrades.includes(id)
}

function GUActive(id) {
	return false
}

function buyQuarkMult(name) {
	var cost = Decimal.pow(100, tmp.qu.multPower[name] + Math.max(tmp.qu.multPower[name] - 467, 0)).times(500)
	if (tmp.qu.gluons[name].lt(cost)) return
	tmp.qu.gluons[name] = tmp.qu.gluons[name].sub(cost).round()
	tmp.qu.multPower[name]++
	tmp.qu.multPower.total++
	updateGluonsTab("spend")
	if (tmp.qu.autobuyer.mode === 'amount') {
		tmp.qu.autobuyer.limit = Decimal.times(tmp.qu.autobuyer.limit, 2)
		getEl("priorityquantum").value = formatValue("Scientific", tmp.qu.autobuyer.limit, 2, 0);
	}
}

function maxQuarkMult() {
	var names = ["rg", "gb", "br"]
	var bought = 0
	for (let c = 0; c < 3; c++) {
		var name = names[c]
		var buying = true
		while (buying) {
			var cost = Decimal.pow(100, tmp.qu.multPower[name] + Math.max(tmp.qu.multPower[name] - 467, 0)).times(500)
			if (tmp.qu.gluons[name].lt(cost)) buying = false
			else if (tmp.qu.multPower[name] < 468) {
				var toBuy = Math.min(Math.floor(tmp.qu.gluons[name].div(cost).times(99).add(1).log(100)),468-tmp.qu.multPower[name])
				var toSpend = Decimal.pow(100, toBuy).sub(1).div(99).times(cost)
				if (toSpend.gt(tmp.qu.gluons[name])) tmp.qu.gluons[name]=new Decimal(0)
				else tmp.qu.gluons[name] = tmp.qu.gluons[name].sub(toSpend).round()
				tmp.qu.multPower[name] += toBuy
				bought += toBuy
			} else {
				var toBuy=Math.floor(tmp.qu.gluons[name].div(cost).times(9999).add(1).log(1e4))
				var toSpend=Decimal.pow(1e4, toBuy).sub(1).div(9999).times(cost)
				if (toSpend.gt(tmp.qu.gluons[name])) tmp.qu.gluons[name]=new Decimal(0)
				else tmp.qu.gluons[name] = tmp.qu.gluons[name].sub(toSpend).round()
				tmp.qu.multPower[name] += toBuy
				bought += toBuy
			}
		}
	}
	tmp.qu.multPower.total += bought
	if (tmp.qu.autobuyer.mode === 'amount') {
		tmp.qu.autobuyer.limit = Decimal.times(tmp.qu.autobuyer.limit, Decimal.pow(2, bought))
		getEl("priorityquantum").value = formatValue("Scientific", tmp.qu.autobuyer.limit, 2, 0)
	}
	updateGluonsTabOnUpdate("spend")
}

function updateGluonicBoosts() {
	tmp.glB = {}
	let data = tmp.glB
	let gluons = tmp.qu.gluons

	data.r = { mult: Math.log10(gluons.rg.add(1).log10() + 1) + 1, sub: gluons.br.add(1).log10() } //x -> x * [RG effect] - [BR effect]
	data.g = { mult: Math.log10(gluons.gb.add(1).log10() + 1) + 1, sub: gluons.rg.add(1).log10() } //x -> x * [GB effect] - [RG effect]
	data.b = { mult: Math.log10(gluons.br.add(1).log10() + 1) + 1, sub: gluons.gb.add(1).log10() } //x -> x * [BR effect] - [GB effect]

	let type = tmp.qu.entColor || "rg"
	let enAmt = ENTANGLED_BOOSTS.gluonEff(gluons[type])
	let masAmt = Math.max(Math.max(
		ENTANGLED_BOOSTS.gluonEff(gluons.rg),
		ENTANGLED_BOOSTS.gluonEff(gluons.gb)),
		ENTANGLED_BOOSTS.gluonEff(gluons.br)
	)

	for (var i = 1; i <= ENTANGLED_BOOSTS.max; i++) data["enB" + i] = ENTANGLED_BOOSTS[i].eff((ENTANGLED_BOOSTS.mastered(i) ? masAmt : enAmt) * tmp.qu.entBoosts)
}

let ENTANGLED_BOOSTS = {
	max: 9,
	cost(x) {
		if (x === undefined) x = tmp.qu.entBoosts || 0
		return Math.pow(x + 1, 2)
	},
	buy() {
		if (!(tmp.qu.quarkEnergy >= this.cost())) return
		tmp.qu.entBoosts = (tmp.qu.entBoosts || 0) + 1
		updateGluonsTabOnUpdate()
	},
	has(x) {
		return ph.did("quantum") && tmp.qu.entBoosts >= this[x].req
	},
	mastered(x) {
		return ph.did("quantum") && tmp.qu.entBoosts >= this[x].masReq
	},
	active(x) {
		if (!this.has(x)) return false
		if (this.mastered(x)) return true

		let gluon = tmp.qu.entColor || "rg"
		return this[x].type == gluon[0] || this[x].type == gluon[1]
	},
	gluonEff(x) {
		return Math.sqrt(Decimal.add(x, 1).log10() * tmp.qu.quarkEnergy)
	},
	choose(x) {
		if (!confirm("This will perform a quantum reset without gaining anything. Are you sure?")) return
		tmp.qu.entColor = x
		quantum(false, true)
	},
	1: {
		req: 1,
		masReq: 5,
		type: "r",
		eff(x) {
			return Math.cbrt(x)
		}
	},
	2: {
		req: 2,
		masReq: 7,
		type: "g",
		eff(x) {
			return Math.log10(x + 1)
		}
	},
	3: {
		req: 4,
		masReq: 10,
		type: "b",
		eff(x) {
			return Math.log10(x + 1) + 1
		}
	},
	4: {
		req: 6,
		masReq: 1/0,
		type: "b",
		eff(x) {
			return 1
		}
	},
	5: {
		req: 9,
		masReq: 1/0,
		type: "r",
		eff(x) {
			return 1
		}
	},
	6: {
		req: 12,
		masReq: 1/0,
		type: "g",
		eff(x) {
			return 1
		}
	},
	7: {
		req: 15,
		masReq: 1/0,
		type: "r",
		eff(x) {
			return 1
		}
	},
	8: {
		req: 18,
		masReq: 1/0,
		type: "b",
		eff(x) {
			return 1
		}
	},
	9: {
		req: 21,
		masReq: 1/0,
		type: "g",
		eff(x) {
			return 1
		}
	}
}

function getGB1Effect() {
	return Decimal.div(1, tmp.tsReduce).log10() / 100 + 1
}

function getBR1Effect() {
	return Math.sqrt(player.dilation.dilatedTime.add(10).log10()) / 2
}

function getRG3Effect() {
	let exp = Math.sqrt(player.meta.resets)
	if (exp > 36) exp = 6 * Math.sqrt(exp)
	if (!hasAch("ng3p24")) exp = 1
	return Decimal.pow(player.resets, exp)
}

function getBR4Effect() {
	if (!tmp.eterUnl) return 1
	return Decimal.pow(getDimensionPowerMultiplier(), 0.0003).max(1)
}

function getBR5Effect() {
	if (!tmp.eterUnl) return 1
	return 1 + Math.min(Math.sqrt(player.dilation.tachyonParticles.max(1).log10()) * 0.013, 0.14)
}

function getBR6Effect() {
	if (!tmp.eterUnl) return 1
	return 1 + player.meta.resets / 340
}

function getGU8Effect(type) {
	return Math.pow(tmp.qu.gluons[type].div("1e565").add(1).log10() * 0.505 + 1, 1.5)
}

//Display
function updateQuarksTab(tab) {
	getEl("redPower").textContent = shorten(tmp.qu.colorPowers.r)
	getEl("greenPower").textContent = shorten(tmp.qu.colorPowers.g)
	getEl("bluePower").textContent = shorten(tmp.qu.colorPowers.b)

	getEl("redTranslation").textContent = formatPercentage(colorBoosts.r - 1)
	getEl("greenTranslation").textContent = shorten(colorBoosts.g) + (tmp.pe ? "+" + shorten(tmp.pe) :"")
	getEl("blueTranslation").textContent = shorten(colorBoosts.b)

	getEl("quarkEnergy").textContent = shorten(tmp.qu.quarkEnergy)
	getEl("quarkEnergyEffect1").textContent = formatPercentage(tmp.qkEng.eff1 - 1)
	getEl("quarkEnergyEffect2").textContent = shorten(tmp.qkEng.eff2)
	getEl("quarkEnergyMult").textContent = shorten(getQuarkEnergyMult())

	if (player.ghostify.milestones >= 8) {
		var assortAmount = getAssortAmount()
		var colors = ['r','g','b']
		getEl("assort_amount").textContent = shortenDimensions(assortAmount.times(getQuarkAssignMult()))
		getEl("assignAllButton").className = (assortAmount.lt(1) ? "unavailabl" : "stor") + "ebtn"
		updateQuantumWorth("display")
	}
}

function updateGluonsTab() {
	let colors = ['r','g','b']

	if (player.ghostify.milestones >= 8) updateGluonsTabOnUpdate("display")
	getEl("quarkEnergy2").textContent = shorten(tmp.qu.quarkEnergy)

	for (var c = 0; c < 3; c++) {
		var color = colors[c]
		getEl(color + "PowerBuff").textContent = shorten(tmp.glB[color].mult)
		getEl(color + "PowerNerf").textContent = shorten(tmp.glB[color].sub)
		getEl(color + colors[(c + 1) % 3]).textContent = shortenDimensions(tmp.qu.gluons[color + colors[(c + 1) % 3]])
	}

	getEl("entangledBoost").className = "gluonupgrade " + (tmp.qu.quarkEnergy >= ENTANGLED_BOOSTS.cost() ? "storebtn" : "unavailablebtn")

	getEl("enB1Eff").textContent = shorten(tmp.glB.enB1)
	getEl("enB2Eff").textContent = shorten(tmp.glB.enB2)
	getEl("enB3Eff").textContent = (100 - 100 / tmp.glB.enB3).toFixed(2)

	getEl("enB4Eff").textContent = shorten(tmp.glB.enB4)
	getEl("enB5Eff").textContent = shorten(tmp.glB.enB5)
	getEl("enB6Eff").textContent = shorten(tmp.glB.enB6)

	getEl("enB7Eff").textContent = shorten(tmp.glB.enB7)
	getEl("enB8Eff").textContent = shorten(tmp.glB.enB8)
	getEl("enB9Eff").textContent = shorten(tmp.glB.enB9)
}

//Display: On load
function updateQuarksTabOnUpdate(mode) {
	var colors = ['r','g','b']
	if (colorCharge.normal.charge == 0) getEl("colorCharge").innerHTML='neutral charge'
	else {
		var color = colorShorthands[colorCharge.normal.color]
		getEl("colorCharge").innerHTML='<span class="'+color+'">'+color+'</span> charge of <span class="'+color+'" style="font-size:35px">' + shorten(colorCharge.normal.charge * tmp.qkEng.eff1) + "</span>"
	}

	getEl("redQuarks").textContent = shortenDimensions(tmp.qu.usedQuarks.r)
	getEl("greenQuarks").textContent = shortenDimensions(tmp.qu.usedQuarks.g)
	getEl("blueQuarks").textContent = shortenDimensions(tmp.qu.usedQuarks.b)

	var assortAmount = getAssortAmount()
	var canAssign = assortAmount.gt(0)
	getEl("quarkAssort").style.display = ""
	getEl("quarkAssign").style.display = "none"

	getEl("assort_amount").textContent = shortenDimensions(assortAmount.times(getQuarkAssignMult()))
	getEl("redAssort").className = canAssign ? "storebtn" : "unavailablebtn"
	getEl("greenAssort").className = canAssign ? "storebtn" : "unavailablebtn"
	getEl("blueAssort").className = canAssign ? "storebtn" : "unavailablebtn"

	var uq = tmp.qu.usedQuarks
	var gl = tmp.qu.gluons
	for (var p = 0; p < 3; p++) {
		var pair = (["rg", "gb", "br"])[p]
		var diff = uq[pair[0]].min(uq[pair[1]])
		getEl(pair + "gain").textContent = shortenDimensions(diff)
		getEl(pair + "prev").textContent = shortenDimensions(uq[pair[0]])
		getEl(pair + "next").textContent = shortenDimensions(uq[pair[0]].sub(diff).round())
	}
	getEl("assignAllButton").className = canAssign ? "storebtn" : "unavailablebtn"
	if (masteryStudies.has("d13")) {
		getEl("redQuarksToD").textContent = shortenDimensions(tmp.qu.usedQuarks.r)
		getEl("greenQuarksToD").textContent = shortenDimensions(tmp.qu.usedQuarks.g)
		getEl("blueQuarksToD").textContent = shortenDimensions(tmp.qu.usedQuarks.b)	
	}
}

function updateGluonsTabOnUpdate(mode) {
	if (!player.masterystudies) return
	else if (!tmp.qu.gluons.rg) {
		tmp.qu.gluons = {
			rg: new Decimal(0),
			gb: new Decimal(0),
			br: new Decimal(0)
		}
	}

	getEl("entangledBoosts").textContent = getFullExpansion(tmp.qu.entBoosts || 0)
	getEl("entangledBoostCost").textContent = shorten(ENTANGLED_BOOSTS.cost())

	getEl("entangledBoostNext").textContent = ""

	var has = true
	var mastered = true
	var data = ENTANGLED_BOOSTS
	for (var e = 1; e <= data.max; e++) {
		if (has && !data.has(e)) {
			has = false
			getEl("entangledBoostNext").textContent = "Next Entangled Boost unlocks at Entangled Booster #" + data[e].req + "."
		}
		if (mastered && !data.mastered(e)) mastered = false

		var el = getEl("enB" + e + "Name")
		el.parentElement.style.display = has ? "" : "none"

		if (has) {
			el.parentElement.className = mastered ? "yellow" : data.active(e) ? "green" : ""
			el.textContent = (mastered ? " Mastered" : "") + " Entangled Boost #" + e

			getEl("enB" + e + "Type").innerHTML = (mastered ? "(formerly " : "(") + data[e].type.toUpperCase() + "-type boost" + (mastered ? ")" : ")<br>Reach " + getFullExpansion(data[e].masReq) + " Entangled Boosts to master this")
		}
	}
}

//Quarks animation
var quarks={}
var centerX
var centerY
var maxDistance
var code

function drawQuarkAnimation(ts){
	centerX = canvas.width/2
	centerY = canvas.height/2
	maxDistance=Math.sqrt(Math.pow(centerX,2)+Math.pow(centerY,2))
	code=player.options.theme=="Aarex's Modifications"?"e5":"99"
	if (getEl("quantumtab").style.display !== "none" && getEl("uquarks").style.display !== "none" && player.options.animations.quarks) {
		qkctx.clearRect(0, 0, canvas.width, canvas.height);
		quarks.sum = tmp.qu.colorPowers.r + tmp.qu.colorPowers.g + tmp.qu.colorPowers.b
		quarks.amount=Math.ceil(Math.min(quarks.sum, 200))
		for (p=0;p<quarks.amount;p++) {
			var particle=quarks['p'+p]
			if (particle==undefined) {
				particle={}
				var random=Math.random()
				if (random<=tmp.qu.colorPowers.r/quarks.sum) particle.type='r'
				else if (random>=1-tmp.qu.colorPowers.b/quarks.sum) particle.type='b'
				else particle.type='g'
				particle.motion=Math.random()>0.5?'in':'out'
				particle.direction=Math.random()*Math.PI*2
				particle.distance=Math.random()
				quarks['p'+p]=particle
			} else {
				particle.distance+=0.01
				if (particle.distance>=1) {
					var random=Math.random()
					if (random<=tmp.qu.colorPowers.r/quarks.sum) particle.type='r'
					else if (random>=1-tmp.qu.colorPowers.b/quarks.sum) particle.type='b'
					else particle.type='g'
					particle.motion=Math.random()>0.5?'in':'out'
					particle.direction=Math.random()*Math.PI*2
					particle.distance=0
				}
				var actualDistance=particle.distance*maxDistance
				if (particle.motion=="in") actualDistance=maxDistance-actualDistance
				qkctx.fillStyle=particle.type=="r"?"#"+code+"0000":particle.type=="g"?"#00"+code+"00":"#0000"+code
				point(centerX+Math.sin(particle.direction)*actualDistance, centerY+Math.cos(particle.direction)*actualDistance, qkctx)
			}
		}
		delta = (ts - lastTs) / 1000;
		lastTs = ts;
		requestAnimationFrame(drawQuarkAnimation);
	}
}
