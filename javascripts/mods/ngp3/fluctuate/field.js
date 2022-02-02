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
			data: [], //[[pos, pk, left, right]]
			mode: 0
		}
		fluc_save.ff = ff_save
		return ff_save
	},
	compile() {
		ff_tmp = { unl: this.unl(true) }
		if (!tmp.ngp3) return

		var data = ff_save || this.setup()
		if (!data.data) {
			data = this.setup()
			ff_save = data
		}
		if (!data.mode) data.mode = 0

		this.switchMode(true)
		this.updateTmp()
	},
	reset() {
		ff_save = {
			data: [], //[[pos, pk, left, right]]
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
			used: [],
			pos: {}
		}

		if (!ff_tmp.unl) return
		ff_tmp.posUnl = 0
		ff_tmp.pkUnl = 0
		for (var i = 1; i < ff.data.reqs.length; i++) if (fluc_save.energy >= ff.data.reqs[i]) ff_tmp.posUnl++
		for (var i = 1; i < ff.data.all.length; i++) if (fluc_save.energy >= ff.data[ff.data.all[i]].req) ff_tmp.pkUnl++

		ff_tmp.spent = 0

		ff.updateTmpOnTick()
	},
	updateTmpOnTick() {
		if (!ff_tmp.unl) return
	},

	updateTab() {
		/*for (var i = 1; i <= 6; i++) {
			var pk = ff_save.perks[i]
			el("ff_pk_"+i+"_pow").innerHTML = pk && shiftDown ? "<br>(" + shorten(ff_tmp.pows[i]) + " power)" : ""
		}*/
	},
	updateDisplays() {
		for (var i = 1; i <= 18; i++) {
			el("ff_arc_"+i+"_name").textContent = "Pos. " + Math.floor(i / 3) + ["a", "b", "c"][(i - 1) % 3]
			el("ff_arc_"+i+"_eng").textContent = shorten(0) + " FE used"

			el("ff_pk_"+i+"_name").textContent = "None"
			el("ff_pk_"+i+"_desc").textContent = ""
		}
		/*for (var i = 1; i <= 6; i++) {
			var a = ff_save.arcs[i]
			var aUnl = fluc_save.energy >= ff.data.reqs[i]
			el("ff_arc_"+i).style.visibility = !c || aUnl ? "visible" : "hidden"
			if (!c || aUnl) {
				if (ff_save.arcs[c]) console.log(ff_save.arcs[c][0], i, ff_save.arcs[c][1])
				el("ff_arc_"+i).className = !aUnl ? "unavailablebtn" :
					c ? (c == i ? "ff_btn" : ff.canArc(c, i) ? "storebtn" : ff_save.arcs[c][0] <= i && ff_save.arcs[c][1] >= i ? "chosenbtn" : "unavailablebtn") :
					(a ? "storebtn" : ff.canArc(i) ? "ff_btn" : "unavailablebtn")
				el("ff_arc_"+i+"_title").textContent = aUnl ? "Position " + i : "Locked"
				el("ff_arc_"+i+"_cost").textContent = c ? (c == i ? "Click to exit" : "Cost: " + shorten(ff.arcCost(c, true) - ff.arcCost(c)) + " FE") :
					(a ? "Click to arc" : aUnl ? "(Cost: " + getFullExpansion(this.arcCost(x, true)) + " FE)" : "(requires " + getFullExpansion(ff.data.reqs[i]) + " FE)")
			}

			var pk = ff_save.perks[i]
			var pkUnl = a !== undefined && (!c || c == i)
			el("ff_pk_"+i).style.display = pkUnl ? "" : "none"
			el("ff_eng_"+i).innerHTML = pkUnl ? (
				shorten(ff.arcCost(i)) + (c ? " / " + shorten(ff.unspent() + ff.arcCost(c)) : "") + " FE used<br>" +
				shorten(ff.arcPower(i)) + " Power"
			) : ""
			if (pkUnl) {
				el("ff_pk_"+i+"_name").textContent = pk ? ff.data[ff.data.all[pk]].title : "None"
				el("ff_pk_"+i+"_desc").textContent = pk ? ff.data[ff.data.all[pk]].desc : ""
			}
		}*/
		el("ff_spent").textContent = shorten(ff_tmp.spent) + " / " + getFullExpansion(fluc_save.energy)

		var nxt = ff.data[ff.data.all[ff_tmp.pkUnl + 1]]
		el("ff_pk_next").style.display = nxt ? "" : "none"
		el("ff_pk_next").textContent = nxt && (nxt.title + " perk unlocks at " + getFullExpansion(nxt.req) + " Fluctuant Energy.")
	},
	setupHTML() {
		for (var i = 1; i <= 18; i++) {
			el("ff_arc_"+i+"_td").innerHTML = '<button class="ff_btn" id="ff_arc_'+i+'" onclick="ff.choose('+i+', \'arc\')"><b id="ff_arc_'+i+'_name"></b><br><span id="ff_arc_'+i+'_eng"></span></button>'
			el("ff_pk_"+i+"_td").innerHTML = '<button class="fluctuatebtn ff_perk" id="ff_pk_'+i+'" onclick="ff.choose('+i+', \'perk\')"><b id="ff_pk_'+i+'_name"></b><br><span id="ff_pk_'+i+'_desc"></span><span id="ff_pk_'+i+'_pow"></span></button>'
		}
	},

	unspent() {
		return fluc_save.energy - ff_tmp.spent
	},
	cost(a, b, next) {
		var l = a ? b - a : 0
		if (next) l++
		return Math.pow(2, (l - 1) / 1.7)
	},
	canArc(x, p) {
		if (fluc_save.energy < ff.data.reqs[p]) return
		if (ff.unspent() < ff.arcCost(x, true)) return

		var a = ff_save.arcs[x]
		if (!a) return true
		if (p < a[0]) return p == a[0] - 1
		return p == a[1] + 1
	},
	arcCost(x, next) {
		return this.cost(ff_save.arcs[x] && ff_save.arcs[x][0], ff_save.arcs[x] && ff_save.arcs[x][1], next)
	},
	arcPower(x) {
		var a = ff_save.arcs[x]
		if (!a) return 0

		var x = 0
		var exp = 2
		for (var i = a[0]; i <= a[1]; i++) x += Math.pow(0, exp)
		return Math.pow(x, 1 / exp)
	},
	perkActive(x) {
		return ff_tmp.used.includes(x) && ff_tmp.pows[x] !== undefined
	},

	respec() {
		if (fluc_save.energy == 1 && str_save.energy < 1) return
		if (!confirm("This will perform a Quantum reset and reset this mechanic entriely. Are you sure?")) return
		ff_save.data = []
		ff.updateTmp()
		restartQuantum()
	},
	choose(x, mode) {
		if (fluc_save.energy == 1 && str_save.energy < 1) {
			alert("You need to get at least 1 Vibration Energy before using this mechanic.")
			return
		}
		alert("Rework incoming...")
		return

		/*if (mode == "perk") {
			var newV = (ff_save.perks[x] || 0) + 1
			while (ff_tmp.used.includes(newV)) newV++

			var name = ff.data.all[newV]
			if (newV == ff.data.all.length || fluc_save.energy < ff.data[name].req) newV = 0
			ff_save.perks[x] = newV

			el("ff_pk_"+x+"_name").textContent = newV ? ff.data[name].title : "None"
			el("ff_pk_"+x+"_desc").textContent = newV ? ff.data[name].desc : ""
			ff.updateTmp()
			restartQuantum()
		}
		if (mode == "arc" && ff_save.mode == 0) {
			var a = ff_save.arcs[x]
			var c = ff_tmp.choose
			if (c) {
				if (c != x) {
					if (!ff.canArc(c, x)) return
					a = ff_save.arcs[c]
					if (x < a[0]) a[0] = x
					else a[1] = x
					ff.updateTmp()
				} else ff_tmp.choose = 0
			} else if (a) {
				ff_tmp.choose = x
				ff.updateTmp()
			} else if (ff.unspent() >= ff.arcCost(x, true)) {
				ff_save.arcs[x] = [x, x]
				ff.updateTmp()
			}
			ff.updateDisplays()
		}
		if (mode == "arc" && ff_save.mode == 1) {
			if (!ff_save.arcs[x]) return
			if (!confirm("This will perform a Quantum reset and remove an arc from this position. Are you sure?")) return
			delete ff_save.arcs[x]
			ff.updateTmp()
			restartQuantum()
		}*/
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