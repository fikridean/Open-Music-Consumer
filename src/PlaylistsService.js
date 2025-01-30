const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `
        SELECT playlists.id as playlist_id, playlists.name, songs.id as songs_id, songs.title, songs.performer FROM songs
        LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
        LEFT JOIN playlists ON playlist_songs.playlist_id = playlists.id
        LEFT JOIN users ON playlists.owner = users.id
        WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    const playlist = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: result.rows.map((song) => ({
        id: song.songs_id,
        title: song.title,
        performer: song.performer,
      })),
    };

    return playlist;
  }
}

module.exports = PlaylistsService;
