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
			eff: (s) => Math.pow(s, 0.75) * 0.1,
			desc: (x) => "Increases the altitudes by " + shorten(x) + "."
		},
		pow: {
			req: 2,
			title: "Power",
			eff: (s) => Math.log2(s / 2 + 1) / 3 + 1,
			desc: (x) => "Multiplies the power gain by " + shorten(x) + "x."
		},
		free: {
			req: 3,
			title: "Freebie",
			eff: (s) => s,
			desc: (x) => "Decreases the power requirement by -" + formatReductionPercentage(x) + "."
		},
		syn: {
			req: 6,
			title: "Synthesis",
			eff: (s) => Math.sqrt(s / 2 + 1),
			desc: (x) => "Strengthens Strings by altitudes. (Power: " + shorten(x) + ")"
		},
		upg: {
			req: 7,
			title: "Upgrade",
			eff: (s) => Math.log10(s * 9 + 1),
			desc: (x) => "Unlocks a new power, and reduce it by " + formatReductionPercentage(x) + "%."
		},
		share: {
			req: 10,
			title: "Sharing",
			eff: (s) => Math.log2(s / 2 + 1) / 3 + 1,
			desc: (x) => "Shares altitudes to the right by " + formatPercentage(x) + "."
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
		d.linked = {}
		d.linked_2 = {}
		d.shown = []
		d.used = []
		d.pkPos = {}
		d.pos = {}
		for (var i = 0; i < save.length; i++) {
			var a = save[i]
			var arc = ff.calcArc(a)
			d.spent += ff.cost(arc.length)
			d.shown.push(a[0])
			d.pos[a[0]] = i
			if (a[1]) {
				d.used.push(a[1])
				d.pkPos[a[1]] = a[0]
			}
			for (var h = 0; h < arc.length; h++) {
				var p = Math.ceil(arc[h] / 3)
				d.linked[p] = (d.linked[p] || 0) + Math.sqrt(Math.abs(arc[h] - arc[0]) + 1)
				d.linked_2[arc[h]] = i
			}
		}

		ff.updateChooseTmp()
		ff.updateTmpOnTick()
	},
	updateTmpOnTick() {
		if (!ff_tmp.unl) return
		var d = ff_tmp
		d.pow = {}
		d.eff = {}
		for (var i = 1; i <= 6; i++) {
			if (d.used.includes(i)) {
				var p1 = ff_tmp.pkPos[i]
				d.pow[i] = d.linked[Math.ceil(p1 / 3)]
				d.eff[i] = ff.data[ff.data.all[i]].eff(d.pow[i])
			}
		}
	},
	updateChooseTmp() {
		var d = ff_tmp.choose
		d.a = []
		if (d.x != undefined) {
			var a = ff_save.data[d.x]
			var c = ff.calcArc(a)
			var p = []
			var p2 = [1,2,3]
			if (fluc.energy >= 12) p2.push(1)
			if (fluc.energy >= 15) p2.push(2)
			if (fluc.energy >= 18) p2.push(3)
			if (fluc.energy >= 21) p2.push(4)
			for (var i = 0; i < p2.length; i++) if (!a[2].includes(p2[i]) && !a[2].includes(-p2[i])) p.push(i)
			for (var i = 0; i < p.length; i++) {
				d.a.push(ff.wrap(c[0] - p[i]))
				d.a.push(ff.wrap(c[c.length-1] + p[i]))
			}
		}
	},

	updateTab() {
		for (var i = 1; i <= 18; i++) {
			var pos = ff_tmp.pos[i]
			if (pos !== undefined) {
				var pk = pos != undefined && ff_save.data[pos][1]
				el("ff_pk_"+i+"_desc").textContent = pk ? ff.data[ff.data.all[pk]].desc(ff_tmp.eff[pk]) : ""
				el("ff_pk_"+i+"_pow").innerHTML = ff_tmp.used.includes(i) ? " (" + shorten(ff_tmp.pow[pk]) + ")" : ""
			}
		}
	},
	updateDisplays() {
		var c = ff_tmp.choose.x
		var arc = c != undefined && ff.calcArc(ff_save.data[c])
		for (var i = 1; i <= 18; i++) {
			var pos = ff_tmp.pos[i]
			el("ff_arc_"+i).style.visibility = ff.arcUnl(i) ? "visible" : "hidden"
			el("ff_arc_"+i).className = c != undefined ? (pos == c ? "ff_btn" : arc.includes(i) ? "chosenbtn" : ff.canArc(i, c) ? "storebtn" : "unavailablebtn") : (pos != undefined ? "ff_btn" : ff_tmp.linked_2[i] != undefined ? "chosenbtn" : ff.canArc(i) ? "storebtn" : "unavailablebtn")
			el("ff_arc_"+i+"_name").textContent = pos != undefined ? (pos == c ? "Choosing" : "[ARC-" + pos + "]") : ff_tmp.linked_2[i] != undefined ? "L-" + ff_tmp.linked_2[i] : "P-" + Math.ceil(i / 3) + ["a", "b", "c"][(i - 1) % 3]
			el("ff_arc_"+i+"_eng").textContent = pos != undefined && c == undefined ? shorten(pos != undefined ? 1 : 0) + " FE used" : (c == undefined ? ff_tmp.linked[Math.ceil(i / 3)] != undefined : ff_tmp.linked_2[i] != undefined) ? "" : "Cost: " + shorten(c == undefined ? ff.cost(1) : ff.arcCost(c) - ff.arcCost(c, false)) + " FE"

			var pk = pos != undefined && ff_save.data[pos][1]
			el("ff_pk_"+i).style.display = ff_tmp.shown.includes(i) ? "" : "none"
			el("ff_pk_"+i+"_name").textContent = pk ? ff.data[ff.data.all[pk]].title : "None"
		}
		el("ff_spent").textContent = shorten(ff_tmp.spent) + " / " + getFullExpansion(fluc_save.energy)

		var nxt = ff.data[ff.data.all[ff_tmp.pkUnl + 1]]
		el("ff_pk_next").style.display = nxt ? "" : "none"
		el("ff_pk_next").textContent = nxt && (nxt.title + " perk unlocks at " + getFullExpansion(nxt.req) + " Fluctuant Energy.")

		el("ff_req").style.display = ff.canUse() ? "none" : ""
		el("ff_div").style.display = ff.canUse() ? "" : "none"
		el("ff_spent_disp").style.display = ff.canUse() ? "" : "none"
	},
	setupHTML() {
		var html = ""
		for (var i = 1; i <= 9; i++) {
			var ni = 19 - i
			var grey = (i - 1) % 6 > 2
			html += "<tr><td id='ff_pk_"+i+"_td'></td>" +
				"<td class='" + (grey ? "grey" : "") + "' id='ff_arc_"+i+"_td'></td>" +
				"<td>" + (i == 5 ? "<button class='storebtn' id='ff_mode' onclick='ff.switchMode()' style='font-size: 18px'></button>" : "") + "</td>" +
				"<td class='" + (!grey ? "grey" : "") + "' id='ff_arc_"+ni+"_td'></td>" +
				"<td id='ff_pk_"+ni+"_td'></td></tr>"
		}
		el("ff_table").innerHTML = html

		for (var i = 1; i <= 18; i++) {
			el("ff_arc_"+i+"_td").innerHTML = '<button class="ff_btn" id="ff_arc_'+i+'" onclick="ff.choose('+i+', \'arc\')"><b id="ff_arc_'+i+'_name"></b><br><span id="ff_arc_'+i+'_eng"></span></button>'
			el("ff_pk_"+i+"_td").innerHTML = '<button class="fluctuatebtn" id="ff_pk_'+i+'" onclick="ff.choose('+i+', \'perk\')"><b id="ff_pk_'+i+'_name"></b><br><span id="ff_pk_'+i+'_desc"></span><span id="ff_pk_'+i+'_pow"></span></button>'
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
		return Math.pow((2.5 * (x - 1) + 1) / 3, 0.6)
	},
	canArc(x) {
		if (!ff.arcUnl(x)) return
		if (ff.unspent() < ff.arcCost(ff_tmp.choose.x) - ff.arcCost(ff_tmp.choose.x, false)) return
		if (ff_tmp.linked_2[x] != undefined) return
		if (ff_tmp.choose.x != undefined) return ff_tmp.choose.a.includes(x)
		if (ff_tmp.linked[Math.ceil(x / 3)] != undefined) return
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
				r.push(ff.wrap(s - n))
				n += j
			}
			if ((!nx || nx > 0) && m == 0) {
				r.push(s)
				m = 1
			}
			if (j > 0) {
				p += j
				r.push(ff.wrap(s + p))
			}
		}
		return r
	},
	wrap: (x) => ((x - 1) % 18) + 1,

	powerStr(x) {
		var r = 0
		for (var i = 0; i < 3; i++) r += ff_tmp.linked_2[x * 3 - i] !== undefined ? 1 : 0
		return r
	},

	perkPos(x) {
		return ff_tmp.pos[x]
	},
	perkEff(x) {
		return ff_tmp.eff[x]
	},
	perkActive(x) {
		return ff_tmp.pow && ff_tmp.pow[x]
	},
	perkShown(x) {
		return ff_tmp.shown.includes(x)
	},

	respec() {
		if (!confirm("This will perform a Quantum reset and reset this mechanic entriely. Are you sure?")) return
		ff_save.data = []
		ff.updateTmp()
		ff.updateDisplays()
		restartQuantum()
	},
	choose(x, mode) {
		if (mode == "arc" && ff_save.mode == 0) {
			var c = ff_tmp.choose.x
			if (c != undefined && ff_tmp.pos[x] == c) {
				delete ff_tmp.choose.x
				ff.updateChooseTmp()
			} else if (c != undefined) {
				if (!ff.canArc(x, c)) return
				var d = ff_save.data[c]
				var a = ff.calcArc(d)
				if (x < a[0]) d[2] = [x - a[0]].concat(d[2])
				else d[2].push(x - a[a.length-1])
				ff.updateTmp()
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
			if (p == undefined) return
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
			el("ff_pk_"+x+"_desc").textContent = newV ? evalData(ff.data[name].desc) : ""
			ff.updateTmp()
			restartQuantum()
		}
	},
	switchMode(update) {
		if (!tmp.ngp3) return
		if (!update) ff_save.mode = (ff_save.mode + 1) % 2
		el("ff_mode").textContent = "Mode: " + ff.data.modes[ff_save.mode]

		if (ff_save.mode == 1 && ff_tmp.choose.x != undefined) {
			ff_tmp.choose.x = 0
			ff.updateDisplays()
		}
	},
	
	exportPreset() {
		let str = ""
		let letters = " abcdefghijklmnopqrstuvwxyz"
		for (var i = 0; i < ff_save.data.length; i++) {
			let d = ff_save.data[i]
			str += letters[d[0]] + letters[d[1] || 0]
			for (var i = 0; i < d[2].length; i++) {
				let s = d[2][i]
				if (s < 0) str += letters[-s]
				else str += letters[s]
			}
			str += "|"
		}

		copyToClipboard(str)
	},
	importPreset() {
		alert("Coming soon...")
	}
}
let ff_tmp = {}
let ff_save
let FLUCTUANT_FIELD = ff

/* TO DO:
	1. OVERLAP ARCS.
	2. MULTIPLE DISTANCES.
	3. DISTANCE 4.
*/