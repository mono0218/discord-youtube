import {joinVoiceChannel,getVoiceConnection, VoiceConnectionStatus,} from "@discordjs/voice"
import {player,client} from "../index.js"

/**
 * VCに接続
 * @params interacion
 * @params client
 * @params player
 */
export default async function connect(interaction){
    const guild = interaction.guild;
    const member = await guild.members.fetch(interaction.member.id)
    const member_vc = member.voice.channel

    if(!member_vc){
        await interaction.reply({content: "vcが見つかりません"})
        return
    }

    if(!member_vc.joinable){
        await interaction.reply({content: "vcに接続できませんでした"})
        return
    }

    if(!member_vc.speakable){
        await interaction.reply({content:"権限がありません"})
        return
    }

    const voice_channel_id = member_vc.id;
    const guild_id = guild.id;

    const connection = joinVoiceChannel({
        guildId: guild_id,
        channelId: voice_channel_id,
        adapterCreator: guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: true,
    });

    connection.subscribe(player);

    await interaction.reply({content: "接続しました"})

    console.log(interaction.guildId+"のVCに入室しました。")
}