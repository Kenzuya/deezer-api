import { UserMetadata } from "./Types/UserMetadata";
import { PageSearchResults } from "./Types/PageSearch";
import { DirectURL } from "./Types/DirectURL";
import Blowfish from "egoroof-blowfish";
import fetch from "node-fetch";
import md5 from "blueimp-md5";
import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import os from "os";
import mime from "mime-types";
import FileType from "file-type";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { randomBytes, getRandomValues } from "crypto";
import { SongMetadata } from "./Types/SongMetadata";
// import ffmetadata from "ffmetadata";

// import Node
enum Quality {
	STANDARD = "STANDARD",
	HIGH = "HIGH",
	LOSSLESS = "LOSSLESS",
}

enum Qualities {
	FLAC = "FLAC",
	MP3_320 = "MP3_320",
	MP3_128 = "MP3_128",
}
type QUALITY = "FLAC" | "MP3_320" | "MP3_128";
interface Metadata {
	input: string;
	image: string;
	title?: string;
	output: string;
	album_artist?: string;
	track?: number;
	album?: string;
	year?: number | string;
	genre?: string;
}
class DeezerSong {
	private readonly api_token: string;
	private readonly COOKIE: string;
	constructor(API_TOKEN: string, cookie: string) {
		this.api_token = API_TOKEN;
		this.COOKIE = cookie;
	}
	async getListData(songId: string) {
		// console.log();
		const response = await fetch(
			`https://www.deezer.com/ajax/gw-light.php?method=song.getListData&input=3&api_version=1.0&api_token=${
				this.api_token
			}&cid=${Math.floor(1e9 * Math.random())}`,
			{
				method: "POST",
				body: JSON.stringify({ sng_ids: [songId] }),
				headers: {
					Cookie: this.COOKIE,
				},
			},
		);
		return (await response.json()) as SongMetadata;
	}
}

