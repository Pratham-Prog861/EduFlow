type PdfImageInput = {
  jpegBytes: Buffer;
  imageWidth: number;
  imageHeight: number;
};

function padOffset(offset: number): string {
  return String(offset).padStart(10, "0");
}

function createContentStream(imageWidth: number, imageHeight: number) {
  const pageWidth = 842;
  const pageHeight = 595;
  const margin = 18;

  const scale = Math.min(
    (pageWidth - margin * 2) / imageWidth,
    (pageHeight - margin * 2) / imageHeight,
  );

  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const x = (pageWidth - drawWidth) / 2;
  const y = (pageHeight - drawHeight) / 2;

  return `q\n${drawWidth.toFixed(2)} 0 0 ${drawHeight.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm\n/Im0 Do\nQ`;
}

export function buildSinglePagePdfFromJpeg({
  jpegBytes,
  imageWidth,
  imageHeight,
}: PdfImageInput): Buffer {
  const contentStream = createContentStream(imageWidth, imageHeight);

  const objects: Buffer[] = [];

  const contentBytes = Buffer.from(contentStream, "ascii");
  objects.push(Buffer.from("<< /Type /Catalog /Pages 2 0 R >>", "ascii"));
  objects.push(Buffer.from("<< /Type /Pages /Count 1 /Kids [3 0 R] >>", "ascii"));
  objects.push(
    Buffer.from(
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>",
      "ascii",
    ),
  );
  objects.push(
    Buffer.concat([
      Buffer.from(`<< /Length ${contentBytes.length} >>\nstream\n`, "ascii"),
      contentBytes,
      Buffer.from("\nendstream", "ascii"),
    ]),
  );
  objects.push(
    Buffer.concat([
      Buffer.from(
        `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
        "ascii",
      ),
      jpegBytes,
      Buffer.from("\nendstream", "ascii"),
    ]),
  );

  const header = Buffer.from("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n", "binary");
  const bodyParts: Buffer[] = [header];
  const offsets: number[] = [0];

  let cursor = header.length;

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(cursor);
    const objectStart = Buffer.from(`${i + 1} 0 obj\n`, "ascii");
    const objectEnd = Buffer.from("\nendobj\n", "ascii");
    const chunk = Buffer.concat([objectStart, objects[i], objectEnd]);
    bodyParts.push(chunk);
    cursor += chunk.length;
  }

  const xrefOffset = cursor;
  const xrefRows = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((offset) => `${padOffset(offset)} 00000 n `),
  ];

  const xref = Buffer.from(`${xrefRows.join("\n")}\n`, "ascii");
  const trailer = Buffer.from(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
    "ascii",
  );

  return Buffer.concat([...bodyParts, xref, trailer]);
}
