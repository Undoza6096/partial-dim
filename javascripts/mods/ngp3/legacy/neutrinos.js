function updateNeutrinoBoostDisplay(){
	if (player.ghostify.neutrinos.boosts >= 1) getEl("neutrinoBoost1").textContent = shorten(tmp.nb[1])
	if (player.ghostify.neutrinos.boosts >= 2) getEl("neutrinoBoost2").textContent = shorten(tmp.nb[2])
	if (player.ghostify.neutrinos.boosts >= 3) getEl("neutrinoBoost3").textContent = shorten(tmp.nb[3])
	if (player.ghostify.neutrinos.boosts >= 4) getEl("neutrinoBoost4").textContent = shorten(tmp.nb[4])
	if (player.ghostify.neutrinos.boosts >= 5) getEl("neutrinoBoost5").textContent = formatPercentage(tmp.nb[5])
	if (player.ghostify.neutrinos.boosts >= 6) getEl("neutrinoBoost6").textContent = formatReductionPercentage(tmp.nb[6])
	if (player.ghostify.neutrinos.boosts >= 7) {
		let preEff = getTreeUpgradeEfficiency("noNB")
		getEl("neutrinoBoost7").textContent = formatPercentage(tmp.nb[7] - 1)
		getEl("preNeutrinoBoost7Eff").textContent = formatPercentage(preEff)
		getEl("neutrinoBoost7Eff").textContent = formatPercentage(preEff * tmp.nb[7])
	}
	if (player.ghostify.neutrinos.boosts >= 8) getEl("neutrinoBoost8").textContent = formatPercentage(tmp.nb[8] - 1)
	if (player.ghostify.neutrinos.boosts >= 9) getEl("neutrinoBoost9").textContent = shorten(tmp.nb[9])
	if (player.ghostify.neutrinos.boosts >= 10) getEl("neutrinoBoost10").textContent = tmp.nb[10].toFixed(4)
	if (player.ghostify.neutrinos.boosts >= 11) getEl("neutrinoBoost11").textContent = shorten(tmp.nb[11])
	if (player.ghostify.neutrinos.boosts >= 12) getEl("neutrinoBoost12").textContent = "^" + shorten(tmp.nb[12])
}

function updateNeutrinoAmountDisplay(){
	getEl("electronNeutrinos").textContent = shortenDimensions(player.ghostify.neutrinos.electron)
	getEl("muonNeutrinos").textContent = shortenDimensions(player.ghostify.neutrinos.mu)
	getEl("tauNeutrinos").textContent = shortenDimensions(player.ghostify.neutrinos.tau)
}

function updateNeutrinoUpgradeDisplay() {
	var sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	for (var u = 1; u <= neutrinoUpgrades.max; u++) if (isNeutrinoUpgUnlocked(u)) {
		if (hasNU(u)) getEl("neutrinoUpg" + u).className = "gluonupgradebought neutrinoupg"
		else if (sum.gte(tmp.nuc[u])) getEl("neutrinoUpg" + u).className = "gluonupgrade neutrinoupg"
		else getEl("neutrinoUpg" + u).className = "gluonupgrade unavailablebtn"

		eff = tmp.nu[u]
		if (eff == undefined) continue
		if (u == 12) getEl("neutrinoUpg12").setAttribute('ach-tooltip', neutrinoUpgrades[u].effDesc(eff))
		else getEl("neutrinoUpg" + u + "Pow").textContent = neutrinoUpgrades[u].effDesc(eff)
	}
}

function isNeutrinoUpgUnlocked(u) {
	if (u >= 16) return GDs.unlocked()
	if (u >= 13) return player.ghostify.ghostlyPhotons.unl
	if (u >= 5) return player.ghostify.times >= u - 2
	return true
}

function updateNeutrinoUpgradeUnlock(u) {
	let unl = isNeutrinoUpgUnlocked(u)
	if (u % 3 == 1) getEl("neutrinoUpg" + u).parentElement.parentElement.style.display = isNeutrinoUpgUnlocked(u) ? "" : "none"
	else getEl("neutrinoUpg" + u).style.display = isNeutrinoUpgUnlocked(u) ? "" : "none"
}

function updateNeutrinoUpgradeUnlocks(rangeMin, rangeMax) {
	if (!tmp.ngp3) return
	for (var u = rangeMin; u <= rangeMax; u++) updateNeutrinoUpgradeUnlock(u)
}