class DeezerAPI {
	constructor() {
		return this;
	}
	public async getTrackMetadata(songId: string) {
		const response = await fetch(`https://api.deezer.com/track/${songId}`);
		const json = await response.json();
		// await Bun.write("./TrackMetadata.json", JSON.stringify(json, null, 2));
		return json;
		// this.song.jembud
		// this.song.getListData()
	}
}
class Deezer {
	private api_token: string;
	private cookie: string;
	private license_token: string;
	public readonly Quality = Quality;
	private directURL: string;
	private arrayBuffer: ArrayBuffer | undefined;
	public song: DeezerSong;
	public api: DeezerAPI;
	private metadata: Metadata;
	private readonly tmpdir: string;
	private songId: string;
	constructor(
		API_TOKEN: string,
		LICENSE_TOKEN: string,
		COOKIE = "dzr_uniq_id=dzr_uniq_id_fr6acff7d6b5cefada86323f6d1f92c4cd4cea4e; euconsent-v2=CPhYGzmPhYGzmA7ACBENCkCsAP_AAH_AAAqIJDtd_H__bW9r-f5_aft0eY1P9_r37uQzDhfNk-8F3L_W_LwX52E7NF36tq4KmR4ku1LBIUNlHMHUDUmwaokVryHsak2cpzNKJ7BEknMZOydYGF9vmxtj-QKY7_5_d3bx2D-t_9v239z3z81Xn3d53-_03LCdV5_9Dfn9fR_bc9KPt_58v8v8_____3_e__3_7994JEAEmGrcQBdmWODNoGEUCIEYVhIVQKACCgGFogMAHBwU7KwCfWECABAKAIwIgQ4AowIBAAAJAEhEAEgRYIAAARAIAAQAIhEIAGBgEFgBYGAQAAgGgYohQACBIQZEBEUpgQFQJBAa2VCCUF0hphAHWWAFBIjYqABEEgIrAAEBYOAYIkBKxYIEmKN8gBGCFAKJUK1EAAAA.flgAAAAAAAAA; noIabVendors=[1]; G_ENABLED_IDPS=google; arl=3a176a6a96d00941ce8c0985c2204a73122a59e3e982e18e478f5311785e890effb983049094e488aeacabaf5d4c443c9a6914e39957ca84a7e1f1ad6f6f56e83ac3a1cf4c4ded66be0375a118d69963b0cc52c71b34d17d7c9d46c72f467468; comeback=1; familyUserId=5129914982; sid=fr668ae57a6011e2295e60b1d9541f1df72a5dee; _abck=E4219B0328F87AC3B77A2C75C2F0887D~0~YAAQz6wwF4CV5cmDAQAAEwzXGAjd1wieCkdwoHsFAkCbDxsu+r9ARG405oJb1wfEPReK/CWsFwinjMqKMtbZB1AJDK42LJCtCTI3q47i4krJ4liYLk+MVjf4oNsHDF4LB6jGJH4t13XOyqEZrm2qjXIcZVhVpdI+LAtSxlWbIe+nFu0QEtnZssg3/D1ylOOubcDXxLjOeLXtTiX4XsV1wUzPxkhNbwMqA86DU7EOlsuku9iPMspLyIRtOJzn1qzDsk+C7AxVFARIQO18auvj6ra7bMF5CnO90x2SqWwVjfYsvJ2tH/1B3hhBwz8tAHZ1GcfzMpaA4fnZVCr8RjhZxgyjLPH+aAXUqP9x86lmVSXvAPbH3UV7uUEka0hx8oDzmg1mrfzvl75I392pPDt0sNpAgao/CTav~-1~-1~-1; ak_bmsc=4BEF5913028A2D3F89DD59AC85F3FCE8~000000000000000000000000000000~YAAQz6wwF4GV5cmDAQAAEwzXGBFzjFH2YOS+fvqdjmMeWpyJcA5cWMMjQWaBk8G+1bbWxBeXPD/l56y4/rh8R/hrRhzj1iUAAc4Jpo2YMupuKYWPRj6SdcdwQ1pSVJ7Q0SrBfgqzVfJRtzHeqF71v/mstz2982qH5xAM4XFshjSHP6arkOaOuhBCSIdneZn+jW2SA+TzpGHO/kpe8Iq9YqXC8PdQHzr1nAWITnAaoQwJn0vLYqPX6G8ZN07+lEXkvxq7hNLI1ktK08OEAbyUjzjMR+68UHGcWnX+OyZg9r1fsSk4y05JUHt3HHIPwQiFGhdyGnM0a6+OmMD65i0Sc8niL1+OO3yzdqrmBhpE5/akbrOHjig56AGDBSmfP+CZvSSHRT7WFY1oV6w=; bm_sz=65886ADEC734109749F5E9D3B79E24AB~YAAQz6wwF4KV5cmDAQAAEwzXGBEzlkcBmUi2MtHHT17VMQ84PdR0cAD5qNG2Nf/145CP8YoEmUPscBhCChTbLLhA+MXbkQpzs8vWHPTcSt8+PauE8uVuXTs8ckej8W+5EM1+ygOOruFKgmt+v5AEwwUoUUhHvO1/OReE9UZY2IbUDyC+EgmdOmtlrcoAIU2PiXU7Hlr1peYgOUVdqG8YYl6kV0g3SV66Hkr1Pf5UP5eJnYwO5nlCfv6+Cj8zVllgrXMobj+tfymoAzeJ8abSK0sMrDiCOy9uXpS018NJi7+5Ixk=~4407620~3422530; ab.storage.deviceId.5ba97124-1b79-4acc-86b7-9547bc58cb18=%7B%22g%22%3A%22e42e6fd5-118e-1b38-570d-d145316910ef%22%2C%22c%22%3A1666609499986%2C%22l%22%3A1666864063784%7D; ab.storage.userId.5ba97124-1b79-4acc-86b7-9547bc58cb18=%7B%22g%22%3A%225129914982%22%2C%22c%22%3A1666609500023%2C%22l%22%3A1666864063785%7D; ab.storage.sessionId.5ba97124-1b79-4acc-86b7-9547bc58cb18=%7B%22g%22%3A%2257e5ac97-f45a-887a-606a-675665194157%22%2C%22e%22%3A1666866961744%2C%22c%22%3A1666864063782%2C%22l%22%3A1666865161744%7D; consentMarketing=1; consentStatistics=1; bm_mi=260569D073A5ADD777D39B78D4B514F0~YAAQrKzbFwJ0h+eDAQAADp4EGRFc2RJZ07+gSrsAXXCHCDsgvdfJux2Md7utkCPBIyRATYL3b87rT9UWpXszyL5J0sfKFM/Ssbp9pCksAWOltgsW69C6elbr+NZHr/+19DJ8u2SPQGPJYohT9O7fgiWo0GTq1x4TziZGscL3niCvyt322gesedm20y+D/8NjuU1FGF8g828MF4lnXWCrJrBMIIb3pFkhBhL2Q/DpPjqGECcmFWdVfSVPh/zxh1LZlMbRrw+oyop1rmsTVw+kuZKdda+M5Kn49SQBtnf/8iXH4VhexER08aqqU12mxUcbFg==~1; bm_sv=7C2F730FE7D8E39AB25D4F9FF7996E7A~YAAQrKzbFwN0h+eDAQAADp4EGRHDPqZ5MseuwsP6TwaBIL6+UkXDyC3/aVJvD4NfaxFFRdVkO/z0eYX47tFmRRvAqhWmKEX/DWIXAjuAlmmarYOBHMpNBNL049OS7nUyoQGhhQFiN+FVlJqteMCwvaW3Z3iLBpYDG17oSBKb3wdfkSXB7aPqX6wysaPBD/KlfnfpO54HUlQ98PezPm2p/WKxNYpVmWgZUEG/6X0HST8cNHovgqh1gblNNQ3A6UvFXw==~1",
		TEMPDIR = './Temp'
	) {
		this.api_token = API_TOKEN;
		this.cookie = COOKIE;
		this.license_token = LICENSE_TOKEN;
		this.song = new DeezerSong(API_TOKEN, COOKIE);
		this.api = new DeezerAPI();
		this.tmpdir = TEMPDIR
	}
	async getUserData() {
		const response = await fetch(
			`https://www.deezer.com/ajax/gw-light.php?method=deezer.getUserData&input=3&api_version=1.0&api_token=&cid=${Math.floor(
				1e9 * Math.random(),
			)}`,
			{
				body: JSON.stringify({}),
				method: "POST",
				headers: {
					// "x-deezer-user": "5129914982",
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
					Cookie: this.cookie,
					// referer: "https://www.deezer.com/search/oplosan"
				},
			},
		);
		const json: UserMetadata = (await response.json()) as UserMetadata;
		this.api_token = json.results.checkForm;
		this.license_token = json.results.USER.OPTIONS.license_token;
		return json;
	}
	async search(query: string) {
		await this.checkData();
		if (query.length < 1) { throw new TypeError("Please type query correctly! "); }
		const response = await fetch(
			`https://www.deezer.com/ajax/gw-light.php?method=deezer.pageSearch&input=3&api_version=1.0&api_token=${
				this.api_token
			}&cid=${Math.floor(1e9 * Math.random())}`,
			{
				headers: {
					// "x-deezer-user": "5129914982",
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
					Referer: encodeURIComponent(query),
					Cookie: this.cookie,
				},
				method: "POST",
				body: JSON.stringify({
					query,
					artist_suggest: false,
					start: 0,
					nb: 40,
					suggest: true,
					top_tracks: true,
				}),
			},
		);
		const res: PageSearchResults = (await response.json()) as PageSearchResults;
		return res;
	}
	async getDirectURL(TRACK_TOKEN: string, format: Required<QUALITY>) {
		await this.checkData();
		const response = await fetch("https://media.deezer.com/v1/get_url", {
			body: JSON.stringify({
				license_token: this.license_token,
				media: [
					{
						type: "FULL",
						formats: [
							{ cipher: "BF_CBC_STRIPE", format },
							// { cipher: "BF_CBC_STRIPE", format: "MP3_320" }
							// { cipher: "BF_CBC_STRIPE", format: "MP3_128" }
							// { cipher: "BF_CBC_STRIPE", format: "MP3_64" }
							// { cipher: "BF_CBC_STRIPE", format: "MP3_MISC" }
						],
					},
				],
				track_tokens: [TRACK_TOKEN],
			}),
			method: "POST",
		});
		const json = (await response.json()) as DirectURL;
		// json.data[]
		this.directURL = json.data[0].media[0].sources[0].url;
		return json;
	}
	private async checkData() {
		if (!(this.api_token || this.license_token)) {
			await this.getUserData();
		} else if (!this.api_token) {
			await this.getUserData();
		} else if (!this.license_token) {
			await this.getUserData();
		}
		return true;
	}
	private xor(one: string, two: string, three: string) {
		let result = "";
		let i = 0;
		while (i < 16) {
			let char = one.charCodeAt(i);
			char ^= two.charCodeAt(i);
			char ^= three.charCodeAt(i);
			result += String.fromCharCode(char);
			i++;
		}
		return result;
	}
	private generateKey(songId: string) {
		const hash = md5(songId.toString());
		const firstMd5Half = hash.substr(0, 16);
		const secondMd5Half = hash.substr(16, 16);
		const salt = "g4el58wc0zvf9na1";

		return this.xor(salt, firstMd5Half, secondMd5Half);
	}
	public decrypt(songId = this.songId, arrayBuffer = this.arrayBuffer) {
		if (!(this.arrayBuffer || arrayBuffer)) {
			throw new Error("ArrayBuffer is undefined");
		}
		const source = new Uint8Array(arrayBuffer);
		const dest = new Uint8Array(source.length);
		const key = this.generateKey(songId);
		const intervalChunk = 3;
		const chunkSize = 2048;
		const chunkCount = Math.ceil(source.length / chunkSize);
		const bf = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
		bf.setIv(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]));

		let i = 0;
		while (i < chunkCount) {
			const usedChunksSize = i * chunkSize;
			const currentChunkSize = Math.min(
				chunkSize,
				source.length - usedChunksSize,
			);
			let buffer = source.subarray(
				usedChunksSize,
				usedChunksSize + currentChunkSize,
			);
			if (i % intervalChunk === 0 && buffer.length === chunkSize) {
				buffer = bf.decode(buffer, Blowfish.TYPE.UINT8_ARRAY);
			}
			dest.set(buffer, usedChunksSize);
			i++;
		}
		this.arrayBuffer = dest.buffer;
		return dest.buffer;
	}
	public async getCoverImages(id: string) {
		const response = await fetch(
			`https://e-cdns-images.dzcdn.net/images/cover/${id}/264x264-000000-80-0-0.jpg`,
		);
		const images = await response.arrayBuffer();
		// await Bun.write("./image.jpg", images);
		return images;
	}
	// static Quality: QUALITY
	public async download(songId: string, format: Required<QUALITY>) {
		const error_message = 'Please type correctly for second arguments. Available option is "FLAC", "MP3_320" or "MP3_128"'
		if(format !== "FLAC") {
			new TypeError(error_message)
		} 
		if (format !== "MP3_320") {
			new TypeError(error_message)
		}
		if (format !== "MP3_128") {
			new TypeError(error_message)
		}
		const metadata = await this.song.getListData(songId)
		const directURL = await this.getDirectURL(metadata.results.data[0].TRACK_TOKEN, format) 
		const response = await fetch(directURL.data[0].media[0].sources[0].url);
		const arrayBuffer = await response.arrayBuffer();
		this.songId = songId
		this.arrayBuffer = arrayBuffer;
		
		return arrayBuffer;
	}
	public async save(
		path: string,
		arrayBuffer = this.arrayBuffer,
		// extension = true,
	) {
		if (!(this.arrayBuffer || arrayBuffer)) {
			throw new Error("ArrayBuffer is undefined");
		}
		const metadata = await this.song.getListData(this.songId)
		const imageBuffer = await this.getCoverImages(metadata.results.data[0].ALB_PICTURE)
		console.log('Saving image...');
		
		const imageDirectory = await this.saveToTempDirectory(imageBuffer)
		console.log('Saving audio files');
		
		const songDirectory = await this.saveToTempDirectory(this.arrayBuffer)
		this.metadata = {
			input: songDirectory,
			output: path,
			image: imageDirectory,
			title: metadata.results.data[0].SNG_TITLE,
			album: metadata.results.data[0].ALB_TITLE,
			album_artist: metadata.results.data[0].ART_NAME,
			track: parseInt(metadata.results.data[0].TRACK_NUMBER),
			year: parseInt(metadata.results.data[0].PHYSICAL_RELEASE_DATE.split('-')[0]),

		}
		function removeFiles() {
			fs.unlinkSync(imageDirectory)
			fs.unlinkSync(songDirectory)
		}
		const isSuccess = this.assignMetadata(this.metadata)
		removeFiles()
		// if (extension) {
		// 	const filetype = await FileType.fromBuffer(arrayBuffer);
		// 	if (!filetype) { throw new Error("File is corrupted or undecrypted..."); }
		// 	fs.writeFileSync(
		// 		`${pathToSaveFile}.${filetype.ext}`,
		// 		Buffer.from(this.arrayBuffer),
		// 	);
		// } else { fs.writeFileSync(pathToSaveFile, Buffer.from(this.arrayBuffer)); }
		// Bun.write(pathToSaveFile, arrayBuffer).finally(() => (this.arrayBuffer = undefined));

		// this
	}
	private async saveToTempDirectory(arrayBuffer: ArrayBuffer): Promise<string> {
		const {ext} = await FileType.fromBuffer(arrayBuffer)
		const savedDirectory = path.resolve(this.tmpdir, `${randomBytes(10).toString('hex')}.${ext}`)
		fs.writeFileSync(savedDirectory, Buffer.from(arrayBuffer))
		return savedDirectory
	}
	public assignMetadata(options: Metadata): boolean {
		const source = `-i ${options.input}`;
		const image = `-i ${options.image}`;
		const args = "-map 0:a -map 1 -codec copy";
		const title = `-metadata title="${options.title}"`;
		const album = `-metadata album="${options.album}"`;
		const album_artist = `-metadata album_artist="${options.album_artist}"`;
		const track = `-metadata track="${options.track}"`;
		const year = `-metadata year=${options.year}`;
		const additional_args = "-disposition:v attached_pic";
		const output = `"${options.output}"`;
		const cmd = ["ffmpeg", source, image, args];
		if (options.title) {
			cmd.push(title);
		}
		if (options.album) {
			cmd.push(album);
		}
		if (options.album_artist) {
			cmd.push(album_artist);
		}
		if (options.track) {
			cmd.push(track);
		}
		if (options.year) {
			cmd.push(year);
		}
		cmd.push(additional_args);
		cmd.push(output);
		// const tmpdir = path.resolve(process.cwd(), "Temp", randomBytes(10).toString());
		// const filetype = await FileType.fromBuffer(this.arrayBuffer);
		// if (!filetype) throw new Error("File is corrupted or undecrypted...");
		// await this.save(tmpdir);
		// const ffmpeg = createFFmpeg({ log: true });
		// await ffmpeg.load();
		// ffmpeg.FS('')
		// const data = await FileType.fromBuffer(this.arrayBuffer);
		try {
			execSync(cmd.join(" "));
			return true
		} catch (err) {
			return false
		}
	}

	public static async instantiate(
		cookie = "dzr_uniq_id=dzr_uniq_id_fr6acff7d6b5cefada86323f6d1f92c4cd4cea4e; euconsent-v2=CPhYGzmPhYGzmA7ACBENCkCsAP_AAH_AAAqIJDtd_H__bW9r-f5_aft0eY1P9_r37uQzDhfNk-8F3L_W_LwX52E7NF36tq4KmR4ku1LBIUNlHMHUDUmwaokVryHsak2cpzNKJ7BEknMZOydYGF9vmxtj-QKY7_5_d3bx2D-t_9v239z3z81Xn3d53-_03LCdV5_9Dfn9fR_bc9KPt_58v8v8_____3_e__3_7994JEAEmGrcQBdmWODNoGEUCIEYVhIVQKACCgGFogMAHBwU7KwCfWECABAKAIwIgQ4AowIBAAAJAEhEAEgRYIAAARAIAAQAIhEIAGBgEFgBYGAQAAgGgYohQACBIQZEBEUpgQFQJBAa2VCCUF0hphAHWWAFBIjYqABEEgIrAAEBYOAYIkBKxYIEmKN8gBGCFAKJUK1EAAAA.flgAAAAAAAAA; noIabVendors=[1]; G_ENABLED_IDPS=google; arl=3a176a6a96d00941ce8c0985c2204a73122a59e3e982e18e478f5311785e890effb983049094e488aeacabaf5d4c443c9a6914e39957ca84a7e1f1ad6f6f56e83ac3a1cf4c4ded66be0375a118d69963b0cc52c71b34d17d7c9d46c72f467468; comeback=1; familyUserId=5129914982; sid=fr668ae57a6011e2295e60b1d9541f1df72a5dee; _abck=E4219B0328F87AC3B77A2C75C2F0887D~0~YAAQz6wwF4CV5cmDAQAAEwzXGAjd1wieCkdwoHsFAkCbDxsu+r9ARG405oJb1wfEPReK/CWsFwinjMqKMtbZB1AJDK42LJCtCTI3q47i4krJ4liYLk+MVjf4oNsHDF4LB6jGJH4t13XOyqEZrm2qjXIcZVhVpdI+LAtSxlWbIe+nFu0QEtnZssg3/D1ylOOubcDXxLjOeLXtTiX4XsV1wUzPxkhNbwMqA86DU7EOlsuku9iPMspLyIRtOJzn1qzDsk+C7AxVFARIQO18auvj6ra7bMF5CnO90x2SqWwVjfYsvJ2tH/1B3hhBwz8tAHZ1GcfzMpaA4fnZVCr8RjhZxgyjLPH+aAXUqP9x86lmVSXvAPbH3UV7uUEka0hx8oDzmg1mrfzvl75I392pPDt0sNpAgao/CTav~-1~-1~-1; ak_bmsc=4BEF5913028A2D3F89DD59AC85F3FCE8~000000000000000000000000000000~YAAQz6wwF4GV5cmDAQAAEwzXGBFzjFH2YOS+fvqdjmMeWpyJcA5cWMMjQWaBk8G+1bbWxBeXPD/l56y4/rh8R/hrRhzj1iUAAc4Jpo2YMupuKYWPRj6SdcdwQ1pSVJ7Q0SrBfgqzVfJRtzHeqF71v/mstz2982qH5xAM4XFshjSHP6arkOaOuhBCSIdneZn+jW2SA+TzpGHO/kpe8Iq9YqXC8PdQHzr1nAWITnAaoQwJn0vLYqPX6G8ZN07+lEXkvxq7hNLI1ktK08OEAbyUjzjMR+68UHGcWnX+OyZg9r1fsSk4y05JUHt3HHIPwQiFGhdyGnM0a6+OmMD65i0Sc8niL1+OO3yzdqrmBhpE5/akbrOHjig56AGDBSmfP+CZvSSHRT7WFY1oV6w=; bm_sz=65886ADEC734109749F5E9D3B79E24AB~YAAQz6wwF4KV5cmDAQAAEwzXGBEzlkcBmUi2MtHHT17VMQ84PdR0cAD5qNG2Nf/145CP8YoEmUPscBhCChTbLLhA+MXbkQpzs8vWHPTcSt8+PauE8uVuXTs8ckej8W+5EM1+ygOOruFKgmt+v5AEwwUoUUhHvO1/OReE9UZY2IbUDyC+EgmdOmtlrcoAIU2PiXU7Hlr1peYgOUVdqG8YYl6kV0g3SV66Hkr1Pf5UP5eJnYwO5nlCfv6+Cj8zVllgrXMobj+tfymoAzeJ8abSK0sMrDiCOy9uXpS018NJi7+5Ixk=~4407620~3422530; ab.storage.deviceId.5ba97124-1b79-4acc-86b7-9547bc58cb18=%7B%22g%22%3A%22e42e6fd5-118e-1b38-570d-d145316910ef%22%2C%22c%22%3A1666609499986%2C%22l%22%3A1666864063784%7D; ab.storage.userId.5ba97124-1b79-4acc-86b7-9547bc58cb18=%7B%22g%22%3A%225129914982%22%2C%22c%22%3A1666609500023%2C%22l%22%3A1666864063785%7D; ab.storage.sessionId.5ba97124-1b79-4acc-86b7-9547bc58cb18=%7B%22g%22%3A%2257e5ac97-f45a-887a-606a-675665194157%22%2C%22e%22%3A1666866961744%2C%22c%22%3A1666864063782%2C%22l%22%3A1666865161744%7D; consentMarketing=1; consentStatistics=1; bm_mi=260569D073A5ADD777D39B78D4B514F0~YAAQrKzbFwJ0h+eDAQAADp4EGRFc2RJZ07+gSrsAXXCHCDsgvdfJux2Md7utkCPBIyRATYL3b87rT9UWpXszyL5J0sfKFM/Ssbp9pCksAWOltgsW69C6elbr+NZHr/+19DJ8u2SPQGPJYohT9O7fgiWo0GTq1x4TziZGscL3niCvyt322gesedm20y+D/8NjuU1FGF8g828MF4lnXWCrJrBMIIb3pFkhBhL2Q/DpPjqGECcmFWdVfSVPh/zxh1LZlMbRrw+oyop1rmsTVw+kuZKdda+M5Kn49SQBtnf/8iXH4VhexER08aqqU12mxUcbFg==~1; bm_sv=7C2F730FE7D8E39AB25D4F9FF7996E7A~YAAQrKzbFwN0h+eDAQAADp4EGRHDPqZ5MseuwsP6TwaBIL6+UkXDyC3/aVJvD4NfaxFFRdVkO/z0eYX47tFmRRvAqhWmKEX/DWIXAjuAlmmarYOBHMpNBNL049OS7nUyoQGhhQFiN+FVlJqteMCwvaW3Z3iLBpYDG17oSBKb3wdfkSXB7aPqX6wysaPBD/KlfnfpO54HUlQ98PezPm2p/WKxNYpVmWgZUEG/6X0HST8cNHovgqh1gblNNQ3A6UvFXw==~1",
	) {
		const response = await fetch(
			`https://www.deezer.com/ajax/gw-light.php?method=deezer.getUserData&input=3&api_version=1.0&api_token=&cid=${Math.floor(
				1e9 * Math.random(),
			)}`,
			{
				body: JSON.stringify({}),
				method: "POST",
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
					Cookie: cookie,
				},
			},
		);
		const json: UserMetadata = (await response.json()) as UserMetadata;
		return new Deezer(
			json.results.checkForm,
			json.results.USER.OPTIONS.license_token,
			cookie,
		);
	}
	// private static jembud() {}
}

