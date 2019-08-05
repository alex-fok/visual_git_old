const w = 1200;
const h = 600;
const scale = 1;

const data = {
	WIDTH: w,
	HEIGHT: h,
	VIEWBOX: {
		x: w*scale,
		y: h*scale
	},
	INIT_POSITION: {
		x: w*.1*scale,
		y: w*.1*scale
	},
	MASTERSIZE: w*.034*scale,
	SUBSIZE: w*.0167*scale,
	DISPOSITION: {
		Ms_x: w*.1*scale,
		M2S_x: w*.05*scale,
		M2S_y: w*.0834*scale,
		Ss_y : w*.0334*scale
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