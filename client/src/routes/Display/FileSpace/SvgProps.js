const w = 1200;
const h = 600;
const scale = .25;

const data = {
	WIDTH: w,
	HEIGHT: h,
	VIEWBOX: {
		x: w*scale,
		y: h*scale
	},
	INIT_POSITION: {
		x: 120*scale,
		y: 120*scale
	},
	MASTERSIZE: 40*scale,
	SUBSIZE: 20*scale,
	DISPOSITION: {
		Ms_x: 140*scale,
		M2S_x: 60*scale,
		M2S_y: 80*scale,
		Ss_y : 40*scale
	}
}

export let
	WIDTH = data.WIDTH,
	HEIGHT = data.HEIGHT,
	VIEWBOX = data.VIEWBOX,
	INIT_POSITION = data.INIT_POSITION,
	MASTERSIZE = data.MASTERSIZE,
	SUBSIZE = data.SUBSIZE,
	DISPOSITION = data.DISPOSITION;