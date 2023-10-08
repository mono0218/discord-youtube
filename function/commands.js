import {client, player} from "../index.js"
import {InQueue, AudioPlay} from "./youtube.js"
import connect from "./connection.js"
import {getVoiceConnection} from "@discordjs/voice";
import { searchEmbed,PingEmbed,VCError1,VCError2,SkipEmbed,DisconnectEmbed,Queue } from "./Embed.js";
import {AudioPlayerStatus, createAudioResource, StreamType} from "@discordjs/voice";
import {list, search} from "./youtube.js"
import { EmbedBuilder, StringSelectMenuBuilder,StringSelectMenuOptionBuilder,ActionRowBuilder, } from 'discord.js';

/**
 * slashコマンド一覧入手
 * @returns commands
 */
export async function commands(){
    const ping = {
        name: "ping",
        description: "pongと返信します。",
    }

    const join = {
        name:"join",
        description: "ボイスチャットに接続します",
    }

    const bye = {
        name:"bye",
        description:"ボイスチャットから切断します",
    }

    const play = {
        name:"play",
        description:"音楽を再生します",
        options: [
            {
                type: 3,
                name: "url",
                description: "urlを貼り付けてください",
                required: true,
            },
        ]
    };

    const search = {
        name:"search",
        description:"音楽を検索します",
        options: [
            {
                type: 3,
                name: "word",
                description: "検索したい音楽を指定してください",
                required: true,
            },
        ]
    };


    const skip ={
        name:"skip",
        description:"スキップします"
    }

    const queue ={
        name:"queue",
        description:"予約中の音楽を表示します"
    }

    return [ping, join, bye, play,skip,search,queue]
}

/**
 * slashコマンド一覧入手
 * @params interaction
 * @params player
 */
export async function CommandReply(interaction){

    if (!interaction.isCommand()) {
        return;
    }

    const func = async msg=> {
        await AudioPlay()
    }

    if (interaction.commandName === 'ping') {
        await interaction.reply({ embeds: [PingEmbed ]});
    }

    if(interaction.commandName === 'join'){
        var connection = getVoiceConnection(interaction.guildId);
        console.log(connection)
        if(connection != undefined){
            interaction.reply({ embeds: [VCError1 ]});
        }else{
            connect(interaction,client,player)
        }
    }

    if(interaction.commandName === 'play'){
        const url = await interaction.options.getString('url')
        await interaction.reply({ content: '受け付けました', ephemeral: true })
        await InQueue(url,interaction)
    }

    if(interaction.commandName === 'bye'){
        var connection = getVoiceConnection(interaction.guildId);
        if(connection === undefined){
            interaction.reply({ embeds: [VCError2 ]});
        }else{
            await connection.destroy();
            connection = undefined
            console.log(interaction.guildId+"のVCから退出しました")
            await interaction.reply({ embeds: [DisconnectEmbed ]});
        }
    }

    if(interaction.commandName === 'search'){
        const word = interaction.options.getString('word')
        await searchEmbed(word,interaction)
    }

    if(interaction.commandName === 'skip'){
        player.stop();
        await interaction.reply("スキップしました")
    }

    if(interaction.commandName === 'queue'){
        let text = ""
        if(list.length===0){
            text = "予約されている曲はありません"
        }else{
            for(let i = 0;i<list.length;i++){
                text=text+`${i+1}. ${list[i].title}\n\n`
            }
        }
        
        const Embed =  new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("再生リスト")
            .setDescription(text)
        
        await interaction.reply({embeds:[ Embed]})
    }
}

export async function SelectMenuReply(interaction){
    if(interaction.customId==="starter"){
        if(interaction.values[0]==="キャンセルする"){
            const channel = interaction.channel
            const msg = await channel.messages.fetch(interaction.message.id);
            await msg.delete(); 
            await interaction.reply({ content: 'キャンセルしました', components: [],ephemeral:true });
        }
        
        const channel = interaction.channel;
        const msg = await channel.messages.fetch(interaction.message.id);
        await msg.delete();
        await interaction.reply({ content: '再生を受け付けました', components: [],ephemeral:true });
        await InQueue(interaction.values[0],interaction)
    }
}