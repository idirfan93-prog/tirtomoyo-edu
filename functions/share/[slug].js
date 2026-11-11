export async function onRequest(context) {
  const { params, request } = context;
  const slug = params.slug;
  const urlObj = new URL(request.url);
  const origin = urlObj.origin;

  const API_URL = 'https://script.google.com/macros/s/AKfycbyjAmofT2d-6T3uF2pfQ6WhD6eDzi5mz5tMsedp1AoiVTfoJ3_Hb2wHAV9asHmvKi7vZQ/exec';

  let title = 'Tirtomoyo EduApps';
  let description = 'Portal etalase dan peluncur aplikasi pembelajaran SD karya guru di Kecamatan Tirtomoyo.';
  let imageUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZ1Gvl2imbZlmQk0FIYYq6LLNtR_UI3MS3Jj1t52YNZLBcvJHACB-H-CipMRjulH1qOMN2M-OYaIlQzM3H_-ORl67PFBjk5M-ObxjgLXMfEv5BOWYi1yseMEO7ByGCOm3ZplNn0zFCS70pIudXH9xvSGFFk5Re8w2rAeewCgeUY4CftmDfYV0r9A5Fre8/s1600/Cheerful%20E-Learning%20Classroom%20Team.png';
  const targetAppUrl = `${origin}/#/detail/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'api_getPublicAppDetail',
        payload: { slug: slug, appId: slug }
      })
    });

    if (res.ok) {
      const result = await res.json();
      if (result && result.ok && result.data) {
        const app = result.data;
        if (app.title) {
          title = `${app.title} — Tirtomoyo EduApps`;
        }
        if (app.shortDescription || app.description) {
          description = app.shortDescription || app.description;
        }
        if (app.thumbnailUrl) {
          imageUrl = app.thumbnailUrl;
        }
      }
    }
  } catch (err) {}

  const safeTitle = escapeXml(title);
  const safeDesc = escapeXml(description);
  const safeImg = escapeXml(imageUrl);
  const safeTarget = escapeXml(targetAppUrl);

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${safeDesc}">

  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeXml(request.url)}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImg}">
  <meta property="og:site_name" content="Tirtomoyo EduApps">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImg}">

  <meta http-equiv="refresh" content="0;url=${safeTarget}">
  <script>
    window.location.replace(${JSON.stringify(targetAppUrl)});
  </script>
</head>
<body style="font-family:sans-serif;padding:2rem;text-align:center;">
  <p>Membuka aplikasi pembelajaran...</p>
  <p><a href="${safeTarget}">Klik di sini jika tidak beralih otomatis</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, ''');
}
