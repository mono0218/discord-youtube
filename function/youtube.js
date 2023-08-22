import {player,client} from "../index.js"
import pkg from 'play-dl';
const play = pkg;
import {AudioPlayerStatus, createAudioResource, StreamType} from "@discordjs/voice";
import { PlayInfo } from "./Embed.js";

export const list = []

/**
 * キューに動画を入れる
 * @params url
 * @params interaction
 */
export async function InQueue(url,interaction){
    const info = await basic_info(url)
    list.push({url:url,interaction:interaction,title:info.video_details.title,})
}

/**
 * 動画の詳細情報を入手する
 * @params url
 */
async function basic_info(url){
    const info = await play.video_basic_info(url)
    return info
}

/**
 * 動画を再生する
 * @params url
 * @params interaction
 */
export async function youtube(){
    await AudioPlay(list[0].interaction,list[0].url)
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
async function AudioPlay(interaction,url){
    

    const info = PlayInfo(await basic_info(url))
    const channel = await client.channels.fetch(interaction.channelId)
    channel.send({embeds:[await info]})

    const stream = await play.stream(url)
    
    let resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
    resource.volume.setVolume(0.1);

    Promise.all(
        [player.play(resource)]
    )
}
