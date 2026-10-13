import PDFDocument from 'pdfkit';
import { dataBR, duracao, FUSO } from './tempo.js';

const EMPRESA = process.env.SS_EMPRESA || 'Halo Energy';

const COR = {
  verde: '#006D40', azul: '#3D7CBF', ouro: '#D4AF37',
  tinta: '#1B1D1E', apoio: '#4E5255', mudo: '#6B7073', linha: '#D7D9DB', fundo: '#F6F7F7',
};
const STATUS = { aberta: 'Em andamento', encerrada: 'Encerrada', auto: 'Encerrada automaticamente' };
const M = 42; // margem

function logo(doc, x, y, tam) {
  const s = tam / 100;
  doc.save().translate(x, y).scale(s).lineWidth(13).lineCap('round');
  const arcos = [
    ['M17.96 31.5 A37 37 0 0 1 86.86 46.77', [17.96, 31.5, 86.86, 46.77], COR.ouro, COR.verde],
    ['M86.86 46.77 A37 37 0 0 1 40.42 85.74', [86.86, 46.77, 40.42, 85.74], COR.verde, COR.azul],
    ['M40.42 85.74 A37 37 0 0 1 13 50', [40.42, 85.74, 13, 50], COR.azul, '#4F8FD0'],
  ];
  for (const [d, [x1, y1, x2, y2], c1, c2] of arcos) {
    const g = doc.linearGradient(x1, y1, x2, y2).stop(0, c1).stop(1, c2);
    doc.path(d).stroke(g);
  }
  doc.restore();
}

function rotulo(doc, txt, x, y, w) {
  doc.font('Helvetica-Bold').fontSize(7).fillColor(COR.mudo)
    .text(txt.toUpperCase(), x, y, { width: w, characterSpacing: 0.6 });
}

function cabecalho(doc, ss) {
  const larg = doc.page.width - 2 * M;
  logo(doc, M, M - 4, 34);
  doc.font('Helvetica-Bold').fontSize(15).fillColor(COR.tinta)
    .text('Relatório Diário de Obra', M + 44, M - 1);
  doc.font('Helvetica').fontSize(9).fillColor(COR.apoio)
    .text(`${EMPRESA} · Solicitação de Serviço`, M + 44, M + 17);
  doc.font('Helvetica-Bold').fontSize(13).fillColor(COR.verde)
    .text(ss.number, M, M - 1, { width: larg, align: 'right' });
  doc.font('Helvetica').fontSize(9).fillColor(COR.apoio)
    .text(STATUS[ss.status], M, M + 17, { width: larg, align: 'right' });
  doc.moveTo(M, M + 38).lineTo(M + larg, M + 38).lineWidth(1.5).strokeColor(COR.verde).stroke();
  doc.y = M + 52;
}

function secao(doc, titulo) {
  garantirEspaco(doc, 60);
  doc.moveDown(0.6);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COR.verde)
    .text(titulo.toUpperCase(), M, doc.y, { characterSpacing: 0.8 });
  const y = doc.y + 3;
  doc.moveTo(M, y).lineTo(doc.page.width - M, y).lineWidth(0.5).strokeColor(COR.linha).stroke();
  doc.y = y + 8;
}

function garantirEspaco(doc, h) {
  if (doc.y + h > doc.page.height - M - 20) doc.addPage();
}

// Grade de campos: [rótulo, valor, colunas ocupadas de 4]
function grade(doc, campos) {
  const larg = doc.page.width - 2 * M;
  const col = larg / 4;
  let x = 0;
  let linha = [];
  const linhas = [];
  for (const [r, v, n] of campos) {
    if (x + n > 4) { linhas.push(linha); linha = []; x = 0; }
    linha.push({ r, v, n, x });
    x += n;
  }
  if (linha.length) linhas.push(linha);

  for (const l of linhas) {
    const altura = Math.max(...l.map(({ v, n }) =>
      doc.font('Helvetica').fontSize(10).heightOfString(v || '—', { width: n * col - 10 }))) + 14;
    garantirEspaco(doc, altura + 6);
    const y = doc.y;
    for (const { r, v, n, x: cx } of l) {
      rotulo(doc, r, M + cx * col, y, n * col - 10);
      doc.font('Helvetica').fontSize(10).fillColor(v ? COR.tinta : COR.mudo)
        .text(v || '—', M + cx * col, y + 11, { width: n * col - 10 });
    }
    doc.y = y + altura + 6;
  }
}

function paragrafo(doc, txt) {
  doc.font('Helvetica').fontSize(10).fillColor(txt ? COR.tinta : COR.mudo)
    .text(txt || 'Não informado.', M, doc.y, { width: doc.page.width - 2 * M, lineGap: 2 });
}

function atividades(doc, ss) {
  const lista = [...ss.activities];
  if (ss.other_activity) lista.push(`Outras: ${ss.other_activity}`);
  if (!lista.length) return paragrafo(doc, '');
  const larg = (doc.page.width - 2 * M) / 2;
  let i = 0;
  while (i < lista.length) {
    garantirEspaco(doc, 18);
    const y = doc.y;
    let h = 0;
    for (let c = 0; c < 2 && i < lista.length; c++, i++) {
      const x = M + c * larg;
      doc.rect(x, y + 1.5, 8, 8).fillAndStroke(COR.verde, COR.verde);
      doc.save().moveTo(x + 1.8, y + 5.6).lineTo(x + 3.6, y + 7.6).lineTo(x + 6.6, y + 3.4)
        .lineWidth(1.2).strokeColor('#FFFFFF').stroke().restore();
      doc.font('Helvetica').fontSize(10).fillColor(COR.tinta).text(lista[i], x + 14, y, { width: larg - 20 });
      h = Math.max(h, doc.y - y);
    }
    doc.y = y + h + 4;
  }
}

