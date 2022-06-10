let pos = {
	unl: () => tmp.ngp3 && mTs.has("d7"),
	setup() {
		return {
			unl: 0,
			res: [1],
			time: 5,
			line: [1,2,3,4],
			upgs: [0,0,0]
		}
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