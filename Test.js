import pkg from 'play-dl';
const play = pkg;

const video = await play.video_info('https://www.youtube.com/watch?v=CdZN8PI3MqM')
console.log(video.video_details.url)