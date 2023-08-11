import {joinVoiceChannel,getVoiceConnection, VoiceConnectionStatus,} from "@discordjs/voice"
import {player,client} from "../index.js"
import { modifyLock } from "./commands.js";
import { ConnectEmbed } from "./Embed.js";

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
        await interaction.reply({ embeds: [VCError3 ]})
        return
    }

    if(!member_vc.joinable){
        await interaction.reply({ embeds: [VCError3 ]})
        return
    }

    if(!member_vc.speakable){
        await interaction.reply({ embeds: [VCError3 ]})
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

    await interaction.reply({ embeds: [ConnectEmbed ]})

    console.log(interaction.guildId+"のVCに入室しました。")

    connection.once(VoiceConnectionStatus.Disconnected, ()=>{
        player.stop();
        modifyLock(false)
    });

    connection.once(VoiceConnectionStatus.Destroyed, ()=>{
        player.stop();
        modifyLock(false)
    });
}