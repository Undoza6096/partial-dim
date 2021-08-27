//Quantum worth
var quantumWorth
function updateQuantumWorth(mode) {
	if (!tmp.ngp3) return
	if (player.ghostify.milestones<8) {
		if (mode != "notation") mode=undefined
	} else if (mode == "notation") return
	if (mode != "notation") {
		if (mode != "display") {
			quantumWorth = qu_save.quarks.add(qu_save.usedQuarks.r).add(qu_save.usedQuarks.g).add(qu_save.usedQuarks.b).add(qu_save.gluons.rg).add(qu_save.gluons.gb).add(qu_save.gluons.br).round()
		}
		if (player.ghostify.times) {
			var automaticCharge = Math.max(Math.log10(quantumWorth.add(1).log10() / 150) / Math.log10(2), 0) + Math.max(qu_save.bigRip.spaceShards.add(1).log10() / 20 - 0.5, 0)
			player.ghostify.automatorGhosts.power = Math.max(automaticCharge, player.ghostify.automatorGhosts.power)
			if (mode != "quick") {
				getEl("automaticCharge").textContent = automaticCharge.toFixed(2)
				getEl("automaticPower").textContent = player.ghostify.automatorGhosts.power.toFixed(2)
			}
			while (player.ghostify.automatorGhosts.ghosts<MAX_AUTO_GHOSTS&&player.ghostify.automatorGhosts.power>=autoGhostRequirements[player.ghostify.automatorGhosts.ghosts-3]) {
				player.ghostify.automatorGhosts.ghosts++
				getEl("autoGhost"+player.ghostify.automatorGhosts.ghosts).style.visibility="visible"
				if (player.ghostify.automatorGhosts.ghosts == MAX_AUTO_GHOSTS) getEl("nextAutomatorGhost").parentElement.style.display="none"
				else {
					getEl("automatorGhostsAmount").textContent = player.ghostify.automatorGhosts.ghosts
					getEl("nextAutomatorGhost").parentElement.style.display = ""
					getEl("nextAutomatorGhost").textContent = autoGhostRequirements[player.ghostify.automatorGhosts.ghosts-3].toFixed(1)
				}
			}
		}
	}
	if (mode != "quick") for (var e = 1; e <= 2; e++) getEl("quantumWorth" + e).textContent = shortenDimensions(quantumWorth)
}

//Quark Assertment Machine
function getAssortPercentage() {
	return qu_save.assortPercentage ? qu_save.assortPercentage : 100
}

function getAssortAmount() {
	return qu_save.quarks.floor().min(qu_save.quarks).times(getAssortPercentage() / 100).round()
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
	qu_save.assortPercentage = Math.max(Math.min(parseFloat(x || getEl("assort_percentage").value), 100), 0)
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
	qu_save.usedQuarks[color] = qu_save.usedQuarks[color].add(usedQuarks.times(mult)).round()
	qu_save.quarks = qu_save.quarks.sub(usedQuarks)
	getEl("quarks").innerHTML = "You have <b class='QKAmount'>0</b> quarks."
	if (!mult.eq(1)) updateQuantumWorth()
	updateColorCharge(true)
	if (player.ghostify.another > 0) player.ghostify.another--
}

function assignAll(auto) {
	var ratios = qu_save.assignAllRatios
	var sum = ratios.r + ratios.g + ratios.b
	var oldQuarks = getAssortAmount()
	var colors = ['r','g','b']
	var mult = getQuarkAssignMult()
	if (oldQuarks.eq(0)) return
	for (c = 0; c < 3; c++) {
		var toAssign = oldQuarks.times(ratios[colors[c]]/sum).round()
		if (toAssign.gt(0)) {
			qu_save.usedQuarks[colors[c]] = qu_save.usedQuarks[colors[c]].add(toAssign.times(mult)).round()
			if (player.ghostify.another > 0) player.ghostify.another--
		}
	}
	qu_save.quarks = qu_save.quarks.sub(oldQuarks).round()
	if (qu_save.autoOptions.assignQKRotate) {
		if (qu_save.autoOptions.assignQKRotate > 1) {
			qu_save.assignAllRatios = {
				r: qu_save.assignAllRatios.g,
				g: qu_save.assignAllRatios.b,
				b: qu_save.assignAllRatios.r
			}
		} else qu_save.assignAllRatios = {
			r: qu_save.assignAllRatios.b,
			g: qu_save.assignAllRatios.r,
			b: qu_save.assignAllRatios.g
		}
		var colors = ['r','g','b']
		for (c = 0; c < 3; c++) getEl("ratio_" + colors[c]).value = qu_save.assignAllRatios[colors[c]]
	}
	if (mult.gt(1)) updateQuantumWorth()
	updateColorCharge(true)
}

function getQuarkAssignMult() {
	let r = new Decimal(1)
	if (hasBosonicUpg(23)) r = r.times(tmp.blu[23])
	return r
}

function changeRatio(color) {
	var value = parseFloat(getEl("ratio_" + color).value)
	if (value < 0 || isNaN(value)) {
		getEl("ratio_" + color).value = qu_save.assignAllRatios[color]
		return
	}
	var sum = 0
	var colors = ['r','g','b']
	for (c = 0; c < 3; c++) sum += colors[c] == color ? value : qu_save.assignAllRatios[colors[c]]
	if (sum == 0 || sum == 1/0) {
		getEl("ratio_" + color).value = qu_save.assignAllRatios[color]
		return
	}
	qu_save.assignAllRatios[color] = value
}

function toggleAutoAssign() {
	qu_save.autoOptions.assignQK = !qu_save.autoOptions.assignQK
	getEl('autoAssign').textContent="Auto: O"+(qu_save.autoOptions.assignQK?"N":"FF")
	if (qu_save.autoOptions.assignQK) assignAll(true)
}

function rotateAutoAssign() {
	qu_save.autoOptions.assignQKRotate=qu_save.autoOptions.assignQKRotate?(qu_save.autoOptions.assignQKRotate+1)%3:1
	getEl('autoAssignRotate').textContent="Rotation: "+(qu_save.autoOptions.assignQKRotate>1?"Left":qu_save.autoOptions.assignQKRotate?"Right":"None")
}

function neutralizeQuarks() {
	if (colorCharge.normal.chargeAmt.eq(0) || !qu_save.quarks.gte(colorCharge.neutralize.total)) return

	var sum = 0
	var colors = ['r','g','b']
	for (var c = 0; c < 3; c++) {
		var color = colors[c]
		qu_save.usedQuarks[color] = qu_save.usedQuarks[color].add(colorCharge.neutralize[color]).round()
	}
	qu_save.quarks = qu_save.quarks.sub(colorCharge.neutralize.total)

	updateColorCharge()
	if (player.ghostify.another > 0) player.ghostify.another--
}