function updateNeutrinosTab(){
	var generations = ["electron", "Muon", "Tau"]
	var neutrinoGain = getNeutrinoGain()
	var sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	getEl("neutrinosGain").textContent="You gain " + shortenDimensions(neutrinoGain) + " " + generations[player.ghostify.neutrinos.generationGain - 1] + " neutrino" + (neutrinoGain.eq(1) ? "" : "s") + " each time you get 1 normal galaxy."
	setAndMaybeShow("neutrinosGainGhostify",hasAch("ng3p68"),'"You gain "+shortenDimensions(Decimal.times(\''+neutrinoGain.toString()+'\',qu_save.bigRip.bestGals*2e3))+" of all neutrinos each time you become a ghost 1x time."')
	
	updateNeutrinoAmountDisplay()
	updateNeutrinoBoostDisplay()
	updateNeutrinoUpgradeDisplay()
	
	if (player.ghostify.ghostParticles.gte(getNeutrinoBoostCost())) getEl("neutrinoUnlock").className = "gluonupgrade neutrinoupg"
	else getEl("neutrinoUnlock").className = "gluonupgrade unavailablebtn"
	if (player.ghostify.ghostParticles.gte(Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2))) getEl("neutrinoMultUpg").className = "gluonupgrade neutrinoupg"
	else getEl("neutrinoMultUpg").className = "gluonupgrade unavailablebtn"
	if (sum.gte(getGHPMultCost())) getEl("ghpMultUpg").className = "gluonupgrade neutrinoupg"
	else getEl("ghpMultUpg").className = "gluonupgrade unavailablebtn"
}

