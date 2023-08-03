import ytdl from "ytdl-core"
import {player} from "../index.js"
import {AudioPlayerStatus, createAudioResource, StreamType} from "@discordjs/voice";
export default async function youtube(url,interaction){
    const stream = ytdl(url, {filter: "audioonly", fmt: "stream",})
    await AudioPlay(stream,interaction)
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
async function AudioPlay(stream,interaction){
    let resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
    resource.volume.setVolume(0.1);
    await waitUntilPlayFinish(player);
    player.play(resource);
}
