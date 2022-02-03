function inBigRip() {
	return false
}
/* BIG RIPPED TO OBSCURITY. */

function updateBreakEternity() {
	if (el("breakEternityTabbtn").style == "none") return

	if (qu_save.breakEternity.unlocked) {
		el("breakEternityReq").style.display = "none"
		el("breakEternityShop").style.display = ""
		el("breakEternityNoBigRip").style.display = qu_save.bigRip.active ? "none" : ""
		el("breakEternityBtn").textContent = (qu_save.breakEternity.break ? "FIX" : "BREAK") + " ETERNITY"
		for (var u = 1; u <= 13; u++) el("breakUpg" + u + "Cost").textContent = shortenDimensions(getBreakUpgCost(u))
		el("breakUpg7MultIncrease").textContent = shortenDimensions(1e9)
		el("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
		el("breakUpgRS").style.display = qu_save.bigRip.active ? "" : "none"
	} else {
		el("breakEternityReq").style.display = ""
		el("breakEternityReq").textContent = "You need to get " + shorten(E("1e1200")) + " EP before you can Break Eternity."
		el("breakEternityNoBigRip").style.display = "none"
		el("breakEternityShop").style.display = "none"
	}
}

function breakEternity() {
	qu_save.breakEternity.break = !qu_save.breakEternity.break
	qu_save.breakEternity.did = true
	el("breakEternityBtn").textContent = (qu_save.breakEternity.break ? "FIX" : "BREAK") + " ETERNITY"
	if (qu_save.bigRip.active) {
		tmp.be = tmp.quUnl && qu_save.breakEternity.break
		updateTmp()
		if (!tmp.be && el("timedimensions").style.display == "block") showDimTab("antimatterdimensions")
	}
	if (!player.dilation.active && isSmartPeakActivated) {
		EPminpeakType = 'normal'
		EPminpeak = E(0)
	}
}

function getEMGain() {
	if (!tmp.quUnl) return E(0)
	let log = player.timeShards.div(1e9).log10() * 0.25
	if (log > 15) log = Math.sqrt(log * 15)
	if (player.ghostify.neutrinos.boosts >= 12) log *= tmp.nb[12]
	
	let log2log = Math.log10(log) / Math.log10(2)
	let start = 10 //Starts at e1024.
	if (log2log > start) { //every squaring there is a sqrt softcap
		let capped = Math.min(Math.floor(Math.log10(Math.max(log2log + 2 - start, 1)) / Math.log10(2)), 20 - start)
		log2log = (log2log - Math.pow(2, capped) - start + 2) / Math.pow(2, capped) + capped + start - 1
		log = Math.pow(2, log2log)
	}

	if (!tmp.be) log /= 2

	return pow10(log).floor()
}

var breakUpgCosts = [1, 1e3, 2e6, 2e11, 8e17, 1e45, null, 1e290, E("1e350"), E("1e375"), E("1e2140"), E("1e2800"), E("1e3850")]
function getBreakUpgCost(id) {
	if (id == 7) return Decimal.pow(2, qu_save.breakEternity.epMultPower).times(1e5)
	return breakUpgCosts[id - 1]
}

function buyBreakUpg(id) {
	if (!qu_save.breakEternity.eternalMatter.gte(getBreakUpgCost(id)) || qu_save.breakEternity.upgrades.includes(id)) return
	qu_save.breakEternity.eternalMatter = qu_save.breakEternity.eternalMatter.sub(getBreakUpgCost(id))
	if (player.ghostify.milestones < 15) qu_save.breakEternity.eternalMatter = qu_save.breakEternity.eternalMatter.round()
	if (id == 7) {
		qu_save.breakEternity.epMultPower++
		el("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
		el("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
	} else qu_save.breakEternity.upgrades.push(id)
	el("eternalMatter").textContent = shortenDimensions(qu_save.breakEternity.eternalMatter)
}

function getBreakUpgMult(id) {
	return tmp.beu[id]
}

function maxBuyBEEPMult() {
	let cost = getBreakUpgCost(7)
	if (!qu_save.breakEternity.eternalMatter.gte(cost)) return
	let toBuy = Math.floor(qu_save.breakEternity.eternalMatter.div(cost).add(1).log(2))
	let toSpend = Decimal.pow(2,toBuy).sub(1).times(cost).min(qu_save.breakEternity.eternalMatter)
	qu_save.breakEternity.epMultPower += toBuy
	qu_save.breakEternity.eternalMatter = qu_save.breakEternity.eternalMatter.sub(toSpend)
	if (player.ghostify.milestones < 15) qu_save.breakEternity.eternalMatter = qu_save.breakEternity.eternalMatter.round()
	el("eternalMatter").textContent = shortenDimensions(qu_save.breakEternity.eternalMatter)
	el("breakUpg7Mult").textContent = shortenDimensions(getBreakUpgMult(7))
	el("breakUpg7Cost").textContent = shortenDimensions(getBreakUpgCost(7))
}