function respecQuarks() {
	if (!confirm("Are you sure you want to respec your colored quarks? This will restart your Quantum run!")) return

	var sum = 0
	var colors = ['r','g','b']
	for (var c = 0; c < 3; c++) {
		var color = colors[c]
		sum = qu_save.usedQuarks[color].add(sum)
		qu_save.usedQuarks[color] = new Decimal(0)
	}
	qu_save.quarks = qu_save.quarks.add(sum)
	restartQuantum(true)

	if (qu_save.autoOptions.assignQK) assignAll(true)
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

function updateColorCharge(update) {
	if (!tmp.ngp3) return
	var usedQuarks = qu_save.usedQuarks

	var colors = ['r', 'g', 'b']
	var colorPowers = {}
	for (var i = 0; i < 3; i++) {
		var ret = Decimal.div(usedQuarks[colors[i]], 2).add(1).log10()
		colorPowers[colors[i]] = ret
	}

	var sorted = []
	for (var s = 0; s < 3; s++) {
		var search = ''
		for (var i = 0; i < 3; i++) {
			var color = colors[i]
			if (!sorted.includes(color) && (!search || usedQuarks[color].gt(usedQuarks[search]))) search = color
		}
		sorted.push(search)
	}

	//Color Charge
	var charge = colorPowers[sorted[0]]
	if (quantumWorth.lte(Decimal.pow(10, 1e15))) charge *= Decimal.div(
			Decimal.sub(usedQuarks[sorted[0]], usedQuarks[sorted[1]]),
			Decimal.add(usedQuarks[sorted[0]], 1)
		)
	var chargeMult = 1
	if (QCs.done(2)) chargeMult *= QCs.data[2].rewardEff(charge * chargeMult) //Avoid recursion

	//Color Subcharge
	if (enB.active("glu", 12)) {
		colorCharge.sub = {
			color: sorted[1],
			charge: colorPowers[sorted[1]] * (quantumWorth.lte(Decimal.pow(10, 1e15)) ?
				Decimal.div(
					Decimal.sub(usedQuarks[sorted[1]], usedQuarks[sorted[2]]),
					Decimal.add(usedQuarks[sorted[1]], 1)
				)
			: 1)
		}
		colorCharge.sub.charge *= chargeMult
		colorCharge.sub.eff = Math.log10(Math.log2(colorCharge.sub.charge + 1) / 2 + 1) * 2 + 1
		chargeMult *= colorCharge.sub.eff
	} else delete colorCharge.sub

	colorCharge.normal = {
		color: sorted[0],
		chargeAmt: Decimal.sub(usedQuarks[sorted[0]], usedQuarks[sorted[1]]).round(),
		charge: charge * chargeMult
	}

	//Neutralization
	colorCharge.neutralize = {}
	colorCharge.neutralize[sorted[0]] = new Decimal(0)
	colorCharge.neutralize[sorted[1]] = Decimal.sub(usedQuarks[sorted[0]], usedQuarks[sorted[1]]).round()
	colorCharge.neutralize[sorted[2]] = Decimal.sub(usedQuarks[sorted[0]], usedQuarks[sorted[2]]).round()
	colorCharge.neutralize.total = colorCharge.neutralize[sorted[1]].add(colorCharge.neutralize[sorted[2]]).round()

	//Cancelling
	colorCharge.subCancel = hasAch("ng3p13") ? Math.pow(charge, 0.75) * 4 : 0

	//Death Mode
	if (tmp.dtMode) qu_save.entColor = usedQuarks[sorted[0]].gte(0) && usedQuarks[sorted[1]].gte(0) ? sorted[0] + sorted[1] : ""

	if (update) updateQuarksTabOnUpdate()
}

function getColorPowerQuantity(color, base) {
	if (QCs.in(2)) return 0

	let ret = 0
	if (colorCharge.normal.color == color) {
		let charge = colorCharge.normal.charge
		ret = Math.pow(Math.abs(charge), 2 * qu_save.expEnergy) * tmp.glB[color].mult
		if (charge < 0) ret = -ret
	}
	if (colorCharge.sub && colorCharge.sub.color == color) {
		let charge = colorCharge.sub.charge
		ret = Math.pow(Math.abs(charge), 2 * qu_save.expEnergy) * tmp.glB[color].mult
		if (charge < 0) ret = -ret
	}
	if (tmp.qe) ret = ret * tmp.qe.eff1 + tmp.qe.eff2
	if (tmp.glB) ret -= tmp.glB[color].sub
	ret = Math.max(ret, 0)

	if (!base) {
		if (hasMTS(314)) ret += getColorPowerQuantity(color == "r" ? "g" : color == "g" ? "b" : "r", true) / 5
		if (color == "r" && hasMTS(272)) ret /= 5
	}
	return ret
}

colorBoosts = {
	r: 1,
	g: 1,
	b: 1
}

function updateColorPowers() {
	if (!tmp.quUnl) return

	//Red
	colorBoosts.r = Math.log10(qu_save.colorPowers.r * 5 + 1) / 3.5 + 1
	if (hasMTS(272)) colorBoosts.r += 0.25
	colorBoosts.r = softcap(colorBoosts.r, "rp")

	//Green
	colorBoosts.g = Math.log10(qu_save.colorPowers.g * 3 + 1) + 1
	colorBoosts.g = softcap(colorBoosts.g, "gp")

	//Blue
	colorBoosts.b_base = qu_save.colorPowers.b + 1
	colorBoosts.b_base += Math.log2(colorBoosts.b_base)
	colorBoosts.b_exp = 2
	if (enB.active("glu", 10)) colorBoosts.b_base *= enB_tmp.glu10
	if (enB.active("glu", 11)) colorBoosts.b_exp += enB_tmp.glu11

	colorBoosts.b_base2 = Decimal.pow(colorBoosts.b_base, colorBoosts.b_exp)
	if (hasMTS(313)) colorBoosts.b_exp *= getMTSMult(313, "update")

	colorBoosts.b = Decimal.pow(colorBoosts.b_base, colorBoosts.b_exp)
}

//Gluons
function gainQuantumEnergy() {
	let xNoDiv = (getQEQuarksPortion() + getQEGluonsPortion()) * tmp.qe.mult
	let x = xNoDiv / tmp.qe.div

	if (isNaN(xNoDiv)) xNoDiv = 0
	if (isNaN(x)) x = 0

	qu_save.quarkEnergy = Math.max(qu_save.quarkEnergy || 0, x)
	qu_save.bestEnergy = Math.max(qu_save.bestEnergy || 0, xNoDiv)
}

function getQEQuarksPortion() {
	let exp = qu_save.expEnergy
	return Math.pow(quantumWorth.add(1).log10(), exp) * 1.25
}

function getQEGluonsPortion() {
	var glu = enB.colorUsed()
	if (!glu) return 0
	if (tmp.dtMode) {
		if (colorCharge.normal.charge == 0) return 0
		if (glu[0] != colorCharge.normal.color && glu[1] != colorCharge.normal.color) return 0
	}

	let exp = qu_save.expEnergy
	return Math.pow(qu_save.gluons[glu].add(1).log10(), exp) * (tmp.ngp3_mul ? 1 : 0.25)
}

function getQuantumEnergyMult() {
	if (QCs.in(2)) return 1

	let x = 1
	if (enB.active("glu", 1)) x += enB_tmp.glu1
	if (tmp.ngp3_mul && tmp.glb) x += (tmp.glB.r.mult + tmp.glB.g.mult + tmp.glB.b.mult) / 15
	if (tmp.ngp3_mul) x *= 1.25
	if (dev.boosts.tmp[3]) x *= dev.boosts.tmp[3]
	return x
}

function getQuantumEnergyDiv() {
	let x = 1
	if (pos.on()) x = tmp.ngp3_mul ? 10 / 9 : 4 / 3
	return x
}

function updateQEGainTmp() {
	let data = {}
	tmp.qe = data
	if (!tmp.quActive) return

	//Quark Efficiency
	data.expDen = hasAch("ng3p14") ? 2 : 3
	if (tmp.ngp3_mul) data.expDen *= 0.8
	if (enB.active("pos", 1)) data.expDen = 1

	data.expNum = 1
	if (enB.active("pos", 1)) data.expNum = enB_tmp.pos1
	if (data.expNum > data.expDen - 1) data.expNum = data.expDen - 1 / Math.sqrt(data.expNum - data.expDen + 2)
	if (QCs.in(2)) data.expNum += 0.5

	data.exp = data.expNum / data.expDen
	qu_save.expEnergy = data.exp

	//Multiplier
	data.mult = getQuantumEnergyMult()
	data.div = getQuantumEnergyDiv()

	//Quantum Energy Loss
	data.total = qu_save.quarkEnergy * tmp.qe.div
	data.sac = qu_save.quarkEnergy * (1 - 1 / tmp.qe.div)
}

function updateQuarkEnergyEffects() {
	if (!tmp.quActive) return

	var eng = qu_save.quarkEnergy

	var exp = 4 / 3
	var exp2 = 4 / 3
	if (!QCs.isntCatched()) exp2 *= tmp.exMode ? 0 : tmp.bgMode ? 1 : 0.5

	tmp.qe.eff1 = Math.pow(Math.log10(eng / 2 + 1) + 1, exp)
	tmp.qe.eff2 = Math.pow(eng, exp2) * tmp.qe.eff1 / 4 * exp2 / exp
}

function buyQuarkMult(name) {
	var cost = Decimal.pow(100, qu_save.multPower[name] + Math.max(qu_save.multPower[name] - 467, 0)).times(500)
	if (qu_save.gluons[name].lt(cost)) return
	qu_save.gluons[name] = qu_save.gluons[name].sub(cost).round()
	qu_save.multPower[name]++
	qu_save.multPower.total++
	updateGluonsTab("spend")
	if (qu_save.autobuyer.mode === 'amount') {
		qu_save.autobuyer.limit = Decimal.times(qu_save.autobuyer.limit, 2)
		getEl("priorityquantum").value = formatValue("Scientific", qu_save.autobuyer.limit, 2, 0);
	}
}

function maxQuarkMult() {
	var names = ["rg", "gb", "br"]
	var bought = 0
	for (let c = 0; c < 3; c++) {
		var name = names[c]
		var buying = true
		while (buying) {
			var cost = Decimal.pow(100, qu_save.multPower[name] + Math.max(qu_save.multPower[name] - 467, 0)).times(500)
			if (qu_save.gluons[name].lt(cost)) buying = false
			else if (qu_save.multPower[name] < 468) {
				var toBuy = Math.min(Math.floor(qu_save.gluons[name].div(cost).times(99).add(1).log(100)),468-qu_save.multPower[name])
				var toSpend = Decimal.pow(100, toBuy).sub(1).div(99).times(cost)
				if (toSpend.gt(qu_save.gluons[name])) qu_save.gluons[name]=new Decimal(0)
				else qu_save.gluons[name] = qu_save.gluons[name].sub(toSpend).round()
				qu_save.multPower[name] += toBuy
				bought += toBuy
			} else {
				var toBuy=Math.floor(qu_save.gluons[name].div(cost).times(9999).add(1).log(1e4))
				var toSpend=Decimal.pow(1e4, toBuy).sub(1).div(9999).times(cost)
				if (toSpend.gt(qu_save.gluons[name])) qu_save.gluons[name]=new Decimal(0)
				else qu_save.gluons[name] = qu_save.gluons[name].sub(toSpend).round()
				qu_save.multPower[name] += toBuy
				bought += toBuy
			}
		}
	}
	qu_save.multPower.total += bought
	if (qu_save.autobuyer.mode === 'amount') {
		qu_save.autobuyer.limit = Decimal.times(qu_save.autobuyer.limit, Decimal.pow(2, bought))
		getEl("priorityquantum").value = formatValue("Scientific", qu_save.autobuyer.limit, 2, 0)
	}
	updateGluonsTabOnUpdate("spend")
}

function updateGluonicBoosts() {
	tmp.glB = {}
	if (!tmp.quActive) return

	let data = tmp.glB
	let enBData = enB
	let gluons = qu_save.gluons

	data.r = { mult: getGluonEffBuff(gluons.rg), sub: getGluonEffNerf(gluons.br, "r") } //x -> x * [RG effect] - [BR effect]
	data.g = { mult: getGluonEffBuff(gluons.gb), sub: getGluonEffNerf(gluons.rg, "g") } //x -> x * [GB effect] - [RG effect]
	data.b = { mult: getGluonEffBuff(gluons.br), sub: getGluonEffNerf(gluons.gb, "b") } //x -> x * [BR effect] - [GB effect]

	let type = enB.colorUsed()
	data.enAmt = enBData.glu.gluonEff(gluons[type])
	data.masAmt = enBData.glu.gluonEff(tmp.exMode ? gluons[type].times(3) : gluons.rg.add(gluons.gb).add(gluons.br))

	//Entangled Boosts
	enB.updateTmp()
}

function getGluonEffBuff(x) {
	let r = Math.log10(Decimal.add(x, 1).log10() * 3 + 1)
	if (tmp.ngp3_mul) r *= 1.5
	return r + 1
}

function getGluonEffNerf(x, color) {
	if (!QCs.isntCatched()) return 0

	let mult = 1
	if (enB.active("pos", 5)) mult /= enB_tmp.pos5

	let r = Math.max(Math.pow(Decimal.add(x, 1).log10() * mult, 2) - colorCharge.subCancel, 0)
	if (tmp.ngp3_mul) r *= 0.5

	let gluon = enB.colorUsed()
	if (color == gluon[0] || color == gluon[1]) r *= tmp.exMode ? 0.5 : 0
	return r
}

var enB = {
	buy(type) {
		var data = this[type]
		if (!data.unl()) return
		if (!(data.engAmt() >= data.cost())) return

		data.set(data.amt() + 1)
		updateGluonicBoosts()
		this.update(type)
	},
	maxBuy(type) {
		var data = this[type]
		if (!data.unl()) return
		if (!(data.engAmt() >= data.cost())) return

		data.set(Math.floor(data.target()))
		updateGluonicBoosts()
		this.update(type)
	},

	has(type, x) {
		var data = this[type]
		return this[type].unl() && data.amt() >= data[x].req
	},
	active(type, x) {
		var data = this[type][x]

		if (enB_tmp[type + x] === undefined) return false

		if (!this.has(type, x)) return false
		if (!this[type].activeReq(x)) return false
		if (this.mastered(type, x)) return true

		if (data.activeReq && !data.activeReq()) return false
		return true
	},
	mastered(type, x) {
		if (type == "glu" && QCs.in(8)) return false

		var data = this[type]
		return data.amt() >= this.getMastered(type, x) && data.amt() >= data[x].req
	},
	getMastered(type, x) {
		var data = this[type]
		var r = (tmp.dtMode && data[x].masReqDeath) || (tmp.exMode && data[x].masReqExpert) || data[x].masReq
		if (type == "glu") {
			if (QCs.perkActive(8) && !this.colorMatch("glu", x)) r = 0
			else if (QCs.perkActive(2)) r *= 20
			if (str.unl()) r += str.nerf_eb(x)
		}
		return r
	},
	anti(type, x) {
		if (type == "glu" && (QCs.perkActive(2) || QCs.in(8))) return true
		return this[type][x].anti
	},

	colorUsed(type, x) {
		if (QCs.in(8)) {
			var qc8 = QCs_save.qc8
			return qc8.order.length ? qc8.order[qc8.index] : ""
		}
		if (qu_save.entColor === undefined) qu_save.entColor = "rg"
		return qu_save.entColor
	},
	colorMatch(type, x) {
		var data = this[type][x]
		var gluon = enB.colorUsed()
		if (!data.type) return true
		if (!gluon) return

		var r = data.type == gluon[0] || data.type == gluon[1]
		if (this.anti(type, x)) r = !r
		return r
	},

	choose(x) {
		if (QCs.in(8)) {
			var qc8 = QCs_save.qc8
			if (qc8.order.length < 2 && !qc8.order.includes(x)) {
				qc8.order.push(x)
				QCs.data[8].updateDisp()
				if (qc8.order.length == 1 && enB.active("glu", 12)) updateColorCharge(true)
			}
			return
		}
		if ((enB.colorUsed()) == x) return
		if (!qu_save.entBoosts || qu_save.gluons.rg.max(qu_save.gluons.gb).max(qu_save.gluons.br).eq(0)) {
			alert("You need to get at least 1 Entangled Boost and have gluons before choosing a type!")
			return
		}
		if (!confirm("This will perform a quantum reset without gaining anything. Are you sure?")) return
		qu_save.entColor = x
		restartQuantum(true)
	},

	updateTmp() {
		var data = {}
		enB_tmp = data

		for (var x = 0; x < this.priorities.length; x++) {
			var boost = this.priorities[x]
			var type = boost[0]
			var num = boost[1]

			if (this.has(type, num)) {
				var eff = this[type][num].eff
				if (eff !== undefined) data[type + num] = eff(this[type].eff(num))
			}
		}
	},

	types: ["glu", "pos"],
	priorities: [
		["glu", 6], ["glu", 9],
		["pos", 7], ["pos", 9], ["pos", 11], ["pos", 12],

		["pos", 1], ["pos", 2], ["pos", 3], ["pos", 4], ["pos", 5], ["pos", 6], ["pos", 8], ["pos", 10],
		["glu", 1], ["glu", 2], ["glu", 3], ["glu", 4], ["glu", 5], ["glu", 7], ["glu", 8], ["glu", 10], ["glu", 11], ["glu", 12],
	],
	glu: {
		name: "Entangled",
		unl() {
			return tmp.quActive && qu_save.gluons.rg.max(qu_save.gluons.gb).max(qu_save.gluons.br).gt(0)
		},

		cost(x) {
			if (x === undefined) x = this.amt()
			return Math.pow(x / 3, 1.5) + 1
		},
		target(noBest) {
			return Math.pow(Math.max(this.engAmt(noBest) - 1, 0), 1 / 1.5) * 3 + 1
		},

		amt() {
			return qu_save.entBoosts || 0
		},
		engAmt(noBest) {
			var x = noBest ? qu_save.quarkEnergy : qu_save.bestEnergy
			if (noBest && QCs_tmp.qc5) x += QCs_tmp.qc5.eff_glu
			return x
		},
		set(x) {
			qu_save.entBoosts = x
		},

		eff(x) {
			var amt = this.boosterEff()

			var r = Math.max(amt * 2 / 3 - 1, 1)
			r *= tmp.glB[enB.mastered("glu", x) ? "masAmt" : "enAmt"]
			if (str.unl()) r *= str.eff_eb(x)
			return r
		},
		boosterEff() {
			var amt = this.target(true)
			if (pos.on()) amt += enB.pos.target()
			if (PCs.unl() && amt >= PCs_tmp.eff1_start) amt = Math.pow(amt / PCs_tmp.eff1_start, this.boosterExp()) * PCs_tmp.eff1_start
			if (hasAch("ng3pr14")) amt *= 1.1
			if (QCs.perkActive(2)) amt *= 1.5

			return amt
		},
		boosterExp(amt) {
			amt = amt || this.target(true)
			if (PCs.unl() && amt >= PCs_tmp.eff1_start) {
				var exp = PCs_tmp.eff1
				return exp
			}
			return 1
		},
		gluonEff(x) {
			let l = Decimal.add(x, 1).log10()
			return Math.pow(Math.log2(l + 2), 2 * (qu_save.expEnergy || 0))
		},

		activeReq(x) {
			return enB.mastered("glu", x) || enB.colorMatch("glu", x)
		},

		max: 12,
		1: {
			req: 1,
			masReq: 6,
			masReqExpert: 7,
			masReqDeath: 10,

			title: "Quantum Tesla",
			type: "r",
			eff(x) {
				return Math.cbrt(x) * 0.75
			},
			effDisplay(x) {
				return shorten(x + 1) + "x"
			}
		},
		2: {
			req: 4,
			masReq: 8,
			masReqExpert: 9,
			masReqDeath: 11,

			title: "Extraclusters",
			type: "g",
			eff(x) {
				return Math.sqrt(Math.log10(x + 1) * 1.5 + 1)
			},
			effDisplay(x) {
				return x.toFixed(3) + "x"
			}
		},
		3: {
			req: 6,
			masReq: 9,
			masReqExpert: 10,
			masReqDeath: 11,

			title: "Dilation Overflow",
			type: "b",
			eff(x) {
				return Math.pow(x / 2 + 1, tmp.ngp3_mul ? 0.5 : 0.4)
			},
			effDisplay(x) {
				return formatReductionPercentage(x, 2, 3) + "%"
			}
		},
		4: {
			req: 7,
			masReq: 10,
			masReqExpert: 11,
			masReqDeath: 13,

			title: "Meta Resynergizer",
			type: "r",
			eff(x) {
				x = Math.sqrt(1 + Math.log10(x / 10 + 1))
				return Math.min(0.003 * x, 0.012)
			},
			effDisplay(x) {
				return "^" + x.toFixed(4)
			}
		},
		5: {
			req: 9,
			masReq: 75,

			title: "Otherworldly Galaxies",
			type: "b",
			eff(x) {
				let r = {
					int: Math.log10(x / 2 + 1) / 2 + 1,
					exp: Math.min(Math.log10(Math.log10(x / 2e3 + 1) + 1) * (tmp.ngp3_mul ? 1.5 : 1) + 1, 2)
				}
				return r
			},
			effDisplay(x) {
				return "Strengthen all replicanti upgrades by <span style='font-size:24px'>^" + shorten(x.exp) + "</span>, <span style='font-size:18px'>+" + formatPercentage(x.int - 1) + "%</span>. (stealth)"
			},

			adjustChance(x) {
				if (futureBoost("replicante_clovers") && dev.boosts.tmp[8]) x = Math.pow(x, dev.boosts.tmp[8])
				return x
			}
		},
		6: {
			req: 10,
			masReq: 13,
			masReqExpert: 14,
			masReqDeath: 15,

			title: "Energy Lever",
			type: "g",
			eff(x) {
				if (pos.on()) {
					return Math.min(Math.pow(x / 20 + 1, 0.2), 1 / (1 - pos_tmp.mults.mdb))
				} else {
					return Math.sqrt(x / 2)
				}
			},
			effDisplay(x) {
				return pos.on() ? "Positrons on: Meta-Dimension Boosts are <span style='font-size:24px'>" + formatPercentage(x - 1) + "%</span> stronger."
				: "Positrons off: Add <span style='font-size:24px'>+" + shorten(x) + "</span> Positronic Charge to all mastered Positronic Boosts."
			}
		},
		7: {
			req: 12,
			masReq: 40,
			masReqExpert: 50,
			masReqDeath: 60,

			title: "Dilation Overflow II",
			type: "g",
			eff(x) {
				var lowLim = tmp.ngp3_mul ? 1.4 : 1.45
				return Math.max(lowLim + (2 - lowLim) / (Math.log2(x / 20 + 1) / 3 + 1), 1.5)
			},
			effDisplay(x) {
				return "^" + x.toFixed(3)
			}
		},
		8: {
			req: 12,
			masReq: 80,

			title: "Meta Resynergizer II",
			type: "r",
			eff(x) {
				return 0.125 - 0.025 / Math.pow(x + 1, tmp.ngp3_mul ? 0.3 : 0.2)
			},
			effDisplay(x) {
				return "x^" + x.toFixed(3)
			}
		},
		9: {
			req: 15,
			masReq: 36,

			title: "Inflation Resistor",
			type: "b",
			anti: true,
			eff(x) {
				return Math.log2(x / 100 + 1) * (tmp.ngp3_exp ? 1.5 : 1) + 1
			},
			effDisplay(x) {
				return shorten(x) + "x"
			}
		},
		10: {
			req: 36,
			masReq: 80,

			title: "Blue Saturation",
			type: "g",
			anti: true,
			eff(x) {
				return Math.pow(x + 1, tmp.ngp3_exp ? 0.35 : 0.25)
			},
			effDisplay(x) {
				return shorten(x) + "x"
			}
		},
		11: {
			req: 45,
			masReq: 80,

			title: "Blue Unseeming",
			type: "r",
			eff(x) {
				return Math.log10(Math.log10(x + 1) / (tmp.ngp3_mul ? 4 : 5) + 1)
			},
			effDisplay(x) {
				return "^" + (x / 2 + 1).toFixed(4)
			}
		},
		12: {
			req: 60,
			masReq: 80,

			title: "Color Subcharge",
			type: "b",
			anti: true,
			eff(x) {
				return 0
			},
			effDisplay(x) {
				return "Unlock Color Subcharge."
			}
		},
	},
	pos: {
		name: "Positronic",
		unl() {
			return pos.unl()
		},

		cost(x) {
			if (x === undefined) x = this.amt()
			return Math.pow(x / 2 + 1, 1.5)
		},
		target() {
			return Math.pow(this.engAmt(), 1 / 1.5) * 2 - 1
		},

		amt() {
			if (pos_save === undefined) return 0
			return pos_save.boosts
		},
		engAmt() {
			if (pos_save === undefined) return 0
			return pos_save.eng
		},
		set(x) {
			pos_save.boosts = x
		},

		activeReq(x) {
			if (pos_tmp.sac.qe < pos.swapCost(pos_tmp.cloud.swaps_amt)) return false
			var mas = enB.mastered("pos", x)

			return (futureBoost("exclude_any_boost") ? QCs.inAny() : QCs.in(2)) ? (pos.on() && mas && (
				QCs.modIn(2, "up") ? enB.pos.lvl(x) == QCs_save.qc2 :
				enB.pos.lvl(x) != QCs_save.qc2
			)) :
			!QCs.isntCatched() ? (pos.on() && mas) :
			(pos.on() || mas)
		},

		engEff(x) {
			var eng = this.engAmt()
			if (QCs_tmp.qc5) eng += QCs_tmp.qc5.eff_pos
			return eng
		},
		eff(x) {
			var eng = this.engEff()
			if (this.charged(x)) eng *= this.chargeEff(x)
			return eng
		},

		chargeReq(x, next, lvl) {
			var lvl = lvl || this.lvl(x, next)
			var req = this[x].chargeReq *
				Math.pow(1.5, Math.max((pos_tmp.cloud && pos_tmp.cloud.total) || 0, 2)) *
				Math.pow(2, lvl - this[x].tier)
			if (hasAch("ng3p28")) req /= Math.sqrt(this[x].chargeReq)
			if (hasAch("ng3pr13")) req *= 0.75
			if (PCs.milestoneDone(42) && lvl == 1) req *= hasAch("ng3pr12") ? 3 : 4
			if (str.unl()) req *= str.nerf_pb(x)
			return req
		},
		chargeEff(x) {
			var lvl = this.lvl(x)
			var eff = 2 * lvl
			if (PCs.milestoneDone(42) && lvl == 1) eff = 8
			if (str.unl()) eff += str.eff_pb(x)
			return eff
		},
		charged(x, lvl) {
			return this.activeReq(x) && this.engAmt() >= this.chargeReq(x, false, lvl) && (enB.mastered("pos", x) || enB.colorMatch("pos", x))
		},

		lvl(x, next) {
			if (pos_save === undefined) return this[x].tier

			var swaps = next ? pos_tmp.cloud.next : pos_tmp.cloud.swaps
			if (swaps[x]) x = swaps[x]
			return this[x].tier
		},

		max: 12,
		1: {
			req: 1,
			masReq: 4,
			masReqExpert: 5,
			masReqDeath: 6,
			chargeReq: 1,

			title: "Replicanti Launch",
			tier: 1,
			type: "g",
			eff(x) {
				var rep = getReplEff()
				var eff = Math.log2(x * 4 + 1)
				return Math.log10(rep.max(1).log10() / 1e6 * eff + 1) * eff
			},
			effDisplay(x) {
				return "(" + shorten(x) + ")"
			}
		},
		2: {
			req: 3,
			masReq: 6,
			chargeReq: 1.5,

			title: "Pata Accelerator",
			tier: 2,
			type: "b",
			eff(x) {
				var slowStart = 4
				if (enB.active("pos", 9)) slowStart += enB_tmp.pos9
				if (PCs.milestoneDone(33)) slowStart += 0.1 * PCs_save.lvl

				var accSpeed = 3 / (slowStart - 1)
				if (enB.active("glu", 9)) accSpeed *= enB_tmp.glu9
				if (QCs.done(7)) accSpeed *= 1.25
				if (PCs.milestoneDone(71)) accSpeed *= 1 + 0.03 * Math.sqrt(PCs_save.lvl)

				var mdb = player.meta.resets
				var base = Math.min(player.meta.bestAntimatter.add(1).log10() * getPataAccelerator() + 1, 1e10)
				var exp = mdb
				var rel_speed = tmp.ngp3_mul || tmp.ngp3_exp ? 30 : 60

				var pre_slow_mdb = Math.min(mdb, slowStart)
				exp += pre_slow_mdb * (pre_slow_mdb - 1) * accSpeed
				exp /= rel_speed

				var speed = 1
				if (mdb <= slowStart) speed += (mdb - 1) * accSpeed

				var mult = Decimal.pow(base, exp)
				var igal = hasAch("ng3p27") ? getIntergalacticExp(mult.log10()) : undefined
				return {
					base: base,
					exp: exp,
					slowdown: slowStart,
					speed: speed / rel_speed,
					acc: accSpeed / rel_speed,
					mult: mult,

					igal: hasAch("ng3p27") ? igal : undefined,
					igal_softcap: hasAch("ng3p27") ? Math.pow(Math.max(igal - 0.5, 1), 2) : undefined
				}
			},
			effDisplay(x) {
				return getPataAccelerator().toFixed(3) + "x"
			}
		},
		3: {
			req: 6,
			masReq: 7,
			chargeReq: 2,

			title: "Classical Positrons",
			tier: 1,
			type: "r",
			eff(x) {
				let gal = player.galaxies
				gal *= 0.0007 * Math.min(Math.pow(Math.log2(x + 1), 2), 100)
				return Math.pow(gal + 1, 1.5)
			},
			effDisplay(x) {
				return "^" + shorten(x)
			}
		},
		4: {
			req: 8,
			masReq: 9,
			masReqExpert: 10,
			masReqDeath: 12,
			chargeReq: 2.5,

			title: "Quantum Scope",
			tier: 3,
			type: "b",
			anti: true,
			eff(x) {
				return Math.log10(x / 10 + 1) * Math.pow(x / (tmp.ngp3_mul ? 100 : 200) + 1, 0.25) / 3 + 1
			},
			effDisplay(x) {
				return shorten(Decimal.pow(getQuantumReq(true), 1 / x))
			}
		},
		5: {
			req: 8,
			masReq: 9,
			masReqExpert: 10,
			chargeReq: 3,

			title: "Gluon Flux",
			tier: 2,
			type: "r",
			anti: true,
			eff(x) {
				return Math.pow(Math.log2(x / 10 + 1) + 1, tmp.ngp3_mul ? 2 : 1)
			},
			effDisplay(x) {
				return formatReductionPercentage(x) + "%"
			}
		},
		6: {
			req: 9,
			masReq: 16,
			chargeReq: 3.5,

			title: "Transfinite Time",
			tier: 3,
			type: "r",
			eff(x) {
				let r = Math.log10(x / 600 + 1) / 3 + 1
				return Math.sqrt(r)
			},
			effDisplay(x) {
				return "^" + x.toFixed(3)
			}
		},
		7: {
			req: 25,
			masReq: 0,
			chargeReq: 4,

			title: "Looped Dimensionality",
			tier: 3,
			eff(x) {
				x = Math.log10(player.dilation.tachyonParticles.max(1).log10() / 100 + 1) * Math.log10(x / 10 + 1) / 4 + 1
				x *= x
				return x
			},
			effDisplay(x) {
				return x.toFixed(3) + "x"
			}
		},
		8: {
			req: 50,
			masReq: 0,
			chargeReq: 5,

			title: "308% Completionist",
			tier: 3,
			eff(x) {
				return Math.log10(x + 1) / 5
			},
			effDisplay(x) {
				return formatReductionPercentage(x + 1) + "%"
			}
		},
		9: {
			req: 90,
			masReq: 0,
			chargeReq: 6,

			title: "MT-Force Preservation",
			tier: 2,
			eff(x) {
				return Math.pow(x / 15 + 1, 0.1) - 1
			},
			effDisplay(x) {
				return shorten(x)
			}
		},
		10: {
			req: 99,
			masReq: 0,
			chargeReq: 8,

			title: "Overpowered Infinities",
			tier: 2,
			eff(x) {
				var sqrt = Math.sqrt(Decimal.max(getInfinitied(), 1).log10())
				var exp = 5 - 5 / (Math.log10(x / 1e3 + 1) + 1)
				return Math.max(sqrt, 1) * exp + 1
			},
			effDisplay(x) {
				return "^" + shorten(x)
			}
		},
		11: {
			req: 150,
			masReq: 0,
			chargeReq: 10,

			title: "Eternity Transfinition",
			tier: 3,
			eff(x) {
				return Math.min(5e-8 * Math.log2(x / 500 + 1), 1e-5)
			},
			effDisplay(x) {
				return shorten(player.eternityPoints.max(1).pow(x * getAQSGainExp())) + "x"
			}
		},
		12: {
			req: 150,
			masReq: 0,
			chargeReq: 12,

			title: "Timeless Capability",
			tier: 3,
			eff(x) {
				return Math.log10(Math.pow(getReplEff().log10() * Math.log10(x + 1), 0.2) + 10) - 1
			},
			effDisplay(x) {
				return "+" + x.toFixed(3) + "x"
			}
		},
	},

	update(type) {
		var data = enB
		var typeData = data[type]

		getEl("enB_" + type + "_amt").textContent = getFullExpansion(typeData.amt() || 0)
		getEl("enB_" + type + "_cost").textContent = shorten(typeData.cost())
		getEl("enB_" + type + "_next").textContent = ""

		var has = true
		var allMastered = true
		for (var e = 1; e <= typeData.max; e++) {
			var active = data.active(type, e)
			var mastered = data.mastered(type, e)
			var el = getEl("enB_" + type + e + "_name")

			if (has && !data.has(type, e)) {
				has = false
				getEl("enB_" + type + "_next").textContent = "Next " + typeData.name + " Boost unlocks at " + typeData[e].req + " " + typeData.name + " Boosters."
			}

			var localHas = has
			if (type == "pos" && QCs.inAny() && !mastered) localHas = false
			el.parentElement.style.display = localHas ? "" : "none"

			if (localHas) {
				if (!mastered) allMastered = false
				el.parentElement.className = data.color(e, type)
				el.textContent = shiftDown ? (typeData[e].title || "Unknown title.") : (typeData.name + " Boost #" + e)
			}
		}
		if (QCs.inAny()) getEl("enB_" + type + "_next").textContent = ""

		if (type == "pos") {
			pos.updateCloud()
			getEl("entangle_div_pos").style.display = allMastered ? "none" : ""
		}
	},
	color(e, type) {
		var colors = {
			r: "red",
			g: "green",
			b: "blue"
		}
		var data = enB
		var typeData = data[type]
		return type == "pos" && shiftDown ? (!typeData.charged(e) ? "black" : [null, "red", "green", "blue"][typeData.lvl(e)]) :
			!data.active(type, e) ? "black" :
			type == "pos" && typeData.charged(e) ? "yellow" :
			data.mastered(type, e) || !typeData[e].type ? "lime" :
			enB.colorMatch(type, e) ? colors[typeData[e].type] + (data.anti(type, e) ? "_anti" : "") : "grey"
	},
	updateUnlock() {
		let gluUnl = enB.glu.unl()
		getEl("gluon_req").textContent = gluUnl ? "" : "To unlock anti-Gluons, you need to go Quantum with at least 2 colored kinds of anti-Quarks."
		getEl("gluonstabbtn").style.display = gluUnl ? "" : "none"
	},
	updateOnTick(type) {
		var data = this[type]

		if (getEl("enB_" + type + "_eng") !== null) getEl("enB_" + type + "_eng").textContent = shorten(data.engAmt())
		getEl("enB_" + type + "_buy").className = data.engAmt() >= data.cost() ? "storebtn" : "unavailablebtn"

		for (var i = 1; i <= data.max; i++) {
			if (!this.has(type, i)) break

			var active = this.active(type, i)
			var mastered = this.mastered(type, i)
			var charged = type == "pos" && data.charged(i)

			var list = []
			if (!active) list.push("Inactive")
			if (charged) list.push("<b class='charged'>" + shortenDimensions(data.chargeEff(i)) + "x Charged</b>")
			else if (mastered) list.push("Mastered")
			if (data[i].type && (!mastered || shiftDown)) list.push((this.anti(type, i) ? "anti-" : "") + data[i].type.toUpperCase() + "-type boost")
			if (!mastered && !QCs.in(8)) list.push("Get " + getFullExpansion(enB.getMastered(type, i)) + " " + data.name + " Boosters to master")

			getEl("enB_" + type + i + "_name").textContent = shiftDown ? (data[i].title || "Unknown title.") : (data.name + " Boost #" + i)
			getEl("enB_" + type + i + "_type").innerHTML = "(" + wordizeList(list, false, " - ", false) + ")" + (data[i].activeDispReq ? "<br>Requirement: " + data[i].activeDispReq() : "")

			if (enB_tmp[type + i] !== undefined) getEl("enB_" + type + i + "_eff").innerHTML = data[i].effDisplay(enB_tmp[type + i])
			if (type == "pos") getEl("enB_pos" + i + "_full").innerHTML = (mastered ? "Tier " + enB.pos.lvl(i) + " - " : "") + (!enB.mastered("pos", i) && !enB.colorMatch("pos", i) ? "Mismatched (No self-boost)" : "Self-boost is at " + shorten(enB.pos.chargeReq(i)) + " charge")
		}
	}
}
var enB_tmp = {}
let ENTANGLED_BOOSTS = enB

function gainQKOnQuantum(qkGain, quick) {
	var oldGluUnl = enB.glu.unl()

	//Nothing -> Quarks
	qu_save.quarks = qu_save.quarks.add(qkGain)
	if (!tmp.ngp3 || player.ghostify.milestones < 8) qu_save.quarks = qu_save.quarks.round()

	//Quarks -> Gluons
	var u = qu_save.usedQuarks
	var g = qu_save.gluons
	var p = ["rg", "gb", "br"]
	var d = []
	for (var c = 0; c < 3; c++) d[c] = u[p[c][0]].min(u[p[c][1]])
	for (var c = 0; c < 3; c++) {
		g[p[c]] = g[p[c]].add(d[c]).round()
		u[p[c][0]] = u[p[c][0]].sub(d[c]).round()
	}
	if (enB.glu.unl() && !oldGluUnl) {
		$.notify("Congratulations, you have unlocked Anti-Gluons!")
		enB.updateUnlock()
	}

	if (!quick) {
		//Quarks -> Colors
		if (qu_save.autoOptions.assignQK) assignAll(true)
		updateColorCharge()

		//Quarks & Gluons -> Energy
		updateQuantumWorth()
		updateQEGainTmp()
		gainQuantumEnergy()
	}
}

//Display
function updateQuarksTab(tab) {
	getEl("redPower").textContent = shorten(qu_save.colorPowers.r)
	getEl("greenPower").textContent = shorten(qu_save.colorPowers.g)
	getEl("bluePower").textContent = shorten(qu_save.colorPowers.b)

	getEl("redTranslation").textContent = "+" + formatPercentage(colorBoosts.r - 1)
	getEl("greenTranslation").textContent = shorten(colorBoosts.g) + "x"
	getEl("blueTranslation").textContent = shorten(colorBoosts.b) + "x"
	getEl("blueTransInfo").textContent = shiftDown ? "(Base: " + shorten(colorBoosts.b_base) + ", raised by ^" + shorten(colorBoosts.b_exp) + ")" : ""

	getEl("quarkEnergyEffect1").textContent = formatPercentage(tmp.qe.eff1 - 1)
	getEl("quarkEnergyEffect2").textContent = shorten(tmp.qe.eff2)

	//Post-Quantum content
	if (player.ghostify.milestones >= 8) {
		updateQuarkAssort()
		updateQuantumWorth("display")
	}
}

function updateGluonsTab() {
	let colors = ['r','g','b']

	if (player.ghostify.milestones >= 8) updateGluonsTabOnUpdate("display")

	for (var c = 0; c < 3; c++) {
		var color = colors[c]
		getEl(color + "PowerBuff").textContent = shorten(tmp.glB[color].mult)
		getEl(color + "PowerNerf").textContent = shorten(tmp.glB[color].sub)
		getEl(color + colors[(c + 1) % 3]).textContent = shortenDimensions(qu_save.gluons[color + colors[(c + 1) % 3]])
	}

	let typeUsed = enB.colorUsed()
	if (typeUsed != "") {
		getEl("entangle_" + typeUsed + "_bonus").textContent = "+" + shorten(getQEGluonsPortion() * tmp.qe.mult / tmp.qe.div) + " quantum energy, " + shorten(enB.glu.gluonEff(qu_save.gluons[typeUsed])) + "x effective boosters"
	}

	enB.updateOnTick("glu")
	getEl("enB_eff").textContent = !shiftDown && !QCs.in(8) ? "" :
		"Effective Boosters: " + shorten(enB.glu.boosterEff()) + (enB.glu.boosterExp() > 1 ? " (^" + shorten(enB.glu.boosterExp()) + ")" : "")
}

//Display: On load
function updateQuarksTabOnUpdate(mode) {
	//Color Charge
	var colors = ['r','g','b']
	if (colorCharge.normal.charge == 0) {
		getEl("colorCharge").innerHTML = 'neutral charge'
		getEl("colorChargeAmt").innerHTML = 0
		getEl("colorChargeColor").className = "black"

		getEl("neutralize_req").innerHTML = 0
		getEl("neutralize_quarks").className = "unavailablebtn"
	} else {
		var color = colorShorthands[colorCharge.normal.color]
		getEl("colorCharge").innerHTML =
			'<span class="' + color + '">' + color + '</span> charge of <span style="font-size: 25px">' + shorten(colorCharge.normal.charge * tmp.qe.eff1) + "</span>" +
			(hasAch("ng3p13") ? ",<br>which is translated to -" + shorten(colorCharge.subCancel) + " to gluon penalties" : "")
		getEl("colorChargeAmt").innerHTML = shortenDimensions(colorCharge.normal.chargeAmt) + " " + color + " anti-quarks"
		getEl("colorChargeColor").className = color

		getEl("neutralize_req").innerHTML = shortenDimensions(colorCharge.neutralize.total)
		getEl("neutralize_quarks").className = qu_save.quarks.gte(colorCharge.neutralize.total) ? "storebtn" : "unavailablebtn"
	}

	//Color Subcharge
	var sub = enB.active("glu", 12)
	getEl("colorSubchargeDiv").style.visibility = sub ? "visible" : "hidden"
	if (sub) {
		var color = colorShorthands[colorCharge.sub.color]
		getEl("colorSubchargeDiv").className = colorCharge.sub.charge == 0 ? "black" : color + " light"
		getEl("colorSubcharge").innerHTML= colorCharge.sub.charge == 0 ? "neutral subcharge" : color + " subcharge of <span style='font-size: 25px'>" + shorten(colorCharge.sub.charge) + "</span>"
		getEl("colorSubchargeEff").textContent = shorten(colorCharge.sub.eff)
	}

	//Colored Quarks
	getEl("redQuarks").textContent = shortenDimensions(qu_save.usedQuarks.r)
	getEl("greenQuarks").textContent = shortenDimensions(qu_save.usedQuarks.g)
	getEl("blueQuarks").textContent = shortenDimensions(qu_save.usedQuarks.b)

	updateQuarkAssort()

	var uq = qu_save.usedQuarks
	var gl = qu_save.gluons
	for (var p = 0; p < 3; p++) {
		var pair = (["rg", "gb", "br"])[p]
		var diff = uq[pair[0]].min(uq[pair[1]])
		getEl(pair + "_gain").textContent = shortenDimensions(diff)
		getEl(pair + "_prev").textContent = shortenDimensions(uq[pair[0]])
		getEl(pair + "_next").textContent = shortenDimensions(uq[pair[0]].sub(diff).round())
	}
}

function updateQuarkAssort() {
	var assortAmount = getAssortAmount()
	var canAssign = assortAmount.gt(0)
	getEl("assort_amount").textContent = shortenDimensions(assortAmount.times(getQuarkAssignMult()))
	getEl("redAssort").className = canAssign ? "storebtn" : "unavailablebtn"
	getEl("greenAssort").className = canAssign ? "storebtn" : "unavailablebtn"
	getEl("blueAssort").className = canAssign ? "storebtn" : "unavailablebtn"
	getEl("assignAllButton").className = canAssign ? "storebtn" : "unavailablebtn"
}

function updateGluonsTabOnUpdate(mode) {
	if (!tmp.ngp3) return
	else if (!qu_save.gluons.rg) {
		qu_save.gluons = {
			rg: new Decimal(0),
			gb: new Decimal(0),
			br: new Decimal(0)
		}
	}

	enB.update("glu")
	enB.update("pos")

	let typeUsed = enB.colorUsed()
	let types = ["rg", "gb", "br"]
	for (var i = 0; i < types.length; i++) {
		var type = types[i]
		getEl("entangle_" + type).style.display = tmp.dtMode ? "none" : ""
		getEl("entangle_" + type).className = "gluonupgrade " + type
		getEl("entangle_" + type + "_pos").style.display = tmp.dtMode ? "none" : ""
		getEl("entangle_" + type + "_pos").className = "gluonupgrade " + type
		getEl("entangle_" + type + "_bonus").textContent = ""
	}

	if (typeUsed != "") {
		getEl("entangle_" + typeUsed).className = "gluonupgrade chosenbtn"
		getEl("entangle_" + typeUsed + "_pos").className = "gluonupgrade chosenbtn"
	}

	getEl("masterNote").style.display = enB.mastered("glu", 1) ? "" : "none"
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
	maxDistance = Math.sqrt(Math.pow(centerX,2)+Math.pow(centerY,2))
	code = player.options.theme=="Aarex's Modifications"?"e5":"99"
	if (getEl("quantumtab").style.display !== "none" && getEl("uquarks").style.display !== "none" && player.options.animations.quarks) {
		qkctx.clearRect(0, 0, canvas.width, canvas.height);
		quarks.sum = qu_save.colorPowers.r + qu_save.colorPowers.g + qu_save.colorPowers.b
		quarks.amount=Math.ceil(Math.min(quarks.sum, 200))
		for (p=0;p<quarks.amount;p++) {
			var particle=quarks['p'+p]
			if (particle==undefined) {
				particle={}
				var random=Math.random()
				if (random<=qu_save.colorPowers.r/quarks.sum) particle.type='r'
				else if (random>=1-qu_save.colorPowers.b/quarks.sum) particle.type='b'
				else particle.type='g'
				particle.motion=Math.random()>0.5?'in':'out'
				particle.direction=Math.random()*Math.PI*2
				particle.distance=Math.random()
				quarks['p'+p]=particle
			} else {
				particle.distance+=0.01
				if (particle.distance>=1) {
					var random=Math.random()
					if (random<=qu_save.colorPowers.r/quarks.sum) particle.type='r'
					else if (random>=1-qu_save.colorPowers.b/quarks.sum) particle.type='b'
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