const deezer = await Deezer.instantiate();
// deezer.song.getListData;
// deezer.api.getTrackMetadata
const res = await deezer.search("last friday night");
// console.log(res);
// deezer.assignMetadata({
// 	input: path.resolve(process.cwd(), "output.flac"),
// 	image: "./image.jpg",
// 	title: "Harleys In Hawaii",
// 	output: "./hasil.flac",
// 	album_artist: "Katy Perry",
// 	track: 1,
// 	album: "Katy Perry",
// 	year: 2022,
// 	genre: "Pop"
// });
// console.log(res);

// const metadata = await deezer.song.getListData(
// 	res.results.TRACK.data[0].SNG_ID,
// );
// // console.log();
// fs.writeFileSync(
// 	"./JSON/TrackMetadata.json",
// 	JSON.stringify(metadata, null, 2),
// );

// const direct = await deezer.getDirectURL(
// 	res.results.TRACK.data[0].TRACK_TOKEN,
// 	"FLAC",
// );
const id = '129191664'
console.log("Downloading...");
const metadata = await deezer.song.getListData(id)
await deezer.download(id, 'FLAC');
console.log("Decrypting...");

deezer.decrypt(id);
console.log("Saving file...");
// delete this
const savedDirectory = `./Audio/${metadata.results.data[0].SNG_TITLE} - ${metadata.results.data[0].ARTISTS[0].ART_NAME}.flac`;
await deezer.save(savedDirectory);


// DeezerAPI.create();
// DeezerAPI;
// await Bun.write("./pageSearchResults.json", JSON.stringify(res, null, 2));
// await deezer.getCoverImages(res.results.TRACK.data[0].ALB_PICTURE);
// const direct = await deezer.getDirectURL(res.results.TRACK.data[0].TRACK_TOKEN, "MP3_320");
// console.log(direct);
// await Bun.write("./directURL.json", JSON.stringify(direct, null, 2));
