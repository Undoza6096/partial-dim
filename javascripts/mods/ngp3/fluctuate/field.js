//FLUCTUANT FIELD
let ff = {
	unl: (force) => force ? fluc.unl() : ff_tmp.unl && ff_tmp.eff,

	data: {
		all: ["alt", "pow", "free", "syn", "upg", "share"],
		alt: {
			req: 1,
			desc: "Increases the altitudes."
		},
		pow: {
			req: 2,
			desc: "Multiplies the power gain."
		},
		free: {
			req: 3,
			desc: "Decreases the power requirement."
		},
		syn: {
			req: 6,
			desc: "Strengthens Strings by altitudes."
		},
		upg: {
			req: 7,
			desc: "Unlocks a new power."
		},
		share: {
			req: 10,
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
	},
}
let ff_tmp = {}
let ff_save
let FLUCTUANT_FIELD = ff