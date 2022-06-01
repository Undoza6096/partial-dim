let pos = {
	unl: () => tmp.ngp3 && mTs.has("d7"),
	setup() {
		return {
			unl: 0,
			ignore: { 3: true, 4: true },
			charge: 0,
			supercharge: {}
		}
	},

	unlock(x) {
		
	},
	supercharge(x) {
		
	},
	ignore(x) {
		
	},

	charge() {
		return 0
	},

	boosts: [
		null,
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		},
		{
			eff: () => new Decimal(1),
			desc: (x) => "Boost something by " + shorten(x) + "x",
		}
	],
	res: [
		null,
		{
			name: "Galaxies",
			res: () => player.galaxies,
		},
		{
			name: "Replicated Galaxies",
			res: () => player.replicanti.galaxies,
		},
		{
			name: "Tachyonic Galaxies",
			res: () => player.dilation.freeGalaxies,
		},
		{
			name: "Meta-Dimension Boosts",
			res: () => player.meta.resets,
		},
		{
			name: "Quantum Energy",
			res: () => player.quantum.quarkEnergy,
		}
	]
}