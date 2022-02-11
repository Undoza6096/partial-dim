//FLUCTUANT FIELD
let ff = {
	unl: (force) => force ? fluc.unl() : ff_tmp.unl && ff_tmp.eff,
	canUse: () => ff_tmp.unl && (fluc_save.energy > 1 || str_save.energy >= 1),

	data: {
		all: [null, "alt", "pow", "free", "syn", "upg", "share"],
		modes: ["Arc", "Remove"],
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
			data: [],
				//[4, 3, [-3, 1, 2]]
				//[pos, pk, arc data]
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
			choose: ff_tmp.choose != undefined ? ff_tmp.choose : {}
		}

		if (!ff_tmp.unl) return
		var d = ff_tmp
		var data = ff.data
		var save = ff_save.data

		d.pkUnl = 0
		for (var i = 1; i < data.all.length; i++) if (fluc_save.energy >= ff.data[ff.data.all[i]].req) d.pkUnl++

		d.spent = 0
		d.linked = []
		d.linked_2 = []
		d.shown = []
		d.used = []
		d.pkPos = {}
		d.pos = {}
		for (var i = 0; i < save.length; i++) {
			var a = save[i]
			d.spent += ff.arcCost(a)
			d.linked.push(Math.ceil(a[0] / 3))
			d.linked_2 = d.linked_2.concat(ff.calcArc(a))
			d.shown.push(a[0])
			d.pos[a[0]] = i
			if (a[1]) {
				d.used.push(a[1])
				d.pkPos[a[1]] = a[0]
			}
		}

		ff.updateChooseTmp()
		ff.updateTmpOnTick()
	},
	updateTmpOnTick() {
		if (!ff_tmp.unl) return
		var d = ff_tmp
		d.pow = {}
		for (var i = 0; i < d.used.length; i++) d.pow[d.used[i]] = ff.powerStr(Math.ceil(d.pkPos[d.used[i]] / 3))
	},
	updateChooseTmp() {
		var d = ff_tmp.choose
		d.a = []
		if (d.x) {
			var c = save[d.x]
			for (var i = 1; i <= 3; i++) if (!c[2].includes(i) && !c[2].includes(-i)) d.a.push(i)
		}
	},

	updateTab() {
		/*for (var i = 1; i <= 6; i++) {
			var pk = ff_save.perks[i]
			el("ff_pk_"+i+"_pow").innerHTML = pk && shiftDown ? "<br>(" + shorten(ff_tmp.pows[i]) + " power)" : ""
		}*/
	},
	updateDisplays() {
		var c = ff_tmp.choose.x
		for (var i = 1; i <= 18; i++) {
			var pos = ff_tmp.pos[i]
			var arc = c && ff.calcArc(ff_save.data[c])
			el("ff_arc_"+i).style.display = ff.arcUnl(i) ? "" : "none"
			el("ff_arc_"+i).className = c != undefined ? (pos == c ? "ff_btn" : ff.canArc(i, c) ? "storebtn" : "unavailablebtn") : (pos != undefined ? "ff_btn" : ff.canArc(i) ? "storebtn" : "unavailablebtn")
			el("ff_arc_"+i+"_name").textContent = pos != undefined && pos == c ? "Choosing" : "P-" + Math.ceil(i / 3) + ["a", "b", "c"][(i - 1) % 3]
			el("ff_arc_"+i+"_eng").textContent = pos != undefined && c == undefined ? shorten(pos != undefined ? 1 : 0) + " FE used" : "Cost: " + shorten(c == undefined ? ff.cost(1) : ff.arcCost(c) - ff.arcCost(c, false)) + " FE"

			var pk = pos != undefined && ff_save.data[pos][1]
			el("ff_pk_"+i).style.display = ff_tmp.shown.includes(i) ? "" : "none"
			el("ff_pk_"+i+"_name").textContent = pk ? ff.data[ff.data.all[pk]].title : "None"
			el("ff_pk_"+i+"_desc").textContent = pk ? ff.data[ff.data.all[pk]].desc : ""
		}

		for (var i = 1; i <= 6; i++) {
			el("ff_eng_"+i).style.display = ff.arcUnl(i * 3) ? "" : "none"
			el("ff_eng_"+i).textContent = shorten(ff.powerStr(i)) + " total Power"
		}
		el("ff_spent").textContent = shorten(ff_tmp.spent) + " / " + getFullExpansion(fluc_save.energy)

		var nxt = ff.data[ff.data.all[ff_tmp.pkUnl + 1]]
		el("ff_pk_next").style.display = nxt ? "" : "none"
		el("ff_pk_next").textContent = nxt && (nxt.title + " perk unlocks at " + getFullExpansion(nxt.req) + " Fluctuant Energy.")

		el("ff_req").style.display = ff.canUse() ? "none" : ""
		el("ff_spent_disp").style.display = ff.canUse() ? "" : "none"
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
	arcUnl(x) {
		return ff_tmp.pkUnl >= Math.ceil(x / 3)
	},
	cost(x) {
		if (!x) x = 1
		return Math.pow(x / 3, 0.6)
	},
	canArc(x, c) {
		if (!ff.arcUnl(x)) return
		if (ff.unspent() < ff.arcCost(c) - ff.arcCost(c, false)) return
		if (c) {
			if (ff_tmp.linked_2.includes(x)) return
			return ff_tmp.choose.includes(Math.abs(x - ff_save.data[c][0]))
		}

		if (ff_tmp.linked.includes(Math.ceil(x / 3))) return
		return true
	},
	arcCost(x, next = true) {
		var l = ff_save.data[x] ? ff_save.data[x][2].length + 1 : 0
		if (next) l++
		return this.cost(l)
	},
	calcArc(d) {
		var a = d[2]
		if (a.length == 0) return [d[0]]

		var n = 0
		for (var i = 0; i < a.length; i++) {
			var j = a[i]
			if (j > 0) break
			n -= j
		}

		var s = d[0]
		var m = 0
		var r = []
		var p = 0
		for (var i = 0; i < a.length; i++) {
			var j = a[i]
			var nx = a[i+1]
			if (j < 0) {
				r.push(s - n)
				n += j
			}
			if ((!nx || nx > 0) && m == 0) {
				r.push(s)
				m = 1
			}
			if (j > 0) {
				p += j
				r.push(s + p)
			}
		}
		return r
	},

	powerStr(x) {
		var r = 0
		for (var i = 0; i < 3; i++) r += ff_tmp.linked_2.includes(x * 3 - i) ? 1 : 0
		return r
	},

	perkPos(x) {
		return ff_tmp.pos[x]
	},
	perkEff(x) {
		return ff_tmp.pow[x]
	},
	perkActive(x) {
		return ff_tmp.unl && ff_tmp.used.includes(x)
	},
	perkShown(x) {
		return ff_tmp.shown.includes(x)
	},

	respec() {
		if (!ff.canUse()) {
			$.notify("You need to get at least 1 Vibration Energy before using this mechanic.", "warn")
			return
		}
		if (!confirm("This will perform a Quantum reset and reset this mechanic entriely. Are you sure?")) return
		ff_save.data = []
		ff.updateTmp()
		restartQuantum()
	},
	choose(x, mode) {
		if (!ff.canUse()) {
			$.notify("You need to get at least 1 Vibration Energy before using this mechanic.", "warn")
			return
		}

		if (mode == "arc" && ff_save.mode == 0) {
			var c = ff_tmp.choose.x
			if (ff_tmp.pos[x] == c) {
				delete ff_tmp.choose.x
				ff.updateChooseTmp()
			} else if (ff_tmp.pos[x] != undefined) {
				ff_tmp.choose.x = ff_tmp.pos[x]
				ff.updateChooseTmp()
			} else {
				if (!ff.canArc(x)) return
				ff_save.data.push([x, 0, []])
				ff.updateTmp()
			}
			ff.updateDisplays()
		} else if (mode == "arc" && ff_save.mode == 1) {
			var p = ff_tmp.pos[x]
			if (p === undefined) return
			if (!confirm("This will perform a Quantum reset and remove an arc from this position. Are you sure?")) return

			var newD = []
			for (var i = 0; i < ff_save.data.length; i++) if (i != p) newD.push(ff_save.data[i])
			ff_save.data = newD

			ff.updateTmp()
			ff.updateDisplays()
			restartQuantum()
		} else if (mode == "perk") {
			var data = ff_save.data[ff_tmp.pos[x]]
			var newV = (data[1] || 0) + 1
			while (ff_tmp.used.includes(newV)) newV++

			var name = ff.data.all[newV]
			if (newV == ff.data.all.length || fluc_save.energy < ff.data[name].req) newV = 0
			data[1] = newV

			el("ff_pk_"+x+"_name").textContent = newV ? ff.data[name].title : "None"
			el("ff_pk_"+x+"_desc").textContent = newV ? ff.data[name].desc : ""
			ff.updateTmp()
			restartQuantum()
		}

		/*if (mode == "arc" && ff_save.mode == 0) {
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
		}*/
	},
	switchMode(update) {
		if (!tmp.ngp3) return
		if (!update) {
			if (!ff.canUse()) {
				$.notify("You need to get at least 1 Vibration Energy before using this mechanic.", "warn")
				return
			}
			ff_save.mode = (ff_save.mode + 1) % 2
		}
		el("ff_mode").textContent = "Mode: " + ff.data.modes[ff_save.mode]

		if (ff_save.mode == 1 && ff_tmp.choose > 0) {
			ff_tmp.choose = 0
			ff.updateDisplays()
		}
	},
	
	exportPreset() {
		alert("Coming soon...")
	},
	importPreset() {
		alert("Coming soon...")
	}
}
let ff_tmp = {}
let ff_save
let FLUCTUANT_FIELD = ff