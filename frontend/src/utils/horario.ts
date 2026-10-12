/**
 * Conversão do código de horário do SIGAA (ex.: "35M34") para texto legível.
 * Formato: dígitos dos dias (2 = segunda ... 7 = sábado), turno (M/T/N) e horários do turno.
 */

const DIAS: Record<string, string> = {
  '2': 'Segunda',
  '3': 'Terça',
  '4': 'Quarta',
  '5': 'Quinta',
  '6': 'Sexta',
  '7': 'Sábado',
};

// Início e fim (em minutos desde 00:00) de cada horário, conforme a grade da UnB.
const HORARIOS: Record<string, [number, number][]> = {
  M: [
    [8 * 60, 8 * 60 + 55],
    [8 * 60 + 55, 9 * 60 + 50],
    [10 * 60, 10 * 60 + 55],
    [10 * 60 + 55, 11 * 60 + 50],
    [12 * 60, 12 * 60 + 55],
  ],
  T: [
    [12 * 60, 12 * 60 + 55],
    [12 * 60 + 55, 13 * 60 + 50],
    [14 * 60, 14 * 60 + 55],
    [14 * 60 + 55, 15 * 60 + 50],
    [16 * 60, 16 * 60 + 55],
    [16 * 60 + 55, 17 * 60 + 50],
    [18 * 60, 18 * 60 + 55],
  ],
  N: [
    [19 * 60, 19 * 60 + 50],
    [19 * 60 + 50, 20 * 60 + 40],
    [20 * 60 + 50, 21 * 60 + 40],
    [21 * 60 + 40, 22 * 60 + 30],
  ],
};

const PADRAO = /^([2-7]+)([MTN])([1-7]+)$/;

function juntarDias(dias: string[]) {
  if (dias.length <= 1) {
    return dias.join('');
  }
  return `${dias.slice(0, -1).join(', ')} e ${dias[dias.length - 1]}`;
}

function formatarHora(minutos: number, arredondarParaCima: boolean) {
  const horas = arredondarParaCima ? Math.ceil(minutos / 60) : Math.floor(minutos / 60);
  return `${String(horas).padStart(2, '0')}h`;
}

function formatarBloco(bloco: string) {
  const partes = PADRAO.exec(bloco);
  if (!partes) {
    return null;
  }
  const [, digitosDias, turno, digitosHorarios] = partes;
  const intervalos = [...digitosHorarios].map((digito) => HORARIOS[turno][Number(digito) - 1]);
  if (intervalos.some((intervalo) => !intervalo)) {
    return null;
  }

  const dias = juntarDias([...digitosDias].map((digito) => DIAS[digito]));
  const inicio = formatarHora(Math.min(...intervalos.map(([comeco]) => comeco)), false);
  const fim = formatarHora(Math.max(...intervalos.map(([, termino]) => termino)), true);
  return `${dias}, ${inicio} - ${fim}`;
}

export function formatarHorario(horarioBruto: string) {
  const blocos = horarioBruto.trim().split(/\s+/).filter(Boolean);
  const formatados = blocos.map(formatarBloco);
  if (blocos.length === 0 || formatados.some((bloco) => bloco === null)) {
    return horarioBruto;
  }
  return formatados.join(' · ');
}

export function semestreAtual(data = new Date()) {
  return `${data.getFullYear()}.${data.getMonth() < 6 ? 1 : 2}`;
}
