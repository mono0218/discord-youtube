import ytdl from "ytdl-core"
import {player,client} from "../index.js"
import pkg from 'play-dl';
const play = pkg;
import {AudioPlayerStatus, createAudioResource, StreamType} from "@discordjs/voice";
import { PlayInfo } from "./Embed.js";

export async function youtube(url,interaction){
    const stream = await play.stream(url)
    console.log(interaction)
    await AudioPlay(stream,interaction,url)
}

export async function serach(word){
    const result = await play.search(word)
    let list = []
    for (let i = 0; i < 4; i++) {
		let text = "0"
		if(result[i].title.length  > 90){
			text = result[i].title.substring(0, 90)+'...';
		}else{
			text= result[i].title
		}
        list.push({title: text,url:result[i].url,number:i+1})
	}
    return list
}

async function basic_info(url){
    const info = await play.video_basic_info(url)
    return info
}


/**
 * 読み上げが終わるまで待機する
 */
async function waitUntilPlayFinish(player) {
    return new Promise((resolve, _) => {
        if (player.state.status === AudioPlayerStatus.Idle) {
            return resolve();
        }
        player.once(AudioPlayerStatus.Idle, () => {
            resolve();
        });
    });
}

/**
 * 音声データの再生
 * @params stream
 * @params player
 */
async function AudioPlay(stream,interaction,url){
    let resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
    resource.volume.setVolume(0.1);
    await waitUntilPlayFinish(player);

    const info = PlayInfo(await basic_info(url))
    console.log(interaction)
    const channel = await client.channels.fetch(interaction.channelId)
    channel.send({embeds:[await info]})

    player.play(resource);
}
