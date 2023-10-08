import {player,client} from "../index.js"
import pkg from 'play-dl';
const play = pkg;
import {AudioPlayerStatus, createAudioResource, StreamType} from "@discordjs/voice";
import { PlayInfo } from "./Embed.js";

export var list = []

async function waitUntilPlayFinish() {
    return new Promise((resolve, _) => {
        if (player.state.status == AudioPlayerStatus.Idle) {
            return resolve();
        }
        player.once(AudioPlayerStatus.Idle, () => {
            resolve();
        });
    });
}

/**
 * キューに動画を入れる
 * @params url
 * @params interaction
 */
export async function InQueue(url,interaction){
    const info = await basic_info(url)
    list.push({url:url,interaction:interaction,title:info.video_details.title,})
    
    await waitUntilPlayFinish()
    await AudioPlay()
}

/**
 * 動画の詳細情報を入手する
 * @params url
 */
export async function basic_info(url){
    return await play.video_basic_info(url)
}

/**
 * 動画を検索する
 * @params word
 */
export async function search(word){
    const result = await play.search(word)
    let list = []
    for (let i = 0; i < 4; i++) {
		let text = "0"
		if(result[i].title.length  > 90){
			text = result[i].title.substring(0, 90)+'...';
		}else{
			text= result[i].title
		}
        const info = await basic_info(url)
        list.push({url:url,interaction:interaction,title:info.video_details.title})
	}
    return list
}

/**
 * 音声データの再生
 * @params stream
 * @params player
 */
export async function AudioPlay(){
    const interaction = list[0].interaction
    const url = list[0].url
    
    const info = PlayInfo(await basic_info(url))
    const channel = await client.channels.fetch(interaction.channelId)
    channel.send({embeds:[await info]})

    const stream = await play.stream(url)
    
    let resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
    resource.volume.setVolume(0.1);

    Promise.all(
        [player.play(resource)]
    ).then((result) => {
        list.shift()
    })
}
