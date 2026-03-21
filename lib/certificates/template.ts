export type CertificateTemplateData = {
  studentName: string;
  courseName: string;
  instructorName: string;
  completedAt: number;
  certificateCode: string;
  verificationUrl?: string;
  qrCodeDataUrl?: string | null;
};

const messageText =
  "By completing this course, the above-named learner has demonstrated practical knowledge and job-ready capability in the subject area.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapWords(input: string, maxChars: number, maxLines = 2): string[] {
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
    }

    if (lines.length >= maxLines - 1) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  return lines.slice(0, maxLines);
}

function truncate(value: string, maxChars: number): string {
  const clean = value.trim();
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, maxChars).trim();
}

function formatCompletionDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function buildCertificateSvg(data: CertificateTemplateData): string {
  const width = 1600;
  const height = 1120;

  const studentName = escapeXml(truncate(data.studentName || "Student", 24));
  const courseLines = wrapWords(data.courseName || "Course", 34, 2).map((line) => escapeXml(line));
  const completionLines = wrapWords("has successfully completed the EduFlow online course", 46, 2).map((line) => escapeXml(line));
  const bodyLines = wrapWords(messageText, 52, 4).map((line) => escapeXml(line));
  const completionDate = escapeXml(formatCompletionDate(data.completedAt));
  const certificateCode = escapeXml(data.certificateCode);
  const qrImage = data.qrCodeDataUrl
    ? `<image href="${escapeXml(data.qrCodeDataUrl)}" x="1302" y="804" width="148" height="148" />`
    : "";

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.10" />
    </filter>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="#e8edf3" />
  <g filter="url(#softShadow)">
    <rect x="58" y="34" width="1484" height="1052" rx="12" fill="url(#paper)" />
  </g>
  <rect x="112" y="68" width="1376" height="984" fill="none" stroke="#d6dfeb" stroke-width="2" />

  <circle cx="708" cy="126" r="34" fill="#1394d2" />
  <text x="708" y="138" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="38" fill="#ffffff" font-weight="700">EF</text>
  <text x="756" y="138" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="54" fill="#0b1220" font-weight="700">EduFlow</text>

  <text x="800" y="286" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="88" fill="#05070b" font-weight="700">Certificate of Completion</text>

  <text x="800" y="432" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="82" fill="#138fcc" font-weight="700">${studentName}</text>

  <text x="800" y="516" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="46" fill="#0f172a">${completionLines[0] ?? ""}</text>
  ${completionLines[1] ? `<text x="800" y="566" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="46" fill="#0f172a">${completionLines[1]}</text>` : ""}

  <text x="800" y="630" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="64" fill="#05070b" font-weight="700">${courseLines[0] ?? "Course"}</text>
  ${courseLines[1] ? `<text x="800" y="692" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="64" fill="#05070b" font-weight="700">${courseLines[1]}</text>` : ""}

  <text x="800" y="748" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="30" fill="#1f2937">${bodyLines[0] ?? ""}</text>
  <text x="800" y="784" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="30" fill="#1f2937">${bodyLines[1] ?? ""}</text>
  <text x="800" y="820" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="30" fill="#1f2937">${bodyLines[2] ?? ""}</text>
  <text x="800" y="856" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="30" fill="#1f2937">${bodyLines[3] ?? ""}</text>

  <text x="800" y="910" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="48" fill="#0f172a">Presented ${completionDate}</text>

  <line x1="510" y1="948" x2="1090" y2="948" stroke="#0f172a" stroke-width="4" />
  <text x="800" y="986" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="#1d2f47" font-weight="700">Pratham Darji</text>
  <text x="800" y="1018" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="34" fill="#4b5563">CEO, EduFlow</text>

  <rect x="1288" y="790" width="176" height="188" rx="10" fill="#ffffff" stroke="#cbd7e7" stroke-width="2" />
  <rect x="1302" y="804" width="148" height="148" fill="#ffffff" stroke="#d9e2ee" />
  ${qrImage}
  <text x="1376" y="972" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="24" fill="#3f4d63" font-weight="700">Scan To Verify</text>

  <text x="800" y="1044" text-anchor="middle" font-family="'Trebuchet MS', 'Avenir Next', sans-serif" font-size="18" fill="#98a4b3">Certificate serial number: ${certificateCode}</text>
</svg>
`.trim();
}

export function certificateDownloadFileName(courseName: string, certificateCode: string, extension: "png" | "pdf") {
  const slug = courseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);

  const base = slug || "course";
  return `eduflow-certificate-${base}-${certificateCode}.${extension}`;
}

export { messageText };
