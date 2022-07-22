const frames = [];

function readFile(g) {
	const f = new FileReader();
	f.readAsDataURL(g.files[0]);
	f.onloadend = async function(e) {
        const type = e.target.result.split(",")[0].split(";")[0].split(":")[1];
        if (type == "image/gif") {
            const gifframes = await gifFrames({ url: e.target.result, frames: 'all', outputType: 'canvas' });
            console.log(gifframes);
            gifframes.forEach(frame => {
                const b64 = frame.getImage().toDataURL();
				frames.push(b64);
				const imglist = document.getElementById("imgs");
				const newImage = document.createElement("IMG");
				newImage.src = b64;
				newImage.width = "64";newImage.height = "64";
				newImage.className = "img";
				newImage.id = frame.frameIndex;
				imglist.appendChild(newImage);

				const te = document.createElement("INPUT");
				te.type = "text";
				te.value = Math.ceil(20 * frame.frameInfo.delay / 100);
				te.style.width = "64px";
				document.getElementById("fps").appendChild(te);
            });
        }
		else {
            const b64 = e.target.result;
            frames.push(b64);
            const imglist = document.getElementById("imgs");
            const newImage = document.createElement("IMG");
            newImage.src = b64;
            newImage.width = "64";
			newImage.height = "64";
            newImage.className = "img";
            imglist.appendChild(newImage);

            const te = document.createElement("INPUT");
            te.type = "text";
            te.value = "20";
            te.style.width = "5em";
            document.getElementById("fps").appendChild(te);
        }
	};
}

function generate() {
	const canvas = document.getElementById("c");
	const ctx = canvas.getContext("2d");
	const imgs = document.getElementById("imgs").getElementsByTagName("IMG");
	let max = 0;
	for (let i = 0; i != imgs.length; i++) {
		if (imgs[i].naturalWidth > max)max = imgs[i].naturalWidth;
	}
	canvas.width = max;
	canvas.height = max * imgs.length;
	ctx.imageSmoothingEnabled = false;
	for (let i = 0; i != imgs.length; i++) {
        ctx.drawImage(imgs[i], 0, i * max);
		ctx.drawImage(imgs[i], 0, max * i, max, max);
	}
	document.getElementById("links").style.display = "inline";
	const b64 = canvas.toDataURL();
	document.getElementById("pngd").href = b64;
	document.getElementById("mcmeta").href = "data:text/plain;charset=utf-8," + createMCMETA();
	document.getElementById("pngd").download = document.getElementById("tname").value + ".png";
	document.getElementById("mcmeta").download = document.getElementById("tname").value + ".png.mcmeta";
}

function createMCMETA() {
    const start = '{"animation":{"frames": [';

	const frameBase = '{"index": ';
	const frameMid = ', "time": ';
	const frameEnd = '},';

	let res = start;

	const fpss = document.getElementById("fps").getElementsByTagName("INPUT");
	for (let i = 0; i != fpss.length; i++) {
		let tmp = frameBase;
		tmp += i;
		tmp += frameMid;
		tmp += fpss[i].value;
		tmp += frameEnd;
		res += tmp;
	}
	res = res.substring(0, res.length - 1);
	res += "]}}";
	return res;
}