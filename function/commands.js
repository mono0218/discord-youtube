import {client, player} from "../index.js"
import youtube from "./youtube.js"
import connect from "./connection.js"
import {getVoiceConnection} from "@discordjs/voice";

let lockflag = 0

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
                name: "content",
                description: "urlを貼り付けてください",
                required: true,
            },
        ]
    };
    const skip ={
        name:"skip",
        description:"スキップします"
    }

    return [ping, join, bye, play,skip]
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
        await interaction.reply('Pong！');
    }

    if(interaction.commandName === 'join'){

        if(lockflag === true){
            interaction.reply('すでに接続しています');
        }else{
            await connect(interaction, client, player)
            lockflag = true
        }
    }

    if(interaction.commandName === 'bye'){
        const connection = getVoiceConnection(interaction.guildId);
        if(connection === undefined){
            interaction.reply('vcに接続していません');
        }else{
            connection.disconnect();
            console.log(interaction.guildId+"のVCから退出しました")
            lockflag = false
            await interaction.reply('bye');
        }
    }

    if(interaction.commandName === 'play'){
        const url = interaction.options.getString('content')
        await interaction.reply({ content: '受け付けました', ephemeral: true })
        await youtube(url,interaction)
    }

    if(interaction.commandName === 'skip'){
        player.stop();
        await interaction.reply("スキップしました")
    }
}