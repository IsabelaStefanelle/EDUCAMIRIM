export function formatarDataHora(valor, opcoes = {}) {
  const { semPrazo = '', prefixo = '', separador = ' ' } = opcoes;
  if (!valor) return semPrazo;

  const data = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}`;

  return `${prefixo}${dataFormatada.replace(' ', separador)}`;
}

export function parseDataHora(texto) {
  if (!texto || texto.trim() === '') return null;

  const match = texto.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [, dia, mes, ano, hora, minuto] = match;
  const componentes = [Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto)];
  const data = new Date(...componentes);
  const correspondem = [
    data.getFullYear() === componentes[0],
    data.getMonth() === componentes[1],
    data.getDate() === componentes[2],
    data.getHours() === componentes[3],
    data.getMinutes() === componentes[4],
  ].every(Boolean);

  return Number.isNaN(data.getTime()) || !correspondem ? null : data;
}