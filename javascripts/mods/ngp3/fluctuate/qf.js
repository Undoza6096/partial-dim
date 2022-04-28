let QF = {
	unl() {
		return false
	},
	setup() {
		return {
			reduce: 0,
			charges: [ E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0), E(0) ],
			directs: {}
		}
	},
	shown() {

	},

	active(x) {
		return QF.unl() && QF.eff(x) !== undefined
	},
	eff(x) {
		return QF_tmp && QF_tmp.new_eff && QF_tmp.new_eff[x]
	},

	rows() {
		let r = 3
		return r
	},
	data: {
		1: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
		2: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
		3: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
		4: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
		5: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
		6: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
		7: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
		8: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
		9: {
			eff: (x) => 1,
			desc: (x) => "Boost something by " + shorten(x) + ".",
		},
	}
}
let QUANTUM_FIELD = QF
let QF_tmp = {}