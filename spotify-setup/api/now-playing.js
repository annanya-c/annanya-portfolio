const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=6";

async function getAccessToken() {
  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });
  return response.json();
}

function formatTrack(track) {
  if (!track) return null;
  return {
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    albumArt: track.album?.images?.[0]?.url || null,
    url: track.external_urls?.spotify || null,
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const { access_token } = await getAccessToken();
    const headers = { Authorization: `Bearer ${access_token}` };

    const nowRes = await fetch(NOW_PLAYING_ENDPOINT, { headers });
    let current = null, isPlaying = false;
    if (nowRes.status === 200) {
      const nowData = await nowRes.json();
      if (nowData?.item) { isPlaying = nowData.is_playing; current = formatTrack(nowData.item); }
    }

    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, { headers });
    let recent = [];
    if (recentRes.status === 200) {
      const recentData = await recentRes.json();
      recent = recentData.items.map((item) => ({ ...formatTrack(item.track), playedAt: item.played_at }));
    }

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json({ isPlaying, current, recent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}