function fotos(doc, ss) {
  if (!ss.photos.length) return paragrafo(doc, 'Nenhuma foto registrada.');
  const gap = 14;
  const w = (doc.page.width - 2 * M - gap) / 2;
  const h = w * 0.75;
  for (let i = 0; i < ss.photos.length; i += 2) {
    const par = ss.photos.slice(i, i + 2);
    const legendaH = Math.max(...par.map((p) =>
      doc.font('Helvetica').fontSize(8.5).heightOfString(`Foto ${i + 1}. ${p.caption}`, { width: w })));
    garantirEspaco(doc, h + legendaH + 16);
    const y = doc.y;
    par.forEach((p, k) => {
      const x = M + k * (w + gap);
      doc.rect(x, y, w, h).fill(COR.fundo);
      try {
        if (!p.imagem) throw new Error('sem imagem');
        doc.image(p.imagem, x, y, { fit: [w, h], align: 'center', valign: 'center' });
      } catch {
        doc.font('Helvetica').fontSize(9).fillColor(COR.mudo)
          .text('Imagem indisponível', x, y + h / 2 - 5, { width: w, align: 'center' });
      }
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COR.tinta)
        .text(`Foto ${i + k + 1}.`, x, y + h + 5, { width: w, continued: !!p.caption })
        .font('Helvetica').fillColor(COR.apoio).text(p.caption ? ` ${p.caption}` : '');
    });
    doc.y = y + h + legendaH + 16;
  }
}

function assinaturas(doc, ss) {
  garantirEspaco(doc, 80);
  doc.moveDown(2.5);
  const y = doc.y + 24;
  const w = (doc.page.width - 2 * M - 40) / 2;
  [[ss.created_by_name || 'Responsável técnico', 'Responsável técnico'], ['', 'Cliente / Fiscal da obra']]
    .forEach(([nome, papel], k) => {
      const x = M + k * (w + 40);
      doc.moveTo(x, y).lineTo(x + w, y).lineWidth(0.7).strokeColor(COR.apoio).stroke();
      doc.font('Helvetica').fontSize(9).fillColor(COR.tinta).text(nome || ' ', x, y + 5, { width: w, align: 'center' });
      doc.fontSize(8).fillColor(COR.mudo).text(papel, x, doc.y, { width: w, align: 'center' });
    });
}

function rodapes(doc, ss) {
  const gerado = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: FUSO });
  const { start, count } = doc.bufferedPageRange();
  for (let i = start; i < start + count; i++) {
    doc.switchToPage(i);
    const y = doc.page.height - M + 8;
    const larg = doc.page.width - 2 * M;
    // margem inferior zerada para o texto do rodapé não abrir página nova
    const margemOriginal = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.font('Helvetica').fontSize(7.5).fillColor(COR.mudo)
      .text(`${ss.number} · gerado em ${gerado}`, M, y, { width: larg, lineBreak: false })
      .text(`Página ${i + 1} de ${count}`, M, y, { width: larg, align: 'right', lineBreak: false });
    doc.page.margins.bottom = margemOriginal;
  }
}

// Gera o PDF inteiro em memória: se algo falhar no meio, o servidor ainda
// pode responder com erro em vez de entregar um arquivo cortado.
export function gerarPdf(ss) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4', margin: M, bufferPages: true,
      info: { Title: `${ss.number} — Relatório Diário de Obra`, Author: EMPRESA },
    });
    const partes = [];
    doc.on('data', (c) => partes.push(c));
    doc.on('end', () => resolve(Buffer.concat(partes)));
    doc.on('error', reject);
    try {
      montar(doc, ss);
    } catch (e) {
      reject(e);
    }
  });
}

function montar(doc, ss) {

  cabecalho(doc, ss);
  const coords = ss.lat != null ? `${ss.lat.toFixed(6)}, ${ss.lng.toFixed(6)}` : '';
  grade(doc, [
    ['Data', dataBR(ss.date), 1],
    ['Início', ss.start_time, 1],
    ['Fim', ss.end_time ? `${ss.end_time}${ss.status === 'auto' ? ' (automático)' : ''}` : 'Em andamento', 1],
    ['Duração', duracao(ss.start_time, ss.end_time), 1],
    ['Cliente / Obra', ss.client, 2],
    ['Responsável', ss.created_by_name, 1],
    ['Clima', ss.weather, 1],
    ['Endereço', ss.address, 3],
    ['Coordenadas', coords, 1],
    ['Equipe', ss.team, 4],
  ]);

  secao(doc, 'Atividades executadas');
  atividades(doc, ss);
  secao(doc, 'Descrição dos serviços');
  paragrafo(doc, ss.description);
  if (ss.notes) {
    secao(doc, 'Observações e pendências');
    paragrafo(doc, ss.notes);
  }
  secao(doc, `Registro fotográfico (${ss.photos.length})`);
  fotos(doc, ss);
  assinaturas(doc, ss);
  rodapes(doc, ss);
  doc.end();
}
