class Listener {
  constructor(PlaylistsService, mailSender) {
    this.PlaylistsService = PlaylistsService;
    this.mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      console.log(`exporting Playlists for ${playlistId} to ${targetEmail}`);

      const playlists = await this.PlaylistsService.getSongsInPlaylist(playlistId);
      const result = await this.mailSender.sendEmail(targetEmail, JSON.stringify(playlists));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
