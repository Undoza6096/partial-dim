//FLUCTUANT FIELD
let ff = {
	unl: (force) => force ? fluc.unl() : ff_tmp.unl && ff_tmp.eff,

	data: {
		all: ["alt", "pow", "free", "syn", "upg", "share"],
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
			perks: {} //{1: "alt", 2: "pow"}
		}
		fluc_save.ff = ff_save
		return ff_save
	},
	compile() {
		ff_tmp = { unl: this.unl(true) }
		if (!tmp.ngp3) return

		var data = ff_save || this.setup()

		this.updateTmp()
	},
	reset() {
		ff_save = {
			arcs: {}, //{1: [1, 4], 2: [1, 3]}
			perks: {} //{1: "alt", 2: "pow"}
		}
		ff.updateTmp()
	},

	update(diff) {
	},
	updateTmp() {
		ff_tmp = {
			unl: ff_tmp.unl
		}
		ff.updateTmpOnTick()
	},
	updateTmpOnTick() {
		if (!ff_tmp.unl) return
	},

	updateTab() {
	},
	updateDisplays() {
		for (var i = 1; i <= 6; i++) {
			var unl = fluc_save.energy >= ff.data.reqs[i]
			el("ff_arc_"+i).className = unl ? "ff_btn" : "unavailablebtn"
			//el("ff_arc_"+i+"title").textContent = unl ? "Position" + i : "Locked"
			//el("ff_arc_"+i+"cost").textContent = unl ? "(Cost: 1 FE)" : "(requires " + ff.data.reqs[i] + " FE)"

			var pk = ff_save.perks[i]
			el("ff_perk_"+i).className = unl ? "ff_btn" : "unavailablebtn"
			el("ff_perk_"+i+"_name").textContent = pk ? ff.data[pk].title : "None"
			el("ff_perk_"+i+"_desc").textContent = pk ? ff.data[pk].desc : ""
		}
	},
}
let ff_tmp = {}
let ff_save
let FLUCTUANT_FIELD = ff