//FLUCTUANT FIELD
let ff = {
	unl: (force) => force ? fluc.unl() : ff_tmp.unl && ff_tmp.eff,

	data: {
		all: [null, "alt", "pow", "free", "syn", "upg", "share"],
		modes: ["Arc", "Remove"],
		reqs: [0, 1, 2, 4, 6, 8, 10],
		alt: {
			req: 1,
			title: "Altitude",
			desc: "Increases the altitudes."
		},
		pow: {
			req: 2,
			title: "Power",
			desc: "Multiplies the power gain."
		},
		free: {
			req: 3,
			title: "Freebie",
			desc: "Decreases the power requirement."
		},
		syn: {
			req: 6,
			title: "Synthesis",
			desc: "Strengthens Strings by altitudes."
		},
		upg: {
			req: 7,
			title: "Upgrade",
			desc: "Unlocks a new power."
		},
		share: {
			req: 10,
			title: "Sharing",
			desc: "Shares altitudes to the right."
		}
	},

	setup() {
		ff_save = {
			arcs: {}, //{1: [1, 4], 2: [1, 3]}
			perks: {}, //{1: "alt", 2: "pow"}
			mode: 0
		}
		fluc_save.ff = ff_save
		return ff_save
	},
	compile() {
		ff_tmp = { unl: this.unl(true) }
		if (!tmp.ngp3) return

		var data = ff_save || this.setup()
		if (!data.mode) data.mode = 0

		this.switchMode(true)
		this.updateTmp()
	},
	reset() {
		ff_save = {
			arcs: {}, //{1: [1, 4], 2: [1, 3]}
			perks: {}, //{1: "alt", 2: "pow"}
			mode: 0
		}
		ff.updateTmp()
	},

	update(diff) {
	},
	updateTmp() {
		ff_tmp = {
			unl: ff_tmp.unl,
			choose: ff_tmp.choose,
			used: []
		}

		if (!ff_tmp.unl) return
		for (var i = 1; i <= 6; i++) {
			var pk = ff_save.perks && ff_save.perks[i]
			if (pk) ff_tmp.used.push(pk)
		}

		ff.updateTmpOnTick()
	},
	updateTmpOnTick() {
		if (!ff_tmp.unl) return

		ff_tmp.pows = {}
		for (var i = 1; i <= 6; i++) {
			ff_tmp.pows[i] = 0
		}
	},

	updateTab() {
		for (var i = 1; i <= 6; i++) {
			var pk = ff_save.perks[i]
			el("ff_perk_"+i+"_pow").innerHTML = pk && shiftDown ? "<br>(" + shorten(ff_tmp.pows[i]) + " power)" : ""
		}
	},
	updateDisplays() {
		var choose = ff_tmp.choose
		for (var i = 1; i <= 6; i++) {
			var unl = fluc_save.energy >= ff.data.reqs[i]
			el("ff_arc_"+i).style.visibility = !choose || unl ? "visible" : "hidden"
			el("ff_arc_"+i).className = unl ? "ff_btn" : "unavailablebtn"
			el("ff_arc_"+i+"_title").textContent = unl ? (choose ? "Inactive" : "Position " + i) : "Locked"
			el("ff_arc_"+i+"_cost").textContent = unl ? (choose && choose != i ? "" : "(Cost: 1 FE)") : "(requires " + ff.data.reqs[i] + " FE)"

			var pk = ff_save.perks[i]
			el("ff_perk_"+i).style.display = unl && (!choose || choose == i) ? "" : "none"
			el("ff_perk_"+i).className = (unl ? "ff_btn" : "unavailablebtn") + " ff_perk"
			el("ff_perk_"+i+"_name").textContent = pk ? ff.data[ff.data.all[pk]].title : "None"
			el("ff_perk_"+i+"_desc").textContent = pk ? ff.data[ff.data.all[pk]].desc : ""

			el("ff_eng_"+i).style.display = unl ? "" : "none"
		}
	},

	perkActive(x) {
		return ff_tmp.used.includes(x) && ff_tmp.pows[x] !== undefined
	},

	respec() {
		if (!confirm("This will perform a Quantum reset and reset this mechanic entriely. Are you sure?")) return
		ff_save.perks = {}
		ff_save.arc = {}
		ff.updateTmp()
		restartQuantum()
	},
	choose(x, mode) {
		if (mode == "perk") {
			var newV = (ff_save.perks[x] || 0) + 1
			while (ff_tmp.used.includes(newV)) newV++

			var name = ff.data.all[newV]
			if (newV == ff.data.all.length || fluc_save.energy < ff.data[name].req) newV = 0
			ff_save.perks[x] = newV

			el("ff_perk_"+x+"_name").textContent = newV ? ff.data[name].title : "None"
			el("ff_perk_"+x+"_desc").textContent = newV ? ff.data[name].desc : ""
			ff.updateTmp()
			restartQuantum()
		}
		if (mode == "arc" && ff_save.mode == 0) {
			if (ff_tmp.choose) {
				if (ff_tmp.choose != x) return
				ff_tmp.choose = 0
			} else ff_tmp.choose = x
			ff.updateDisplays()
		}
		if (mode == "arc" && ff_save.mode == 1) {
			if (!ff_save.arc[x]) return
			if (!confirm("This will perform a Quantum reset and remove an arc from this position. Are you sure?")) return
			delete ff_save.arc[x]
			ff.updateTmp()
			restartQuantum()
		}
	},
	switchMode(update) {
		if (!tmp.ngp3) return
		if (!update) ff_save.mode = (ff_save.mode + 1) % 2
		getEl("ff_mode").textContent = "Mode: " + ff.data.modes[ff_save.mode]

		if (ff_save.mode == 1 && ff_tmp.choose > 0) {
			ff_tmp.choose = 0
			ff.updateDisplays()
		}
	}
}
let ff_tmp = {}
let ff_save
let FLUCTUANT_FIELD = ff