function onNotationChangeNeutrinos() {
	if (player.masterystudies == undefined) return
	getEl("neutrinoUnlockCost").textContent=shortenDimensions(getNeutrinoBoostCost())
	getEl("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5, player.ghostify.neutrinos.multPower - 1))
	getEl("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4, player.ghostify.neutrinos.multPower-1).times(2))
	getEl("ghpMult").textContent = shortenMoney(getGHPBaseMult())
	getEl("ghpMultUpgCost").textContent=shortenDimensions(getGHPMultCost())
	for (var u = 1; u <= neutrinoUpgrades.max; u++) getEl("neutrinoUpg" + u + "Cost").textContent=shortenDimensions(new Decimal(tmp.nuc[u]))
}

function getNeutrinoGain() {
	let ret = Decimal.pow(5, player.ghostify.neutrinos.multPower - 1)
	if (player.ghostify.ghostlyPhotons.unl) ret = ret.times(tmp.le[5])
	if (hasNU(14)) ret = ret.times(tmp.nu[14])
	if (isNanoEffectUsed("neutrinos")) ret = ret.times(tmp.nf.effects.neutrinos)
	return ret
}

function buyNeutrinoUpg(id) {
	let sum = player.ghostify.neutrinos.electron.add(player.ghostify.neutrinos.mu).add(player.ghostify.neutrinos.tau).round()
	let cost = tmp.nuc[id]
	if (sum.lt(cost) || player.ghostify.neutrinos.upgrades.includes(id)) return
	player.ghostify.neutrinos.upgrades.push(id)
	subNeutrinos(cost)
}

function updateNeutrinoBoosts() {
	for (var b = 1; b <= neutrinoBoosts.max; b++) getEl("neutrinoBoost" + (b % 3 == 1 ? "Row" + (b + 2) / 3 : "Cell" + b)).style.display = player.ghostify.neutrinos.boosts >= b ? "" : "none"
	getEl("neutrinoUnlock").style.display = player.ghostify.neutrinos.boosts >= 12 ? "none" : ""
	getEl("neutrinoUnlockCost").textContent = shortenDimensions(getNeutrinoBoostCost())
}

function getNeutrinoBoostCost() {
	let data = neutrinoBoosts[player.ghostify.neutrinos.boosts + 1]
	let x = data ? data.cost : 1/0
	return new Decimal(x)
}

function unlockNeutrinoBoost() {
	var cost = getNeutrinoBoostCost()
	if (!player.ghostify.ghostParticles.gte(cost) || player.ghostify.neutrinos.boosts >= 12) return
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(cost).round()
	player.ghostify.neutrinos.boosts++
	updateNeutrinoBoosts()
	updateTmp()
}

function hasNU(id) {
	return pH.did("ghostify") ? player.ghostify.neutrinos.upgrades.includes(id) : false
}

function buyNeutrinoMult() {
	let cost = Decimal.pow(4, player.ghostify.neutrinos.multPower - 1).times(2)
	if (!player.ghostify.ghostParticles.gte(cost)) return
	player.ghostify.ghostParticles=player.ghostify.ghostParticles.sub(cost).round()
	player.ghostify.neutrinos.multPower++
	getEl("neutrinoMult").textContent=shortenDimensions(Decimal.pow(5, player.ghostify.neutrinos.multPower-1))
	getEl("neutrinoMultUpgCost").textContent=shortenDimensions(Decimal.pow(4, player.ghostify.neutrinos.multPower-1).times(2))
}

function maxNeutrinoMult() {
	let cost = Decimal.pow(4,player.ghostify.neutrinos.multPower-1).times(2)
	if (!player.ghostify.ghostParticles.gte(cost)) return
	let toBuy = Math.floor(player.ghostify.ghostParticles.div(cost).times(3).add(1).log(4))
	let toSpend = Decimal.pow(4, toBuy).sub(1).div(3).times(cost)
	player.ghostify.ghostParticles = player.ghostify.ghostParticles.sub(toSpend.min(player.ghostify.ghostParticles)).round()
	player.ghostify.neutrinos.multPower += toBuy
	getEl("neutrinoMult").textContent = shortenDimensions(Decimal.pow(5, player.ghostify.neutrinos.multPower - 1))
	getEl("neutrinoMultUpgCost").textContent = shortenDimensions(Decimal.pow(4, player.ghostify.neutrinos.multPower - 1).times(2))
}

let neutrinoBoosts = {
	max: 12,
	1: {
		eff(nt) {
			return 1
		},
		cost: 1
	},
	2: {
		eff(nt) {
			return 1
		},
		cost: 2
	},
	3: {
		eff(nt) {
			return 1
		},
		cost: 4
	},
	4: {
		eff(nt) {
			return 1
		},
		cost: 6
	},
	5: {
		eff(nt) {
			var nb5neutrinos = nt[0].max(1).log10()+nt[1].max(1).log10()+nt[2].max(1).log10()
			return Math.min(nb5neutrinos / 33, 1)
		},
		cost: 15
	},
	6: {
		eff(nt) {
			var nb6neutrinos = Math.pow(nt[0].add(1).log10(), 2) + Math.pow(nt[1].add(1).log10(), 2) + Math.pow(nt[2].add(1).log10(), 2)
			var nb6exp1 = .25
			if (tmp.ngp3_exp) nb6exp1 = .26
			let nb6 = Math.pow(nb6neutrinos, nb6exp1) * 0.525 + 1
			if (isLEBoostUnlocked(9)) nb6 *= tmp.leBonus[7]
			return nb6
		},
		cost: 50
	},
	7: {
		eff(nt) {
			let nb7exp = .5
			if (tmp.ngp3_exp) nb7exp = .6
			let nb7neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			let nb7 = Math.pow(Math.log10(1 + nb7neutrinos), nb7exp) * 2.35
			if (nb7 > 4) nb7 = 2 * Math.log2(nb7)
			if (nb7 > 5) nb7 = 2 + Math.log2(nb7 + 3)
			if (hasNU(17)) nb7 = Math.pow(nb7 + 1, tmp.nu[17]) - 1
			return nb7
		},
		cost: 1e3
	},
	8: {
		eff(nt) {
			let nb8neutrinos = Math.pow(nt[0].add(1).log10(),2)+Math.pow(nt[1].add(1).log10(),2)+Math.pow(nt[2].add(1).log10(),2)
			let nb8exp = .25
			if (tmp.ngp3_exp) nb8exp = .27
			var nb8 = Math.pow(nb8neutrinos, nb8exp) / 10 + 1
			if (nb8 > 11) nb8 = 7 + Math.log2(nb8 + 5)
			return nb8
		},
		cost: 1e14
	},
	9: {
		eff(nt) {
			var nb9 = (nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10())/10
			if (isLEBoostUnlocked(9)) nb9 *= tmp.leBonus[7]
			return nb9
		},
		cost: 1e35
	},
	10: {
		eff(nt) {
			let nb10neutrinos = nt[0].add(1).log10()+nt[1].add(1).log10()+nt[2].add(1).log10()
			let nb10 = Math.max(nb10neutrinos - 3e3, 0) / 75e4
			if (hasBosonicUpg(54)) nb10 = Math.pow(nb10neutrinos / 2e5, 2)
			return nb10
		},
		cost: "1e900"
	},
	11: {
		eff(nt) {
			let nb11neutrinos = nt[0].add(nt[1]).add(nt[2]).add(1).log10()
			let exp = Math.sqrt(nb11neutrinos)
			if (hasBosonicUpg(54)) exp = Math.max(Math.pow(nb11neutrinos, 0.75) / 5, exp)

			return Decimal.pow(1.15, exp)
		},
		cost: "1e3000"
	},
	12: {
		eff(nt) {
			let nb12neutrinos = nt[0].add(nt[1]).add(nt[2]).add(1).log10()
			let nb12 = Math.pow(nb12neutrinos / 1e4 + 1, 2)
			if (hasBosonicUpg(54)) nb12 = Math.pow(nb12, 1.25)
			return nb12
		},
		cost: "1e10000"
	}
}

var neutrinoUpgrades = {
	max: 18,
	1: {
		eff() {
			let x = 110
			x = Math.max(x - player.meta.resets, 0)
			return x
		},
		effDesc(x) {
			return x
		}
	},
	3: {
		eff() {
			if (!tmp.quActive) return new Decimal(1)
			let log = qu_save.colorPowers.b
			let exp = Math.pow(Math.log10(qu_save.colorPowers.b + 10) + 1, 2)
			let x
			if (exp > 2) x = Decimal.pow(Math.max(log / 250 + 1, 1), exp)
			else x = Math.pow(Math.max(log / 250 + 1, 1), exp)
			return x
		},
		effDesc(x) {
			return shorten(x)
		}
	},
	4: {
		eff() {
			let nu4base = 50
			if (tmp.ngp3l) nu4base = 20
			return Decimal.pow(nu4base, Math.pow(Math.max(-getTickspeed().div(1e3).log10() / 4e13 - 4, 0), 1/4))
		},
		effDesc(x) {
			return shorten(x)
		}
	},
	7: {
		eff() {
			if (!tmp.quActive) return new Decimal(1)
			var nu7 = qu_save.colorPowers.g / 400
			if (nu7 > 40) nu7 = Math.sqrt(nu7*10)+20
			return Decimal.pow(10, nu7) 
		},
		effDesc(x) {
			return shorten(x)
		}
	},
	12: {
		eff() {
			return { 
				normal: Math.sqrt(initialGalaxies() * .0035 + 1),
				free: getEffectiveTGs() * .035 + 1,
				replicated: Math.sqrt(getTotalRGs()) * .0175 + 1 //NU12 
			}
		},
		effDesc(x) {
			return "Normal galaxy effect: " + shorten(x.normal) + "x to quark spin production, "+
			"Replicated galaxy effect: " + shorten(x.replicated) + "x to EC14 reward, "+
			"Free galaxy effect: " + shorten(x.free) + "x to IC3 reward"
		}
	},
	14: {
		eff() {
			if (!tmp.quActive) return new Decimal(1)
			var base = player.ghostify.ghostParticles.add(1).log10()
			var colorsPortion = Math.pow(qu_save.colorPowers.r + qu_save.colorPowers.g + qu_save.colorPowers.b, 1/3)
			return Decimal.pow(base, colorsPortion * 0.8 + 1).max(1)
		},
		effDesc(x) {
			return shorten(x)
		}
	},
	15: {
		eff() {
			if (!tmp.quActive) return new Decimal(1)
			let nr = qu_save.nanofield.rewards
			if (nr > 90) nr = Math.sqrt(nr * 90)
			return Decimal.pow(2, nr / 2.5)
		},
		effDesc(x) {
			return shorten(x)
		}
	},
	17: {
		eff() {
			return 1 - 1 / Math.max(player.ghostify.hb.higgs / 150, 1)
		},
		effDesc(x) {
			return x.toFixed(3)
		}
	}
}

function gainNeutrinos(bulk,type) {
	let gain = getNeutrinoGain().times(bulk)
	let gens = ["electron", "mu", "tau"]
	if (type == "all") {
		for (var g = 0; g < 3; g++) {
			var gen = gens[g]
			player.ghostify.neutrinos[gen] = player.ghostify.neutrinos[gen].add(gain).round()
		}
	} else if (type == "gen") {
		var gen = gens[player.ghostify.neutrinos.generationGain - 1]
		player.ghostify.neutrinos[gen] = player.ghostify.neutrinos[gen].add(gain).round()
	}
}

function subNeutrinos(sub) {
	let neu = player.ghostify.neutrinos
	let sum = neu.electron.add(neu.mu).add(neu.tau).round()
	let gen = ["electron", "mu", "tau"]
	for (g = 0; g < 3; g++) neu[gen[g]] = neu[gen[g]].sub(neu[gen[g]].div(sum).times(sub).min(neu[gen[g]])).round()
}