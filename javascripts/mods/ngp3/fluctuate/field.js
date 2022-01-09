//FLUCTUANT FIELD
let ff = {
	unl: (force) => force ? fluc.unl() : ff_tmp.unl && ff_tmp.eff,

	data: {
	},

	setup() {
		ff_save = {
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