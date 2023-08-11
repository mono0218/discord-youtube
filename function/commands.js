import {client, player} from "../index.js"
import {youtube} from "./youtube.js"
import connect from "./connection.js"
import {getVoiceConnection} from "@discordjs/voice";
import { SerachEmbed,PingEmbed,VCError1,VCError2,SkipEmbed,DisconnectEmbed } from "./Embed.js";
import { Integration } from "discord.js";

let lockflag = false

export function modifyLock( value ) { lockflag = value; }

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

    const serach = {
        name:"serach",
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

    return [ping, join, bye, play,skip,serach]
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
    if (interaction.commandName === 'ping') {
        await interaction.reply({ embeds: [PingEmbed ]});
    }

    if(interaction.commandName === 'join'){

        if(lockflag === true){
            interaction.reply({ embeds: [VCError1 ]});
        }else{
            connect(interaction,client,player)
            lockflag = true
        }
    }
    
    if(interaction.commandName === 'bye'){
        const connection = getVoiceConnection(interaction.guildId);
        if(connection === undefined){
            interaction.reply({ embeds: [VCError2 ]});
        }else{
            connection.disconnect();
            console.log(interaction.guildId+"のVCから退出しました")
            lockflag = false
            interaction.reply({ embeds: [DisconnectEmbed ]});
        }
    }

    if(interaction.commandName === 'play'){
        const url = interaction.options.getString('url')
        await interaction.reply({ content: '受け付けました', ephemeral: true })
        await youtube(url,interaction)
    }

    if(interaction.commandName === 'serach'){
        const word = interaction.options.getString('word')
        await SerachEmbed(word,interaction)
    }

    if(interaction.commandName === 'skip'){
        player.stop();
        await interaction.reply("スキップしました")
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
        youtube(interaction.values[0],interaction)
    }
}