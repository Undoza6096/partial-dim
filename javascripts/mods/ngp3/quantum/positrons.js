let pos = {
	unl: () => tmp.ngp3 && mTs.has("d7"),
	setup() {
		return {
			s: []
		}
	},

	order: ["r1", "b1", "b2", "b3", "r2", "b4", "r3"],
	boosts: {
		1: {
			name: "???",
			eff: () => new Decimal(1),
			desc: (x) => shorten(x),
		},
		2: {
			name: "???",
			eff: () => new Decimal(1),
			desc: (x) => shorten(x),
		}
	},
	res: {
		1: {
			name: "Placeholder",
			res: () => new Decimal(0),
		},
		2: {
			name: "Placeholder",
			res: () => new Decimal(0),
		}
	}
}