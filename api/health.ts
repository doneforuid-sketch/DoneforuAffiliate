export default function handler(_req: any, res: any) {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  if (typeof res.status === 'function') {
    return res.status(200).json({ status: 'ok', hasServerKey: hasKey });
  }
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ status: 'ok', hasServerKey: hasKey }));
}
