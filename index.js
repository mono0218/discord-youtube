import { Client, GatewayIntentBits, } from "discord.js"
import dotenv from "dotenv"
dotenv.config();
import { createAudioPlayer } from "@discordjs/voice";
import {commands,CommandReply,SelectMenuReply} from "./function/commands.js"

export const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,] });

export const player = createAudioPlayer();

client.once('ready', async() => {
    await client.application.commands.set(await commands(), process.env.GuildID);
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if(interaction.isCommand()){
        await CommandReply(interaction)
    }else if(interaction.isSelectMenu()){
        await SelectMenuReply(interaction)
    }else{
        return
    }
    
});

client.on('error', console.warn);

client.login(process.env.TOKEN);