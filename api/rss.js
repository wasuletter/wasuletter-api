// api/rss.js
export default async function handler(req, res) {
  const { keyword } = req.query;
  const url = `https://rsshub.app/twitter/keyword/${encodeURIComponent(keyword)}`;

  try {
    const rssRes = await fetch(url);
    const text = await rssRes.text();
    const parser = require('xml2js');

    parser.parseString(text, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'RSS parse error' });
      } else {
        const items = result.rss.channel[0].item || [];
        const simplified = items.map(item => ({
          title: item.title[0],
          pubDate: item.pubDate[0],
          link: item.link[0]
        }));
        res.status(200).json({ tweets: simplified });
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch RSS' });
  }
}
