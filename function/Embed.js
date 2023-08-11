import { EmbedBuilder, StringSelectMenuBuilder,StringSelectMenuOptionBuilder,ActionRowBuilder, } from 'discord.js';
import {search} from "./youtube.js"

export const ConnectEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("接続したよ！よろしくね！")

export const DisconnectEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("切断したよ！また使ってね！")

export const VCError1 = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("既に接続しているよ！エラーが発生した場合は管理者を呼んでね")

export const VCError2 = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("切断できなかったよ！エラーが発生した場合は管理者を呼んでね")

export const VCError3 = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("権限がないよ！サーバー管理者に連絡してね")

export const SkipEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("VCに接続していないよ！VCに接続してから試してね！\nエラーが発生した場合は管理者を呼んでね")

export const PingEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle("接続は良好だよ！ものちゃんも元気！")

export const PlayInfo = (info) => new EmbedBuilder()
	.setAuthor({
		name: "現在再生中の曲",
	})
	.setTitle(info.video_details.title)
	.setURL(info.video_details.url)
	.setDescription(`> 再生時間：${info.video_details.durationRaw}`)
	.setImage(info.video_details.thumbnails[3].url)
	.setColor("#00b0f4")
	.setFooter({
		text: "monokamo",
	})
	.setTimestamp();

	
export async function searchEmbed(word,interaction){

	const result = await search(word)

	const ResultEmbed =  new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle("曲を選択してください")
		.setDescription(`1. ${result[0].title}\n\n2. ${result[1].title}\n\n3. ${result[2].title}\n\n4. ${result[3].title}`)

	const ActionEmbed = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('1')
					.setValue(result[0].url)
					.setDescription(`${result[0].title}`),
				new StringSelectMenuOptionBuilder()
					.setLabel('2')
					.setValue(result[1].url)
					.setDescription(`${result[1].title}`),
				new StringSelectMenuOptionBuilder()
					.setLabel('3')
					.setValue(result[2].url)
					.setDescription(`${result[2].title}`),
				new StringSelectMenuOptionBuilder()
					.setLabel('4')
					.setValue(result[3].url)
					.setDescription(`${result[3].title}`),
				new StringSelectMenuOptionBuilder()
					.setLabel('5')
					.setValue("キャンセルする")
					.setDescription(`cancel`),
			)
		);

	await interaction.reply({embeds: [ResultEmbed],components: [ActionEmbed]})
}



